import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/index';
import { ErrorMessage, LoadingSpinner } from '../components/Alerts';
import APSBadge from '../components/ui/APSBadge';
import ThemeToggle from '../components/ui/ThemeToggle';
import FloatingField from '../components/ui/FloatingField';
import DeveloperProfile from '../components/ui/DeveloperProfile';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      const { token, user } = response.data;
      login(user, token);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_40%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl lg:block"
        >
          <div className="flex items-center justify-between">
            <APSBadge size="lg" />
            <ThemeToggle />
          </div>
          <div className="mt-16 max-w-xl">
            <p className="chip">Production-ready team workflow</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-white">
              Team Task Manager built for <span className="text-gradient">serious product work</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
              Track projects, move tasks quickly, and keep your team aligned with a polished SaaS-style experience that feels recruiter-ready from the first click.
            </p>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {[
              'Dark-first interface with light mode toggle',
              'Kanban workflows with quick task completion',
              'Premium cards, charts, and animations',
              'Developer branding by Aditya Pratap Singh',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-16 max-w-md">
            <DeveloperProfile />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
        >
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <APSBadge size="lg" />
            <ThemeToggle />
          </div>
          <div className="mb-8">
            <p className="chip mb-4">Sign in</p>
            <h2 className="text-3xl font-semibold text-white">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sign in to continue managing projects, tasks, and your dashboard.
            </p>
          </div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FloatingField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FloatingField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <LoadingSpinner /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
