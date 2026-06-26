import { useState, useEffect, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Check, 
  CheckCircle2, 
  Calendar, 
  User, 
  Building, 
  Mail, 
  Phone, 
  Sparkles, 
  X, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  Info,
  Clock,
  Briefcase,
  RotateCcw
} from 'lucide-react';
import { StepNumber, QuizAnswers, LeadSubmission } from './types';
import MockLoomPlayer from './components/MockLoomPlayer';
import ObjectionsTabs from './components/ObjectionsTabs';
import CalendarWidget from './components/CalendarWidget';
import ReviewsMarquee from './components/ReviewsMarquee';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      damping: 15 
    } 
  }
};

export default function App() {
  const [step, setStep] = useState<StepNumber>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    step1: '',
    step2: '',
    step3: '',
  });

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offerType, setOfferType] = useState<'launch' | 'audit' | null>(null);
  const [name, setName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [niche, setNiche] = useState('Aesthetic');
  const [preferredContact, setPreferredContact] = useState('Phone Call');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState<LeadSubmission[]>([]);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scroll Spy State
  const [scrollPercent, setScrollPercent] = useState(0);

  const showToast = useCallback((msg: string) => {
    setToastMessage(null);
    setTimeout(() => {
      setToastMessage(msg);
    }, 50);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Scroll spy effect to calculate scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = (scrollTop / docHeight) * 100;
        setScrollPercent(pct);
      } else {
        setScrollPercent(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [step]); // Re-run when step changes to adjust for varying page lengths

  const handleCalendarBookingSuccess = useCallback((details: { date: string; time: string; name: string; email: string; phone: string; clinicName: string }) => {
    const newSubmission: LeadSubmission = {
      name: details.name,
      clinicName: details.clinicName,
      email: details.email,
      phone: details.phone,
      preferredContact: `Scheduled Call: ${details.date} @ ${details.time}`,
      answers: { ...answers },
      offerType: 'audit',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newSubmission, ...allSubmissions];
    setAllSubmissions(updated);
    try {
      localStorage.setItem('vantyx_submissions', JSON.stringify(updated));
      showToast('Booking details saved');
    } catch (e) {
      console.error('Failed to save submission', e);
    }
  }, [answers, allSubmissions, showToast]);

  // Load submissions from localStorage on mount and guarantee top scroll alignment
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vantyx_submissions');
      if (stored) {
        setAllSubmissions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load submissions', e);
    }

    // Always start at step 1 on clean load/refresh
    setStep(1);
    setAnswers({ step1: '', step2: '', step3: '' });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
  }, []);

  // Set page theme to black on mount
  useEffect(() => {
    document.body.style.backgroundColor = '#0A0A0A';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Scroll to the very top of the page on step transition
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
  }, [step]);

  // Stabilized async navigation handler for a fluid, glitch-free state transition experience
  const handleAnswerSelect = useCallback(async (option: string) => {
    // 1. Update current step answer in state
    const currentStepKey = `step${step}` as keyof QuizAnswers;
    const nextAnswers = { ...answers, [currentStepKey]: option };
    setAnswers(nextAnswers);

    const nextStep = (step < 3 ? step + 1 : step) as StepNumber;

    // 2. Persist state to localStorage asynchronously without blocking main thread
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        try {
          localStorage.setItem('vantyx_progress', JSON.stringify({ step: nextStep, answers: nextAnswers }));
        } catch (e) {
          console.error('Failed to save progress', e);
        }
        resolve();
      }, 0);
    });

    // 3. Wait for browser's rendering process to fully flush state updates and styles
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });

    // 4. Elegant transitional delay so the checkmark stays readable before swapping pages
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    // 5. Advance the step safely
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  }, [step, answers]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      const prevStep = (step - 1) as StepNumber;
      setStep(prevStep);
      try {
        localStorage.setItem('vantyx_progress', JSON.stringify({ step: prevStep, answers }));
        showToast('Configuration updated');
      } catch (e) {
        console.error('Failed to save progress', e);
      }
    }
  }, [step, answers, showToast]);

  const openFormModal = (type: 'launch' | 'audit') => {
    setOfferType(type);
    setIsModalOpen(true);
    setIsSuccess(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOfferType(null);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !clinicName || !email || !phone) {
      alert('Please fill out all fields to continue.');
      return;
    }

    setIsSubmitting(true);

    // Simulate network submission
    setTimeout(() => {
      const newSubmission: LeadSubmission = {
        name,
        clinicName,
        email,
        phone,
        niche: offerType === 'launch' ? niche : undefined,
        preferredContact: offerType === 'audit' ? preferredContact : undefined,
        answers: { ...answers },
        offerType: offerType!,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updated = [newSubmission, ...allSubmissions];
      setAllSubmissions(updated);
      try {
        localStorage.setItem('vantyx_submissions', JSON.stringify(updated));
        showToast('Configuration saved');
      } catch (e) {
        console.error('Failed to save submission', e);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleResetFlow = useCallback(() => {
    setStep(1);
    setAnswers({ step1: '', step2: '', step3: '' });
    setIsSuccess(false);
    setIsModalOpen(false);
    try {
      localStorage.removeItem('vantyx_progress');
      showToast('Session reset successfully');
    } catch (e) {
      console.error('Failed to clear progress', e);
    }
  }, [showToast]);

  // Content generators based on active step
  const progressPercent = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-200 font-sans flex flex-col justify-between selection:bg-gold-500 selection:text-neutral-950">
      
      {/* 1. Global Gold Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-900 z-50 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* 2. Centered Logo Header with responsive layout to prevent collision */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-6 md:pt-10 flex items-center justify-between gap-4 relative z-40">
        <div className="w-16 flex justify-start">
          {step > 1 && (
            <button 
              id="back-button"
              onClick={handleBack}
              className="flex p-2 sm:p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950/80 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-all items-center justify-center cursor-pointer group"
              title="Go back"
            >
              <ChevronLeft className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform group-hover:-translate-x-0.5" />
            </button>
          )}
        </div>
        
        <div className="flex-1 flex justify-center">
          <img 
            src="https://res.cloudinary.com/diwxs2xe8/image/upload/q_auto/f_auto/v1781975346/erasebg-transformed_ies8rk.png" 
            alt="Vantyx Logo" 
            className="h-[120px] sm:h-[240px] md:h-[312px] lg:h-[384px] w-auto object-contain transition-all duration-300"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="w-16 flex justify-end">
          {(step > 1 || answers.step1) && (
            <button
              id="reset-flow"
              onClick={handleResetFlow}
              className="block text-[10px] sm:text-xs border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900 text-neutral-400 hover:text-white px-2.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full font-mono transition-colors whitespace-nowrap"
            >
              Restart
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Hero / Form Layout Canvas (aligned to top for higher headings and reduced scroll requirement) */}
      <main className="flex-1 flex flex-col justify-start pt-6 pb-16 md:pt-10 md:pb-20 px-4 sm:px-8 md:px-14 relative overflow-hidden">
        
        {/* Subtle background glow graphics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-amber-500/3 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            
            {/* ================= PAGE 1 ================= */}
            {step === 1 && (
              <div
                key="page1"
                className="space-y-6 md:space-y-10 text-center"
              >
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white leading-[1.15] max-w-4xl mx-auto font-display">
                  Add <span className="text-gold-500 text-gold-glow">20+ qualified patients</span> to your calendar every month, on autopilot. You only pay when they book.
                </h1>

                {/* Sub-headline */}
                <h2 className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
                  A 90-second walkthrough of where your clinic is leaking €2,000+ a month—and how to plug it instantly.
                </h2>

                {/* Video Component */}
                <div className="pt-6 pb-4">
                  <MockLoomPlayer
                    step={1}
                    question="Where do you think your clinic is losing the most revenue right now?"
                    options={[
                      "Missed calls / After-hours inquiries going unanswered",
                      "No instant follow-up with new website/ad leads",
                      "Old patient lists sitting cold with no reactivation"
                    ]}
                    selectedAnswer={answers.step1}
                    onAnswerSelect={handleAnswerSelect}
                  />
                </div>
                {/* Real-time horizontal clinic owner reviews marquee */}
                <ReviewsMarquee />
              </div>
            )}

            {/* ================= PAGE 2 ================= */}
            {step === 2 && (
              <div
                key="page2"
                className="space-y-6 md:space-y-10 text-center"
              >
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white leading-[1.15] max-w-4xl mx-auto font-display">
                  How we turn that leak into <span className="text-gold-500 text-gold-glow">20+ booked patients</span> a month, without you lifting a finger.
                </h1>

                {/* Sub-headline */}
                <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
                  Three pillars: Acquisition captures the lead. Instant Response qualifies them before they go cold. Automation books and reminds them in the background.
                </p>

                {/* Video Component */}
                <div className="pt-6 pb-4">
                  <MockLoomPlayer
                    step={2}
                    question="How quickly does your team currently respond to a new incoming inquiry?"
                    options={[
                      "Within 5 minutes (Ideal)",
                      "Within 1–2 hours",
                      "Next day / When we have time"
                    ]}
                    selectedAnswer={answers.step2}
                    onAnswerSelect={handleAnswerSelect}
                  />
                </div>
                {/* Real-time horizontal clinic owner reviews marquee */}
                <ReviewsMarquee />
              </div>
            )}

            {/* ================= PAGE 3 ================= */}
            {step === 3 && (
              <div
                key="page3"
                className="space-y-6 md:space-y-10 text-center animate-fade-in"
              >
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white leading-[1.15] max-w-4xl mx-auto font-display">
                  Still have questions? Here's the <span className="text-gold-500 text-gold-glow">honest answer</span> to all of them.
                </h1>

                {/* Optimised dual-column grid for side-by-side presentation on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto pt-6 pb-4">
                  {/* Left Column: Objections/Questions */}
                  <div className="lg:col-span-5 w-full">
                    <ObjectionsTabs />
                  </div>

                  {/* Right Column: Loom Player and Quiz */}
                  <div className="lg:col-span-7 w-full pt-4 lg:pt-0">
                    <MockLoomPlayer
                      step={3}
                      question="What is the main priority for your clinic over the next 30 days?"
                      options={[
                        "Scaling my patient numbers as fast as possible",
                        "Saving administrative hours for my front-desk team",
                        "Just curious to see what AI can do for us"
                      ]}
                      selectedAnswer={answers.step3}
                      onAnswerSelect={handleAnswerSelect}
                    />
                  </div>
                </div>

                {/* Real-time horizontal clinic owner reviews marquee */}
                <ReviewsMarquee />
              </div>
            )}

            {/* ================= PAGE 4 ================= */}
            {step === 4 && (
              <div
                key="page4"
                className="space-y-6 md:space-y-10 text-center"
              >
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white leading-[1.15] max-w-4xl mx-auto font-display">
                  You're one step from <span className="text-gold-500 text-gold-glow">20+ new patients</span> a month. Pick how you want to start.
                </h1>

                {/* Sub-headline */}
                <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
                  Get live in your clinic this week for a one-time $247 setup, or book a free 20-minute audit to see your numbers first.
                </p>

                {/* Interactive Split Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto pt-6 pb-4">
                  
                  {/* Column A: Immediate Action */}
                  <div className="bg-[#0E0E0E] border-2 border-gold-500 rounded-3xl p-5 sm:p-8 md:p-10 relative flex flex-col justify-between text-left shadow-[0_0_60px_rgba(255,215,0,0.15)] overflow-hidden group">
                    {/* Glowing radial background highlight */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08)_0%,transparent_70%)] pointer-events-none" />
                    
                    {/* Top Accent Badge */}
                    <div className="absolute top-0 right-8 translate-y-[-50%]">
                      <span className="bg-gold-500 text-black text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 sm:px-4 py-1.5 rounded-full shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>

                    <div className="space-y-5 relative z-10">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white font-display">Start today</h3>
                        <p className="text-4xl sm:text-5xl font-extrabold text-gold-500 mt-2 font-mono tracking-tight">
                          $247 <span className="text-[10px] sm:text-xs md:text-sm font-normal text-neutral-400">one-time setup</span>
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm md:text-base text-neutral-300">
                        Get your Vantyx System built and running in your clinic this week.
                      </p>

                      <div className="h-[1px] bg-neutral-800" />

                      {/* Value Bullets */}
                      <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm md:text-base">
                        <li className="flex items-start gap-2.5 sm:gap-3 text-neutral-200">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 sm:w-3.5 sm:h-3.5 text-gold-500" />
                          </span>
                          <span><strong>Exclusive territory rights</strong> (we partner with only 1 clinic per local area)</span>
                        </li>
                        <li className="flex items-start gap-2.5 sm:gap-3 text-neutral-200">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 sm:w-3.5 sm:h-3.5 text-gold-500" />
                          </span>
                          <span>Configured specifically for your clinic's niche</span>
                        </li>
                        <li className="flex items-start gap-2.5 sm:gap-3 text-neutral-200">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 sm:w-3.5 sm:h-3.5 text-gold-500" />
                          </span>
                          <span><strong>Live within 24 hours</strong> with active booking enabled</span>
                        </li>
                        <li className="flex items-start gap-2.5 sm:gap-3 text-neutral-200">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 sm:w-3.5 sm:h-3.5 text-gold-500" />
                          </span>
                          <span>No long-term contract, month-to-month after setup</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-6 sm:pt-8 relative z-10">
                      <button
                        id="cta-start-today"
                        onClick={() => openFormModal('launch')}
                        className="w-full bg-gold-500 hover:bg-gold-400 active:scale-[0.98] text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest py-3.5 sm:py-4.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                      >
                        <span>Get started for $247</span>
                        <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Column B: Low-Risk Entry */}
                  <div className="bg-neutral-900/40 border border-neutral-950 rounded-3xl p-5 sm:p-8 md:p-10 flex flex-col justify-between text-left hover:border-neutral-800 transition-all duration-300 relative overflow-hidden group">
                    
                    {/* Top Accent Badge */}
                    <div className="absolute top-0 right-8 translate-y-[-50%]">
                      <span className="bg-neutral-850 border border-neutral-800 text-neutral-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 sm:px-4 py-1.5 rounded-full">
                        NO PRESSURE
                      </span>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white font-display">Book a free audit call</h3>
                        <p className="text-4xl sm:text-5xl font-extrabold text-white mt-2 font-mono tracking-tight">
                          Free <span className="text-[10px] sm:text-xs md:text-sm font-normal text-neutral-500">20-minute call</span>
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm md:text-base text-neutral-400">
                        Not ready to commit? Let's look at your clinic's specific numbers together and see exactly where the leaks are.
                      </p>

                      <div className="h-[1px] bg-neutral-800" />

                      {/* Value Bullets */}
                      <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm md:text-base">
                        <li className="flex items-start gap-2.5 sm:gap-3 text-neutral-400">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
                          </span>
                          <span><strong className="text-neutral-300">20-minute call</strong>, zero sales pressure</span>
                        </li>
                        <li className="flex items-start gap-2.5 sm:gap-3 text-neutral-400">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
                          </span>
                          <span>We'll map out your clinic's customized revenue leak estimate</span>
                        </li>
                        <li className="flex items-start gap-2.5 sm:gap-3 text-neutral-400">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
                          </span>
                          <span>You decide afterward if you want us to build it, no obligation</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-6 sm:pt-8">
                      <button
                        id="cta-book-audit"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="w-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm uppercase tracking-widest py-3.5 sm:py-4.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer border border-neutral-800"
                      >
                        <span>{showCalendar ? '▲ Close calendar' : '📅 Book my free audit call'}</span>
                      </button>

                      {/* Expandable Calendar Accordion Dropdown */}
                      <AnimatePresence>
                        {showCalendar && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="overflow-hidden mt-6"
                          >
                            <CalendarWidget onSuccess={handleCalendarBookingSuccess} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </AnimatePresence>

        </div>
      </main>

      {/* 4. Submission & Action Form Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md z-50 overflow-y-auto flex justify-center items-start sm:items-center p-3 sm:p-4 py-8 sm:py-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-3xl p-5 sm:p-6 md:p-8 relative shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                id="close-modal"
                onClick={closeModal}
                className="absolute top-4 right-4 p-1.5 rounded-full border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {!isSuccess ? (
                // Form Phase
                <form id="lead-form" onSubmit={handleFormSubmit} className="space-y-5">
                  
                  {/* Badge & Title */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-[10px] font-mono tracking-wider uppercase mb-2">
                      {offerType === 'launch' ? 'IMMEDIATE DEPLOYMENT' : 'ZERO PRESSURE AUDIT'}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-[-0.02em] font-display">
                      {offerType === 'launch' 
                        ? "Secure Your Vantyx System Launch" 
                        : "Claim Your Free 20-Min Revenue Audit"
                      }
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {offerType === 'launch'
                        ? "Fill out your details to begin customization. We'll build and activate your system in 3-5 days."
                        : "We'll analyze your website, ad feeds, and front desk channels to find leaks."
                      }
                    </p>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-3.5">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 font-mono">YOUR FULL NAME</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          id="form-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Dr. Sarah Jenkins"
                          className="w-full bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 focus:border-gold-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:ring-1 focus:ring-gold-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Clinic Name */}
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 font-mono">CLINIC / PRACTICE NAME</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          id="form-clinic-name"
                          type="text"
                          required
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          placeholder="Elite Dental Care"
                          className="w-full bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 focus:border-gold-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:ring-1 focus:ring-gold-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 font-mono">WORK EMAIL</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          id="form-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="dr.jenkins@elitedental.com"
                          className="w-full bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 focus:border-gold-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:ring-1 focus:ring-gold-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 font-mono">DIRECT PHONE NUMBER</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          id="form-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+353 87 123 4567"
                          className="w-full bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 focus:border-gold-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:ring-1 focus:ring-gold-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Conditional Fields based on action Type */}
                    {offerType === 'launch' ? (
                      /* Niche selection */
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 font-mono">CLINIC NICHE SPECIALTY</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Aesthetic', 'Dental', 'Medical Practice'].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setNiche(n)}
                              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                                niche === n
                                  ? 'bg-gold-500 text-black border-gold-400'
                                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Contact method */
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 font-mono">PREFERRED AUDIT CONTACT METHOD</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Phone Call', 'WhatsApp', 'Email Audit'].map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPreferredContact(method)}
                              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                                preferredContact === method
                                  ? 'bg-white text-black border-white'
                                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Submission Info notice card */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center gap-2.5 text-[10px] text-neutral-400 leading-snug font-mono">
                    <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />
                    <span>Secure end-to-end connection. Your diagnostic quiz details will be pre-compiled into this launch build.</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    id="submit-lead"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold-500 hover:bg-gold-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                        Compiling System Config...
                      </span>
                    ) : offerType === 'launch' ? (
                      <span>Confirm & Secure Setup for $247 →</span>
                    ) : (
                      <span>Schedule My Free Audit Call →</span>
                    )}
                  </button>

                </form>
              ) : (
                // Success Phase
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto shadow-lg shadow-gold-500/5">
                    <CheckCircle2 className="w-8 h-8 text-gold-500" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-[-0.02em] font-display">
                      {offerType === 'launch' ? 'Vantyx Setup Initialized!' : 'Free Audit Requested!'}
                    </h2>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong className="text-white">{name}</strong>. We have securely registered <strong className="text-white">{clinicName}</strong> in our autopilot cue.
                    </p>
                  </div>

                  {/* Micro-Commitments alignment card */}
                  <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4 text-left space-y-3">
                    <h4 className="text-[10px] font-bold text-gold-500 font-mono tracking-widest uppercase flex items-center gap-1.5 border-b border-neutral-800/80 pb-2">
                      <Clock className="w-3.5 h-3.5" /> Customized Build Diagnostic
                    </h4>
                    
                    <div className="space-y-2.5 text-xs">
                      {answers.step1 && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-neutral-500 font-mono">PRIORITY LEAK SOURCE</span>
                          <span className="text-neutral-200 font-semibold">{answers.step1}</span>
                        </div>
                      )}
                      {answers.step2 && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-neutral-500 font-mono">CURRENT RESPONSE SLOWDOWN</span>
                          <span className="text-neutral-200 font-semibold">{answers.step2}</span>
                        </div>
                      )}
                      {answers.step3 && (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] text-neutral-500 font-mono">30-DAY PRIMARY TARGET</span>
                          <span className="text-neutral-200 font-semibold">{answers.step3}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900 border border-neutral-800/60 rounded-xl text-[10px] text-neutral-400 font-mono leading-normal">
                    {offerType === 'launch' 
                      ? `Our deployment team will reach out to ${email} within 4 business hours to finalize CRM integrations.`
                      : `A Vantyx consultant will contact you via ${preferredContact} on your phone ${phone}.`
                    }
                  </div>

                  <button
                    id="success-done"
                    onClick={closeModal}
                    className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-md cursor-pointer"
                  >
                    Done
                  </button>

                </motion.div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* 5. Minimal footer */}
      <footer className="py-6 border-t border-neutral-900/60 text-center text-xs text-neutral-500 font-mono select-none">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>&copy; {new Date().getFullYear()} Vantyx AI Systems. All rights reserved.</span>
          <div className="flex gap-4 text-[10px]">
            <a href="#privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <span className="text-neutral-800">&bull;</span>
            <a href="#terms" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-neutral-900/95 border border-gold-500/30 text-white font-mono text-xs flex items-center gap-3 shadow-[0_8px_32px_rgba(255,215,0,0.15)] backdrop-blur-md"
          >
            <span className="w-4 h-4 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/30">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span className="tracking-wide font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
