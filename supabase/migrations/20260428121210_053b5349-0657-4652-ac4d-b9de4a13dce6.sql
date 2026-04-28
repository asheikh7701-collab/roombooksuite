CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.room_status AS ENUM ('active', 'maintenance', 'inactive');
CREATE TYPE public.reservation_status AS ENUM ('confirmed', 'pending', 'cancelled', 'completed');

CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT DEFAULT 'General',
  job_title TEXT,
  phone TEXT,
  avatar_url TEXT,
  notification_email BOOLEAN NOT NULL DEFAULT true,
  notification_push BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  floor TEXT,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  type TEXT NOT NULL DEFAULT 'Meeting Room',
  description TEXT,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  status public.room_status NOT NULL DEFAULT 'active',
  open_time TEXT NOT NULL DEFAULT '08:00',
  close_time TEXT NOT NULL DEFAULT '18:00',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  attendees INTEGER NOT NULL DEFAULT 1 CHECK (attendees > 0),
  purpose TEXT,
  notes TEXT,
  status public.reservation_status NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_rooms_status ON public.rooms(status);
CREATE INDEX idx_reservations_room_date ON public.reservations(room_id, reservation_date);
CREATE INDEX idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX idx_reservations_status ON public.reservations(status);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
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

CREATE OR REPLACE FUNCTION public.prevent_room_double_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('confirmed', 'pending') AND EXISTS (
    SELECT 1
    FROM public.reservations r
    WHERE r.room_id = NEW.room_id
      AND r.reservation_date = NEW.reservation_date
      AND r.status IN ('confirmed', 'pending')
      AND r.id <> COALESCE(NEW.id, gen_random_uuid())
      AND NEW.start_time < r.end_time
      AND NEW.end_time > r.start_time
  ) THEN
    RAISE EXCEPTION 'This room is already booked for the selected time.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER prevent_room_double_booking_trigger
BEFORE INSERT OR UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.prevent_room_double_booking();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Signed in users can view active rooms"
ON public.rooms
FOR SELECT
TO authenticated
USING (status = 'active' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create rooms"
ON public.rooms
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update rooms"
ON public.rooms
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete rooms"
ON public.rooms
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own reservations"
ON public.reservations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own reservations"
ON public.reservations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own reservations"
ON public.reservations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

INSERT INTO public.rooms (name, location, floor, capacity, type, description, amenities, image_url, status, open_time, close_time)
VALUES
  ('Executive Boardroom', 'North Wing', '14', 16, 'Boardroom', 'Premium boardroom for leadership meetings and strategic reviews.', ARRAY['Video conferencing','Whiteboard','Catering console','Privacy glass'], '/src/assets/room-director-board.jpg', 'active', '08:00', '19:00'),
  ('Innovation Lab', 'East Atrium', '8', 24, 'Workshop Space', 'Flexible collaboration room for design sprints and product workshops.', ARRAY['Movable tables','Interactive display','Writable walls','Prototype storage'], '/src/assets/room-innovation-lab.jpg', 'active', '08:00', '18:00'),
  ('Client Salon', 'Reception Tower', '3', 8, 'Client Room', 'Polished client-facing room with lounge seating and presentation tools.', ARRAY['Display','Coffee service','Acoustic panels','Guest Wi-Fi'], '/src/assets/room-executive-lounge.jpg', 'active', '08:30', '18:00'),
  ('Town Hall Forum', 'Central Atrium', '1', 80, 'Event Space', 'Large all-hands and training venue with full AV setup.', ARRAY['Stage','Microphones','Projector','Recording'], '/src/assets/room-town-hall.jpg', 'active', '09:00', '17:00'),
  ('Focus Suite A', 'South Wing', '6', 4, 'Focus Room', 'Compact room for interviews, 1:1 meetings, and private calls.', ARRAY['Monitor','Phone booth quality acoustics','Desk camera'], '/src/assets/room-meeting-1.jpg', 'active', '08:00', '18:00'),
  ('Strategy Studio', 'West Wing', '10', 12, 'Meeting Room', 'Well-appointed meeting room for team planning and weekly reviews.', ARRAY['Video conferencing','Whiteboard','Wireless sharing'], '/src/assets/room-meeting-2.jpg', 'active', '08:00', '18:00');

ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;