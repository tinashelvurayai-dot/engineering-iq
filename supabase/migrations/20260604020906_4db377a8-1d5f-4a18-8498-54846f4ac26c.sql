
-- Add editable email template columns
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS access_email_subject text NOT NULL DEFAULT 'Your Industrial Automation Access Code',
  ADD COLUMN IF NOT EXISTS access_email_body text NOT NULL DEFAULT E'Hi {{full_name}},\n\nYour payment has been approved. Your access code is:\n\n{{code}}\n\nHow to sign in:\n1. Open the Industrial Automation app\n2. Click "I have a code"\n3. Enter your full name and the access code above\n\nQuestions? Reply to this email.\n\n— Ultimate_Developers';

-- Tighten exposure: remove fully-public SELECT, restrict to authenticated
DROP POLICY IF EXISTS "Anyone can read settings" ON public.app_settings;

CREATE POLICY "Authenticated can read settings"
  ON public.app_settings FOR SELECT
  TO authenticated
  USING (true);

-- Expose only non-sensitive pricing for anonymous visitors via SECURITY DEFINER RPC
CREATE OR REPLACE FUNCTION public.get_public_pricing()
RETURNS TABLE(solo_amount numeric, pair_amount numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT solo_amount, pair_amount FROM public.app_settings WHERE id = true LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_pricing() TO anon, authenticated;
