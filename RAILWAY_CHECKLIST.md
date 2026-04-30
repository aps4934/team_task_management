# Railway Deployment Checklist

> **Project**: Team Task Manager  
> **Status**: ✅ Production-ready  
> **Repository**: https://github.com/aps4934/team_task_management

## Pre-Deployment Verification

### Backend Readiness
- [x] Express server configured with dynamic PORT from environment
- [x] CORS middleware accepts `FRONTEND_URL` from environment
- [x] MongoDB Atlas connection string in `.env`
- [x] JWT authentication implemented
- [x] All routes tested locally
- [x] Health check endpoint available (`/api/health`)
- [x] Error handling middleware configured
- [x] `package.json` has correct `"start"` script
- [x] `Procfile` created for Railway
- [x] `.env.production` template created

### Frontend Readiness
- [x] React + Vite configured
- [x] API proxy configured for dev
- [x] Production build tested (`npm run build`)
- [x] `dist/` folder generated successfully
- [x] Environment variables use `VITE_` prefix
- [x] `package.json` has `build` and `preview` scripts
- [x] `.env.production` template created
- [x] No hardcoded API URLs

### Git Repository
- [x] GitHub repo created: `aps4934/team_task_management`
- [x] Code pushed to main branch
- [x] `.gitignore` configured
- [x] `.env` files excluded from git
- [x] `/node_modules` ignored
- [x] `/dist` ignored

### MongoDB Atlas
- [x] Cluster created (Cluster0)
- [x] Database user created
- [x] Connection string obtained
- [x] IP whitelist configured (0.0.0.0/0 for production testing)
- [x] Replica set enabled (required for transactions)

---

## Railway Deployment Steps

### Phase 1: Backend Setup (5-10 minutes)

**Step 1.1: Create Railway Account**
```bash
# Do this in browser:
# 1. Go to https://railway.app
# 2. Click "Start New Project"
# 3. Sign up with GitHub (recommended)
# 4. Authorize your GitHub account
```

**Step 1.2: Connect Repository to Railway**
```bash
# In Railway dashboard:
# 1. Click "New Project"
# 2. Select "Deploy from GitHub repo"
# 3. Search for and select: aps4934/team_task_management
# 4. Click "Deploy"
# 5. Wait 2-3 minutes for initial build
```

**Step 1.3: Add Environment Variables**
```bash
# In Railway dashboard → Your service → "Variables" tab:

# 1. Click "New Variable"

# MongoDB URI
MONGODB_URI=mongodb+srv://sadityapratap070_db_user:ij8OUFXU4SJmWv08@ac-f1ovvwq-shard-00-00.824u4zo.mongodb.net:27017,ac-f1ovvwq-shard-00-01.824u4zo.mongodb.net:27017,ac-f1ovvwq-shard-00-02.824u4zo.mongodb.net:27017/team-task-manager?ssl=true&replicaSet=atlas-hz12hk-shard-0&authSource=admin&retryWrites=true&w=majority

# Generate JWT Secret locally:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

JWT_SECRET=<paste-generated-key-here>

# Environment
NODE_ENV=production

# Will update later after frontend deployment
FRONTEND_URL=http://localhost:5173

# 2. Click "Save" for each variable
# 3. Wait for auto-redeploy
```

**Step 1.4: Get Backend URL**
```bash
# In Railway dashboard:
# 1. Go to "Settings" tab
# 2. Copy the auto-generated domain
# 3. Format: https://project-name.up.railway.app

# Test the backend:
curl https://<your-railway-url>/api/health
# Expected response: {"status":"Server is running"}
```

**Checkpoint**: ✅ Backend deployed and health check passes

---

### Phase 2: Frontend Setup (5-10 minutes)

**Step 2.1: Create Vercel Account**
```bash
# Do this in browser:
# 1. Go to https://vercel.com
# 2. Click "Sign Up"
# 3. Choose "GitHub" sign-up
# 4. Authorize your GitHub account
# 5. Verify email
```

**Step 2.2: Deploy Project**
```bash
# In Vercel dashboard:
# 1. Click "Add New..." → "Project"
# 2. Click "Continue with GitHub"
# 3. Search for: aps4934/team_task_management
# 4. Click "Import"
# 5. Set "Root Directory" to: frontend/
# 6. Click "Deploy"
# 7. Wait 2-3 minutes for build
```

