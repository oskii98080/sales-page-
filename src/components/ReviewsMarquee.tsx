import { useState, memo } from 'react';
import { motion } from 'motion/react';
import { Check, Star, ArrowUpRight } from 'lucide-react';

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
  category: 'medspa' | 'dental' | 'dermatology';
  metrics: string[];
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    role: "Founder & Lead Practitioner",
    clinic: "Aura MedSpa",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 5,
    date: "June 14, 2026",
    text: "We went from spending €2,000/mo on stale leads to adding 24 fully qualified patients on autopilot. The €247 setup paid for itself in the first 48 hours.",
    verified: true,
    category: 'medspa',
    metrics: ["+24 Patients/mo", "Setup ROI: 48h"]
  },
  {
    id: 2,
    name: "Dr. Marcus Vance",
    role: "Clinical Director",
    clinic: "Vance Dental Group",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 5,
    date: "May 28, 2026",
    text: "Losing hot leads because we responded 2 hours too late was our biggest leak. Vantyx's instant qualification booked 18 patients last month without our front desk picking up the phone.",
    verified: true,
    category: 'dental',
    metrics: ["+18 Patients/mo", "Instant Qualify"]
  },
  {
    id: 3,
    name: "Thomas Reis",
    role: "Managing Partner",
    clinic: "Reis Cosmetic Dentistry",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 5,
    date: "June 02, 2026",
    text: "The sheer volume of high-intent bookings is remarkable. Our front desk actually has time to focus on in-clinic patient care now.",
    verified: true,
    category: 'dental',
    metrics: ["Autopilot Active", "Zero Staff Overhead"]
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
    verified: true,
    category: 'dermatology',
    metrics: ["Seamless Integration", "24h Autopilot"]
  }
];

function ReviewsMarquee() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="w-full py-16 md:py-20 overflow-hidden relative mt-14 border-t border-b border-neutral-900/40 bg-gradient-to-r from-[#070707]/30 via-[#0C0C0C]/80 to-[#070707]/30">
      
      {/* Upper header section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-8 bg-gold-500 rounded-full" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display uppercase">
              WHAT OUR CLIENTS SAY
            </h2>
          </div>
          <p className="text-neutral-400 text-sm sm:text-base font-sans mt-2 max-w-2xl">
            Real performance, audited data, and genuine growth from active medical partners.
          </p>
        </div>

        {/* Global rating summary badge - Improved 5-star column layout */}
        <div className="flex items-center gap-4.5 bg-gradient-to-br from-neutral-900/80 to-neutral-950/90 border border-gold-500/15 rounded-2xl p-4.5 sm:p-5 text-xs sm:text-sm shrink-0 shadow-[0_4px_30px_rgba(212,175,55,0.06)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono leading-none">5.0</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
                ))}
              </div>
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-400 font-sans tracking-wide">
              Average rating across <strong className="text-gold-400 font-semibold">42 active practices</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite horizontal scrolling marquee */}
      <div className="relative w-full overflow-hidden flex min-h-[340px]">
        
        {/* Cinematic edge blur gradients for smooth visual blend */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-28 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-28 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 shrink-0">
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
                  onMouseEnter={() => setHoveredCard(review.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="w-[310px] sm:w-[360px] md:w-[390px] p-6.5 rounded-2xl bg-[#0B0B0B] border border-neutral-900/90 hover:border-gold-500/25 transition-all duration-500 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] group relative overflow-hidden shrink-0"
                >
                  {/* Subtle warm radial backlight on hover */}
                  <div className="absolute -inset-px bg-gradient-to-b from-gold-500/0 to-gold-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                  
                  <div className="relative z-10">
                    {/* Rating stars, verified pill, and publication date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                          ))}
                        </div>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-1.5 py-0.5 rounded-md font-mono">
                            <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                            Verified Partner
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase">{review.date}</span>
                    </div>

                    {/* Review Text */}
                    <p className="text-neutral-300 text-xs sm:text-[13px] md:text-sm italic font-normal leading-relaxed mb-5 font-sans">
                      "{review.text}"
                    </p>

                    {/* Metrics Performance Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {review.metrics.map((metric, mIdx) => (
                        <span 
                          key={mIdx} 
                          className="text-[10px] font-mono bg-neutral-900/80 text-gold-500/90 border border-neutral-800/85 px-2 py-0.5 rounded-md flex items-center gap-1 group-hover:border-gold-500/15 transition-colors"
                        >
                          <ArrowUpRight className="w-2.5 h-2.5 text-gold-500/70" />
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio Block with clinic details */}
                  <div className="flex items-center gap-3 border-t border-neutral-900/60 pt-4 relative z-10">
                    <div className="relative shrink-0">
                      <img 
                        src={review.image} 
                        alt={review.name} 
                        className="w-10 h-10 rounded-full object-cover border border-neutral-800 group-hover:border-gold-500/30 transition-colors duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#0E0E0E] border border-neutral-900 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-left overflow-hidden">
                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-none mb-1 group-hover:text-gold-400 transition-colors duration-500 truncate">
                        {review.name}
                      </h4>
                      <p className="text-[9px] font-mono text-gold-500 font-semibold tracking-wide uppercase leading-none truncate">
                        {review.role}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-1 font-sans font-medium leading-none truncate">
                        {review.clinic}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Duplicate set to enable seamless loop */}
            <div className="flex gap-6 shrink-0" aria-hidden="true">
              {reviews.map((review) => (
                <div 
                  key={`dup-${review.id}`}
                  className="w-[310px] sm:w-[360px] md:w-[390px] p-6.5 rounded-2xl bg-[#0B0B0B] border border-neutral-900/90 hover:border-gold-500/25 transition-all duration-500 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)] group relative overflow-hidden shrink-0"
                >
                  <div className="absolute -inset-px bg-gradient-to-b from-gold-500/0 to-gold-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex gap-0.5">
                          <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                          <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                          <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                          <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                          <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                        </div>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-1.5 py-0.5 rounded-md font-mono">
                            <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                            Verified Partner
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase">{review.date}</span>
                    </div>

                    <p className="text-neutral-300 text-xs sm:text-[13px] md:text-sm italic font-normal leading-relaxed mb-5 font-sans">
                      "{review.text}"
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {review.metrics.map((metric, mIdx) => (
                        <span 
                          key={mIdx} 
                          className="text-[10px] font-mono bg-neutral-900/80 text-gold-500/90 border border-neutral-800/85 px-2 py-0.5 rounded-md flex items-center gap-1 group-hover:border-gold-500/15 transition-colors"
                        >
                          <ArrowUpRight className="w-2.5 h-2.5 text-gold-500/70" />
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-neutral-900/60 pt-4 relative z-10">
                    <div className="relative shrink-0">
                      <img 
                        src={review.image} 
                        alt={review.name} 
                        className="w-10 h-10 rounded-full object-cover border border-neutral-800 group-hover:border-gold-500/30 transition-colors duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#0E0E0E] border border-neutral-900 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-left overflow-hidden">
                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-none mb-1 group-hover:text-gold-400 transition-colors duration-500 truncate">
                        {review.name}
                      </h4>
                      <p className="text-[9px] font-mono text-gold-500 font-semibold tracking-wide uppercase leading-none truncate">
                        {review.role}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-1 font-sans font-medium leading-none truncate">
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
    </div>
  );
}

export default memo(ReviewsMarquee);
