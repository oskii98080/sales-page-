import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import femaleClinicOwner from '../assets/images/female_clinic_owner_1782428135403.jpg';

interface Review {
  id: number;
  name: string;
  role: string;
  clinic: string;
  image: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    role: "Medical Director & Owner",
    clinic: "Aura MedSpa",
    image: femaleClinicOwner,
    rating: 5,
    date: "June 14, 2026",
    text: "We went from spending €2,000/mo on stale leads to adding 24 fully qualified patients on autopilot. The €247 setup paid for itself in the first 48 hours.",
    verified: true
  },
  {
    id: 2,
    name: "Dr. Elena Rostova",
    role: "Clinic Founder",
    clinic: "Rostova Dental & Aesthetics",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 5,
    date: "May 28, 2026",
    text: "Losing hot leads because we responded 2 hours too late was our biggest leak. Vantyx's instant qualification booked 18 patients last month without our front desk picking up the phone.",
    verified: true
  },
  {
    id: 3,
    name: "Dr. Amanda Reis",
    role: "Managing Partner",
    clinic: "Reis Cosmetic Dentistry",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 5,
    date: "June 02, 2026",
    text: "The sheer volume of high-intent bookings is remarkable. Our front desk actually has time to focus on in-clinic patient care now.",
    verified: true
  },
  {
    id: 4,
    name: "Dr. Chloe Patel",
    role: "Chief Dermatologist",
    clinic: "Patel Skin & Laser",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 5,
    date: "June 20, 2026",
    text: "Truly hands-off. The integration with our calendar system is seamless and patients love the non-robotic, helpful automated messages.",
    verified: true
  }
];

export default function ReviewsMarquee() {
  return (
    <div className="w-full py-10 overflow-hidden relative mt-14 border-t border-b border-neutral-900/40 bg-gradient-to-r from-[#070707]/30 via-[#0C0C0C]/80 to-[#070707]/30">
      <div className="max-w-7xl mx-auto px-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-6 bg-gold-500 rounded-full" />
          <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-widest">
            REAL RESULTS FROM ACTIVE CLINICS
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-gold-500 font-mono bg-gold-500/5 px-3.5 py-1.5 rounded-full border border-gold-500/15">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Verified Partner Network</span>
        </div>
      </div>

      {/* Infinite horizontal scroll wrapper */}
      <div className="relative w-full overflow-hidden flex">
        {/* Deep edge blur gradients for high-end cinematic fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

        <motion.div 
          className="flex gap-6 shrink-0"
          animate={{ x: [0, "-50%"] }}
          transition={{
            ease: "linear",
            duration: 22,
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {/* Main set of reviews */}
          <div className="flex gap-6 shrink-0">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className="w-[340px] md:w-[390px] p-6.5 rounded-2xl bg-[#0B0B0B] border border-neutral-900/90 hover:border-gold-500/20 transition-all duration-500 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] group relative overflow-hidden"
              >
                {/* Subtle backlighting on hover */}
                <div className="absolute -inset-px bg-gradient-to-b from-gold-500/0 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                
                <div className="relative z-10">
                  {/* Stars, Verified Status, and Date */}
                  <div className="flex items-center justify-between mb-4.5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg 
                            key={i} 
                            className="w-4 h-4 text-gold-500 fill-gold-500 drop-shadow-[0_0_4px_rgba(212,175,55,0.4)]" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-mono">
                          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase">{review.date}</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-neutral-300 text-[13px] md:text-sm italic font-normal leading-relaxed mb-6 font-sans">
                    "{review.text}"
                  </p>
                </div>

                {/* Bio Block with elevated layout */}
                <div className="flex items-center gap-3.5 border-t border-neutral-900/60 pt-4.5 relative z-10">
                  <div className="relative">
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-11 h-11 rounded-full object-cover border border-neutral-800 group-hover:border-gold-500/30 transition-colors duration-500 shadow-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0E0E0E] border border-neutral-900 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white tracking-tight leading-none mb-1.5 group-hover:text-gold-400 transition-colors duration-500">
                      {review.name}
                    </h4>
                    <p className="text-[10px] font-mono text-gold-500 font-semibold tracking-wide uppercase leading-none">
                      {review.role}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1 font-sans font-medium leading-none">
                      {review.clinic}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Identical duplicated set for mathematically seamless loop point */}
          <div className="flex gap-6 shrink-0" aria-hidden="true">
            {reviews.map((review) => (
              <div 
                key={`dup-${review.id}`}
                className="w-[340px] md:w-[390px] p-6.5 rounded-2xl bg-[#0B0B0B] border border-neutral-900/90 hover:border-gold-500/20 transition-all duration-500 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] group relative overflow-hidden"
              >
                {/* Subtle backlighting on hover */}
                <div className="absolute -inset-px bg-gradient-to-b from-gold-500/0 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                
                <div className="relative z-10">
                  {/* Stars, Verified Status, and Date */}
                  <div className="flex items-center justify-between mb-4.5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg 
                            key={i} 
                            className="w-4 h-4 text-gold-500 fill-gold-500 drop-shadow-[0_0_4px_rgba(212,175,55,0.4)]" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-mono">
                          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase">{review.date}</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-neutral-300 text-[13px] md:text-sm italic font-normal leading-relaxed mb-6 font-sans">
                    "{review.text}"
                  </p>
                </div>

                {/* Bio Block with elevated layout */}
                <div className="flex items-center gap-3.5 border-t border-neutral-900/60 pt-4.5 relative z-10">
                  <div className="relative">
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-11 h-11 rounded-full object-cover border border-neutral-800 group-hover:border-gold-500/30 transition-colors duration-500 shadow-xl"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0E0E0E] border border-neutral-900 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white tracking-tight leading-none mb-1.5 group-hover:text-gold-400 transition-colors duration-500">
                      {review.name}
                    </h4>
                    <p className="text-[10px] font-mono text-gold-500 font-semibold tracking-wide uppercase leading-none">
                      {review.role}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1 font-sans font-medium leading-none">
                      {review.clinic}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

