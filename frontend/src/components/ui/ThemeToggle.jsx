import React from 'react';
import { MoonStar, SunMedium } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ compact = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-3 py-2 text-sm font-medium text-slate-100 shadow-lg shadow-black/10 backdrop-blur transition-colors hover:border-cyan-400/40 hover:bg-slate-800 ${
        compact ? 'px-2 py-2' : ''
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? <SunMedium size={16} /> : <MoonStar size={16} />}
      {!compact && <span>{isDark ? 'Light' : 'Dark'} mode</span>}
    </motion.button>
  );
};

export default ThemeToggle;