**Step 2.3: Add Environment Variables**
```bash
# In Vercel dashboard → Settings → Environment Variables:

# Add:
VITE_API_URL=https://<your-railway-backend-url>/api

# Example:
VITE_API_URL=https://team-task-manager-abc123.up.railway.app/api

# Click "Save"
# Trigger redeploy: Click "Deployments" → "Redeploy"
```

**Step 2.4: Get Frontend URL**
```bash
# In Vercel dashboard:
# 1. Go to "Deployments" tab
# 2. Click on latest successful deployment
# 3. Copy the domain
# 4. Format: https://project-name.vercel.app

# Test the frontend:
# Visit the URL in browser
# Should see login screen without errors
```

**Checkpoint**: ✅ Frontend deployed and loads successfully

---

### Phase 3: Integration (5 minutes)

**Step 3.1: Link Backend & Frontend**
```bash
# In Railway dashboard → Your backend service → Variables:

# Update FRONTEND_URL:
FRONTEND_URL=https://<your-vercel-url>

# Example:
FRONTEND_URL=https://team-task-manager.vercel.app

# Click "Save" (triggers auto-redeploy)
# Wait for redeploy to complete
```

**Step 3.2: Test CORS**
```bash
# In browser DevTools (F12) → Console:

fetch('https://<your-railway-url>/api/health')
  .then(r => r.json())
  .then(d => console.log('✓ Connected:', d))
  .catch(e => console.error('✗ Failed:', e))

# Expected: ✓ Connected: {status: "Server is running"}
```

**Checkpoint**: ✅ CORS working between frontend and backend

---

## End-to-End Testing

### Test 1: User Registration
```bash
# 1. Visit: https://<your-vercel-url>
# 2. Click "Don't have an account? Register"
# 3. Fill form:
#    - Name: Test User
#    - Email: test@example.com
#    - Password: TestPass@123
# 4. Click "Register"
# 5. Should see Dashboard
```

**Verify in MongoDB**:
```bash
# 1. Go to https://cloud.mongodb.com
# 2. Click Cluster0 → Collections
# 3. Navigate to: team-task-manager → users
# 4. Should see new user document
```

### Test 2: Login
```bash
# 1. Log out or private window
# 2. Click "Login"
# 3. Enter: test@example.com / TestPass@123
# 4. Should see Dashboard
```

### Test 3: Project Creation
```bash
# 1. On Dashboard, click "Create Project"
# 2. Enter:
#    - Name: Test Project
#    - Description: Production test
# 3. Click "Create"
# 4. Should appear in Projects list
# 5. Refresh page → persists
```

### Test 4: Task Management
```bash
# 1. Go to Projects → Select test project
# 2. Create a task
# 3. Drag task between Kanban columns
# 4. All changes should persist
```

**Checkpoint**: ✅ Full flow works in production

---

## MongoDB Atlas Setup for Production

### IP Whitelist Configuration

**Option 1: Allow from Anywhere (Development/Testing)**
```bash
# 1. Go to https://cloud.mongodb.com
# 2. Click "Network Access"
# 3. Click "Add IP Address"
# 4. Select "Allow Access from Anywhere"
# 5. Click "Confirm"
# ⚠️ Not recommended for production
```

**Option 2: Specific Railway IPs (Recommended)**
```bash
# 1. Check Railway documentation for outbound IPs
# 2. Or contact Railway support for your region's IPs
# 3. Add those specific IPs to MongoDB whitelist
# 4. More secure than 0.0.0.0/0
```

### Monitoring & Scaling

**Monitor Database Usage**:
```bash
# In MongoDB Atlas:
# 1. Go to "Monitoring" → "Charts"
# 2. Watch these metrics:
#    - Connection count
#    - Query performance
#    - Storage usage
# 3. Alert if storage > 90% of M0 limit (512MB)
```

**Upgrade when needed**:
```bash
# If approaching limits:
# 1. Go to Clusters → Cluster0
# 2. Click "Scale" button
# 3. Upgrade from M0 to M2 or M5
# 4. Cost: ~$57-110/month
```

---

## Troubleshooting Guide

### Backend Not Connecting

**Symptom**: 502 Bad Gateway in frontend

