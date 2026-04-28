CREATE TABLE public.user_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  can_view_dashboard BOOLEAN NOT NULL DEFAULT true,
  can_book_rooms BOOLEAN NOT NULL DEFAULT true,
  can_view_reservations BOOLEAN NOT NULL DEFAULT true,
  can_manage_profile BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_permissions_user_id ON public.user_permissions(user_id);

CREATE TRIGGER update_user_permissions_updated_at
BEFORE UPDATE ON public.user_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own permissions"
ON public.user_permissions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create permissions"
ON public.user_permissions
FOR INSERT
TO authenticated
WITH CHECK (private.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

CREATE POLICY "Admins can update permissions"
ON public.user_permissions
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'))
WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete permissions"
ON public.user_permissions
FOR DELETE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'));

INSERT INTO public.user_permissions (user_id)
SELECT p.user_id
FROM public.profiles p
ON CONFLICT (user_id) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_permissions;