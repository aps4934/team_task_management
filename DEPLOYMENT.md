# Deployment Guide

This guide covers deploying Team Task Manager to production using Railway (backend & database) and Vercel/Netlify (frontend).

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment-vercelnetlify)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment](#post-deployment)

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up" and create an account
3. Verify your email

### Step 2: Create a Database Cluster
1. After login, click "Create a Project"
2. Name it "team-task-manager"
3. Click "Create Project"
4. Click "Create a Cluster"
5. Select the free tier "M0"
6. Choose your region (closest to your users)
7. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create username and password
4. Choose "Built-in Role": Database User
5. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (or add specific IPs)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters"
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Choose "Node.js" driver
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `myFirstDatabase` with `team-task-manager`

Connection String Format:
```
mongodb+srv://username:password@cluster-name.mongodb.net/team-task-manager
```

## Backend Deployment (Railway)

### Step 1: Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Click "Start New Project"
3. Sign up with GitHub (recommended) or email

### Step 2: Set Up Railway Project
1. Click "Create New Project"
2. Select "GitHub Repo" (connect your repository)
3. Choose your team-task-manager repository
4. Click "Deploy Now"

### Step 3: Add Environment Variables
1. Go to your Railway project dashboard
2. Click on "Variables"
3. Add the following variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/team-task-manager
JWT_SECRET=your_long_random_secret_key_here_make_it_very_secure
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

To generate a secure JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Configure Deployment Settings
1. Click on your service
2. Go to "Deploy" tab
3. Set the start command:
   ```
   npm start
   ```
4. Set the build command:
   ```
   npm install
   ```

### Step 5: Deploy
1. Railway auto-deploys on git push
2. Or manually trigger deploy from the dashboard
3. Wait for the deployment to complete
4. Your backend URL will be provided (e.g., `https://team-task-manager-backend.up.railway.app`)

### Step 6: Test Backend
```bash
curl https://your-backend-url.com/api/health
```

Should return:
```json
{"status":"Server is running"}
```

## Frontend Deployment (Vercel/Netlify)

### Option A: Deploy to Vercel

#### Step 1: Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

#### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Select your team-task-manager repository
3. Select "frontend" directory as root (if needed)
4. Click "Import"

#### Step 3: Add Environment Variables
1. Go to "Settings" → "Environment Variables"
2. Add:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
3. Click "Save"

#### Step 4: Deploy
1. Vercel automatically deploys on git push
2. Or click "Deploy" in the dashboard
3. Your frontend URL will be provided

### Option B: Deploy to Netlify

#### Step 1: Create Netlify Account
1. Go to [Netlify](https://app.netlify.com)
2. Click "Sign up"
3. Choose GitHub sign up

#### Step 2: Connect Repository
1. Click "Add new site" → "Import an existing project"
2. Select GitHub
3. Choose your team-task-manager repository

#### Step 3: Configure Deployment
1. Set build command: `npm run build`
2. Set publish directory: `dist`
3. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.com/api`

#### Step 4: Deploy
1. Click "Deploy site"
2. Wait for the build to complete
3. Your frontend URL will be provided

## Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/team-task-manager

# Security
JWT_SECRET=your_long_random_secret_key_here_min_32_chars

# Server
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.local or .env.production)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Post-Deployment

### Step 1: Update Frontend URL in Backend
1. Get your frontend deployment URL (e.g., `https://team-task-manager.vercel.app`)
2. Update `FRONTEND_URL` in Railway backend variables
3. Redeploy backend

### Step 2: Test Application
1. Visit your frontend URL
2. Try registering a new account
3. Test creating a project
4. Test creating a task
5. Verify all operations work

### Step 3: Set Up Domain (Optional)
#### For Vercel:
1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration steps

#### For Netlify:
1. Go to "Settings" → "Domain management"
2. Click "Add domain"
3. Follow DNS configuration steps

#### For Railway:
1. Go to "Railway" project
2. Click your backend service
3. Go to "Settings" → "Domain"
4. Add your custom domain

### Step 4: Enable HTTPS
- Vercel: Automatic
- Netlify: Automatic
- Railway: Automatic with custom domains

### Step 5: Monitor Logs
#### Railway:
1. Click your service
2. Go to "Logs" tab
3. Monitor for errors

#### Vercel/Netlify:
1. Go to "Deployments"
2. Click on a deployment
3. View build and deployment logs

## Continuous Deployment

All platforms support automatic deployment on git push:

1. Push changes to your main branch
2. Deployment automatically starts
3. Check status in the dashboard
4. Rollback if issues occur

## Scaling Considerations

### Backend (Railway)
- Upgrade from free tier if needed
- Monitor CPU and memory usage
- Database indexes for performance
- Consider caching for frequently accessed data

### Database (MongoDB Atlas)
- Upgrade cluster tier for production load
- Enable backups
- Set up automatic scaling
- Monitor connection pool

### Frontend (Vercel/Netlify)
- Enable caching headers
- Optimize bundle size
- Consider edge caching

## Troubleshooting

### Backend Won't Deploy
1. Check build logs in Railway
2. Verify all environment variables are set
3. Ensure package.json has correct start script
4. Check for port conflicts

### Frontend Build Fails
1. Check build logs
2. Verify Node.js version compatibility
3. Ensure environment variables are set
4. Clear cache and redeploy

### CORS Errors
1. Verify FRONTEND_URL in backend .env
2. Ensure backend is running
3. Check browser console for exact error
4. Verify API endpoint URL in frontend

### Database Connection Issues
1. Check MongoDB URI format
2. Verify credentials
3. Ensure IP whitelist includes server IPs
4. Check database user permissions

### API Calls Return 401/403
1. Verify JWT_SECRET is same in all instances
2. Check token expiration (7 days)
3. Verify Authorization header format: `Bearer <token>`
4. Check user role and permissions

## Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS everywhere
- [ ] Set up SSL certificates
- [ ] Implement rate limiting
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Regular backups enabled
- [ ] Monitor error logs
- [ ] Update dependencies regularly

## Performance Optimization

1. **Enable Compression**: Already configured in Express
2. **Database Indexing**: Mongoose automatically creates indexes
3. **API Response Caching**: Consider implementing for GET endpoints
4. **Frontend Code Splitting**: Vite handles this automatically
5. **Image Optimization**: Use CDN for images
6. **Database Query Optimization**: Use lean() for read-only queries

## Backup & Recovery

### MongoDB Atlas Backups
1. Go to "Backup" in the left sidebar
2. Enable automatic backups
3. Configure retention policy
4. Test recovery process regularly

### Code Backup
- GitHub is your backup
- Ensure you have a private repository
- Regular commits and pushes

## Support & Monitoring

### Set Up Monitoring
1. Enable error tracking (Sentry, LogRocket)
2. Monitor performance metrics
3. Set up alerts for failures
4. Regular log review

### Health Checks
- Set up ping monitors for backend
- Monitor frontend availability
- Test API endpoints regularly

## Next Steps

1. Set up custom domain
2. Enable analytics
3. Configure error tracking
4. Set up backup and recovery
5. Create deployment automation
6. Document your setup

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
