import Task from '../models/Task.js';
import Project from '../models/Project.js';

const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    const userId = req.user.userId;

    // Check if project exists and user is a member
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = projectDoc.members.some(m => m.toString() === userId);
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not a member of this project' });
    }

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
      createdBy: userId,
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('project', 'name');

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

const getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Check if user is a member of the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(m => m.toString() === req.user.userId);
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not a member of this project' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    // Group by status
    const tasksByStatus = {
      todo: tasks.filter(t => t.status === 'todo'),
      'in-progress': tasks.filter(t => t.status === 'in-progress'),
      completed: tasks.filter(t => t.status === 'completed'),
    };

    res.json({
      count: tasks.length,
      tasks: tasksByStatus,
      allTasks: tasks,
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    const project = await Project.findById(task.project);
    const isMember = project.members.some(m => m.toString() === req.user.userId);
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const taskId = req.params.id;

    let task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization - creator, assigned user, or admin can update
    const isCreator = task.createdBy.toString() === req.user.userId;
    const isAssigned = task.assignedTo.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAssigned && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('project', 'name');

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization - only creator or admin can delete
    if (task.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.find({ assignedTo: userId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name')
      .sort({ dueDate: 1 });

    const now = new Date();

    // Categorize tasks
    const myTasks = {
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'),
      today: tasks.filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        return dueDate.toDateString() === now.toDateString() && t.status !== 'completed';
      }),
      upcoming: tasks.filter(t => t.dueDate && new Date(t.dueDate) > now && t.status !== 'completed'),
      completed: tasks.filter(t => t.status === 'completed'),
    };

    res.json({
      myTasks,
      totalTasks: tasks.length,
      stats: {
        overdue: myTasks.overdue.length,
        today: myTasks.today.length,
        upcoming: myTasks.upcoming.length,
        completed: myTasks.completed.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks,
};
