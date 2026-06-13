// Thin wrapper around supabase.functions.invoke so call sites don't repeat error parsing.
import { supabase } from "@/integrations/supabase/client";

export async function callFn<T = any>(name: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(name, { body });
  if (error) {
    // Try to extract structured { error } JSON from the edge response.
    const ctx: any = (error as any).context;
    try {
      if (ctx?.json) {
        const parsed = await ctx.json();
        if (parsed?.error) throw new Error(parsed.error);
      } else if (typeof ctx?.text === "function") {
        const raw = await ctx.text();
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.error) throw new Error(parsed.error);
        } catch {}
      }
    } catch (inner: any) {
      if (inner?.message) throw inner;
    }
    throw new Error(error.message || "Edge function failed");
  }
  if (data && typeof data === "object" && (data as any).error) {
    throw new Error((data as any).error);
  }
  return data as T;
}

export type ApprovalResult = {
  code: string;
  email: string;
  full_name: string;
  is_pair?: boolean;
  second_code?: string | null;
  second_email?: string | null;
  second_full_name?: string | null;
};

export const accessApi = {
  submit: (input: {
    full_name: string;
    whatsapp: string;
    email: string;
    is_pair?: boolean;
    second_full_name?: string;
    second_whatsapp?: string;
    second_email?: string;
  }) => callFn<{ ok: true }>("access-submit", input),
  signIn: (input: { full_name: string; code: string }) =>
    callFn<{ email: string; password: string }>("access-signin", input),
  approve: (input: { request_id: string }) =>
    callFn<ApprovalResult>("access-approve", input),
  resend: (input: { request_id: string }) =>
    callFn<ApprovalResult>("access-resend", input),
  reject: (input: { request_id: string }) =>
    callFn<{ ok: true }>("access-reject", input),
  adminAddUser: (input: { full_name: string; email: string; access_level?: "free" | "full" }) =>
    callFn<{ code: string; email: string; full_name: string }>("admin-add-user", input),
  cleanupUsers: () => callFn<{ removed_count: number }>("admin-cleanup-users", {}),
};
