# NEURON Tasks Backend Deployment Script for Windows
# This script helps prepare the backend for deployment

Write-Host "🚀 NEURON Tasks Backend Deployment Preparation" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "backend\package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project structure verified" -ForegroundColor Green

# Navigate to backend directory
Set-Location backend

Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🔍 Checking for required files..." -ForegroundColor Yellow

# Check if server.js exists
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Error: server.js not found in backend directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ server.js found" -ForegroundColor Green

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "⚠️  Warning: .env.production not found" -ForegroundColor Yellow
    Write-Host "📝 Creating template .env.production file..." -ForegroundColor Yellow
    
    $envContent = @"
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
"@

    $envContent | Out-File -FilePath ".env.production" -Encoding UTF8

    Write-Host "✅ Template .env.production created" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Update the values in .env.production before deploying!" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env.production found" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Deployment Checklist:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "□ Update .env.production with real values"
Write-Host "□ Set up MongoDB Atlas database"
Write-Host "□ Configure Render service with:"
Write-Host "  - Root Directory: backend"
Write-Host "  - Build Command: npm install"
Write-Host "  - Start Command: npm start"
Write-Host "□ Add environment variables to Render dashboard"
Write-Host "□ Test API endpoint after deployment"
Write-Host ""
Write-Host "📚 For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "   - RENDER_DEPLOYMENT.md"
Write-Host "   - RENDER_FIX.md"
Write-Host ""
Write-Host "✨ Backend is ready for deployment!" -ForegroundColor Green

# Return to original directory
Set-Location ..