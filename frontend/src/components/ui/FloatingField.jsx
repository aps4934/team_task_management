import React from 'react';

const FloatingField = ({ label, id, type = 'text', as = 'input', value, onChange, error, ...rest }) => {
  const baseClasses =
    'peer w-full rounded-2xl border border-white/10 bg-white/5 px-4 pb-3 pt-6 text-white placeholder-transparent outline-none transition focus:border-cyan-400/40 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20';

  return (
    <div className="relative">
      {as === 'textarea' ? (
        <textarea id={id} value={value} onChange={onChange} className={`${baseClasses} min-h-[120px]`} placeholder={label} {...rest} />
      ) : (
        <input id={id} type={type} value={value} onChange={onChange} className={baseClasses} placeholder={label} {...rest} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-4 text-sm text-slate-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan-300"
      >
        {label}
      </label>
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </div>
  );
};

export default FloatingField;
