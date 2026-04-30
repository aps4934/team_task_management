import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, PanelLeftClose } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import APSBadge from './ui/APSBadge';
import ThemeToggle from './ui/ThemeToggle';
import NotificationBell from './ui/NotificationBell';
import ProfileMenu from './ui/ProfileMenu';

export const Header = ({ onMenuClick, onToggleCollapse, collapsed }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/10 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={onToggleCollapse}
            className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/10 lg:inline-flex"
            aria-label="Toggle sidebar"
          >
            <PanelLeftClose size={18} className={collapsed ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>

          <Link to="/dashboard" className="flex items-center gap-3">
            <APSBadge size="md" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Team Task Manager</p>
              <motion.h1 layout className="text-lg font-semibold text-white sm:text-xl">
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </motion.h1>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle compact />
          <NotificationBell />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
