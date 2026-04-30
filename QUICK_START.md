# Quick Start Guide

Get Team Task Manager up and running in 5 minutes.

## Prerequisites Check

```bash
# Check Node.js
node --version  # Should be v14+

# Check npm
npm --version   # Should be v6+

# Check Git
git --version   # Should be v2+
```

## 30-Second Setup

### 1. Backend (Terminal 1)
```bash
cd team-task-manager/backend
cp .env.example .env
npm install
npm run dev
```

Update `.env` with:
```env
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 2. Frontend (Terminal 2)
```bash
cd team-task-manager/frontend
cp .env.example .env.local
npm install
npm run dev
```

### 3. Open Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Test Account

### Quick Registration
1. Click "Sign up" on login page
2. Use these details:
   - Name: Test User
   - Email: test@example.com
   - Password: test123456

### Or Quick Login
If account already exists, use above credentials.

## 2-Minute Demo

### Create Project
1. Login with test account
2. Click "Projects" → "New Project"
3. Name: "My First Project"
4. Click "Create Project"

### Create Task
1. Click on project
2. Click "New Task"
3. Fill in:
   - Title: "Setup application"
   - Priority: High
   - Assign to: Test User
4. Click "Create Task"

### View Tasks
1. See task in "To Do" column
2. Tasks organized by status
3. Click Dashboard to see statistics

## File Structure Quick Reference

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── index.js          ← Start server here
│   │   ├── config/db.js      ← MongoDB connection
│   │   ├── models/           ← Data schemas
│   │   ├── routes/           ← API endpoints
│   │   ├── controllers/      ← Business logic
│   │   └── middleware/       ← Auth, validation
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx           ← Main component
│   │   ├── pages/            ← Page components
│   │   ├── components/       ← Reusable components
│   │   ├── services/         ← API calls
│   │   └── context/          ← Auth context
│   └── package.json
└── README.md                  ← Full documentation
```

## Essential Commands

### Backend
```bash
npm run dev      # Development mode
npm start        # Production mode
npm install      # Install dependencies
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
npm install      # Install dependencies
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port in backend .env
PORT=5001
```

### MongoDB Connection Error
```bash
# Start MongoDB (macOS/Linux)
mongod

# Or verify Atlas connection string in .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### CORS Error
1. Backend must have `FRONTEND_URL=http://localhost:5173`
2. Restart backend after changing .env
3. Verify browser console for exact error

### Blank Frontend Page
1. Check browser console (F12)
2. Verify backend is running
3. Clear cache (Ctrl+Shift+Delete)
4. Check VITE_API_URL in frontend .env.local

## API Testing

### Test Backend Health
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{"status":"Server is running"}
```

### Test Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123456"}'
```

## Docker (Optional)

### Run with Docker Compose
```bash
docker-compose up -d
```

### Stop
```bash
docker-compose down
```

## Next Steps

1. **Customize**
   - Change colors in `frontend/tailwind.config.js`
   - Modify UI in `frontend/src/components/`
   - Add your logo

2. **Extend**
   - Add new features
   - Modify task fields
   - Add notifications

3. **Deploy**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Set up MongoDB Atlas
   - Deploy to Railway (backend)
   - Deploy to Vercel (frontend)

4. **Learn More**
   - Read [README.md](./README.md)
   - Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
   - Review [SETUP.md](./SETUP.md)

## Environment Variables Cheat Sheet

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=any-random-string-min-32-chars
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## Feature Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] Create project
- [ ] Create task in project
- [ ] Update task status
- [ ] View dashboard
- [ ] View my tasks
- [ ] Filter tasks
- [ ] See task statistics

## Getting Help

1. **Check Documentation**
   - [README.md](./README.md) - Full overview
   - [SETUP.md](./SETUP.md) - Detailed setup
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

2. **Check Logs**
   - Backend: Terminal logs
   - Frontend: Browser DevTools (F12)
   - Database: MongoDB Atlas dashboard

3. **Common Issues**
   - Port conflict → Change PORT in .env
   - DB connection → Verify MongoDB URI
   - CORS → Update FRONTEND_URL
   - 401 errors → Check JWT_SECRET

## Production Checklist

- [ ] Use strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas (not local)
- [ ] Enable HTTPS
- [ ] Set proper CORS origin
- [ ] Review security settings
- [ ] Set up monitoring
- [ ] Enable backups

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         React Frontend (Vite)           │
│    http://localhost:5173                │
├─────────────────────────────────────────┤
│  Components | Pages | Services | Context│
│         Tailwind CSS Styling            │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               │ Bearer Token Auth
┌──────────────▼──────────────────────────┐
│    Express Backend (Node.js)            │
│    http://localhost:5000/api            │
├─────────────────────────────────────────┤
│  Routes | Controllers | Middleware      │
│   Models | Validators | Utils           │
└──────────────┬──────────────────────────┘
               │ Mongoose ODM
┌──────────────▼──────────────────────────┐
│       MongoDB Database                  │
│  Users | Projects | Tasks Collections   │
└─────────────────────────────────────────┘
```

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI library |
| Styling | Tailwind CSS | CSS framework |
| Build | Vite | Fast bundler |
| Routing | React Router | Page routing |
| API | Axios | HTTP client |
| Backend | Express | Web framework |
| Database | MongoDB | NoSQL database |
| Auth | JWT | Token auth |
| Validation | express-validator | Input validation |
| Hashing | bcryptjs | Password security |

## Quick Reference

### Default Credentials (after registration)
```
Email: test@example.com
Password: test123456
```

### Roles
- **Admin**: Full access (manual assignment)
- **Member**: Limited access (default)

### Task Statuses
- todo
- in-progress
- completed

### Priority Levels
- low
- medium
- high

### API Base URL
- Dev: `http://localhost:5000/api`
- Prod: `https://your-domain.com/api`

## Time Estimates

- **Setup**: ~5 minutes
- **First test**: ~2 minutes
- **First project**: ~3 minutes
- **Full feature test**: ~10 minutes
- **Deployment**: ~20 minutes

---

Ready to get started? Run the 30-second setup above and visit http://localhost:5173!

For detailed information, see [README.md](./README.md)
