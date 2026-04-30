import React, { useState } from 'react';
import { ChevronDown, Github, Linkedin, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.name || 'A')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-left text-slate-100 shadow-lg shadow-black/10 backdrop-blur transition hover:border-cyan-400/40"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium leading-tight">{user?.name || 'Developer'}</p>
          <p className="text-xs text-slate-400">{user?.role || 'Member'}</p>
        </div>
        <ChevronDown size={16} className="text-slate-400" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-50 mt-3 w-72 rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-cyan-500/20">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{user?.name || 'Aditya Pratap Singh'}</p>
                  <p className="text-xs text-slate-400">Full Stack Developer</p>
                  <p className="mt-2 text-xs leading-5 text-slate-300">
                    Building elegant, scalable interfaces that feel fast and intuitive.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <a
                href="https://github.com/aps4934"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl px-3 py-2 text-slate-200 transition hover:bg-white/5"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/aps4934g/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl px-3 py-2 text-slate-200 transition hover:bg-white/5"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-rose-300 transition hover:bg-rose-500/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
