import React, { useEffect, useMemo, useState } from 'react';
import { taskService } from '../services/index';
import { LoadingSpinner, ErrorMessage } from '../components/Alerts';
import { formatDate, getStatusColor, getPriorityColor, isOverdue } from '../utils/helpers';
import { AlertTriangle, Clock3, Search, Filter, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import EmptyState from '../components/ui/EmptyState';

const filters = ['all', 'overdue', 'today', 'upcoming', 'completed'];

const MyTasks = () => {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

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

  const getFilteredTasks = () => {
    if (!tasks) return [];
    switch (filter) {
      case 'overdue':
        return tasks.myTasks.overdue;
      case 'today':
        return tasks.myTasks.today;
      case 'upcoming':
        return tasks.myTasks.upcoming;
      case 'completed':
        return tasks.myTasks.completed;
      default:
        return [...tasks.myTasks.overdue, ...tasks.myTasks.today, ...tasks.myTasks.upcoming, ...tasks.myTasks.completed];
    }
  };

  const filteredTasks = useMemo(() => {
    const baseTasks = getFilteredTasks();
    return baseTasks.filter((task) => {
      const searchable = `${task.title} ${task.description || ''} ${task.project?.name || ''}`.toLowerCase();
      return searchable.includes(query.toLowerCase());
    });
  }, [filter, query, tasks]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <p className="chip mb-4 inline-flex items-center gap-2">
            <CheckCircle2 size={14} />
            Personal work queue
          </p>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Search, filter, and prioritize the work assigned directly to you.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickMetric label="Overdue" value={tasks?.stats?.overdue || 0} accent="rose" />
          <QuickMetric label="Today" value={tasks?.stats?.today || 0} accent="amber" />
          <QuickMetric label="Upcoming" value={tasks?.stats?.upcoming || 0} accent="cyan" />
          <QuickMetric label="Completed" value={tasks?.stats?.completed || 0} accent="emerald" />
        </div>
      </motion.section>

      {error && <ErrorMessage message={error} />}

      <section className="panel space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-11"
              placeholder="Search tasks, projects, descriptions..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === filterType
                    ? 'bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Filter size={14} />
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <EmptyState
              title="No tasks found"
              description="Try a different filter or search term to surface matching work."
              icon={<Clock3 size={28} />}
            />
          ) : (
            filteredTasks.map((task, index) => (
              <motion.article
                key={task._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`rounded-3xl border p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 ${
                  isOverdue(task.dueDate, task.status)
                    ? 'border-rose-500/30 bg-rose-500/10'
                    : 'border-white/10 bg-white/5 hover:border-cyan-400/30 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">{task.title}</h3>
                      {task.dueDate && (
                        <span className={`chip ${isOverdue(task.dueDate, task.status) ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : ''}`}>
                          <AlertTriangle size={14} />
                          {isOverdue(task.dueDate, task.status) ? 'Overdue' : formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{task.description || 'No description provided.'}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`chip ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                      <span className={`chip ${getStatusColor(task.status)}`}>{task.status}</span>
                      <span className="chip">Project: {task.project.name}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Assigned To</p>
                    <p className="mt-1 font-medium text-white">{task.assignedTo?.name || 'Unassigned'}</p>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const QuickMetric = ({ label, value, accent }) => {
  const styles = {
    rose: 'bg-rose-500/10 text-rose-200 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-200 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20',
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${styles[accent]}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
};

export default MyTasks;
