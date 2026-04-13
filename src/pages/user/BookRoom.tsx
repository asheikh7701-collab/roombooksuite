import { useState } from "react";
import { Users, Wifi, Video, MapPin, Check, ChevronRight, Clock, Calendar } from "lucide-react";

const rooms = [
  { id: 1, name: "Director Board Meeting Room", capacity: 12, amenities: ["4K VC", "Wi-Fi", "Whiteboard"], floor: "Floor 12", selected: false },
  { id: 2, name: "Meeting Room #1", capacity: 6, amenities: ["Wi-Fi", "Display"], floor: "Floor 8", selected: false },
  { id: 3, name: "Innovation Lab", capacity: 10, amenities: ["Wi-Fi", "Display", "Whiteboard"], floor: "Floor 6", selected: false },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

const BookRoom = () => {
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStart, setSelectedStart] = useState("");
  const [selectedEnd, setSelectedEnd] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [attendees, setAttendees] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Book a Meeting Space</h1>
          <p className="text-on-surface-variant text-lg">Streamlined professional coordination for The Atrium Executive Suite.</p>
        </div>
        {/* Step Indicator */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                s <= step ? "bg-secondary text-secondary-foreground" : "bg-surface-container-highest text-on-surface-variant"
              }`}>
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`h-0.5 w-8 ${s < step ? "bg-secondary-container" : "bg-surface-container-highest"}`} />}
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-8 space-y-8">
          {step === 1 && (
            <div className="bg-surface-container-low rounded-xl p-8">
              <h2 className="text-xl font-bold tracking-tight text-primary mb-6">Step 1: Select Room</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`text-left bg-surface-container-lowest rounded-xl p-6 transition-all ${
                      selectedRoom === room.id ? "ring-2 ring-secondary shadow-lg" : "hover:shadow-md"
                    }`}
                  >
                    <div className="h-32 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg mb-4 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-primary/20" />
                    </div>
                    <h3 className="font-bold text-primary mb-2">{room.name}</h3>
                    <div className="flex gap-4 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.capacity} Seats</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {room.floor}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {room.amenities.map((a) => (
                        <span key={a} className="px-2 py-1 bg-surface-container-low rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          {a}
                        </span>
                      ))}
                    </div>
                    {selectedRoom === room.id && (
                      <div className="mt-3 flex items-center gap-1 text-secondary text-sm font-semibold">
                        <Check className="w-4 h-4" /> Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                disabled={!selectedRoom}
                onClick={() => setStep(2)}
                className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-surface-container-low rounded-xl p-8">
              <h2 className="text-xl font-bold tracking-tight text-primary mb-6">Step 2: Date & Time</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Start Time</label>
                    <select
                      value={selectedStart}
                      onChange={(e) => setSelectedStart(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40"
                    >
                      <option value="">Select</option>
                      {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">End Time</label>
                    <select
                      value={selectedEnd}
                      onChange={(e) => setSelectedEnd(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40"
                    >
                      <option value="">Select</option>
                      {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(1)} className="px-6 py-3 bg-surface-container-high text-primary rounded-xl font-semibold">Back</button>
                <button
                  disabled={!selectedDate || !selectedStart || !selectedEnd}
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-surface-container-low rounded-xl p-8">
              <h2 className="text-xl font-bold tracking-tight text-primary mb-6">Step 3: Meeting Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Meeting Title</label>
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="Q4 Strategy Review"
                    className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground placeholder:text-outline focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Attendee Emails</label>
                  <textarea
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="john@company.com, jane@company.com"
                    rows={3}
                    className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground placeholder:text-outline focus:ring-2 focus:ring-secondary/40 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(2)} className="px-6 py-3 bg-surface-container-high text-primary rounded-xl font-semibold">Back</button>
                <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all">
                  <Check className="w-4 h-4" /> Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-elegant sticky top-24">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Booking Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-xs text-on-surface-variant">Room</p>
                  <p className="font-semibold text-primary text-sm">
                    {selectedRoom ? rooms.find((r) => r.id === selectedRoom)?.name : "Not selected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-xs text-on-surface-variant">Date</p>
                  <p className="font-semibold text-primary text-sm">{selectedDate || "Not selected"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-xs text-on-surface-variant">Time</p>
                  <p className="font-semibold text-primary text-sm">
                    {selectedStart && selectedEnd ? `${selectedStart} - ${selectedEnd}` : "Not selected"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
