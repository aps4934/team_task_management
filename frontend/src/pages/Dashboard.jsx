import React, { useEffect, useMemo, useState } from 'react';
import { taskService } from '../services/index';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, ErrorMessage } from '../components/Alerts';
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers';
import { AlertTriangle, CalendarCheck2, CheckCircle2, Clock3, FolderKanban, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import StatCard from '../components/ui/StatCard';
import DeveloperProfile from '../components/ui/DeveloperProfile';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeletons';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getMyTasks();
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = tasks?.totalTasks || 0;
  const completed = tasks?.stats?.completed || 0;
  const overdue = tasks?.stats?.overdue || 0;
  const today = tasks?.stats?.today || 0;
  const pending = Math.max(totalTasks - completed, 0);

  const chartData = useMemo(
    () => [
      { name: 'Overdue', value: overdue, fill: '#f43f5e' },
      { name: 'Today', value: today, fill: '#f59e0b' },
      { name: 'Pending', value: pending, fill: '#38bdf8' },
      { name: 'Completed', value: completed, fill: '#22c55e' },
    ],
    [completed, overdue, pending, today]
  );

  if (loading) {
    return <CardSkeleton count={4} />;
  }

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="chip mb-4 inline-flex items-center gap-2">
              <Sparkles size={14} />
              Smart overview
            </p>
            <h1 className="page-title">
              Good to see you, {user?.name?.split(' ')[0] || 'there'}.
            </h1>
            <p className="page-subtitle">
              Here’s your live workspace summary with tasks, progress, and the next actions that need attention.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="chip flex-col items-start !rounded-2xl px-4 py-3">
              <span className="text-xs text-slate-400">Workspace</span>
              <span className="mt-1 font-semibold text-white">Team Task Manager</span>
            </div>
            <div className="chip flex-col items-start !rounded-2xl px-4 py-3">
              <span className="text-xs text-slate-400">Completed</span>
              <span className="mt-1 font-semibold text-emerald-300">{completed}</span>
            </div>
            <div className="chip flex-col items-start !rounded-2xl px-4 py-3">
              <span className="text-xs text-slate-400">Pending</span>
              <span className="mt-1 font-semibold text-cyan-300">{pending}</span>
            </div>
            <div className="chip flex-col items-start !rounded-2xl px-4 py-3">
              <span className="text-xs text-slate-400">Overdue</span>
              <span className="mt-1 font-semibold text-rose-300">{overdue}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {error && <ErrorMessage message={error} />}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Tasks" value={totalTasks} icon={<FolderKanban size={22} />} accent="indigo" hint="All assigned items" />
        <StatCard label="Completed" value={completed} icon={<CheckCircle2 size={22} />} accent="emerald" hint="Closed and delivered" />
        <StatCard label="Pending" value={pending} icon={<Clock3 size={22} />} accent="cyan" hint="Still in progress" />
        <StatCard label="Overdue" value={overdue} icon={<AlertTriangle size={22} />} accent="rose" hint="Needs immediate attention" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Task health</h2>
              <p className="text-sm text-slate-400">A quick visual check on workload distribution.</p>
            </div>
            <span className="chip">Live snapshot</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={56}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#020617',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    color: '#e2e8f0',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="value" radius={[16, 16, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <DeveloperProfile />
          <div className="panel">
            <h3 className="text-lg font-semibold text-white">Focus summary</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span>Overdue items</span>
                <span className="font-semibold text-rose-300">{overdue}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span>Due today</span>
                <span className="font-semibold text-amber-300">{today}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span>Completed tasks</span>
                <span className="font-semibold text-emerald-300">{completed}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TaskPanel
          title="Overdue Tasks"
          description="High-priority items that need attention now."
          items={tasks?.myTasks.overdue || []}
          emptyTitle="No overdue tasks"
          emptyDescription="Your workspace is clear right now."
          emptyIcon={<AlertTriangle size={28} />}
          accent="rose"
          showProject
        />
        <TaskPanel
          title="Today's Tasks"
          description="The work scheduled for today."
          items={tasks?.myTasks.today || []}
          emptyTitle="No tasks due today"
          emptyDescription="You’ve cleared today’s queue."
          emptyIcon={<CalendarCheck2 size={28} />}
          accent="amber"
          showProject
        />
        <TaskPanel
          title="Upcoming Tasks"
          description="Upcoming work to keep your delivery on track."
          items={(tasks?.myTasks.upcoming || []).slice(0, 5)}
          emptyTitle="No upcoming tasks"
          emptyDescription="Nothing queued up yet."
          emptyIcon={<Clock3 size={28} />}
          accent="cyan"
        />
        <div className="panel flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Completed Tasks</h2>
            <p className="mt-1 text-sm text-slate-400">You’ve completed {completed} tasks so far.</p>
          </div>
          {completed > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(tasks?.myTasks.completed || []).slice(0, 4).map((task) => (
                <div key={task._id} className="rounded-2xl border border-white/10 bg-emerald-500/10 p-4">
                  <p className="font-medium text-white">{task.title}</p>
                  <p className="mt-1 text-xs text-emerald-200">Completed and ready for review</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="Nothing completed yet"
                description="Once tasks are closed, they’ll appear here with a clean summary."
                icon={<CheckCircle2 size={28} />}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const TaskPanel = ({ title, description, items, emptyTitle, emptyDescription, emptyIcon, accent, showProject = false }) => {
  const accentStyles = {
    rose: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    cyan: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200',
  };

  return (
    <div className="panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <span className={`chip ${accentStyles[accent]}`}>{items.length}</span>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />
        ) : (
          items.map((task) => (
            <div key={task._id} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/30 hover:bg-white/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{task.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{task.description || 'No description provided.'}</p>
                </div>
                <span className={`chip ${getPriorityColor(task.priority)}`}>{task.priority}</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className={`chip ${getStatusColor(task.status)}`}>{task.status}</span>
                {task.dueDate && (
                  <span className="chip">
                    Due {formatDate(task.dueDate)}
                  </span>
                )}
                {showProject && task.project?.name && <span className="chip">{task.project.name}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
