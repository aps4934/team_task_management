import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, PointerSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { taskService, projectService } from '../services/index';
import { LoadingSpinner, ErrorMessage, SuccessMessage } from '../components/Alerts';
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers';
import { Plus, Trash2, CheckCircle2, ArrowLeft, GripVertical, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import FloatingField from '../components/ui/FloatingField';
import EmptyState from '../components/ui/EmptyState';

const statusConfig = [
  { id: 'todo', label: 'Todo', accent: 'slate' },
  { id: 'in-progress', label: 'In Progress', accent: 'cyan' },
  { id: 'completed', label: 'Completed', accent: 'emerald' },
];

const ProjectTasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    assignedTo: '',
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectRes] = await Promise.all([
        taskService.getTasksByProject(projectId),
        projectService.getProjectById(projectId),
      ]);
      setTasks(tasksRes.data);
      setProject(projectRes.data.project);
      if (projectRes.data.project.members.length > 0) {
        setFormData((prev) => ({
          ...prev,
          assignedTo: projectRes.data.project.members[0]._id,
        }));
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask({
        ...formData,
        project: projectId,
      });
      setSuccess('Task created successfully');
      toast.success('Task created successfully');
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        assignedTo: project?.members[0]?._id || '',
      });
      setShowModal(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task';
      setError(message);
      toast.error(message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        setSuccess('Task deleted successfully');
        toast.success('Task deleted successfully');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete task';
        setError(message);
        toast.error(message);
      }
    }
  };

  const handleMarkCompleted = async (taskId) => {
    try {
      await taskService.updateTask(taskId, { status: 'completed' });
      setSuccess('Task marked as completed');
      toast.success('Task marked as completed');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task';
      setError(message);
      toast.error(message);
    }
  };

  const tasksByStatus = useMemo(() => {
    const allTasks = tasks?.allTasks || [];
    return statusConfig.reduce((acc, status) => {
      acc[status.id] = allTasks.filter((task) => task.status === status.id);
      return acc;
    }, {});
  }, [tasks]);

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const activeTask = tasks?.allTasks.find((task) => task._id === active.id);
    if (!activeTask) return;

    const overTask = tasks?.allTasks.find((task) => task._id === over.id);
    const targetStatus = overTask?.status || over.id;

    if (!statusConfig.some((status) => status.id === targetStatus)) return;
    if (activeTask.status === targetStatus) return;

    try {
      await taskService.updateTask(active.id, { status: targetStatus });
      toast.success(`Moved to ${targetStatus.replace('-', ' ')}`);
      fetchData();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to move task';
      toast.error(message);
      setError(message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <button
            onClick={() => navigate('/projects')}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </button>
          <p className="chip mb-4 inline-flex items-center gap-2">
            <Sparkles size={14} />
            Kanban board
          </p>
          <h1 className="page-title">{project?.name || 'Project Tasks'}</h1>
          <p className="page-subtitle">Drag tasks across columns, complete them instantly, and keep the team synced.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} />
          New Task
        </button>
      </motion.section>

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/40"
          >
            <h2 className="text-2xl font-semibold text-white">Create New Task</h2>
            <p className="mt-1 text-sm text-slate-400">Add work directly to the board and assign it to a teammate.</p>
            <form onSubmit={handleCreateTask} className="mt-6 space-y-4">
              <FloatingField
                id="taskTitle"
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <FloatingField
                id="taskDescription"
                label="Description"
                as="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="form-label">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Assign To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="input-field"
                >
                  {project?.members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-6 xl:grid-cols-3">
          {statusConfig.map((column, columnIndex) => (
            <motion.section
              key={column.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.06 }}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/10 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{column.label}</h3>
                  <p className="text-xs text-slate-400">{tasksByStatus[column.id].length} tasks</p>
                </div>
                <span className={`chip ${column.accent === 'slate' ? '' : column.accent === 'cyan' ? 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20' : 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20'}`}>
                  {column.label}
                </span>
              </div>

              <ColumnDropZone id={column.id}>
                <SortableContext items={tasksByStatus[column.id].map((task) => task._id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {tasksByStatus[column.id].length === 0 ? (
                      <EmptyState
                        title={`No ${column.label.toLowerCase()} tasks`}
                        description="Drop a task here or create a new one."
                        icon={<GripVertical size={28} />}
                      />
                    ) : (
                      tasksByStatus[column.id].map((task) => (
                        <SortableTaskCard
                          key={task._id}
                          task={task}
                          onDelete={handleDeleteTask}
                          onComplete={handleMarkCompleted}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </ColumnDropZone>
            </motion.section>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

const ColumnDropZone = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={`min-h-[320px] rounded-3xl p-1 transition ${isOver ? 'bg-cyan-400/5' : ''}`}>
      {children}
    </div>
  );
};

const SortableTaskCard = ({ task, onDelete, onComplete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-black/10 backdrop-blur-xl transition ${
        isDragging ? 'scale-[1.02] ring-2 ring-cyan-400/40' : 'hover:border-cyan-400/30 hover:bg-white/10'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              {...listeners}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400"
              aria-label="Drag task"
            >
              <GripVertical size={14} />
            </button>
            <h4 className="font-semibold text-white">{task.title}</h4>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">{task.description || 'No description provided.'}</p>
        </div>
        <div className="flex items-center gap-1">
          {task.status !== 'completed' && (
            <button
              onClick={() => onComplete(task._id)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-emerald-300 transition hover:border-emerald-400/30 hover:bg-emerald-500/10"
              title="Mark completed"
            >
              <CheckCircle2 size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(task._id)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-rose-300 transition hover:border-rose-400/30 hover:bg-rose-500/10"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`chip ${getPriorityColor(task.priority)}`}>{task.priority}</span>
        <span className={`chip ${getStatusColor(task.status)}`}>{task.status}</span>
        {task.dueDate && <span className="chip">Due {formatDate(task.dueDate)}</span>}
      </div>
      <p className="mt-3 text-xs text-slate-500">Assigned to: {task.assignedTo.name}</p>
    </motion.div>
  );
};

export default ProjectTasks;
