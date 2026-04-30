import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const NotificationBell = () => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-100 shadow-lg shadow-black/10 backdrop-blur transition hover:border-cyan-400/40"
      aria-label="Notifications"
    >
      <Bell size={18} />
      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
    </motion.button>
  );
};

export default NotificationBell;
