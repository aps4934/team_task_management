# Team Task Manager - Full Stack Application

A comprehensive full-stack web application for managing team projects and tasks with role-based access control.

## Features

### Authentication & Authorization
- User registration and login with JWT tokens
- Password hashing using bcrypt
- Role-based access control (Admin, Member)
- Protected routes and API endpoints

### Project Management
- Create and manage team projects
- Add team members to projects
- View all projects (role-based visibility)
- Edit and delete projects (admin only)

### Task Management
- Create tasks with title, description, priority, and due date
- Assign tasks to team members
- Task status tracking (Todo, In Progress, Completed)
- Update and delete tasks
- View tasks grouped by status (Kanban board style)

### Dashboard
- Task overview with statistics
- Overdue tasks highlighting
- Task categorization (Today, Upcoming, Overdue, Completed)
- Quick task access

### User Management
- View all users
- User profile management
- Role assignment

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Deployment
- **Backend**: Railway
- **Database**: MongoDB Atlas
- **Frontend**: Vercel or Netlify

## Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── authorize.js
│   │   │   └── errorHandler.js
│   │   ├── validators/
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   └── auth.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── Alerts.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   ├── ProjectTasks.jsx
    │   │   └── MyTasks.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── index.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   ├── helpers.js
    │   │   └── ProtectedRoute.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── .gitignore
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd team-task-manager/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd team-task-manager/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The application will run on `http://localhost:5173`

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member"
    }
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: Same as register

#### Get Current User
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member"
    }
  }
  ```

### User Endpoints

#### Get All Users
- **GET** `/api/users`
- **Headers**: `Authorization: Bearer <token>`

#### Get User by ID
- **GET** `/api/users/:id`
- **Headers**: `Authorization: Bearer <token>`

#### Update User
- **PUT** `/api/users/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "profileImage": "image_url"
  }
  ```

### Project Endpoints

#### Create Project
- **POST** `/api/projects`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "Project Name",
    "description": "Project Description"
  }
  ```

#### Get All Projects
- **GET** `/api/projects`
- **Headers**: `Authorization: Bearer <token>`

#### Get Project by ID
- **GET** `/api/projects/:id`
- **Headers**: `Authorization: Bearer <token>`

#### Update Project
- **PUT** `/api/projects/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "Updated Name",
    "description": "Updated Description"
  }
  ```

#### Delete Project
- **DELETE** `/api/projects/:id`
- **Headers**: `Authorization: Bearer <token>`

#### Add Member to Project
- **POST** `/api/projects/members/add`
- **Headers**: `Authorization: Bearer <token>` (Admin only)
- **Body**:
  ```json
  {
    "projectId": "project_id",
    "userId": "user_id"
  }
  ```

#### Remove Member from Project
- **POST** `/api/projects/members/remove`
- **Headers**: `Authorization: Bearer <token>` (Admin only)
- **Body**:
  ```json
  {
    "projectId": "project_id",
    "userId": "user_id"
  }
  ```

### Task Endpoints

#### Create Task
- **POST** `/api/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "project": "project_id",
    "assignedTo": "user_id",
    "priority": "high",
    "status": "todo",
    "dueDate": "2024-12-31"
  }
  ```

#### Get My Tasks
- **GET** `/api/tasks/my-tasks`
- **Headers**: `Authorization: Bearer <token>`

#### Get Tasks by Project
- **GET** `/api/tasks/project/:projectId`
- **Headers**: `Authorization: Bearer <token>`

#### Get Task by ID
- **GET** `/api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`

#### Update Task
- **PUT** `/api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: (any of the task fields)
  ```json
  {
    "status": "in-progress",
    "priority": "medium"
  }
  ```

#### Delete Task
- **DELETE** `/api/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`

## Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'member'], default: 'member'),
  profileImage: String,
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Project Model
```javascript
{
  name: String (required),
  description: String,
  createdBy: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  project: ObjectId (ref: Project, required),
  assignedTo: ObjectId (ref: User, required),
  status: String (enum: ['todo', 'in-progress', 'completed'], default: 'todo'),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  dueDate: Date,
  createdBy: ObjectId (ref: User, required),
  timestamps: true
}
```

## User Roles & Permissions

### Admin
- Create/update/delete projects
- Assign tasks
- Manage team members
- View all projects and tasks

### Member
- View assigned projects
- View/update assigned tasks
- Cannot create projects or manage team members

## Features in Detail

### Dashboard
- Shows statistics: total tasks, overdue, today, completed
- Displays overdue tasks with alert
- Shows today's tasks
- Lists upcoming tasks (next 5)
- Shows completed tasks count

### Projects
- Create new projects
- View all projects (filtered by role)
- Edit project details
- Delete projects
- See team members

### Tasks (Kanban Board)
- Create tasks within projects
- Organize by status (Todo, In Progress, Completed)
- View task details (title, description, priority, due date)
- Delete tasks
- Assign tasks to team members

### My Tasks
- View all assigned tasks
- Filter by: All, Overdue, Today, Upcoming, Completed
- See task details and due dates
- Quick access to priority and status

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

Error Response Format:
```json
{
  "message": "Error description"
}
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation with express-validator
- Role-based authorization
- Protected API routes

## Development Tips

- Use the `/api/health` endpoint to check server status
- JWT tokens expire after 7 days
- All API requests require the Authorization header (except login/register)
- Passwords are never returned in API responses
- Timestamps (createdAt, updatedAt) are automatically managed

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB Atlas connection string
- Ensure IP whitelist includes your computer
- Check database credentials

### CORS Errors
- Ensure FRONTEND_URL in backend .env matches your frontend URL
- Check that both servers are running

### Authentication Issues
- Verify JWT_SECRET is set in .env
- Check token expiration (7 days)
- Ensure token is sent in Authorization header as Bearer token

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## License

MIT

## Support

For issues and questions, please refer to the documentation or create an issue in the repository.
