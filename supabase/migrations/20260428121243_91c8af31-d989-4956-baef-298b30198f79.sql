CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

ALTER POLICY "Users can view own profile" ON public.profiles
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Users can update own profile" ON public.profiles
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Admins can delete profiles" ON public.profiles
USING (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Users can view own roles" ON public.user_roles
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Admins can create roles" ON public.user_roles
WITH CHECK (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Admins can update roles" ON public.user_roles
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Admins can delete roles" ON public.user_roles
USING (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Signed in users can view active rooms" ON public.rooms
USING (status = 'active' OR private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Admins can create rooms" ON public.rooms
WITH CHECK (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Admins can update rooms" ON public.rooms
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Admins can delete rooms" ON public.rooms
USING (private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Users can view own reservations" ON public.reservations
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Users can create own reservations" ON public.reservations
WITH CHECK (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Users can update own reservations" ON public.reservations
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

ALTER POLICY "Users can delete own reservations" ON public.reservations
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

DROP FUNCTION public.has_role(UUID, public.app_role);