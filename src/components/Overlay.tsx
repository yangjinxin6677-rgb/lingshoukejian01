import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Info, MessageSquare, Sparkles, BarChart3 } from "lucide-react";
import { PAGES } from "../constants";
import { Category } from "../types";

interface OverlayProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const Overlay: React.FC<OverlayProps> = ({ currentPage, setCurrentPage }) => {
  const page = PAGES[currentPage];
  const [revealed, setRevealed] = useState(false);
  const [pollVoted, setPollVoted] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setRevealed(false);
    setPollVoted(false);
    setShowQR(false);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < PAGES.length - 1) setCurrentPage(currentPage + 1);
  };

  const handleBack = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") handleNext();
      if (e.key === "ArrowLeft") handleBack();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  if (page.isTransition) {
    return (
      <div className="fixed inset-0 pointer-events-none flex flex-col items-center justify-center p-6 z-10 font-sans">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          className="text-center pointer-events-auto"
        >
          <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            {page.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto mb-12">
            {page.description}
          </p>
          <button
            onClick={handleNext}
            className="px-12 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-emerald-400 transition-all shadow-2xl hover:scale-105 active:scale-95"
          >
            开启章节
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-10 font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col gap-2">
          <motion.div
            key={page.category}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] uppercase tracking-widest font-bold text-white"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            {page.category}
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tighter text-white drop-shadow-2xl">
            Retail Evolution <span className="text-emerald-400">3D</span>
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col items-end gap-2 mt-4">
          <div className="flex gap-1">
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-1.5 w-4 md:w-8 rounded-full transition-all duration-700 cursor-pointer hover:scale-y-150 ${
                  i <= currentPage ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "bg-white/10 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
            Module Progress: {Math.round(((currentPage + 1) / PAGES.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className={`flex flex-col max-w-2xl pointer-events-auto transition-all duration-1000 ${
        currentPage === 0 
          ? "items-start self-start mt-auto mb-4" 
          : "items-center md:items-start"
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
          >
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-1000" />
            
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white leading-tight">
              {page.title}
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 font-light">
              {page.description}
            </p>

            {/* Interactive Elements based on Category */}
            {currentPage === 2 && (
              <div className="mb-8">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-bold transition-all flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  {showQR ? "隐藏互动二维码" : "查看互动二维码"}
                </button>
                
                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl">
                        <img 
                          src="/qr.png" 
                          alt="QR Code" 
                          className="w-40 h-40"
                          referrerPolicy="no-referrer"
                        />
                        <p className="text-black text-[10px] font-bold text-center mt-2 uppercase tracking-tighter">扫码参与互动</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {page.category === Category.INTRO && !pollVoted && (
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-sm text-white/60 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> 实时互动：说出你所熟悉的零售企业
                  </p>
                  <div className="flex flex-col gap-4">
                    <p className="text-white/40 text-sm italic">请学生回答后，点击下方按钮展示行业巨头：</p>
                    <button
                      onClick={() => {
                        setPollVoted(true);
                        window.dispatchEvent(new CustomEvent('retail-voted', { detail: 'ALL' }));
                      }}
                      className="px-8 py-4 bg-emerald-500 text-black rounded-full font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      展示大型零售企业 LOGO
                    </button>
                  </div>
                </div>
              </div>
            )}

            {page.category === Category.FUTURE && (
              <div className="p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-6">
                <p className="text-sm text-indigo-300 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> 终极讨论：十年后的零售店会是什么样？
                </p>
                <div className="flex flex-wrap gap-2">
                  {["#元宇宙购物", "#脑机接口", "#全息导购", "#3D打印配送"].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Case Interaction Button */}
            {page.details && !revealed && (pollVoted || page.category !== Category.INTRO) && (
              <button
                onClick={() => setRevealed(true)}
                className="group flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black rounded-full font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                {page.category === Category.THEORY ? "解析理论案例" : "深入案例故事"}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* Deep Dive Section */}
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-white/10 pt-8"
              >
                <div className="flex items-center gap-3 text-emerald-400 mb-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Info className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em]">Deep Dive Insight</p>
                </div>
                <p className="text-white/70 text-base md:text-lg italic leading-relaxed font-light">
                  {page.details}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center pointer-events-auto">
        <button
          onClick={handleBack}
          disabled={currentPage === 0}
          className={`group flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all border ${
            currentPage === 0
              ? "opacity-0 pointer-events-none"
              : "bg-white/5 text-white hover:bg-white/10 backdrop-blur-xl border-white/10"
          }`}
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          上一步
        </button>

        <div className="hidden md:flex flex-col items-center gap-1">
          <div className="text-white/20 text-[10px] font-mono tracking-widest uppercase">Navigation Control</div>
          <div className="flex gap-2">
            <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/40">←</kbd>
            <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/40">SPACE</kbd>
            <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-white/40">→</kbd>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === PAGES.length - 1}
          className={`group flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all ${
            currentPage === PAGES.length - 1
              ? "opacity-0 pointer-events-none"
              : "bg-white text-black hover:bg-emerald-400 shadow-xl"
          }`}
        >
          {currentPage === PAGES.length - 2 ? "进入终极讨论" : "继续探索"}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
