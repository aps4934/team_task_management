import React from 'react';

const APSBadge = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 font-semibold text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20 ${sizeClasses[size]}`}
      aria-label="APS badge"
    >
      APS
    </div>
  );
};

export default APSBadge;
