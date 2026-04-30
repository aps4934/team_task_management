import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ title, description, actionLabel, onAction, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 text-cyan-300">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary mt-6">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
