#!/bin/bash

# NEURON Tasks Backend Deployment Script
# This script helps prepare the backend for deployment

echo "🚀 NEURON Tasks Backend Deployment Preparation"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Navigate to backend directory
cd backend

echo "📦 Installing backend dependencies..."
npm install

echo "🔍 Checking for required files..."

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found in backend directory"
    exit 1
fi

echo "✅ server.js found"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production not found"
    echo "📝 Creating template .env.production file..."
    
    cat > .env.production << EOF
# Production Environment Variables
NODE_ENV=production
PORT=10000

# Database (Update with your MongoDB Atlas connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neuron-tasks?retryWrites=true&w=majority

# JWT Secret (Generate a strong secret for production)
JWT_SECRET=your-super-secure-jwt-secret-key-here-change-this-in-production

# CORS Origins (Update with your frontend domain)
CORS_ORIGIN=https://your-frontend-domain.com

# Security
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session
SESSION_SECRET=your-session-secret-here
EOF

    echo "✅ Template .env.production created"
    echo "⚠️  IMPORTANT: Update the values in .env.production before deploying!"
else
    echo "✅ .env.production found"
fi

echo ""
echo "🎯 Deployment Checklist:"
echo "========================"
echo "□ Update .env.production with real values"
echo "□ Set up MongoDB Atlas database"
echo "□ Configure Render service with:"
echo "  - Root Directory: backend"
echo "  - Build Command: npm install"
echo "  - Start Command: npm start"
echo "□ Add environment variables to Render dashboard"
echo "□ Test API endpoint after deployment"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - RENDER_DEPLOYMENT.md"
echo "   - RENDER_FIX.md"
echo ""
echo "✨ Backend is ready for deployment!"