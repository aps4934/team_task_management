import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400"></div>
    </div>
  );
};

export const ErrorMessage = ({ message }) => {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200 shadow-lg shadow-rose-500/5">
      {message}
    </div>
  );
};

export const SuccessMessage = ({ message }) => {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-200 shadow-lg shadow-emerald-500/5">
      {message}
    </div>
  );
};

export default { LoadingSpinner, ErrorMessage, SuccessMessage };
