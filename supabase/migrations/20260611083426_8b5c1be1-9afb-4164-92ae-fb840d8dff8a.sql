
ALTER TABLE public.access_requests
  ADD COLUMN IF NOT EXISTS second_generated_code text,
  ADD COLUMN IF NOT EXISTS second_synthetic_email text,
  ADD COLUMN IF NOT EXISTS second_user_id uuid,
  ADD COLUMN IF NOT EXISTS second_auto_password text;

ALTER TABLE public.payment_requests
  ADD COLUMN IF NOT EXISTS request_id uuid REFERENCES public.access_requests(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_payment_requests_request_id ON public.payment_requests(request_id);
