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
      return json({ code: row.generated_code, email: row.email, full_name: row.full_name });
    }

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
      id: uid,
      email: synthetic_email,
      full_name: row.full_name,
      access_level: "full",
    });

    const { error: codeErr } = await supa.from("access_codes").insert({
      code,
      total_seats: 1,
      used_seats: 1,
      amount: 5,
      assigned_emails: [synthetic_email],
      bound_user_id: uid,
      notes: `Auto-issued for request ${row.id}`,
    });
    if (codeErr) throw new Error(codeErr.message);

    await supa.from("access_requests").update({
      status: "approved",
      generated_code: code,
      synthetic_email,
      auto_password: password,
      user_id: uid,
      approved_at: new Date().toISOString(),
    }).eq("id", row.id);

    return json({ code, email: row.email, full_name: row.full_name });
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
