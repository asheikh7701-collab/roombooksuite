import roomDirectorBoard from "@/assets/room-director-board.jpg";
import roomMeeting1 from "@/assets/room-meeting-1.jpg";
import roomInnovationLab from "@/assets/room-innovation-lab.jpg";
import roomExecutiveLounge from "@/assets/room-executive-lounge.jpg";
import roomMeeting2 from "@/assets/room-meeting-2.jpg";
import roomTownHall from "@/assets/room-town-hall.jpg";

export interface Room {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  status: "available" | "maintenance" | "inactive";
  equipment: string[];
  bookings: number;
  image: string;
  description: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  floor: string;
  attendees: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  title: string;
  bookedBy: string;
  attendeeEmails: string;
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  department: string;
  joinedAt: string;
  totalBookings: number;
  status: "active" | "inactive";
}

export const ROOMS: Room[] = [
  {
    id: "demo-room-1",
    name: "Director Board Meeting Room",
    floor: "Floor 12",
    capacity: 12,
    status: "available",
    equipment: ["4K Video Conferencing", "Whiteboard", "Wi-Fi", "Projector"],
    bookings: 45,
    image: roomDirectorBoard,
    description: "Premium executive boardroom with panoramic city views, ideal for C-suite meetings and board presentations.",
  },
  {
    id: "demo-room-2",
    name: "Meeting Room #1",
    floor: "Floor 8",
    capacity: 6,
    status: "available",
    equipment: ["Display", "Wi-Fi", "Whiteboard"],
    bookings: 38,
    image: roomMeeting1,
    description: "Compact collaborative space perfect for team huddles and brainstorming sessions.",
  },
  {
    id: "demo-room-3",
    name: "Innovation Lab",
    floor: "Floor 6",
    capacity: 10,
    status: "available",
    equipment: ["Dual Displays", "Whiteboard Wall", "Wi-Fi", "Standing Desks"],
    bookings: 28,
    image: roomInnovationLab,
    description: "Creative workspace with modular furniture, large displays, and collaboration tools.",
  },
  {
    id: "demo-room-4",
    name: "Executive Lounge",
    floor: "Floor 12",
    capacity: 4,
    status: "available",
    equipment: ["Video Call", "Wi-Fi", "Coffee Service"],
    bookings: 22,
    image: roomExecutiveLounge,
    description: "Intimate luxury setting for confidential discussions and client meetings.",
  },
  {
    id: "demo-room-5",
    name: "Meeting Room #2",
    floor: "Floor 8",
    capacity: 8,
    status: "inactive",
    equipment: ["Display", "Wi-Fi", "Whiteboard", "Video Conferencing"],
    bookings: 15,
    image: roomMeeting2,
    description: "Versatile conference room with video conferencing capabilities and glass partition walls.",
  },
  {
    id: "demo-room-6",
    name: "Town Hall",
    floor: "Floor 1",
    capacity: 50,
    status: "available",
    equipment: ["Projector", "Mic System", "Wi-Fi", "Stage Lighting"],
    bookings: 8,
    image: roomTownHall,
    description: "Grand auditorium-style space for all-hands meetings, town halls, and corporate events.",
  },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "res-1",
    roomId: "demo-room-1",
    roomName: "Director Board Meeting Room",
    date: "2024-10-28",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    floor: "Floor 12",
    attendees: 8,
    status: "confirmed",
    title: "Q4 Strategy Review",
    bookedBy: "Alex Sterling",
    attendeeEmails: "sarah@company.com, james@company.com",
    createdAt: "2024-10-20",
  },
  {
    id: "res-2",
    roomId: "demo-room-2",
    roomName: "Meeting Room #1",
    date: "2024-10-30",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    floor: "Floor 8",
    attendees: 4,
    status: "confirmed",
    title: "Design Sprint Kickoff",
    bookedBy: "Alex Sterling",
    attendeeEmails: "emma@company.com, mike@company.com",
    createdAt: "2024-10-22",
  },
  {
    id: "res-3",
    roomId: "demo-room-3",
    roomName: "Innovation Lab",
    date: "2024-11-01",
    startTime: "9:00 AM",
    endTime: "12:00 PM",
    floor: "Floor 6",
    attendees: 10,
    status: "pending",
    title: "Product Demo Session",
    bookedBy: "Sarah Chen",
    attendeeEmails: "team@company.com",
    createdAt: "2024-10-25",
  },
  {
    id: "res-4",
    roomId: "demo-room-4",
    roomName: "Executive Lounge",
    date: "2024-10-20",
    startTime: "3:00 PM",
    endTime: "4:00 PM",
    floor: "Floor 12",
    attendees: 3,
    status: "completed",
    title: "Client Onboarding",
    bookedBy: "Alex Sterling",
    attendeeEmails: "client@external.com",
    createdAt: "2024-10-15",
  },
  {
    id: "res-5",
    roomId: "demo-room-2",
    roomName: "Meeting Room #1",
    date: "2024-10-18",
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    floor: "Floor 8",
    attendees: 5,
    status: "completed",
    title: "Weekly Stand-up",
    bookedBy: "James Wilson",
    attendeeEmails: "dev-team@company.com",
    createdAt: "2024-10-14",
  },
  {
    id: "res-6",
    roomId: "demo-room-5",
    roomName: "Meeting Room #2",
    date: "2024-11-05",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    floor: "Floor 8",
    attendees: 6,
    status: "confirmed",
    title: "Engineering Sync",
    bookedBy: "Emma Davis",
    attendeeEmails: "engineering@company.com",
    createdAt: "2024-10-28",
  },
];

export const USERS: AppUser[] = [
  { id: "u1", name: "Alex Sterling", email: "alex@company.com", role: "user", department: "Product", joinedAt: "2023-06-15", totalBookings: 42, status: "active" },
  { id: "u2", name: "Sarah Chen", email: "sarah@company.com", role: "user", department: "Design", joinedAt: "2023-08-20", totalBookings: 35, status: "active" },
  { id: "u3", name: "James Wilson", email: "james@company.com", role: "user", department: "Engineering", joinedAt: "2023-03-10", totalBookings: 28, status: "active" },
  { id: "u4", name: "Emma Davis", email: "emma@company.com", role: "user", department: "Marketing", joinedAt: "2024-01-05", totalBookings: 18, status: "active" },
  { id: "u5", name: "Michael Brown", email: "michael@company.com", role: "admin", department: "Operations", joinedAt: "2023-01-01", totalBookings: 12, status: "active" },
  { id: "u6", name: "Lisa Park", email: "lisa@company.com", role: "user", department: "HR", joinedAt: "2024-02-15", totalBookings: 8, status: "inactive" },
];

export const TIME_SLOTS = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM",
];
