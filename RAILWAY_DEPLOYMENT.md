# Railway Deployment Guide - Quick Start

> **Status**: Production-ready. MongoDB Atlas configured. CORS set up for both local and production URLs.

## Prerequisites

- GitHub repository connected: https://github.com/aps4934/team_task_management
- MongoDB Atlas account with connection string
- Railway account (free tier available)
- Vercel or Netlify account for frontend

---

## Part 1: Backend Deployment (Railway)

### Step 1: Connect Repository to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select **`aps4934/team_task_management`**
5. Railway auto-detects Node.js and uses `npm start` from package.json

### Step 2: Add Environment Variables

Navigate to your Railway project → Click **"Variables"** tab → Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://sadityapratap070_db_user:ij8OUFXU4SJmWv08@ac-f1ovvwq-shard-00-00.824u4zo.mongodb.net:27017,...` | Copy from your MongoDB Atlas |
| `JWT_SECRET` | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | **Keep this secret!** |
| `NODE_ENV` | `production` | Required for Express optimization |
| `FRONTEND_URL` | Will update after frontend deploy | Initially use Vercel/Netlify preview URL |
| `PORT` | Leave blank (Railway assigns automatically) | Or set to 3000 |

**To generate JWT_SECRET locally:**
```bash
cd backend
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Deploy Backend

1. Railway auto-deploys when you push to `main` branch
2. To manually trigger: Click **"Deploy"** button in dashboard
3. Monitor logs: Click service → **"Logs"** tab

**Once deployed:**
- Your backend URL will be: `https://<service-name>.up.railway.app`
- Test with: `curl https://<service-name>.up.railway.app/api/health`
- Should return: `{"status":"Server is running"}`

### Step 4: MongoDB Atlas Network Setup

⚠️ **Important**: MongoDB Atlas must allow Railway's outbound IPs

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Network Access"**
3. Click **"Add IP Address"**
4. Choose **"Allow Access from Anywhere"** (0.0.0.0/0) for testing
   - For production, use specific Railway IP ranges (if available)
5. Click **"Confirm"**

**Note**: Already done in development setup

---

## Part 2: Frontend Deployment (Vercel Recommended)

### Option A: Vercel (Recommended - Faster)

#### Step 1: Import Project

