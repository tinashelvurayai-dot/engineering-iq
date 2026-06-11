import { cors, requireAdmin } from "../_shared/admin.ts";

// One-shot cleanup: deletes every auth user + profile row whose user_id is
// NOT in the allow-list. Admin-only. Idempotent.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { supa } = await requireAdmin(req);
    // Allow-list: current admin + Portia Musakwa.
    const KEEP = new Set<string>([
      "d68fddda-44ac-41a1-bee4-a23d04037a34", // admin
      "58d727be-c658-481f-9de7-7638f773c84e", // Portia Musakwa
    ]);

    const removed: string[] = [];
    let page = 1;
    while (true) {
      const { data, error } = await supa.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error(error.message);
      const users = data?.users ?? [];
      if (users.length === 0) break;
      for (const u of users) {
        if (KEEP.has(u.id)) continue;
        // Wipe references in public tables first to avoid orphans.
        await supa.from("access_codes").delete().eq("bound_user_id", u.id);
        await supa.from("access_code_usage").delete().eq("user_id", u.id);
        await supa.from("user_roles").delete().eq("user_id", u.id);
        await supa.from("profiles").delete().eq("id", u.id);
        await supa.from("access_requests").update({ user_id: null, second_user_id: null }).eq("user_id", u.id);
        const { error: delErr } = await supa.auth.admin.deleteUser(u.id);
        if (delErr) console.error("delete user failed", u.id, delErr.message);
        else removed.push(u.id);
      }
      if (users.length < 200) break;
      page += 1;
    }
    return new Response(JSON.stringify({ removed_count: removed.length, removed }), {
      headers: { ...cors, "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...cors, "content-type": "application/json" },
    });
  }
});
