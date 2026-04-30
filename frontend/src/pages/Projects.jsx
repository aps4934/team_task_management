import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderPlus, Users, Trash2, Sparkles, FolderOpen, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService } from '../services/index';
import { LoadingSpinner, ErrorMessage, SuccessMessage } from '../components/Alerts';
import FloatingField from '../components/ui/FloatingField';
import EmptyState from '../components/ui/EmptyState';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAllProjects();
      setProjects(response.data.projects);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectService.createProject(formData);
      setSuccess('Project created successfully');
      toast.success('Project created successfully');
      setFormData({ name: '', description: '' });
      setShowModal(false);
      fetchProjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create project';
      setError(message);
      toast.error(message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        setSuccess('Project deleted successfully');
        toast.success('Project deleted successfully');
        fetchProjects();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete project';
        setError(message);
        toast.error(message);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel flex flex-col gap-4 overflow-hidden lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <p className="chip mb-4 inline-flex items-center gap-2">
            <Sparkles size={14} />
            Team workspace
          </p>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Card-based project management with member avatars and fast navigation into task boards.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FolderPlus size={18} />
          New Project
        </button>
      </motion.section>

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/40"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">Create New Project</h2>
              <p className="mt-1 text-sm text-slate-400">Give your team a clear space to plan and deliver.</p>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <FloatingField
                id="projectName"
                label="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <FloatingField
                id="projectDescription"
                label="Description"
                as="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', description: '' });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => {
          const members = project.members || [];
          const visibleMembers = members.slice(0, 4);
          const extraCount = Math.max(members.length - visibleMembers.length, 0);

          return (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="chip mb-3 inline-flex items-center gap-2">
                    <FolderOpen size={14} />
                    Active project
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{project.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {project.description || 'A focused workspace for collaboration and delivery.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="rounded-2xl border border-white/10 bg-white/5 p-2 text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-500/10"
                    aria-label="Delete project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {visibleMembers.length > 0 ? (
                      visibleMembers.map((member) => (
                        <div
                          key={member._id}
                          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 bg-gradient-to-br from-indigo-500 to-cyan-400 text-xs font-semibold text-white"
                          title={member.name}
                        >
                          {member.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      ))
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 bg-white/10 text-slate-300">
                        <Users size={16} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{members.length} members</p>
                    <p className="text-xs text-slate-400">{extraCount > 0 ? `${extraCount} more hidden` : 'Team members visible'}</p>
                  </div>
                </div>
                <Link
                  to={`/projects/${project._id}/tasks`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-400/30 hover:bg-white/10"
                >
                  Open board
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </section>

      {projects.length === 0 && (
        <EmptyState
          title="No projects yet"
          description="Create the first project to start organizing work for your team."
          actionLabel="Create First Project"
          onAction={() => setShowModal(true)}
          icon={<FolderPlus size={30} />}
        />
      )}
    </div>
  );
};

export default Projects;
