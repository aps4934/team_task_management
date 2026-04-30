import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import APSBadge from './APSBadge';

const DeveloperProfile = ({ compact = false }) => {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/5 p-5 ${compact ? 'p-4' : ''}`}>
      <div className="flex items-start gap-4">
        <APSBadge size="lg" />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white">Aditya Pratap Singh</h3>
          <p className="text-sm text-slate-300">Full Stack Developer</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            I build polished web apps with thoughtful UX, strong frontend architecture, and production-ready backend integration.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a
              href="https://github.com/aps4934"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10"
            >
              <Github size={15} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/aps4934g/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10"
            >
              <Linkedin size={15} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfile;
