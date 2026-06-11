import { cors, requireAdmin } from "../_shared/admin.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { supa } = await requireAdmin(req);
    const { request_id } = await req.json();
    if (!request_id) throw new Error("request_id required");
    const { data: row } = await supa.from("access_requests").select("*").eq("id", request_id).maybeSingle();
    if (!row) throw new Error("Request not found");
    if (!row.email) throw new Error("This request has no email");
    if (!row.generated_code) throw new Error("This request has no code yet - approve first");
    return new Response(JSON.stringify({
      code: row.generated_code,
      email: row.email,
      full_name: row.full_name,
      is_pair: !!row.is_pair,
      second_code: row.second_generated_code,
      second_email: row.second_email,
      second_full_name: row.second_full_name,
    }), {
      headers: { ...cors, "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...cors, "content-type": "application/json" },
    });
  }
});
