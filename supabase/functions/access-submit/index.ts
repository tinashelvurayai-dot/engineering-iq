// Public: submit access request (anonymous). Email REQUIRED. Optional pair signup.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const body = await req.json();
    const { full_name, whatsapp, email, is_pair, second_full_name, second_whatsapp, second_email } = body;
    if (!full_name || String(full_name).trim().length < 2) throw new Error("Full name is required");
    if (!whatsapp || String(whatsapp).trim().length < 5) throw new Error("WhatsApp number is required");
    if (!email || !emailOk(email)) throw new Error("Valid email required");

    const pair = !!is_pair;
    if (pair) {
      if (!second_full_name || String(second_full_name).trim().length < 2) throw new Error("Second user full name is required");
      if (!second_whatsapp || String(second_whatsapp).trim().length < 5) throw new Error("Second user WhatsApp is required");
      if (!second_email || !emailOk(second_email)) throw new Error("Valid second email required");
      if (String(email).trim().toLowerCase() === String(second_email).trim().toLowerCase()) {
        throw new Error("The two pair emails must be different");
      }
    }

    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await supa.from("access_requests").insert({
      full_name: String(full_name).trim(),
      whatsapp: String(whatsapp).trim(),
      email: String(email).trim(),
      is_pair: pair,
      second_full_name: pair ? String(second_full_name).trim() : null,
      second_whatsapp: pair ? String(second_whatsapp).trim() : null,
      second_email: pair ? String(second_email).trim() : null,
    });
    if (error) throw new Error(error.message);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...cors, "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...cors, "content-type": "application/json" },
    });
  }
});
