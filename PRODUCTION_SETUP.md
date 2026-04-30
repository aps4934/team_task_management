# Production Deployment Setup

This document provides detailed steps for deploying Team Task Manager to production using Railway, Vercel, and MongoDB Atlas.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Stack                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐     ┌──────────────────┐            │
│  │   Vercel/        │     │   Railway        │            │
│  │   Netlify        │────▶│   Backend        │            │
│  │   (React SPA)    │     │   (Express)      │            │
│  └──────────────────┘     └────────┬─────────┘            │
│         5173                       │                       │
│                                    │                       │
│                           ┌────────▼──────────┐            │
│                           │  MongoDB Atlas    │            │
│                           │  (Replica Set)    │            │
│                           └───────────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Quick Deployment Timeline

- **Total Time**: ~20 minutes
- **Backend**: 2-3 minutes (auto-deploy)
- **Frontend**: 5-10 minutes (build + deploy)
- **Integration**: 5-7 minutes (testing)

---

## Step 1: Prepare MongoDB Atlas (Already Done ✓)

Your MongoDB Atlas connection is pre-configured with:
- **Cluster**: Cluster0 (3-shard replica set)
- **Database**: team-task-manager
- **User**: sadityapratap070_db_user
- **IP Whitelist**: Configure in production

### Verify MongoDB Connection

```bash
# From backend directory
node -e "
import('mongoose').then(async (m) => {
  const uri = 'mongodb+srv://sadityapratap070_db_user:ij8OUFXU4SJmWv08@ac-f1ovvwq-shard-00-00.824u4zo.mongodb.net:27017,...';
  await m.default.connect(uri);
  console.log('✓ MongoDB connected successfully');
  process.exit(0);
});
"
```

---

## Step 2: Generate Production JWT Secret

```bash
# Run this command to generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# 7f3c2b9e1a4d6f8c0b5e2a7d9f1c4b6e8a2d5f7c9b1e3a5d7f0c2b4e6a8d
```

**Store this securely** - you'll need it for Railway.

---

## Step 3: Deploy Backend to Railway

### 3.1 Create Railway Account

