import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, CheckCircle2, ChevronRight, User, Mail, Phone, Building } from 'lucide-react';

interface CalendarWidgetProps {
  onSuccess: (details: { date: string; time: string; name: string; email: string; phone: string; clinicName: string }) => void;
}

export default function CalendarWidget({ onSuccess }: CalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Generate the next 7 business days
  const getDays = () => {
    const days = [];
    const today = new Date();
    let count = 0;
    let offset = 1;

    while (count < 7) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + offset);
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (nextDate.getDay() !== 0 && nextDate.getDay() !== 6) {
        days.push(nextDate);
        count++;
      }
      offset++;
    }
    return days;
  };

  const days = getDays();
  const timeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  const handleBook = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !clinicName || selectedDate === null || !selectedTime) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsBooked(true);
      const chosenDate = days[selectedDate].toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      onSuccess({
        date: chosenDate,
        time: selectedTime,
        name,
        email,
        phone,
        clinicName
      });
    }, 1200);
  };

  return (
    <div className="w-full mt-6 bg-[#0A0A0A] rounded-3xl border border-neutral-900 overflow-hidden text-left p-6 md:p-8 space-y-8">
      <AnimatePresence mode="wait">
        {!isBooked ? (
          <motion.div
            key="calendar-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* 1. Step title */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-900">
              <Calendar className="w-4.5 h-4.5 text-gold-500" />
              <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider font-sans">
                Select Date & Time
              </span>
            </div>

            {/* 2. Days Slider */}
            <div className="grid grid-cols-4 gap-3">
              {days.slice(0, 4).map((day, idx) => {
                const isSelected = selectedDate === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setSelectedDate(idx); setSelectedTime(null); }}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
                      isSelected
                        ? 'bg-gold-500/10 border-gold-500 text-white'
                        : 'bg-neutral-900/40 border-neutral-950 text-neutral-400 hover:border-neutral-800'
                    }`}
                  >
                    <span className="text-[11px] font-bold uppercase text-neutral-500 tracking-wider">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-base font-extrabold text-white mt-1.5">
                      {day.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3. Time slots (shown when day is selected) */}
            {selectedDate !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2.5 text-xs md:text-sm text-neutral-400">
                  <Clock className="w-4 h-4" />
                  <span>Available slots for {days[selectedDate].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 rounded-xl border text-xs md:text-sm font-bold text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gold-500 text-black border-gold-500'
                            : 'bg-neutral-900/40 border-neutral-950 text-neutral-300 hover:border-neutral-800'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 4. Complete Registration (shown when time is selected) */}
            {selectedTime && (
              <motion.form
                onSubmit={handleBook}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 pt-5 border-t border-neutral-900"
              >
                <div className="text-xs md:text-sm font-extrabold text-neutral-400 uppercase tracking-widest mb-4">
                  Confirm Details
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-4.5 h-4.5 text-neutral-600" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0E0E0E] text-white text-xs md:text-sm border border-neutral-900 rounded-xl pl-11 pr-5 py-4 outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="relative">
                    <Building className="absolute left-4 top-4 w-4.5 h-4.5 text-neutral-600" />
                    <input
                      type="text"
                      placeholder="Clinic Name"
                      required
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full bg-[#0E0E0E] text-white text-xs md:text-sm border border-neutral-900 rounded-xl pl-11 pr-5 py-4 outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-4.5 h-4.5 text-neutral-600" />
                    <input
                      type="email"
                      placeholder="Work Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0E0E0E] text-white text-xs md:text-sm border border-neutral-900 rounded-xl pl-11 pr-5 py-4 outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-4 w-4.5 h-4.5 text-neutral-600" />
                    <input
                      type="tel"
                      placeholder="Mobile Phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#0E0E0E] text-white text-xs md:text-sm border border-neutral-900 rounded-xl pl-11 pr-5 py-4 outline-none focus:border-gold-500 transition-colors placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black font-extrabold text-xs md:text-sm uppercase tracking-widest py-4.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-gold-500/10"
                >
                  {isSubmitting ? (
                    <span>Scheduling booking...</span>
                  ) : (
                    <>
                      <span>Confirm Free Audit Call</span>
                      <ChevronRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="calendar-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 text-center space-y-6"
          >
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-gold-500" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base md:text-lg font-bold text-white">Audit Session Scheduled!</h4>
              <p className="text-xs md:text-sm text-neutral-400">
                Confirmed for {days[selectedDate!].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {selectedTime}.
              </p>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              We have sent a calendar invite with Zoom details to {email}. Looking forward to helping you plug those revenue leaks!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
