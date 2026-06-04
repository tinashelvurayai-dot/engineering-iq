import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as Record<string, string>)[c]!,
  );
}

function applyTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k) => vars[k] ?? "");
}

function bodyToHtml(body: string, code: string): string {
  // Escape, then convert {{code}} block into a styled box if present in escaped form
  const escaped = escapeHtml(body);
  const withBox = escaped.replace(
    escapeHtml(code),
    `<div style="background:#1e293b;border:2px solid #6366f1;border-radius:10px;padding:20px;margin:18px 0;text-align:center"><p style="margin:0 0 6px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px">Your Access Code</p><p style="margin:0;font-family:'Courier New',monospace;font-size:28px;font-weight:700;color:#6366f1;letter-spacing:4px">${escapeHtml(code)}</p></div>`,
  );
  return withBox.replace(/\n/g, "<br/>");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const { to, fullName, code } = await req.json();
    if (!to || !fullName || !code) throw new Error("Missing required fields: to, fullName, code");

    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Load admin-editable template from app_settings
    const { data: settings } = await supa
      .from("app_settings")
      .select("access_email_subject, access_email_body")
      .eq("id", true)
      .maybeSingle();

    const subjectTpl = settings?.access_email_subject || "Your Industrial Automation Access Code";
    const bodyTpl = settings?.access_email_body
      || `Hi {{full_name}},\n\nYour access code is:\n\n{{code}}\n\n— Ultimate_Developers`;

    const vars = { full_name: fullName, code };
    const subject = applyTemplate(subjectTpl, vars);
    const renderedBody = applyTemplate(bodyTpl, vars);
    const html = `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0f172a;color:#fff;border-radius:12px;border:1px solid #1e293b;line-height:1.6;font-size:14px">${bodyToHtml(renderedBody, code)}</div>`;

    // Use Supabase Auth's built-in email (same SMTP path as signup verification)
    const { error } = await (supa.auth.admin as any).sendRawEmail({ email: to, html, subject });
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...cors, "content-type": "application/json" },
    });
  } catch (e) {
    console.error("send-access-email error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...cors, "content-type": "application/json" },
    });
  }
});
