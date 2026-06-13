-- 1) Hard-delete every user except admin + Portia
DO $$
DECLARE
  v_keep uuid[] := ARRAY[
    'd68fddda-44ac-41a1-bee4-a23d04037a34'::uuid, -- admin
    '58d727be-c658-481f-9de7-7638f773c84e'::uuid  -- Portia Musakwa
  ];
  v_id uuid;
BEGIN
  FOR v_id IN SELECT id FROM auth.users WHERE id <> ALL(v_keep) LOOP
    DELETE FROM public.access_code_usage WHERE user_id = v_id;
    DELETE FROM public.access_codes      WHERE bound_user_id = v_id;
    UPDATE public.access_requests
       SET user_id = NULL
     WHERE user_id = v_id;
    UPDATE public.access_requests
       SET second_user_id = NULL
     WHERE second_user_id = v_id;
    DELETE FROM public.user_roles WHERE user_id = v_id;
    DELETE FROM public.support_tickets WHERE user_id = v_id;
    DELETE FROM public.profiles   WHERE id = v_id;
    DELETE FROM auth.users        WHERE id = v_id;
  END LOOP;
END $$;

-- 2) Block non-admin INSERTs on user_roles (privilege-escalation guard)
DROP POLICY IF EXISTS "Only admins can assign roles" ON public.user_roles;
CREATE POLICY "Only admins can assign roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
