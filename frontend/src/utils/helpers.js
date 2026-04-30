export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isOverdue = (dueDate, status) => {
  if (status === 'completed' || !dueDate) return false;
  return new Date(dueDate) < new Date();
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'border border-rose-500/30 bg-rose-500/10 text-rose-200';
    case 'medium':
      return 'border border-amber-500/30 bg-amber-500/10 text-amber-200';
    case 'low':
      return 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
    default:
      return 'border border-white/10 bg-white/5 text-slate-300';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
    case 'in-progress':
      return 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-200';
    case 'todo':
      return 'border border-white/10 bg-white/5 text-slate-300';
    default:
      return 'border border-white/10 bg-white/5 text-slate-300';
  }
};
