# 🚀 Railway Deployment - Step by Step

> **Quick version of deployment steps**

---

## Phase 1: Create Railway Account (2 minutes)

1. Go to **https://railway.app**
2. Click **"Start New Project"**
3. Click **"Sign Up"** (or Login if you have account)
4. Choose **"GitHub"** signup (recommended)
5. Authorize Railway to access your GitHub
6. Verify email

✅ **Done** - You now have a Railway account

---

## Phase 2: Deploy Backend (5 minutes)

### Step 1: Create Project
1. In Railway dashboard, click **"New Project"** or **"+"** button
2. Select **"Deploy from GitHub repo"**
3. Search for and select: **`aps4934/team_task_management`**
4. Click **"Deploy"**
5. **Wait 2-3 minutes** for initial build (watch the logs)

### Step 2: Check Service Created
- You should see a service created (may be named after your repo)
- Status should show "Building" then "Success"
- Once green/running, move to Step 3

### Step 3: Add Environment Variables
1. Click on your **backend service**
2. Go to **"Variables"** tab (on the right side)
3. Add each variable by clicking **"New Variable"**:

**Variable 1: MONGODB_URI**
- **Name**: `MONGODB_URI`
- **Value**: 
  ```
  mongodb+srv://sadityapratap070_db_user:ij8OUFXU4SJmWv08@ac-f1ovvwq-shard-00-00.824u4zo.mongodb.net:27017,ac-f1ovvwq-shard-00-01.824u4zo.mongodb.net:27017,ac-f1ovvwq-shard-00-02.824u4zo.mongodb.net:27017/team-task-manager?ssl=true&replicaSet=atlas-hz12hk-shard-0&authSource=admin&retryWrites=true&w=majority
  ```
- Click **"Save"**

**Variable 2: JWT_SECRET**
- **Name**: `JWT_SECRET`
- **Value**: Generate a secure key by running this locally:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  - Copy the output (64-character hex string)
- **Paste** it as the value
- Click **"Save"**

**Variable 3: NODE_ENV**
- **Name**: `NODE_ENV`
- **Value**: `production`
- Click **"Save"**

**Variable 4: PORT**
- **Name**: `PORT`
- **Value**: `3000`
- Click **"Save"**

**Variable 5: FRONTEND_URL** (temporary)
- **Name**: `FRONTEND_URL`
- **Value**: `http://localhost:5173` (will update later)
- Click **"Save"**

### Step 4: Wait for Auto-Redeploy
- Railway **automatically redeploys** after you add variables
- Wait 1-2 minutes for it to restart
- Check logs to see if MongoDB connects successfully
- Look for message like: `MongoDB Connected: ac-f1ovvwq-shard...`

### Step 5: Get Your Backend URL
1. Go to **"Settings"** tab
2. Under **"Domains"**, copy the auto-generated URL
3. Format: `https://<project-name>.up.railway.app`
4. **Save this URL** - you'll need it for frontend

### Step 6: Test Backend
```bash
# In your terminal, run:
curl https://<your-railway-url>/api/health

# Should return:
# {"status":"Server is running"}
```

✅ **Backend is deployed!**

---

## Phase 3: Deploy Frontend (5 minutes)

### Step 1: Create Vercel Account
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"GitHub"** signup
4. Authorize and verify email

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Click **"Continue with GitHub"**
3. Search for: **`aps4934/team_task_management`**
4. Click **"Import"**

### Step 3: Configure Project
1. You should see import settings:
   - **Root Directory**: Set to `frontend/` (if not auto-detected)
   - **Framework**: Should show "Vite"
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
2. Click **"Deploy"** button

### Step 4: Wait for Deployment
- Vercel builds and deploys automatically
- You'll see build progress in the terminal output
- Build takes 2-3 minutes
- Once complete (green checkmark), move to Step 5

### Step 5: Get Your Frontend URL
1. Once deployment completes, you'll see a **domain URL**
2. Format: `https://<project-name>.vercel.app`
3. Click the URL to visit your app
4. **Save this URL** - you'll need it for backend

### Step 6: Add Environment Variable to Vercel
1. Go to **"Settings"** tab
2. Go to **"Environment Variables"**
3. Click **"Add New"**
4. Set:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://<your-railway-url>/api`
   - Example: `https://team-task-manager-abc.up.railway.app/api`
5. Click **"Save"**

### Step 7: Redeploy Frontend
1. Go to **"Deployments"** tab
2. Find your latest deployment
3. Click **"..."** menu → **"Redeploy"**
4. Wait for rebuild (2-3 minutes)

✅ **Frontend is deployed!**

---

## Phase 4: Link Backend & Frontend (2 minutes)

### Step 1: Update Backend CORS
1. Go back to **Railway dashboard**
2. Click your **backend service**
3. Go to **"Variables"** tab
4. Find **`FRONTEND_URL`** variable
5. Update the value to your **Vercel URL** (e.g., `https://team-task-manager.vercel.app`)
   - ⚠️ NO trailing slash
   - ⚠️ Include `https://`
