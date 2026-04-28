CREATE OR REPLACE FUNCTION private.has_any_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE role = 'admin'
  )
$$;

DROP POLICY "Admins can create roles" ON public.user_roles;

CREATE POLICY "Safe role creation"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  private.has_role(auth.uid(), 'admin')
  OR (auth.uid() = user_id AND role = 'user')
  OR (auth.uid() = user_id AND role = 'admin' AND NOT private.has_any_admin())
);