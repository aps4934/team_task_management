import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, FolderKanban, CheckSquare, X, PanelLeftClose } from 'lucide-react';
import DeveloperProfile from './ui/DeveloperProfile';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/my-tasks', label: 'My Tasks', icon: CheckSquare },
];

export const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navContent = (
    <div className="flex h-full flex-col p-4">
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">APS</p>
          <p className={`font-semibold text-white ${collapsed ? 'hidden lg:block' : 'block'}`}>Aditya Pratap Singh</p>
        </div>
        <button
          onClick={onToggleCollapse}
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/10 lg:inline-flex"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={18} className={collapsed ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-white ring-1 ring-cyan-400/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-cyan-400/20 text-cyan-300' : 'bg-white/5 text-slate-400 group-hover:text-white'}`}>
                <Icon size={18} />
              </span>
              <span className={collapsed ? 'hidden lg:block' : 'block'}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex-1 space-y-4 overflow-auto">
        <DeveloperProfile compact />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400">
        <p className="font-medium text-slate-200">Built by Aditya Pratap Singh</p>
        <p className="mt-1">Production-ready UI crafted for modern product teams.</p>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : collapsed ? 0 : 0 }}
        className={`fixed inset-y-0 left-0 z-50 h-screen border-r border-white/10 bg-slate-950/95 shadow-2xl shadow-black/30 backdrop-blur-xl transition-[width,transform] duration-300 lg:translate-x-0 ${
          collapsed ? 'w-24' : 'w-72'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 lg:hidden">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Menu</p>
              <p className="font-semibold text-white">Navigation</p>
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          {navContent}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