6. Click **"Save"**

### Step 2: Wait for Redeploy
- Railway auto-redeploys
- Wait 1-2 minutes
- Check logs for successful restart

### Step 3: Test CORS
1. Open your **Vercel frontend URL** in browser
2. Open **Developer Tools** (F12)
3. Go to **Console** tab
4. Paste this:
   ```javascript
   fetch('https://<your-railway-url>/api/health')
     .then(r => r.json())
     .then(d => console.log('✓ Success:', d))
     .catch(e => console.error('✗ Error:', e))
   ```
5. Should see: `✓ Success: {status: "Server is running"}`

✅ **CORS is working!**

---

## Phase 5: End-to-End Testing (5 minutes)

### Test 1: User Registration
1. Visit your **Vercel URL**
2. Click **"Don't have an account? Register"**
3. Fill form:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: TestPass@123
   - **Confirm Password**: TestPass@123
4. Click **"Register"**
5. Should redirect to **Dashboard**

### Test 2: Verify in MongoDB
1. Go to **https://cloud.mongodb.com**
2. Click **"Clusters"** → **Cluster0**
3. Click **"Collections"** or **"Browse Collections"**
4. Navigate to: `team-task-manager` → `users`
5. Should see your test user document

### Test 3: Test Login
1. Log out (or open private/incognito window)
2. Click **"Login"**
3. Enter: `test@example.com` / `TestPass@123`
4. Should redirect to **Dashboard**

### Test 4: Create Project
1. On Dashboard, click **"Create Project"** button
2. Enter:
   - **Name**: My Test Project
   - **Description**: Production test
3. Click **"Create"**
4. Should appear in Projects list
5. **Refresh page** → should still be there ✅

### Test 5: Create Task
1. Go to **Projects** → Select your project
2. Click **"Add Task"** or view project board
3. Create a task with title and description
4. Drag it between Kanban columns (Todo → In Progress → Completed)
5. **Refresh page** → changes persist ✅

✅ **Full flow works!**

---

## 🧪 Troubleshooting

### Issue: Backend shows "502 Bad Gateway" or no logs

**Solution**:
1. Check Railway logs for MongoDB error
2. Add `MONGODB_URI` variable if missing
3. Check MongoDB Atlas IP whitelist:
   - Go to https://cloud.mongodb.com
   - Network Access → Add IP → Allow Anywhere (0.0.0.0/0)

### Issue: Frontend can't connect to backend

**Solution**:
1. Check if `VITE_API_URL` is correct in Vercel
2. Verify Railway `FRONTEND_URL` is set correctly
3. Hard refresh frontend: **Ctrl+Shift+R**

### Issue: CORS errors in console

**Solution**:
1. Update Railway `FRONTEND_URL` to your Vercel domain
2. Wait for redeploy
3. Hard refresh browser

### Issue: Registration fails

**Solution**:
1. Check backend logs for MongoDB connection
2. Verify MongoDB Atlas credentials are correct
3. Ensure email format is valid

---

## 📊 Summary

| Step | Service | Time | Status |
|------|---------|------|--------|
| 1 | Railway Account | 2 min | ✅ |
| 2 | Backend Deploy | 5 min | ✅ |
| 3 | Frontend Deploy | 5 min | ✅ |
| 4 | Link Services | 2 min | ✅ |
| 5 | End-to-End Test | 5 min | ✅ |
| **TOTAL** | **All Services** | **~20 min** | ✅ |

---

## 🎉 Done!

Your app is now live in production!

**URLs**:
- **Frontend**: `https://<your-vercel-url>`
- **Backend API**: `https://<your-railway-url>/api`
- **GitHub**: https://github.com/aps4934/team_task_management

---

## 📝 Environment Variables Checklist

### Railway (Backend)
- [ ] `MONGODB_URI` = mongodb+srv://...
- [ ] `JWT_SECRET` = <64-char-hex>
- [ ] `NODE_ENV` = production
- [ ] `PORT` = 3000
- [ ] `FRONTEND_URL` = https://xxx.vercel.app

### Vercel (Frontend)
- [ ] `VITE_API_URL` = https://xxx.up.railway.app/api

### MongoDB Atlas
- [ ] IP Whitelist includes 0.0.0.0/0 or Railway IPs
- [ ] User credentials correct
- [ ] Database `team-task-manager` exists

---

## 🔒 Important Security Notes

1. **JWT_SECRET**: Generate new for production (don't use development key)
2. **MongoDB**: Currently allows from anywhere (0.0.0.0/0) - restrict later for production
3. **.env files**: Never commit to git (already in .gitignore)
4. **Connection string**: Keep private (don't share publicly)

---

**Need help?** Check these guides:
- [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Detailed reference
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Comprehensive troubleshooting
- [RAILWAY_CHECKLIST.md](./RAILWAY_CHECKLIST.md) - With verification steps

