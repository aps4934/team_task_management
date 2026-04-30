import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon, accent = 'cyan', hint }) => {
  const accentClasses = {
    cyan: 'from-cyan-500/20 to-cyan-400/5 text-cyan-300 ring-cyan-400/20',
    indigo: 'from-indigo-500/20 to-indigo-400/5 text-indigo-300 ring-indigo-400/20',
    emerald: 'from-emerald-500/20 to-emerald-400/5 text-emerald-300 ring-emerald-400/20',
    rose: 'from-rose-500/20 to-rose-400/5 text-rose-300 ring-rose-400/20',
    amber: 'from-amber-500/20 to-amber-400/5 text-amber-300 ring-amber-400/20',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`rounded-3xl border border-white/10 bg-gradient-to-br ${accentClasses[accent]} p-5 shadow-xl shadow-black/10 backdrop-blur`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <h3 className="mt-2 text-3xl font-semibold text-white">{value}</h3>
          {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
