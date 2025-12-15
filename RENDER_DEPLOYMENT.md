# Render Deployment Guide for NEURON Tasks Backend

## Quick Deploy to Render

### Option 1: Deploy Backend Only (Recommended)

1. **Create New Web Service on Render:**
   - Connect your GitHub repository
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

2. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secure-jwt-secret-64-characters-long
   CORS_ORIGIN=https://your-frontend-domain.netlify.app
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   SESSION_SECRET=your-session-secret-here
   ```

3. **MongoDB Setup:**
   - Use MongoDB Atlas (recommended)
   - Or create a MongoDB database on Render
   - Copy connection string to `MONGODB_URI`

### Option 2: Deploy with render.yaml

1. **Use the provided render.yaml file:**
   - The `render.yaml` file is already configured
   - Just push to GitHub and connect to Render
   - Render will automatically detect the configuration

### Troubleshooting Common Issues

#### Error: Cannot find module 'index.js'
**Solution:** Make sure you set the correct root directory and start command:
- **Root Directory:** `backend`
- **Start Command:** `npm start`

#### Build Command Issues
**Solution:** Use these exact commands:
- **Build Command:** `npm install`
- **Start Command:** `npm start`

#### CORS Errors
**Solution:** Update the `CORS_ORIGIN` environment variable with your frontend URL:
```
CORS_ORIGIN=https://your-app-name.netlify.app
```

#### Database Connection Issues
**Solution:** 
1. Check MongoDB URI format
2. Ensure IP whitelist includes `0.0.0.0/0` for Render
3. Verify database user permissions

### Environment Variables Setup

1. **Required Variables:**
   ```bash
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neuron-tasks
   JWT_SECRET=generate-a-64-character-random-string-here
   CORS_ORIGIN=https://your-frontend-url.com
   ```

2. **Optional Variables:**
   ```bash
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   SESSION_SECRET=another-random-secret
   ```

### Testing Your Deployment

1. **Health Check:**
   ```bash
   curl https://your-app-name.onrender.com/api/health
   ```

2. **API Test:**
   ```bash
   curl https://your-app-name.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"test123"}'
   ```

### Frontend Configuration

Update your frontend environment variables:
```env
VITE_API_URL=https://your-backend-app.onrender.com/api
```

### Performance Tips

1. **Keep Service Warm:** Render free tier sleeps after 15 minutes
2. **Use Paid Plan:** For production apps, consider paid plan
3. **Database Optimization:** Use MongoDB Atlas for better performance
4. **Caching:** Enable Redis if needed for session storage

### Security Checklist

- [ ] Strong JWT secret (64+ characters)
- [ ] Correct CORS origin (your frontend domain)
- [ ] MongoDB authentication enabled
- [ ] Environment variables set (not hardcoded)
- [ ] Rate limiting configured
- [ ] HTTPS enabled (automatic on Render)

### Monitoring

1. **Render Dashboard:** Monitor logs and metrics
2. **Health Endpoint:** `/api/health` for uptime monitoring
3. **Error Tracking:** Consider adding Sentry for error tracking

---

## Alternative: Deploy Backend Folder Only

If you want to deploy just the backend folder as a separate repository:

1. **Create new repository for backend only**
2. **Copy backend folder contents to root**
3. **Deploy normally on Render**

This approach gives you more control and cleaner deployment.