import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

interface MockLoomPlayerProps {
  step: 1 | 2 | 3;
  question: string;
  options: string[];
  onAnswerSelect: (answer: string) => void;
  selectedAnswer: string | null;
}

function MockLoomPlayer({
  step,
  question,
  options,
  onAnswerSelect,
  selectedAnswer,
}: MockLoomPlayerProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [localSelected, setLocalSelected] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when step changes
    setShowQuiz(false);
    setLocalSelected(null);

    // After exactly 2 seconds, show the premium glassmorphic quiz overlay over the video
    const timer = setTimeout(() => {
      setShowQuiz(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [step]);

  const handleSelect = (option: string) => {
    setLocalSelected(option);
    // Short satisfying delay to let the checkmark animation play out before advancing
    setTimeout(() => {
      onAnswerSelect(option);
    }, 550);
  };

  const getLoomSrc = () => {
    let baseSrc = "";
    if (step === 1) baseSrc = "https://www.loom.com/embed/a97d2df87d034ab88e666dace2173aff";
    else if (step === 2) baseSrc = "https://www.loom.com/embed/b3e58fcf7d3844bd895a2ef345f0ce5d";
    else if (step === 3) baseSrc = "https://www.loom.com/embed/022f4d780a8a443eb936cc80ccfbe7af";

    // Unmuted (volume on), autoplay enabled, and play from the very start (t=0)
    return `${baseSrc}?autoplay=true&muted=false&t=0&hide_owner=true&hide_share=true&hide_title=true&hide_embed_top_bar=true`;
  };

  const getPaddingBottom = () => {
    if (step === 1) return '56.25%'; // 16:9 standard ratio
    return '64.62829736211032%'; // Loom ratio
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative space-y-6">
      {/* Outer Video Player Container */}
      <div 
        id={`loom-player-container-step-${step}`}
        className="relative w-full overflow-hidden rounded-2xl border border-neutral-900 shadow-2xl bg-black/95 transition-all duration-700"
        style={{ height: 0, paddingBottom: getPaddingBottom() }}
      >
        {/* The active Loom iframe with autoplay and unmuted audio */}
        <iframe 
          src={getLoomSrc()} 
          frameBorder="0" 
          webkitallowfullscreen="true" 
          mozallowfullscreen="true" 
          allowFullScreen 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          allow="autoplay; fullscreen"
          referrerPolicy="no-referrer"
          className="w-full h-full"
        />
      </div>

      {/* Dedicated High-Whitespace Quiz Block Rendered Below the Video */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-hidden mt-6 md:mt-8"
          >
            {/* Solid matte deep card with responsive premium padding and border */}
            <div 
              className="relative w-full p-5 sm:p-10 md:p-14 rounded-3xl bg-[#121212] border border-neutral-800/80 shadow-2xl text-left"
            >
              <h3 className="text-lg md:text-2xl font-bold text-white mb-6 md:mb-8 tracking-tight leading-snug font-sans">
                {question}
              </h3>

              {/* Options List */}
              {/* Options List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 md:gap-6">
                {options.map((option, idx) => {
                  const isSelected = selectedAnswer === option || localSelected === option;
                  const isHovered = hoveredOption === idx;

                  return (
                    <motion.button
                      key={idx}
                      id={`quiz-option-${step}-${idx}`}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHoveredOption(idx)}
                      onMouseLeave={() => setHoveredOption(null)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`w-full rounded-2xl border text-left flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden min-h-[64px] md:min-h-[180px] p-4.5 md:p-6 ${
                        isSelected
                          ? 'bg-[#0E0E0E] border-gold-500 text-white shadow-lg shadow-gold-500/5'
                          : isHovered
                          ? 'bg-[#0E0E0E] border-gold-500/50 text-white'
                          : 'bg-[#0A0A0A] border-neutral-900 text-neutral-300 hover:border-neutral-800'
                      }`}
                    >
                      <div className="flex flex-row md:flex-col items-center md:items-start gap-3.5 md:gap-5 w-full pr-8 md:pr-0">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm border transition-colors shrink-0 ${
                          isSelected 
                            ? 'bg-gold-500 text-black border-gold-500 font-bold' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-xs sm:text-sm md:text-base font-semibold leading-relaxed">{option}</span>
                      </div>

                      <div className="absolute right-4.5 top-1/2 -translate-y-1/2 md:translate-y-0 md:top-auto md:bottom-6 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 shrink-0">
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            >
                              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-gold-500 stroke-[3]" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(MockLoomPlayer);
