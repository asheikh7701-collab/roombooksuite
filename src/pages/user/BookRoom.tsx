import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Users, MapPin, Check, ChevronRight, Clock, Calendar, ChevronLeft, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { TIME_SLOTS } from "@/data/appData";

const BookRoom = () => {
  const { rooms, addReservation } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStart, setSelectedStart] = useState("");
  const [selectedEnd, setSelectedEnd] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [attendeeEmails, setAttendeeEmails] = useState("");
  const [attendeeCount, setAttendeeCount] = useState("2");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const availableRooms = rooms.filter((r) => r.status !== "maintenance");
  const selectedRoomData = rooms.find((r) => r.id === selectedRoom);

  const handleConfirmBooking = async () => {
    if (!selectedRoom || !selectedRoomData) return;
    setIsSubmitting(true);

    try {
      await addReservation({
        roomId: selectedRoom,
        date: selectedDate,
        startTime: selectedStart,
        endTime: selectedEnd,
        attendees: parseInt(attendeeCount) || 2,
        status: "confirmed",
        title: meetingTitle || "Untitled Meeting",
        attendeeEmails,
      });

      setBookingComplete(true);
      toast.success("Room booked successfully!", {
        description: `${selectedRoomData.name} on ${selectedDate} from ${selectedStart} to ${selectedEnd}`,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not book this room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingComplete) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
          <PartyPopper className="w-10 h-10 text-secondary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-primary mb-3">Booking Confirmed!</h1>
        <p className="text-on-surface-variant text-lg mb-2">{selectedRoomData?.name}</p>
        <p className="text-on-surface-variant mb-8">
          {selectedDate} • {selectedStart} – {selectedEnd}
        </p>
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-elegant mb-8 text-left">
          <h3 className="font-bold text-primary mb-4">Booking Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-on-surface-variant">Meeting</span><span className="font-medium text-primary">{meetingTitle || "Untitled Meeting"}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Room</span><span className="font-medium text-primary">{selectedRoomData?.name}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Date</span><span className="font-medium text-primary">{selectedDate}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Time</span><span className="font-medium text-primary">{selectedStart} – {selectedEnd}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Attendees</span><span className="font-medium text-primary">{attendeeCount}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Floor</span><span className="font-medium text-primary">{selectedRoomData?.floor}</span></div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate("/user/reservations")} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold">
            View Reservations
          </button>
          <button
            onClick={() => {
              setBookingComplete(false);
              setStep(1);
              setSelectedRoom(null);
              setSelectedDate("");
              setSelectedStart("");
              setSelectedEnd("");
              setMeetingTitle("");
              setAttendeeEmails("");
              setAttendeeCount("2");
            }}
            className="px-6 py-3 bg-surface-container-low text-primary rounded-xl font-semibold"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-primary mb-2">Book a Meeting Space</h1>
          <p className="text-on-surface-variant text-lg">Streamlined booking for The Atrium Executive Suite.</p>
        </div>
        <div className="flex items-center gap-1">
          {[{ n: 1, l: "Room" }, { n: 2, l: "Schedule" }, { n: 3, l: "Details" }].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  s.n <= step ? "bg-secondary text-secondary-foreground" : "bg-surface-container-highest text-on-surface-variant"
                }`}>
                  {s.n < step ? <Check className="w-4 h-4" /> : s.n}
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-1">{s.l}</span>
              </div>
              {i < 2 && <div className={`h-0.5 w-8 mx-1 mt-[-12px] ${s.n < step ? "bg-secondary-container" : "bg-surface-container-highest"}`} />}
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {step === 1 && (
            <div className="bg-surface-container-low rounded-xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight text-primary">Select a Room</h2>
                <span className="text-sm font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                  {availableRooms.length} Available
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`text-left bg-surface-container-lowest rounded-xl overflow-hidden transition-all ${
                      selectedRoom === room.id ? "ring-2 ring-secondary shadow-lg" : "hover:shadow-md"
                    }`}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={400} height={225} />
                      {selectedRoom === room.id && (
                        <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                      {room.status === "occupied" && (
                        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                          <span className="bg-foreground/80 text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm">Currently Occupied</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-primary mb-1">{room.name}</h3>
                      <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">{room.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.capacity} Seats</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {room.floor}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {room.equipment.slice(0, 3).map((e) => (
                          <span key={e} className="px-2 py-0.5 bg-surface-container-low rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                disabled={!selectedRoom}
                onClick={() => setStep(2)}
                className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-surface-container-low rounded-xl p-6 lg:p-8">
              <h2 className="text-xl font-bold tracking-tight text-primary mb-6">Choose Date & Time</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Start Time</label>
                    <select value={selectedStart} onChange={(e) => setSelectedStart(e.target.value)} className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40">
                      <option value="">Select start time</option>
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">End Time</label>
                    <select value={selectedEnd} onChange={(e) => setSelectedEnd(e.target.value)} className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40">
                      <option value="">Select end time</option>
                      {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(1)} className="px-6 py-3 bg-surface-container-high text-primary rounded-xl font-semibold flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  disabled={!selectedDate || !selectedStart || !selectedEnd}
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-surface-container-low rounded-xl p-6 lg:p-8">
              <h2 className="text-xl font-bold tracking-tight text-primary mb-6">Meeting Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Meeting Title *</label>
                  <input type="text" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} placeholder="Q4 Strategy Review" className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground placeholder:text-outline focus:ring-2 focus:ring-secondary/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Number of Attendees</label>
                  <input type="number" value={attendeeCount} onChange={(e) => setAttendeeCount(e.target.value)} min="1" max={selectedRoomData?.capacity} className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground focus:ring-2 focus:ring-secondary/40" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Attendee Emails (Optional)</label>
                  <textarea value={attendeeEmails} onChange={(e) => setAttendeeEmails(e.target.value)} placeholder="john@company.com, jane@company.com" rows={3} className="w-full px-4 py-3 bg-surface-container-lowest border-0 rounded-xl text-foreground placeholder:text-outline focus:ring-2 focus:ring-secondary/40 resize-none" />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setStep(2)} className="px-6 py-3 bg-surface-container-high text-primary rounded-xl font-semibold flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  disabled={!meetingTitle || isSubmitting}
                  onClick={handleConfirmBooking}
                  className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                      Booking...
                    </span>
                  ) : (
                    <><Check className="w-4 h-4" /> Confirm Booking</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-elegant sticky top-24">
            {selectedRoomData && (
              <img src={selectedRoomData.image} alt={selectedRoomData.name} className="w-full h-40 object-cover" loading="lazy" width={400} height={160} />
            )}
            <div className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="text-xs text-on-surface-variant">Room</p>
                    <p className="font-semibold text-primary text-sm">{selectedRoomData?.name || "Not selected"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="text-xs text-on-surface-variant">Date</p>
                    <p className="font-semibold text-primary text-sm">{selectedDate || "Not selected"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="text-xs text-on-surface-variant">Time</p>
                    <p className="font-semibold text-primary text-sm">
                      {selectedStart && selectedEnd ? `${selectedStart} – ${selectedEnd}` : "Not selected"}
                    </p>
                  </div>
                </div>
                {meetingTitle && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-secondary shrink-0" />
                    <div>
                      <p className="text-xs text-on-surface-variant">Meeting</p>
                      <p className="font-semibold text-primary text-sm">{meetingTitle}</p>
                    </div>
                  </div>
                )}
              </div>
              {selectedRoomData && (
                <div className="mt-6 pt-4 border-t border-outline-variant/20">
                  <p className="text-xs text-on-surface-variant mb-2">Equipment</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRoomData.equipment.map((e) => (
                      <span key={e} className="px-2 py-0.5 bg-surface-container-low rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{e}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
