import Project from '../models/Project.js';
import User from '../models/User.js';

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    const project = new Project({
      name,
      description,
      createdBy: userId,
      members: [userId],
    });

    await project.save();
    await project.populate('createdBy members', 'name email role');

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let query;
    if (userRole === 'admin') {
      query = Project.find({ isActive: true });
    } else {
      query = Project.find({ 
        isActive: true,
        members: userId 
      });
    }

    const projects = await query.populate('createdBy members', 'name email role');

    res.json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy members', 'name email role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a member or admin
    const isMember = project.members.some(m => m._id.toString() === req.user.userId);
    const isAdmin = req.user.role === 'admin';

    if (!isMember && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const projectId = req.params.id;
    const userId = req.user.userId;

    let project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization - only creator or admin can update
    if (project.createdBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();
    await project.populate('createdBy members', 'name email role');

    res.json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

const addMemberToProject = async (req, res, next) => {
  try {
    const { projectId, userId: memberId } = req.body;

    let project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if user exists
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a member
    if (project.members.includes(memberId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(memberId);
    await project.save();
    await project.populate('createdBy members', 'name email role');

    res.json({
      message: 'Member added successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

const removeMemberFromProject = async (req, res, next) => {
  try {
    const { projectId, userId: memberId } = req.body;

    let project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project.members = project.members.filter(m => m.toString() !== memberId);
    await project.save();
    await project.populate('createdBy members', 'name email role');

    res.json({
      message: 'Member removed successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    let project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project.isActive = false;
    await project.save();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  addMemberToProject,
  removeMemberFromProject,
  deleteProject,
};
