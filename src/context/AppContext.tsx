import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Session, User as AuthUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import type { AppUser, Reservation, Room, UserPermissions } from "@/data/appData";
import roomDirectorBoard from "@/assets/room-director-board.jpg";
import roomMeeting1 from "@/assets/room-meeting-1.jpg";
import roomInnovationLab from "@/assets/room-innovation-lab.jpg";
import roomExecutiveLounge from "@/assets/room-executive-lounge.jpg";
import roomMeeting2 from "@/assets/room-meeting-2.jpg";
import roomTownHall from "@/assets/room-town-hall.jpg";

const roomImages = [roomDirectorBoard, roomInnovationLab, roomExecutiveLounge, roomTownHall, roomMeeting1, roomMeeting2];

interface AppContextType {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  users: AppUser[];
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  currentUser: { id: string; name: string; email: string; role: "user" | "admin"; department?: string; phone?: string; notificationEmail?: boolean; notificationPush?: boolean; permissions: UserPermissions };
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string, portal: "user" | "admin") => Promise<{ error?: string }>;
  signUp: (payload: { email: string; password: string; name: string; role?: "user" | "admin" }) => Promise<{ error?: string; message?: string }>;
  signInWithGoogle: (portal: "user" | "admin") => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
  updateProfile: (updates: { fullName?: string; email?: string; department?: string; phone?: string; notificationEmail?: boolean; notificationPush?: boolean }) => Promise<void>;
  createUser: (payload: { email: string; password: string; fullName: string; department?: string; jobTitle?: string; role: "user" | "admin"; permissions: UserPermissions }) => Promise<void>;
  updateUserAccess: (userId: string, updates: { status?: "active" | "inactive"; role?: "user" | "admin"; permissions?: UserPermissions }) => Promise<void>;
  addReservation: (res: Omit<Reservation, "id" | "createdAt" | "bookedBy" | "roomName" | "floor"> & { userId?: string }) => Promise<void>;
  cancelReservation: (id: string) => Promise<void>;
  updateReservation: (id: string, updates: Partial<Reservation>) => Promise<void>;
  addRoom: (room: Omit<Room, "id">) => Promise<void>;
  updateRoom: (id: string, updates: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

const toDbTime = (value: string) => {
  if (!value) return value;
  if (/^\d{2}:\d{2}/.test(value)) return value.length === 5 ? `${value}:00` : value;
  const [time, modifier] = value.split(" ");
  const [rawHour, rawMinute] = time.split(":").map(Number);
  let hour = rawHour;
  if (modifier === "PM" && hour < 12) hour += 12;
  if (modifier === "AM" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${rawMinute.toString().padStart(2, "0")}:00`;
};

const toUiTime = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
};

const mapRoomStatus = (status: "active" | "maintenance" | "inactive"): Room["status"] => {
  if (status === "active") return "available";
  if (status === "maintenance") return "maintenance";
  return "inactive";
};

const toDbRoomStatus = (status?: Room["status"]) => {
  if (status === "maintenance") return "maintenance";
  if (status === "inactive") return "inactive";
  return "active";
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [profile, setProfile] = useState<AppUser | null>(null);
  const defaultPermissions: UserPermissions = { canViewDashboard: true, canBookRooms: true, canViewReservations: true, canManageProfile: true };
  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions);

  const currentUser = useMemo(() => ({
    id: authUser?.id ?? "",
    name: profile?.name ?? authUser?.user_metadata?.full_name ?? authUser?.email?.split("@")[0] ?? "Workspace User",
    email: profile?.email ?? authUser?.email ?? "",
    role,
    department: profile?.department,
    phone: undefined,
    notificationEmail: true,
    notificationPush: true,
    permissions,
  }), [authUser, profile, role, permissions]);

  const fetchProfileAndRole = useCallback(async (user: AuthUser | null) => {
    if (!user) {
      setProfile(null);
      setRole("user");
      setPermissions(defaultPermissions);
      return;
    }

    const intendedRole = (localStorage.getItem("roombook_pending_role") as "user" | "admin" | null) ?? "user";
    const metadataName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : user.email?.split("@")[0] ?? "Workspace User";

    const { data: existingProfile } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
    if (!existingProfile) {
      await supabase.from("profiles").insert({
        user_id: user.id,
        full_name: metadataName,
        email: user.email ?? "",
        department: "General",
      });
      await supabase.from("user_permissions").insert({ user_id: user.id });
    }

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    if (!roles?.length) {
      await supabase.from("user_roles").insert({ user_id: user.id, role: intendedRole });
      localStorage.removeItem("roombook_pending_role");
    }

    const [{ data: latestProfile }, { data: latestRoles }, { data: latestPermissions }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", user.id),
      supabase.from("user_permissions").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    const resolvedRole = latestRoles?.some((r) => r.role === "admin") ? "admin" : "user";
    setRole(resolvedRole);
    setPermissions(latestPermissions ? {
      canViewDashboard: latestPermissions.can_view_dashboard,
      canBookRooms: latestPermissions.can_book_rooms,
      canViewReservations: latestPermissions.can_view_reservations,
      canManageProfile: latestPermissions.can_manage_profile,
    } : defaultPermissions);
    setProfile(latestProfile ? {
      id: latestProfile.user_id,
      name: latestProfile.full_name,
      email: latestProfile.email,
      role: resolvedRole,
      department: latestProfile.department ?? "General",
      joinedAt: latestProfile.created_at.split("T")[0],
      totalBookings: 0,
      status: latestProfile.status as "active" | "inactive",
      permissions: latestPermissions ? {
        canViewDashboard: latestPermissions.can_view_dashboard,
        canBookRooms: latestPermissions.can_book_rooms,
        canViewReservations: latestPermissions.can_view_reservations,
        canManageProfile: latestPermissions.can_manage_profile,
      } : defaultPermissions,
    } : null);
  }, []);

  const refreshData = useCallback(async () => {
    const [{ data: roomRows }, { data: reservationRows }, { data: profileRows }, { data: roleRows }, { data: permissionRows }] = await Promise.all([
      supabase.from("rooms").select("*").order("name"),
      supabase.from("reservations").select("*").order("reservation_date", { ascending: false }),
      supabase.from("profiles").select("*"),
      supabase.from("user_roles").select("*"),
      supabase.from("user_permissions").select("*"),
    ]);

    const mappedRooms: Room[] = (roomRows ?? []).map((room, index) => ({
      id: room.id,
      name: room.name,
      floor: room.floor ? `Floor ${room.floor}` : room.location,
      capacity: room.capacity,
      status: mapRoomStatus(room.status),
      equipment: room.amenities ?? [],
      bookings: (reservationRows ?? []).filter((r) => r.room_id === room.id && r.status !== "cancelled").length,
      image: roomImages[index % roomImages.length],
      description: room.description ?? "Enterprise meeting space with workplace-ready amenities.",
    }));

    const roomById = new Map(mappedRooms.map((room) => [room.id, room]));
    const profileByUser = new Map((profileRows ?? []).map((p) => [p.user_id, p]));

    setRooms(mappedRooms);
    setReservations((reservationRows ?? []).map((reservation) => {
      const room = roomById.get(reservation.room_id);
      const organizer = profileByUser.get(reservation.user_id);
      return {
        id: reservation.id,
        roomId: reservation.room_id,
        roomName: room?.name ?? "Deleted Room",
        date: reservation.reservation_date,
        startTime: toUiTime(reservation.start_time),
        endTime: toUiTime(reservation.end_time),
        floor: room?.floor ?? "—",
        attendees: reservation.attendees,
        status: reservation.status,
        title: reservation.title,
        bookedBy: organizer?.full_name ?? "Workspace User",
        attendeeEmails: reservation.notes ?? "",
        createdAt: reservation.created_at.split("T")[0],
      };
    }));

    setUsers((profileRows ?? []).map((p) => {
      const userRole = roleRows?.some((r) => r.user_id === p.user_id && r.role === "admin") ? "admin" : "user";
      const userPerms = permissionRows?.find((permission) => permission.user_id === p.user_id);
      return {
        id: p.user_id,
        name: p.full_name,
        email: p.email,
        role: userRole,
        department: p.department ?? "General",
        joinedAt: p.created_at.split("T")[0],
        totalBookings: (reservationRows ?? []).filter((r) => r.user_id === p.user_id).length,
        status: p.status as "active" | "inactive",
        permissions: userPerms ? {
          canViewDashboard: userPerms.can_view_dashboard,
          canBookRooms: userPerms.can_book_rooms,
          canViewReservations: userPerms.can_view_reservations,
          canManageProfile: userPerms.can_manage_profile,
        } : defaultPermissions,
      };
    }));
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, nextSession) => {
      setSession(nextSession);
      setAuthUser(nextSession?.user ?? null);
      setTimeout(async () => {
        await fetchProfileAndRole(nextSession?.user ?? null);
        if (nextSession?.user) await refreshData();
        setLoading(false);
      }, 0);
    });

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setAuthUser(initialSession?.user ?? null);
      fetchProfileAndRole(initialSession?.user ?? null)
        .then(() => initialSession?.user ? refreshData() : undefined)
        .finally(() => setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, [fetchProfileAndRole, refreshData]);

  useEffect(() => {
    if (!session) return;
    const channel = supabase
      .channel("roombook-live")
      .on("postgres_changes", { event: "*", schema: "public" }, () => refreshData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session, refreshData]);

  const signIn = async (email: string, password: string, portal: "user" | "admin") => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    await fetchProfileAndRole(data.user);
    await refreshData();
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const isPortalAdmin = roles?.some((r) => r.role === "admin");
    if (portal === "admin" && !isPortalAdmin) {
      await supabase.auth.signOut();
      return { error: "This account does not have admin access." };
    }
    return {};
  };

  const signUp = async ({ email, password, name, role: requestedRole = "user" }: { email: string; password: string; name: string; role?: "user" | "admin" }) => {
    localStorage.setItem("roombook_pending_role", requestedRole);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
    });
    if (error) return { error: error.message };
    return { message: "Check your email to verify your account, then sign in." };
  };

  const signInWithGoogle = async (portal: "user" | "admin") => {
    localStorage.setItem("roombook_pending_role", portal === "admin" ? "admin" : "user");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) return { error: result.error.message };
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRooms([]);
    setReservations([]);
    setUsers([]);
  };

  const updateProfile = async (updates: { fullName?: string; email?: string; department?: string; phone?: string; notificationEmail?: boolean; notificationPush?: boolean }) => {
    if (!authUser) throw new Error("You must be signed in.");
    const { error } = await supabase.from("profiles").update({
      full_name: updates.fullName,
      email: updates.email,
      department: updates.department,
      phone: updates.phone,
      notification_email: updates.notificationEmail,
      notification_push: updates.notificationPush,
    }).eq("user_id", authUser.id);
    if (error) throw error;
    await fetchProfileAndRole(authUser);
    await refreshData();
  };

  const createUser = async (payload: { email: string; password: string; fullName: string; department?: string; jobTitle?: string; role: "user" | "admin"; permissions: UserPermissions }) => {
    const { error } = await supabase.functions.invoke("admin-create-user", { body: payload });
    if (error) throw error;
    await refreshData();
  };

  const updateUserAccess = async (userId: string, updates: { status?: "active" | "inactive"; role?: "user" | "admin"; permissions?: UserPermissions }) => {
    if (updates.status) {
      const { error } = await supabase.from("profiles").update({ status: updates.status }).eq("user_id", userId);
      if (error) throw error;
    }

    if (updates.role) {
      await supabase.from("user_roles").delete().eq("user_id", userId);
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: updates.role });
      if (error) throw error;
    }

    if (updates.permissions) {
      const { error } = await supabase.from("user_permissions").upsert({
        user_id: userId,
        can_view_dashboard: updates.permissions.canViewDashboard,
        can_book_rooms: updates.permissions.canBookRooms,
        can_view_reservations: updates.permissions.canViewReservations,
        can_manage_profile: updates.permissions.canManageProfile,
      }, { onConflict: "user_id" });
      if (error) throw error;
    }

    await refreshData();
  };

  const addReservation = async (res: Omit<Reservation, "id" | "createdAt" | "bookedBy" | "roomName" | "floor"> & { userId?: string }) => {
    if (!authUser) throw new Error("You must be signed in to book a room.");
    const { error } = await supabase.from("reservations").insert({
      room_id: res.roomId,
      user_id: res.userId ?? authUser.id,
      title: res.title,
      reservation_date: res.date,
      start_time: toDbTime(res.startTime),
      end_time: toDbTime(res.endTime),
      attendees: res.attendees,
      notes: res.attendeeEmails,
      status: res.status,
    });
    if (error) throw error;
    await refreshData();
  };

  const cancelReservation = async (id: string) => {
    const { error } = await supabase.from("reservations").update({ status: "cancelled" }).eq("id", id);
    if (error) throw error;
    await refreshData();
  };

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    const { error } = await supabase.from("reservations").update({
      title: updates.title,
      reservation_date: updates.date,
      start_time: updates.startTime ? toDbTime(updates.startTime) : undefined,
      end_time: updates.endTime ? toDbTime(updates.endTime) : undefined,
      attendees: updates.attendees,
      notes: updates.attendeeEmails,
      status: updates.status,
    }).eq("id", id);
    if (error) throw error;
    await refreshData();
  };

  const addRoom = async (room: Omit<Room, "id">) => {
    const { error } = await supabase.from("rooms").insert({
      name: room.name,
      location: room.floor.replace("Floor ", ""),
      floor: room.floor.replace("Floor ", ""),
      capacity: room.capacity,
      description: room.description,
      amenities: room.equipment,
      status: toDbRoomStatus(room.status),
      type: "Meeting Room",
    });
    if (error) throw error;
    await refreshData();
  };

  const updateRoom = async (id: string, updates: Partial<Room>) => {
    const { error } = await supabase.from("rooms").update({
      name: updates.name,
      floor: updates.floor?.replace("Floor ", ""),
      location: updates.floor?.replace("Floor ", ""),
      capacity: updates.capacity,
      description: updates.description,
      amenities: updates.equipment,
      status: updates.status ? toDbRoomStatus(updates.status) : undefined,
    }).eq("id", id);
    if (error) throw error;
    await refreshData();
  };

  const deleteRoom = async (id: string) => {
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) throw error;
    await refreshData();
  };

  return (
    <AppContext.Provider value={{
      rooms, setRooms, reservations, setReservations, users, setUsers, currentUser, session, loading, isAdmin: role === "admin",
      signIn, signUp, signInWithGoogle, signOut, refreshData, updateProfile, createUser, updateUserAccess,
      addReservation, cancelReservation, updateReservation, addRoom, updateRoom, deleteRoom,
    }}>
      {children}
    </AppContext.Provider>
  );
};
