# Team Task Manager - Features Guide

Complete guide to all features and functionality in Team Task Manager.

## Table of Contents
1. [Authentication Features](#authentication-features)
2. [Project Management](#project-management)
3. [Task Management](#task-management)
4. [Dashboard & Analytics](#dashboard--analytics)
5. [User Management](#user-management)
6. [Role-Based Access](#role-based-access)

---

## Authentication Features

### User Registration
- **Location**: `/register` page
- **Features**:
  - Create new account with name, email, and password
  - Password validation (minimum 6 characters)
  - Email validation
  - Default role: Member
  - Automatic login after registration
  - Form validation with error messages

**How to Use**:
1. Click "Sign up" on login page
2. Enter your details
3. Confirm password matches
4. Click "Create Account"
5. Automatically redirected to dashboard

---

### User Login
- **Location**: `/login` page
- **Features**:
  - Email and password authentication
  - JWT token generation
  - Persistent session (7 days)
  - "Remember me" session persistence
  - Error handling for invalid credentials
  - Account status verification

**How to Use**:
1. Visit `/login`
2. Enter email and password
3. Click "Sign In"
4. Token stored automatically
5. Redirected to dashboard

---

### Password Security
- **Hashing Algorithm**: bcryptjs (salt rounds: 10)
- **Storage**: Hashed passwords never sent in responses
- **Features**:
  - One-way encryption
  - Unique salt for each password
  - Resistant to rainbow table attacks
  - OWASP compliant

---

### Session Management
- **Token Type**: JWT (JSON Web Tokens)
- **Expiration**: 7 days
- **Storage**: Browser localStorage
- **Automatic Logout**: On token expiration
- **Security**: Automatic logout if 401 response received
- **Token Refresh**: Re-login required for new token

---

## Project Management

### Create Project
- **Location**: Projects page
- **Access**: All authenticated users
- **Features**:
  - Project name (required, max 100 characters)
  - Description (optional, max 500 characters)
  - Creator automatically added as member
  - Timestamps (createdAt, updatedAt)

**How to Use**:
1. Navigate to Projects page
2. Click "New Project" button
3. Enter project details
4. Click "Create Project"
5. Added to your projects list

---

### View Projects
- **Location**: Projects page
- **Features**:
  - Grid/list view of projects
  - Shows project name, description
  - Displays member count
  - Shows creator information
  - Filtered by user role:
    - **Admin**: See all projects
    - **Member**: See only joined projects

**How to Use**:
1. Click "Projects" in sidebar
2. View all your projects
3. Click project to view tasks
4. See member count and details

---

### Edit Project
- **Location**: Projects page
- **Access**: Creator or Admin only
- **Features**:
  - Update project name
  - Update description
  - Preserve all associated tasks

**How to Use**:
1. Go to Projects page
2. Click edit button on project
3. Update details
4. Click "Save Changes"

---

### Delete Project
- **Location**: Projects page
- **Access**: Creator or Admin only
- **Features**:
  - Soft delete (marks as inactive)
  - Confirmation dialog
  - Tasks remain in database
  - Cannot be recovered in UI

**How to Use**:
1. Go to Projects page
2. Click delete button on project
3. Confirm deletion
4. Project removed from view

---

### Project Members
- **Features**:
  - View all project members
  - See member roles
  - View member profiles
  - Member count display

**Member List**:
- Shows member name, email, and role
- Creator highlighted
- Admin badge shown

---

### Add Members to Project
- **Access**: Admin only (future enhancement)
- **Features**:
  - Search users by name/email
  - Prevent duplicate membership
  - Real-time member list update

---

## Task Management

### Create Task
- **Location**: Project Tasks page
- **Access**: Project members and admins
- **Fields**:
  - **Title** (required, max 100 characters)
  - **Description** (optional, max 1000 characters)
  - **Priority** (low, medium, high)
  - **Status** (todo, in-progress, completed)
  - **Assign To** (required, team member)
  - **Due Date** (optional)

**How to Use**:
1. Open a project
2. Click "New Task"
3. Fill in task details
4. Assign to team member
5. Set due date (optional)
6. Click "Create Task"

---

### View Tasks (Kanban Board)
- **Location**: Project Tasks page
- **Features**:
  - Three-column Kanban board:
    - **To Do**: New tasks
    - **In Progress**: Currently working
    - **Completed**: Finished tasks
  - Drag-and-drop (future enhancement)
  - Task cards showing:
    - Title
    - Description
    - Priority badge
    - Due date
    - Assigned to
  - Color-coded priorities:
    - Red: High
    - Yellow: Medium
    - Green: Low

**How to Use**:
1. Navigate to project
2. View tasks in columns
3. See task details on card
4. Click task for full details

---

### Update Task
- **Location**: Project Tasks page / Task Details
- **Access**: Task creator, assigned user, or admin
- **Updatable Fields**:
  - Title
  - Description
  - Status
  - Priority
  - Due date
  - Assigned to

**How to Use**:
1. Click on task
2. Update desired fields
3. Change status if needed
4. Click "Save Changes"

---

### Delete Task
- **Location**: Project Tasks page
- **Access**: Task creator or admin
- **Features**:
  - Confirmation dialog
  - Permanent deletion
  - Cannot undo

**How to Use**:
1. Click delete icon on task
2. Confirm deletion
3. Task removed

---

### Task Status Tracking
- **Statuses**:
  - **Todo**: New, not started tasks
  - **In Progress**: Currently being worked on
  - **Completed**: Finished tasks
- **Features**:
  - Status change history (timestamps tracked)
  - Visual indicators
  - Filtering by status

---

### Task Priority Levels
- **Levels**:
  - **Low**: Minor tasks
  - **Medium**: Standard importance (default)
  - **High**: Urgent/critical tasks
- **Visual Indicators**:
  - Color-coded badges
  - Icons for priority
  - Sorting by priority

---

### Task Assignment
- **Features**:
  - Assign only to project members
  - One assignee per task
  - Reassign as needed
  - View assigned user details
  - Receive notifications (future)

---

### Task Due Dates
- **Features**:
  - Optional due date
  - Date picker interface
  - Overdue highlighting
  - Calendar integration (future)
  - Reminder notifications (future)

---

## Dashboard & Analytics

### Dashboard Overview
- **Location**: Dashboard page
- **Displays**:
  - Task statistics
  - Overdue tasks
  - Today's tasks
  - Upcoming tasks
  - Completed tasks summary

---

### Task Statistics
- **Cards Show**:
  - **Total Tasks**: Count of all assigned tasks
  - **Overdue**: Tasks past due date not completed
  - **Today**: Tasks due today
  - **Completed**: Finished tasks

**Icons**:
- Check mark: Completed tasks
- Alert: Overdue tasks
- Clock: Today's tasks

---

### Overdue Tasks Section
- **Features**:
  - Red highlighting
  - Shows overdue tasks
  - Click to view details
  - Prioritize by due date

---

### Today's Tasks Section
- **Features**:
  - Yellow highlighting
  - Tasks due today
  - Quick access
  - Priority indicator

---

### Upcoming Tasks
- **Features**:
  - Blue highlighting
  - Next 5 upcoming tasks
  - Sorted by due date
  - Scrollable list

---

### Completed Tasks
- **Features**:
  - Green highlighting
  - Total completed count
  - Historical record
  - Satisfaction metric

---

## My Tasks

### View All My Tasks
- **Location**: My Tasks page
- **Features**:
  - All tasks assigned to current user
  - Filter options:
    - All tasks
    - Overdue
    - Today
    - Upcoming
    - Completed
  - Sorted by due date

---

### Task Filtering
- **Filter Options**:
  - **All**: All assigned tasks
  - **Overdue**: Past due date
  - **Today**: Due today
  - **Upcoming**: Future due dates
  - **Completed**: Finished tasks

**How to Use**:
1. Click filter button
2. Select category
3. View filtered tasks

---

### Task Details View
- **Information Shown**:
  - Title and description
  - Project name
  - Priority level
  - Status
  - Due date
  - Assigned user
  - Created date

---

## User Management

### User Profile
- **Location**: Auth context / Settings (future)
- **Information**:
  - User name
  - Email address
  - Role (Admin/Member)
  - Profile image (optional)
  - Join date (future)
  - Activity log (future)

---

### View User Profile
- **Access**: All authenticated users
- **Features**:
  - See user information
  - View profile image
  - Check role
  - See joined projects (future)

---

### Update Profile
- **Updatable Fields**:
  - Name
  - Profile image
- **Access**: Own profile or admin

---

### User Directory
- **Location**: Users page (future)
- **Features**:
  - List all active users
  - Search by name/email
  - Filter by role
  - View user details

---

## Role-Based Access

### Admin Role
- **Permissions**:
  - ✅ Create projects
  - ✅ Edit all projects
  - ✅ Delete projects
  - ✅ Add/remove members
  - ✅ Create tasks
  - ✅ Edit all tasks
  - ✅ Delete all tasks
  - ✅ View all projects and tasks
  - ✅ Manage users (future)

- **Dashboard Access**: All projects and tasks

---

### Member Role
- **Permissions**:
  - ❌ Cannot create projects
  - ❌ Cannot delete projects
  - ✅ Can view assigned projects
  - ✅ Can create tasks in projects
  - ✅ Can edit assigned tasks
  - ✅ Can update own task status
  - ❌ Cannot delete tasks
  - ✅ Can view my tasks

- **Dashboard Access**: Own projects and tasks

---

## Protected Routes

### Authentication Required
All routes except login/register require valid JWT token:
- `/dashboard`
- `/projects`
- `/projects/:id/tasks`
- `/my-tasks`

### Automatic Redirects
- No token → Redirect to login
- Invalid token → Logout and redirect to login
- Expired token → Re-login required

---

## Permissions Matrix

| Action | Admin | Member |
|--------|-------|--------|
| Create Project | ✅ | ❌ |
| Edit Project | ✅ | ❌ |
| Delete Project | ✅ | ❌ |
| View All Projects | ✅ | ❌ |
| Add Member | ✅ | ❌ |
| Remove Member | ✅ | ❌ |
| Create Task | ✅ | ✅* |
| Edit Task | ✅ | ✅* |
| Delete Task | ✅ | ❌ |
| View Dashboard | ✅ | ✅ |
| View My Tasks | ✅ | ✅ |

*Only in projects they're members of

---

## Data Validation

### Input Validation
- **Name**: Max 50 characters, not empty
- **Email**: Valid email format, unique
- **Password**: Minimum 6 characters, hashed
- **Project Name**: Max 100 characters
- **Project Description**: Max 500 characters
- **Task Title**: Max 100 characters
- **Task Description**: Max 1000 characters
- **Priority**: Must be low, medium, or high
- **Status**: Must be todo, in-progress, or completed

---

## Error Handling

### User-Friendly Error Messages
- Invalid email format
- Password too short
- User already exists
- Invalid credentials
- Project not found
- Task not found
- Unauthorized access
- Validation errors with field names

### Server Error Handling
- 400: Bad request / validation error
- 401: Unauthorized / invalid token
- 403: Forbidden / insufficient permissions
- 404: Resource not found
- 500: Internal server error

---

## Future Enhancements

### Planned Features
- [ ] Real-time collaboration (WebSocket)
- [ ] Task comments and discussions
- [ ] File attachments
- [ ] Email notifications
- [ ] Calendar view for tasks
- [ ] Recurring tasks
- [ ] Task templates
- [ ] Time tracking
- [ ] Activity feed
- [ ] Advanced search
- [ ] Export to PDF/Excel
- [ ] Mobile app
- [ ] Dark mode
- [ ] Two-factor authentication
- [ ] OAuth integration

---

## Accessibility Features

### Current Support
- Semantic HTML
- ARIA labels (partial)
- Keyboard navigation (partial)
- Color contrast ratios

### Future Improvements
- Full keyboard navigation
- Screen reader support
- WCAG 2.1 AA compliance
- High contrast mode
- Text size adjustment

---

## Performance Features

### Optimizations
- JWT token caching
- API request batching
- Database indexing
- Lazy loading (future)
- Component memoization (React)
- Code splitting (Vite)

---

## Security Features

### Implemented
- Password hashing (bcryptjs)
- JWT token authentication
- CORS configuration
- Input validation
- SQL injection prevention (MongoDB)
- XSS prevention (React)
- CSRF tokens (future)

### Best Practices
- Secure password requirements
- Token expiration
- Secrets in environment variables
- HTTPS enforcement (production)
- Rate limiting (future)

---

End of Features Guide
