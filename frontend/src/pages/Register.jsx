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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      const { token, user } = response.data;
      login(user, token);
      toast.success(`Account created for ${user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.16),_transparent_40%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
        >
          <div className="mb-8 flex items-center justify-between">
            <APSBadge size="lg" />
            <ThemeToggle />
          </div>

          <div className="mb-8">
            <p className="chip mb-4">Create your account</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Start working like a top SaaS team</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Create your account to manage projects, move tasks across the board, and keep work visible.
            </p>
          </div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FloatingField
              id="name"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <FloatingField
              id="email"
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <FloatingField
              id="password"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <FloatingField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <LoadingSpinner /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
              Sign in
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl lg:block"
        >
          <div className="max-w-xl">
            <p className="chip">Built for recruiters</p>
            <h2 className="mt-5 text-5xl font-semibold tracking-tight text-white">
              Clean workflows. Smooth interactions. <span className="text-gradient">Modern visuals.</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
              The interface is tuned to feel like a production SaaS product, with dark mode as the default, crisp cards, subtle motion, and a strong developer identity.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              'Floating labels and inline validation',
              'Responsive layout for mobile and desktop',
              'Developer branding and social links',
              'Charts, toasts, and drag-and-drop interactions',
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
      </div>
    </div>
  );
};

export default Register;
