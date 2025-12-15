# Fix for Render Deployment Error

## The Problem
Render is trying to run `node index.js` but your backend entry point is `server.js` in the `backend` folder.

## Solution Steps

### Step 1: Update Render Service Settings

In your Render dashboard:

1. **Go to your service settings**
2. **Update these fields:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Step 2: Environment Variables

Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-64-character-secret-key
CORS_ORIGIN=https://your-frontend-domain.netlify.app
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SESSION_SECRET=your-session-secret
```

### Step 3: MongoDB Atlas Setup

1. **Create MongoDB Atlas cluster** (if not done)
2. **Create database user**
3. **Whitelist IP:** Add `0.0.0.0/0` for Render access
4. **Get connection string** and add to `MONGODB_URI`

### Step 4: Redeploy

1. **Manual Deploy:** Click "Manual Deploy" in Render dashboard
2. **Or Push to GitHub:** Any new commit will trigger redeploy

## Expected Success Output

After fixing, you should see:
```
==> Build successful 🎉
==> Deploying...
==> Running 'npm start'
🚀 Server running in production mode on port 10000
```

## Test Your API

Once deployed, test with:
```bash
curl https://your-app-name.onrender.com/api/health
```

Should return:
```json
{
  "success": true,
  "message": "NEURON Tasks API is running",
  "timestamp": "2024-12-15T..."
}
```

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Set Root Directory to `backend`

### Issue: "Build failed"
**Solution:** Ensure `package.json` exists in backend folder

### Issue: "Database connection failed"
**Solution:** Check MongoDB URI and IP whitelist

### Issue: "CORS errors"
**Solution:** Set correct `CORS_ORIGIN` environment variable

---

## Quick Commands for Render

**Root Directory:** `backend`
**Build Command:** `npm install`
**Start Command:** `npm start`

That's it! Your backend should deploy successfully.