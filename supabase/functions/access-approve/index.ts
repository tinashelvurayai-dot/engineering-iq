import { cors, requireAdmin, randCode, randPassword, synthEmail } from "../_shared/admin.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { supa } = await requireAdmin(req);
    const { request_id } = await req.json();
    if (!request_id) throw new Error("request_id required");

    const { data: row } = await supa.from("access_requests").select("*").eq("id", request_id).maybeSingle();
    if (!row) throw new Error("Request not found");
    if (!row.email) throw new Error("This request has no email");
    if (row.status === "approved" && row.generated_code) {
      return json({
        code: row.generated_code,
        email: row.email,
        full_name: row.full_name,
        is_pair: !!row.is_pair,
        second_code: row.second_generated_code,
        second_email: row.second_email,
        second_full_name: row.second_full_name,
      });
    }

    // Read pricing & agent from settings
    const { data: settings } = await supa.from("app_settings").select("*").eq("id", true).maybeSingle();
    const soloAmount = Number((settings as any)?.solo_amount ?? 5);
    const pairAmount = Number((settings as any)?.pair_amount ?? 8);
    const agentName = (settings as any)?.primary_agent_name ?? null;
    const isPair = !!row.is_pair && !!row.second_email;
    const totalAmount = isPair ? pairAmount : soloAmount;
    // Per-seat amount stored on each access_code (informational)
    const perSeat = isPair ? +(pairAmount / 2).toFixed(2) : soloAmount;

    // --- Primary user ---
    const synthetic_email = synthEmail();
    const password = randPassword();
    const code = randCode();
    const { data: created, error: cErr } = await supa.auth.admin.createUser({
      email: synthetic_email,
      password,
      email_confirm: true,
      user_metadata: { full_name: row.full_name },
    });
    if (cErr || !created.user) throw new Error(cErr?.message || "Could not create user");
    const uid = created.user.id;

    await supa.from("profiles").upsert({
      id: uid, email: synthetic_email, full_name: row.full_name, access_level: "full",
    });
    const { error: codeErr } = await supa.from("access_codes").insert({
      code, total_seats: 1, used_seats: 1, amount: perSeat,
      assigned_emails: [synthetic_email], bound_user_id: uid,
      agent_name: agentName,
      notes: `Auto-issued for request ${row.id}${isPair ? " (pair #1)" : ""}`,
    });
    if (codeErr) throw new Error(codeErr.message);

    // --- Secondary user (pair) ---
    let second_code: string | null = null;
    let second_synthetic_email: string | null = null;
    let second_uid: string | null = null;
    let second_password: string | null = null;
    if (isPair) {
      second_synthetic_email = synthEmail();
      second_password = randPassword();
      second_code = randCode();
      const { data: c2, error: c2Err } = await supa.auth.admin.createUser({
        email: second_synthetic_email,
        password: second_password,
        email_confirm: true,
        user_metadata: { full_name: row.second_full_name },
      });
      if (c2Err || !c2.user) throw new Error(c2Err?.message || "Could not create pair partner user");
      second_uid = c2.user.id;
      await supa.from("profiles").upsert({
        id: second_uid, email: second_synthetic_email,
        full_name: row.second_full_name, access_level: "full",
      });
      const { error: c2CodeErr } = await supa.from("access_codes").insert({
        code: second_code, total_seats: 1, used_seats: 1, amount: perSeat,
        assigned_emails: [second_synthetic_email], bound_user_id: second_uid,
        agent_name: agentName,
        notes: `Auto-issued for request ${row.id} (pair #2)`,
      });
      if (c2CodeErr) throw new Error(c2CodeErr.message);
    }

    await supa.from("access_requests").update({
      status: "approved",
      generated_code: code,
      synthetic_email,
      auto_password: password,
      user_id: uid,
      second_generated_code: second_code,
      second_synthetic_email,
      second_user_id: second_uid,
      second_auto_password: second_password,
      approved_at: new Date().toISOString(),
    }).eq("id", row.id);

    // --- Auto-log payment (approval = payment received) ---
    await supa.from("payment_requests").insert({
      student_email: row.email,
      student_email_2: isPair ? row.second_email : null,
      amount: totalAmount,
      agent_name: agentName,
      status: "approved",
      request_id: row.id,
      created_at: row.created_at, // back-date to when request was submitted
      notes: `Auto-logged on approval of ${isPair ? "pair" : "solo"} request`,
    });

    return json({
      code, email: row.email, full_name: row.full_name,
      is_pair: isPair,
      second_code, second_email: isPair ? row.second_email : null,
      second_full_name: isPair ? row.second_full_name : null,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 400);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}