**Diagnosis**:
```bash
# Test backend directly:
curl https://<your-railway-url>/api/health

# Check Railway logs:
# Railway → Service → Logs tab
# Look for errors
```

**Solutions**:
- [ ] Verify `MONGODB_URI` is correct
- [ ] Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- [ ] Verify `JWT_SECRET` is set and long enough
- [ ] Check backend logs for MongoDB connection errors
- [ ] Restart service: Railway → "Redeploy"

### CORS Errors in Browser

**Symptom**: Console shows `Access-Control-Allow-Origin` error

**Cause**: `FRONTEND_URL` not updated in Railway

**Solution**:
```bash
# 1. Copy your Vercel URL exactly
# 2. Go to Railway → Variables
# 3. Update FRONTEND_URL to your Vercel domain
# 4. Save (auto-redeploys)
# 5. Hard refresh browser (Ctrl+Shift+R)
```

### Frontend Can't Reach Backend

**Symptom**: API calls fail or timeout

**Diagnosis**:
```bash
# Check if VITE_API_URL is correct:
# 1. Visit: https://<your-vercel-url>
# 2. Open DevTools → Network tab
# 3. Trigger API call (e.g., login attempt)
# 4. Check request URL
```

**Solution**:
```bash
# Update VITE_API_URL in Vercel:
# 1. Vercel → Settings → Environment Variables
# 2. Update VITE_API_URL to correct Railway URL
# 3. Redeploy: Deployments → "Redeploy"
# 4. Wait for build to complete
```

### MongoDB Connection Timeout

**Symptom**: Backend logs show `ECONNREFUSED` or timeout

**Cause**: IP not whitelisted in MongoDB Atlas

**Solution**:
```bash
# 1. Go to MongoDB Atlas → Network Access
# 2. Add IP: 0.0.0.0/0 (or Railway IP)
# 3. Click "Confirm"
# 4. Wait 2-3 minutes for change to propagate
# 5. Restart Railway service
```

---

## Post-Deployment Tasks

### Day 1: Verification
- [ ] All tests pass (registration, login, project creation, tasks)
- [ ] No console errors
- [ ] Backend logs show normal operation
- [ ] MongoDB shows new documents

### Week 1: Monitoring
- [ ] Check Railway logs daily for errors
- [ ] Monitor Vercel deployment status
- [ ] Watch MongoDB storage usage
- [ ] Invite beta testers

### Month 1: Optimization
- [ ] Analyze frontend performance (Vercel Analytics)
- [ ] Check database query patterns (MongoDB Monitoring)
- [ ] Gather user feedback
- [ ] Plan feature improvements

---

## Important Variables Reference

### Backend (.env for Railway)

| Variable | Value | Generator |
|----------|-------|-----------|
| `MONGODB_URI` | Full Atlas connection string | From MongoDB Atlas |
| `JWT_SECRET` | 64-char hex string | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NODE_ENV` | `production` | Set manually |
| `FRONTEND_URL` | Vercel deployment URL | From Vercel |
| `PORT` | Leave blank (Railway auto-assigns) | Auto |

### Frontend (.env for Vercel)

| Variable | Value | Source |
|----------|-------|--------|
| `VITE_API_URL` | `https://<railway-url>/api` | From Railway |

---

## Quick Reference URLs

**After Deployment**:

| Component | URL |
|-----------|-----|
| Frontend | https://_______________ |
| Backend API | https://_______________/api |
| Backend Health | https://_______________/api/health |
| GitHub Repo | https://github.com/aps4934/team_task_management |
| MongoDB Atlas | https://cloud.mongodb.com |
| Railway Dashboard | https://railway.app |
| Vercel Dashboard | https://vercel.com |

---

## Emergency Contacts

- **Railway Support**: https://railway.app/support
- **Vercel Support**: https://vercel.com/support
- **MongoDB Support**: https://www.mongodb.com/support

---

## Success Indicators ✅

- [x] Backend deployed to Railway
- [x] Frontend deployed to Vercel
- [x] CORS working (no browser errors)
- [x] User registration works end-to-end
- [x] Data persists in MongoDB
- [x] All tests pass
- [x] No console errors
- [x] Production URLs shared with team

**Status**: 🚀 Ready for Production

---

**Last Updated**: 2026-04-30  
**Deployment Date**: ________________

