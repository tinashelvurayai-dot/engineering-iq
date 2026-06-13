import { cors, requireAdmin, randCode, randPassword, synthEmail } from "../_shared/admin.ts";

// Admin-only: create a user directly (no payment / no request flow).
// Body: { full_name: string, email: string, access_level?: "full"|"free" }
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { supa } = await requireAdmin(req);
    const { full_name, email, access_level } = await req.json();
    if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2) {
      throw new Error("full_name is required");
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Valid contact email required");
    }
    const level = access_level === "free" ? "free" : "full";

    const synthetic_email = synthEmail();
    const password = randPassword();
    const code = randCode();

    const { data: created, error: cErr } = await supa.auth.admin.createUser({
      email: synthetic_email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });
    if (cErr || !created.user) throw new Error(cErr?.message || "Could not create user");
    const uid = created.user.id;

    await supa.from("profiles").upsert({
      id: uid, email: synthetic_email, full_name, access_level: level,
    });
    await supa.from("access_codes").insert({
      code, total_seats: 1, used_seats: 1, amount: 0,
      assigned_emails: [synthetic_email], bound_user_id: uid,
      notes: `Admin-created user (${email})`,
    });

    return new Response(JSON.stringify({ code, email, full_name }), {
      headers: { ...cors, "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...cors, "content-type": "application/json" },
    });
  }
});
