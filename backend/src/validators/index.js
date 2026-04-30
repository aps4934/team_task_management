import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateCreateProject = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('description')
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  handleValidationErrors,
];

const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('project')
    .notEmpty().withMessage('Project ID is required'),
  body('assignedTo')
    .notEmpty().withMessage('Assignee is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  handleValidationErrors,
];

export {
  validateRegister,
  validateLogin,
  validateCreateProject,
  validateCreateTask,
};