1. Go to [Railway.app](https://railway.app)
2. Click **"Start New Project"**
3. Sign up with GitHub (recommended)

### 3.2 Connect to GitHub Repository

1. Click **"Create New Project"** or **"New"**
2. Select **"Deploy from GitHub repo"**
3. Search for and select: **`aps4934/team_task_management`**
4. Select the repository
5. Railway auto-detects Node.js - click **"Deploy"**

### 3.3 Configure Environment Variables

1. Go to your Railway project dashboard
2. Click on the service (should be named after your repo)
3. Click **"Variables"** tab on the right
4. Click **"New Variable"** and add these:

| Name | Value | 
|------|-------|
| `MONGODB_URI` | `mongodb+srv://sadityapratap070_db_user:ij8OUFXU4SJmWv08@ac-f1ovvwq-shard-00-00.824u4zo.mongodb.net:27017,ac-f1ovvwq-shard-00-01.824u4zo.mongodb.net:27017,ac-f1ovvwq-shard-00-02.824u4zo.mongodb.net:27017/team-task-manager?ssl=true&replicaSet=atlas-hz12hk-shard-0&authSource=admin&retryWrites=true&w=majority` |
| `JWT_SECRET` | (paste the generated key from Step 2) |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

5. After adding all variables, click **"Save"** (auto-redeploys)

### 3.4 Get Your Backend URL

1. Go to **"Settings"** tab
2. Under **"Domains"**, copy the auto-generated URL
3. Format: `https://<project-name>.up.railway.app`

**Test Backend**:
```bash
curl https://<your-backend-url>/api/health
# Should return: {"status":"Server is running"}
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Sign Up for Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"GitHub"** sign-up
4. Authorize and verify email

### 4.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Click **"Continue with GitHub"**
3. Search for and select: **`aps4934/team_task_management`**
4. Click **"Import"**

### 4.3 Configure Project

1. **Root Directory**: Set to `frontend/` (if not auto-detected)
2. **Framework**: Should show "Vite"
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### 4.4 Add Environment Variables

1. Under **"Environment Variables"**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://<your-railway-backend-url>/api` (e.g., `https://team-task-manager-abc123.up.railway.app/api`)
   - Click **"Add"**

2. Click **"Deploy"**

### 4.5 Wait for Deployment

- Vercel builds and deploys automatically
- Build takes ~2-3 minutes
- You'll get a production URL: `https://<project>.vercel.app`

**Test Frontend**:
- Visit `https://<your-frontend-url>`
- Should see login screen
- No console errors

---

## Step 5: Link Backend & Frontend

### 5.1 Update Backend CORS

1. Go back to Railway dashboard
2. Click your backend service
3. Click **"Variables"**
4. Add new variable:
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://<your-vercel-url>` (e.g., `https://team-task-manager.vercel.app`)
5. Click **"Save"** (auto-redeploys backend)

### 5.2 Verify CORS Works

1. Open your frontend: `https://<your-vercel-url>`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Paste:
   ```javascript
   fetch('https://<your-railway-url>/api/health')
     .then(r => r.json())
     .then(d => console.log('✓ Backend connected:', d))
     .catch(e => console.error('✗ Backend error:', e))
   ```
5. Should see: `✓ Backend connected: {status: "Server is running"}`

---

## Step 6: End-to-End Testing

### 6.1 Test User Registration

1. Visit your frontend URL
2. Click **"Don't have an account? Register"**
3. Fill out:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: TestPass@123
   - **Confirm**: TestPass@123
4. Click **"Register"**
5. Should redirect to Dashboard

### 6.2 Verify Database Entry

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click your cluster → **"Collections"**
3. Navigate to: `team-task-manager` → `users`
4. Should see your test user entry

### 6.3 Test Login

1. Log out or open private/incognito window
2. Click **"Login"**
3. Enter: test@example.com / TestPass@123
4. Should redirect to Dashboard

### 6.4 Test Project Creation

1. On Dashboard, click **"Create Project"** button
2. Enter:
   - **Name**: My Test Project
   - **Description**: Testing production deployment
3. Click **"Create"**
4. Should see project appear in Projects list
5. Refresh page → Project should persist

### 6.5 Test Task Management

1. Go to Projects → Select your test project
2. Click **"Add Task"** or go to project board
3. Create a task
4. Try dragging task between Kanban columns
5. All changes should persist

---

## MongoDB Atlas Production Setup

### Security: Whitelist Railway IPs

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Network Access"**
3. Click **"Add IP Address"**
4. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For maximum security, get Railway's specific IP range
5. Click **"Confirm"**

**Alternatively**, if Railway provides static IPs, use those instead.

### Monitor Database

1. Go to **"Monitoring"** → **"Charts"**
2. Watch for:
   - Connection count
   - Query performance
   - Storage usage
3. Alert thresholds:
   - Storage > 90%: Plan upgrade
   - Connections > 100: Plan upgrade
   - Latency > 500ms: Investigate indexes

---

## Troubleshooting

### Issue: "502 Bad Gateway" in Vercel

**Symptom**: Frontend loads, but API calls fail

**Diagnosis**:
```bash
curl https://<your-railway-url>/api/health
```
If returns error, backend is down.

**Fix**:
1. Go to Railway dashboard
2. Click service → **"Logs"**
3. Look for errors (e.g., MongoDB connection failed)
4. Check `MONGODB_URI` variable is correct
5. Check MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Issue: CORS Errors in Console

**Symptom**: Console shows `Access-Control-Allow-Origin` error

**Cause**: Backend `FRONTEND_URL` not set correctly

**Fix**:
1. Copy your Vercel URL exactly
2. Go to Railway → Variables
3. Update `FRONTEND_URL` to match (including `https://`, without trailing slash)
4. Wait for auto-redeploy
5. Hard refresh Vercel frontend (Ctrl+Shift+R)

### Issue: "Cannot POST /api/auth/register"

**Symptom**: Registration fails with 404

**Cause**: Backend routes not loaded or wrong port

**Fix**:
1. Test backend health: `curl https://<your-railway-url>/api/health`
2. If fails, check Railway logs for startup errors
3. Verify all environment variables are set
4. Restart service: Railway → **"Redeploy"**

### Issue: "Incorrect username or password" (always fails)

**Symptom**: Login fails even with correct credentials

**Cause**: Password not hashing correctly, or wrong JWT_SECRET

**Fix**:
1. Create new test user (registration)
2. Verify new user appears in MongoDB Atlas
3. If still fails, JWT_SECRET might be wrong
4. Generate new secret and update Railway

### Issue: MongoDB Connection Timeout

**Symptom**: Backend logs show `ECONNREFUSED` or timeout

**Cause**: MongoDB Atlas IP not whitelisted or wrong URI

**Fix**:
1. Go to MongoDB Atlas → **"Network Access"**
2. Verify 0.0.0.0/0 is whitelisted (or Railway IP added)
3. Test connection string locally first
4. Verify `MONGODB_URI` format is correct (check Atlas for exact string)

---

## Performance Optimization

### Frontend (Vercel)

- ✓ Already optimized (Vite tree-shaking)
- ✓ Automatic image optimization
- ✓ Edge CDN distribution
- **Next**: Monitor Core Web Vitals in Vercel dashboard

### Backend (Railway)

- Start with: Free tier (~$5/month)
- Monitor: CPU, memory, bandwidth usage
- Upgrade if: >80% CPU usage consistently

### Database (MongoDB)

- Current: Free tier (M0, 512MB storage)
- Monitor: Storage usage, query count
- Upgrade when: Approaching 512MB limit

---

## Deployment Checklist

```
□ Generated JWT_SECRET using crypto.randomBytes(32)
□ Created Railway account
□ Deployed backend to Railway
□ Set all environment variables:
  □ MONGODB_URI
  □ JWT_SECRET
  □ NODE_ENV=production
  □ PORT=3000
□ Backend health check passes (/api/health)
□ Got backend URL from Railway
□ Created Vercel account
□ Deployed frontend to Vercel
□ Set VITE_API_URL in Vercel
□ Updated Railway FRONTEND_URL variable
□ CORS test passes in browser console
□ Test user registration works
□ Test user appears in MongoDB Atlas
□ Test login works
□ Test project creation works
□ Test task management works
□ No console errors on frontend
□ Backend logs show normal operation
□ MongoDB Atlas shows increased connection/query activity
```

---

## Monitoring & Alerts

### Daily Checks

1. **Railway**: Click service → **"Logs"** → check for errors
2. **Vercel**: Check **"Analytics"** dashboard
3. **MongoDB**: Atlas → **"Monitoring"** → verify healthy

### Set Up Alerts

**Railway**:
- Go to project settings
- Enable email notifications for deployment failures

**MongoDB**:
- Atlas → **"Alerts"** → set thresholds for storage/performance

---

## Disaster Recovery

### If Backend Crashes

1. Railway auto-restarts failed services
2. If persistent:
   - Click service → **"Redeploy"**
   - Or push new commit to main branch

### If Frontend Build Fails

1. Vercel shows build logs
2. Common issues:
   - Invalid `VITE_API_URL` format
   - Missing npm packages
   - TypeScript/Lint errors
3. Fix code → push → auto-redeploys

### If MongoDB Data Corrupted

1. MongoDB Atlas → **"Backup"**
2. Restore to earlier snapshot
3. Data loss: minimal (daily backups)

---

## Next Steps After Deployment

1. **Share Your App**
   - Give friends/family your Vercel URL
   - Collect feedback

2. **Custom Domain** (Optional)
   - Vercel: **"Settings"** → **"Domains"** → add custom domain
   - Railway: **"Settings"** → **"Domain"** → add custom domain
   - Cost: ~$10/year for domain

3. **Analytics** (Optional)
   - Vercel: Automatic with analytics dashboard
   - MongoDB: Built-in monitoring

4. **Scale**
   - If traffic grows: upgrade Railway/MongoDB tiers
   - Monitor metrics regularly

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.mongodb.com/atlas
- **Express.js Docs**: https://expressjs.com
- **React Docs**: https://react.dev

---

## Production URLs (Template)

Fill in after deployment:

| Service | URL |
|---------|-----|
| Frontend | https://_________________ |
| Backend API | https://_________________ |
| MongoDB | Managed by Railway environment variable |

---

**Deployment Date**: ________________

**Last Updated**: ________________

