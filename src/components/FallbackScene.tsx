import React from "react";
import { PAGES } from "../constants";
import { motion, AnimatePresence } from "motion/react";

interface FallbackSceneProps {
  currentPage: number;
}

export const FallbackScene: React.FC<FallbackSceneProps> = ({ currentPage }) => {
  const page = PAGES[currentPage];

  return (
    <div 
      className="fixed inset-0 transition-colors duration-1000 ease-in-out flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: page.bgColor }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -20 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Abstract 2D representation of the stage */}
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            <div className="absolute inset-0 border-2 border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl md:text-8xl mb-4 opacity-20 filter blur-sm">
                  {currentPage < 8 ? "🏛️" : currentPage < 13 ? "📈" : "💡"}
                </div>
                <div className="h-1 w-24 bg-emerald-500 mx-auto rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-white/10 rounded-full animate-pulse delay-700" />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-emerald-500/30 rounded-full animate-ping" />
        </motion.div>
      </AnimatePresence>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black/40" />
    </div>
  );
};
