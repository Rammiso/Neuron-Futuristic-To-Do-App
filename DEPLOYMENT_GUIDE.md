# NEURON Tasks - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ and npm 8+
- MongoDB Atlas account or MongoDB instance
- Domain name (for production)
- SSL certificate (recommended)

### Environment Setup

#### 1. Backend Environment Variables
Create `backend/.env.production`:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neuron-tasks?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here-change-this-in-production
CORS_ORIGIN=https://your-frontend-domain.com
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SESSION_SECRET=your-session-secret-here
```

#### 2. Frontend Environment Variables
Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=NEURON Tasks
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_ENABLE_DEMO_MODE=true
VITE_ENABLE_REGISTRATION=true
```

### Deployment Options

#### Option 1: Netlify + Railway/Render
1. **Frontend (Netlify):**
   ```bash
   npm run build:frontend
   # Deploy frontend/dist to Netlify
   ```

2. **Backend (Railway/Render):**
   ```bash
   # Deploy backend folder to Railway or Render
   # Set environment variables in platform dashboard
   ```

#### Option 2: Vercel + MongoDB Atlas
1. **Frontend (Vercel):**
   ```bash
   npm run build:frontend
   # Deploy using vercel.json configuration
   ```

2. **Backend (Vercel Serverless):**
   ```bash
   # Deploy backend as serverless functions
   ```

#### Option 3: Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build -d

# Or build individual containers
docker build -t neuron-tasks-frontend ./frontend
docker build -t neuron-tasks-backend ./backend
```

#### Option 4: Traditional VPS/Cloud Server
```bash
# Install dependencies
npm run install:all

# Build frontend
npm run build:frontend

# Start production server
npm run start:prod
```

### Database Setup

#### MongoDB Atlas (Recommended)
1. Create MongoDB Atlas cluster
2. Create database user with read/write permissions
3. Whitelist your server IP addresses
4. Copy connection string to `MONGODB_URI`

#### Local MongoDB (Development)
```bash
# Install MongoDB locally
# Start MongoDB service
mongod --dbpath /path/to/data
```

### Security Checklist

- [ ] Change all default passwords and secrets
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for your domain only
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Remove demo credentials and test files

### Performance Optimization

- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Monitor memory usage
- [ ] Set up database indexes
- [ ] Enable MongoDB connection pooling

### Monitoring & Logging

#### Production Logging
```javascript
// Only log errors in production
if (process.env.NODE_ENV === 'production') {
  // Use proper logging service (Winston, etc.)
} else {
  console.log('Development logs');
}
```

#### Health Checks
- Backend: `GET /api/health`
- Frontend: Check if app loads correctly
- Database: Monitor connection status

### Deployment Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Production Start
npm run start:prod

# Database Seeding (Development only)
npm run seed:dev

# Clean Install
npm run clean && npm run install:all
```

### Troubleshooting

#### Common Issues
1. **CORS Errors**: Update `CORS_ORIGIN` in backend environment
2. **Database Connection**: Check MongoDB URI and network access
3. **Build Failures**: Ensure Node.js version compatibility
4. **Environment Variables**: Verify all required variables are set

#### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run start:prod
```

### Post-Deployment

1. **Test Authentication**: Register new user and login
2. **Test Core Features**: Create tasks, use calendar, check dashboard
3. **Performance Check**: Monitor load times and responsiveness
4. **Security Scan**: Run security audit tools
5. **Backup Setup**: Configure automated database backups

### Maintenance

- Regular dependency updates
- Security patches
- Database maintenance
- Performance monitoring
- User feedback collection

---

## 📱 Mobile Responsiveness

The app is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Design System

- **Theme**: Cyberpunk with neon green/cyan accents
- **Typography**: Inter (body), JetBrains Mono (code/data)
- **Effects**: Glassmorphism, holographic overlays, particle backgrounds
- **Animations**: Framer Motion micro-interactions
- **Performance**: Optimized for 60fps on mid-range devices

## 🔧 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, JWT
- **Deployment**: Docker, Netlify, Vercel, Railway
- **Security**: Helmet, CORS, Rate Limiting, Input Validation