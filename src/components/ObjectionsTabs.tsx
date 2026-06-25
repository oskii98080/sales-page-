import { motion } from 'motion/react';

const questions = [
  "Will this actually work for my clinic?",
  "What does this actually cost me?",
  "How much time is it going to take to manage?",
  "Is this going to feel robotic or hurt how my clients come across?"
];

export default function ObjectionsTabs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="flex flex-col gap-4 max-w-3xl mx-auto text-left py-4"
    >
      {questions.map((q, idx) => (
        <motion.div 
          key={idx}
          variants={itemVariants}
          className="p-6 md:p-7 rounded-2xl bg-[#0A0A0A] border border-neutral-900 shadow-xl flex items-center gap-5 hover:border-gold-500/20 transition-all duration-300"
        >
          {/* A beautiful numbered gold indicator */}
          <span className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 font-mono text-gold-500 text-sm md:text-base font-extrabold">
            0{idx + 1}
          </span>
          <h4 className="text-base md:text-lg font-bold text-white tracking-tight font-display leading-snug">
            "{q}"
          </h4>
        </motion.div>
      ))}
    </motion.div>
  );
}