1. Go to [Vercel](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Select **`aps4934/team_task_management`**
4. Click **"Import"**

#### Step 2: Configure Root Directory

1. Go to **"Settings"** → **"Root Directory"**
2. Set to `frontend/` (if needed)
3. Click **"Save"**

#### Step 3: Add Environment Variables

1. Go to **"Settings"** → **"Environment Variables"**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://<your-railway-backend-url>/api` (e.g., `https://team-task-manager.up.railway.app/api`)
3. Click **"Save and Deploy"**

#### Step 4: Deploy

1. Vercel auto-deploys on git push
2. Or click **"Redeploy"** in dashboard
3. Your frontend URL: `https://<project-name>.vercel.app`

### Option B: Netlify (Alternative)

#### Step 1: Connect Repository

1. Go to [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select GitHub, then choose `aps4934/team_task_management`

#### Step 2: Configure Build Settings

1. **Build command**: `npm run build` (from frontend directory)
2. **Publish directory**: `frontend/dist`
3. **Root directory**: `frontend/`

#### Step 3: Add Environment Variables

1. Go to **"Site settings"** → **"Build & deploy"** → **"Environment"**
2. Click **"Edit variables"**
3. Add:
   - `VITE_API_URL` = `https://<your-railway-backend-url>/api`
4. Click **"Save"**

#### Step 4: Deploy

1. Click **"Deploy site"**
2. Wait for build completion
3. Your frontend URL: `https://<site-name>.netlify.app`

---

## Part 3: Connect Frontend to Backend

After both are deployed:

### Step 1: Update Backend CORS

1. Go to Railway → Your backend service
2. Click **"Variables"**
3. Update `FRONTEND_URL` with your Vercel/Netlify URL (e.g., `https://team-task-manager.vercel.app`)
4. Click **"Save"** (auto-triggers redeploy)

### Step 2: Verify CORS

In browser console:
```javascript
// Should work without CORS errors
fetch('https://<your-railway-backend>/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## Part 4: Testing Production

### Test Authentication Flow

1. Visit your frontend URL
2. Click **"Register"**
3. Create a test account:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "Test@123"
4. Should redirect to Dashboard
5. Verify MongoDB stores data (check Atlas dashboard)

### Test Project Creation

1. On Dashboard, click **"Create Project"**
2. Enter project details
3. Should save to MongoDB
4. Refresh page → Data persists

### Test Task Management

1. Go to Projects → Select a project
2. Create a task
3. Drag task between Kanban columns
4. Should persist across page refreshes

---

## Troubleshooting

### Issue: 502 Bad Gateway

**Cause**: Backend not running or crashed

**Fix**:
1. Check Railway logs: Service → **"Logs"**
2. Look for `MONGODB_URI` connection errors
3. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Issue: CORS Errors in Console

**Cause**: `FRONTEND_URL` not updated in Railway backend variables

**Fix**:
1. Copy your Vercel/Netlify URL
2. Update `FRONTEND_URL` in Railway Variables
3. Trigger redeploy

### Issue: Frontend Can't Reach Backend

**Cause**: `VITE_API_URL` is incorrect

**Fix**:
1. Verify backend URL: `curl https://<your-backend-url>/api/health`
2. Update frontend environment variable in Vercel/Netlify
3. Redeploy frontend

### Issue: MongoDB Connection Timeout

**Cause**: Network access not whitelisted

**Fix**:
1. Go to MongoDB Atlas → **"Network Access"**
2. Add IP `0.0.0.0/0` (allow from anywhere)
3. Or add Railway's specific IP range

---

## Environment Variables Reference

### Backend (.env for Railway)
```env
MONGODB_URI=mongodb+srv://sadityapratap070_db_user:ij8OUFXU4SJmWv08@ac-f1ovvwq-shard-00-00.824u4zo.mongodb.net:27017,ac-f1ovvwq-shard-00-01.824u4zo.mongodb.net:27017,ac-f1ovvwq-shard-00-02.824u4zo.mongodb.net:27017/team-task-manager?ssl=true&replicaSet=atlas-hz12hk-shard-0&authSource=admin&retryWrites=true&w=majority
JWT_SECRET=<generate-with-crypto-randomBytes>
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
PORT=3000
```

### Frontend (.env.production for Vercel/Netlify)
```env
VITE_API_URL=https://your-railway-backend.up.railway.app/api
VITE_ENV=production
VITE_APP_NAME=Team Task Manager
```

---

## Deployment Checklist

- [ ] MongoDB Atlas configured with IP whitelist (0.0.0.0/0 or Railway IPs)
- [ ] JWT_SECRET generated and stored in Railway Variables
- [ ] Backend deployed to Railway with all environment variables set
- [ ] Backend health check passes: `/api/health` returns `{"status":"Server is running"}`
- [ ] Frontend deployed to Vercel/Netlify
- [ ] `VITE_API_URL` points to Railway backend URL
- [ ] Backend `FRONTEND_URL` updated with Vercel/Netlify URL
- [ ] Test registration works end-to-end
- [ ] Test project/task creation persists
- [ ] No CORS errors in browser console
- [ ] MongoDB documents appear in Atlas after user registration

---

## Monitoring & Maintenance

### Monitor Backend (Railway)

1. Go to Service → **"Logs"**
2. Watch for errors during user actions
3. Check memory/CPU usage

### Monitor Frontend (Vercel)

1. Go to **"Deployments"**
2. Click latest deployment
3. View build and analytics logs

### Monitor Database (MongoDB)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Monitoring"** → **"Charts"**
3. Watch for slow queries or connection spikes

---

## Scaling & Performance

### Backend (Railway)
- Current: Free tier with shared resources
- To upgrade: Click service → **"Plan"** → upgrade tier
- Monitor CPU/memory: if >80% consistently, upgrade

### Frontend (Vercel)
- Static build deployed on Edge CDN (automatic)
- No scaling needed for most use cases

### Database (MongoDB)
- Current: Free tier (M0 shared cluster)
- To upgrade: Atlas → **"Cluster"** → **"Scale to Dedicated"**
- Enable auto-scaling for production traffic

---

## Next Steps

1. **Push to GitHub**: `git push origin main`
2. **Deploy Backend**: Railway auto-deploys from git
3. **Deploy Frontend**: Vercel/Netlify auto-deploys from git
4. **Verify**: Test full flow from user registration to task management
5. **Share**: Your app is now live! 🚀

**Production URLs**:
- Frontend: https://your-app.vercel.app
- Backend API: https://your-service.up.railway.app/api
- MongoDB: Secure connection through Railway environment variables

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.mongodb.com/atlas

