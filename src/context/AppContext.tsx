import { createContext, useContext, useState, ReactNode } from "react";
import { Room, Reservation, AppUser, ROOMS, INITIAL_RESERVATIONS, USERS } from "@/data/appData";

interface AppContextType {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  users: AppUser[];
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  currentUser: { name: string; email: string; role: "user" | "admin" };
  addReservation: (res: Omit<Reservation, "id" | "createdAt">) => void;
  cancelReservation: (id: string) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  addRoom: (room: Omit<Room, "id">) => void;
  updateRoom: (id: number, updates: Partial<Room>) => void;
  deleteRoom: (id: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [users, setUsers] = useState<AppUser[]>(USERS);

  const currentUser = { name: "Alex Sterling", email: "alex@company.com", role: "user" as const };

  const addReservation = (res: Omit<Reservation, "id" | "createdAt">) => {
    const newRes: Reservation = {
      ...res,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setReservations((prev) => [newRes, ...prev]);
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" as const } : r))
    );
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const addRoom = (room: Omit<Room, "id">) => {
    const newRoom: Room = { ...room, id: Date.now() };
    setRooms((prev) => [...prev, newRoom]);
  };

  const updateRoom = (id: number, updates: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRoom = (id: number) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        rooms, setRooms,
        reservations, setReservations,
        users, setUsers,
        currentUser,
        addReservation, cancelReservation, updateReservation,
        addRoom, updateRoom, deleteRoom,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
