import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../Header';
import Sidebar from '../Sidebar';

const AppShell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_42%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />
      <div className={`flex min-h-screen flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-72'}`}>
        <Header onMenuClick={() => setSidebarOpen(true)} onToggleCollapse={() => setSidebarCollapsed((value) => !value)} collapsed={sidebarCollapsed} />
        <main className="flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto w-full max-w-7xl"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
