# Team Task Manager - Setup Instructions

Complete step-by-step guide to set up Team Task Manager locally for development.

## Prerequisites

Before you start, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **MongoDB** (local or Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Verify Installation
```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show 6.0.0 or higher
git --version     # Should show 2.0.0 or higher
```

## Step 1: Clone the Repository

```bash
# If this is a new project, navigate to your projects folder
cd ~/projects

# Clone the repository (replace with your repository URL)
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd backend
```

### 2.2 Install Dependencies
```bash
npm install
```

This will install:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `express-validator` - Input validation
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables
- `nodemon` - Auto-restart on file changes (dev dependency)

### 2.3 Create Environment File
```bash
# Copy the example .env file
cp .env.example .env

# Or create it manually
nano .env
```

### 2.4 Configure Environment Variables
Edit the `.env` file and update with your values:

#### Option A: Using Local MongoDB
```env
# Database - Local MongoDB
MONGODB_URI=mongodb://localhost:27017/team-task-manager

# Security
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Option B: Using MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get connection string
5. Update .env:
```env
# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/team-task-manager?retryWrites=true&w=majority

JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 2.5 Generate JWT Secret
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use online generator
# https://www.uuidgenerator.net/
```

### 2.6 Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
MongoDB Connected: cluster-name.mongodb.net
Server running on port 5000
```

### 2.7 Test Backend
Open a new terminal and test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Response should be:
```json
{"status":"Server is running"}
```

## Step 3: Frontend Setup

### 3.1 Open New Terminal and Navigate to Frontend
```bash
# Keep the backend running in the previous terminal
cd team-task-manager/frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

This will install:
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - CSS framework
- `vite` - Build tool (dev dependency)

### 3.3 Create Environment File
```bash
cp .env.example .env.local
```

### 3.4 Configure Environment Variables
Edit `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3.5 Start Frontend Server
```bash
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Step 4: Access the Application

1. Open your browser
2. Navigate to `http://localhost:5173`
3. You should see the login page

## Step 5: Create Test Data

### 5.1 Register a New Account
1. Click "Sign up" link
2. Enter:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
3. Click "Create Account"
4. You'll be redirected to the dashboard

### 5.2 Create a Project
1. Click "Projects" in the sidebar
2. Click "New Project"
3. Enter:
   - Project Name: `My First Project`
   - Description: `This is my first project`
4. Click "Create Project"

### 5.3 Create Tasks
1. Click on the project
2. Click "New Task"
3. Enter:
   - Title: `Complete setup`
   - Description: `Finish setting up the application`
   - Priority: `High`
   - Assign To: `John Doe`
   - Due Date: `2024-12-31`
4. Click "Create Task"

### 5.4 Update Task Status
1. Click on the task
2. Move to "In Progress" column
3. Or update status when editing

## Step 6: Verify Features

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout functionality
- [ ] Protected routes work

### Projects
- [ ] Create project
- [ ] View projects
- [ ] Edit project
- [ ] Delete project

### Tasks
- [ ] Create task in project
- [ ] View tasks by status (Kanban board)
- [ ] Update task status
- [ ] Delete task
- [ ] View my tasks

### Dashboard
- [ ] See task statistics
- [ ] View overdue tasks
- [ ] Check today's tasks
- [ ] See upcoming tasks

## Development Workflow

### Terminal Setup
It's recommended to use two terminal windows:

**Terminal 1 - Backend:**
```bash
cd team-task-manager/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd team-task-manager/frontend
npm run dev
```

### Making Changes

#### Backend Changes
- Edit files in `backend/src/`
- Backend auto-reloads with `nodemon`
- Test with curl or Postman

#### Frontend Changes
- Edit files in `frontend/src/`
- Frontend auto-reloads with Vite
- Browser will refresh automatically

### Debugging

#### Backend Debugging
1. Add console.log statements:
   ```javascript
   console.log('Debug info:', variable);
   ```
2. Check terminal output
3. Use VS Code debugger (optional)

#### Frontend Debugging
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Use React DevTools extension

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Check MongoDB URI format
- Verify credentials are correct
- Ensure MongoDB is running locally or Atlas cluster is active
- Check firewall settings

### Issue: CORS Errors
**Solution:**
- Verify FRONTEND_URL in backend .env
- Backend must include `cors()` middleware
- Restart backend after changing .env

### Issue: Port Already in Use
**Solution:**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### Issue: Dependencies Installation Fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Frontend Shows Blank Page
**Solution:**
- Check browser console for errors
- Verify backend is running
- Check VITE_API_URL in .env.local
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Can't Login
**Solution:**
- Verify backend is running
- Check email and password are correct
- View backend logs for errors
- Check browser console for network errors

## Building for Production

### Build Backend
```bash
cd backend
npm run build  # (if you add a build script)
npm start      # Run production server
```

### Build Frontend
```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized files ready for deployment.

## Database Management

### Local MongoDB

#### Start MongoDB (macOS/Linux)
```bash
mongod
```

#### Start MongoDB (Windows)
```bash
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
```

#### Connect to MongoDB CLI
```bash
mongo
```

### MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Log in to your account
3. Click your cluster
4. Click "Collections" to see your data

## Performance Tips

1. **Frontend**
   - Minimize bundle size
   - Use React DevTools Profiler
   - Check Network tab in DevTools

2. **Backend**
   - Monitor database queries
   - Use indexes for frequently queried fields
   - Cache frequently accessed data

3. **Database**
   - Ensure indexes are created
   - Monitor connection pool
   - Regular backups

## Next Steps

1. Customize the UI with your branding
2. Add more features (notifications, comments, etc.)
3. Set up testing (Jest, React Testing Library)
4. Deploy to production
5. Set up CI/CD pipeline

## Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review error messages in terminal/console
3. Check GitHub Issues for similar problems
4. Create a new issue with details:
   - OS (Windows/Mac/Linux)
   - Node version
   - Error message
   - Steps to reproduce

## Quick Commands Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start dev server
npm start            # Start production server

# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Database
mongod               # Start MongoDB (local)
mongo                # Connect to MongoDB CLI
```

## Keyboard Shortcuts

### VS Code
- `Ctrl+` ` - Open terminal
- `Ctrl+Shift+D - Debug
- `Ctrl+Shift+X - Extensions
- `Ctrl+J - Toggle terminal

### Browser DevTools
- `F12` - Open DevTools
- `Ctrl+Shift+J - Open Console
- `Ctrl+Shift+I - Open Inspector

Happy coding! 🚀
