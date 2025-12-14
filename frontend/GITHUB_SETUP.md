# 🚀 GitHub Setup Guide

Follow these steps to push your NEURON Tasks project to GitHub.

## Prerequisites

- Git installed on your computer
- GitHub account created
- Project files ready

## Step 1: Initialize Git Repository

Open your terminal in the project directory and run:

```bash
git init
```

## Step 2: Create Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name:** `neuron-tasks`
   - **Description:** "A high-performance, cyberpunk-inspired task management application"
   - **Visibility:** Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 3: Add Files to Git

```bash
# Add all files
git add .

# Check what will be committed
git status
```

## Step 4: Make Initial Commit

```bash
git commit -m "Initial commit: NEURON Tasks v1.0.0

- Cyberpunk-inspired task management system
- React + Vite + Tailwind CSS
- Framer Motion animations
- Dual theme support (light/dark)
- AI Assistant feature
- Profile management
- Comprehensive settings
- Moving particle background
- Fully responsive design"
```

## Step 5: Connect to GitHub

Replace `yourusername` with your actual GitHub username:

```bash
git remote add origin https://github.com/yourusername/neuron-tasks.git
```

## Step 6: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## Step 7: Verify Upload

1. Go to your repository on GitHub
2. Refresh the page
3. You should see all your files!

## 🎉 Success!

Your project is now on GitHub! 

## Next Steps

### Update README
Edit `README.md` and replace:
- `yourusername` with your GitHub username
- `Your Name` with your actual name
- Add screenshots if desired

### Add Topics
On GitHub repository page:
1. Click the ⚙️ gear icon next to "About"
2. Add topics: `react`, `vite`, `task-management`, `cyberpunk`, `tailwindcss`

### Enable GitHub Pages (Optional)
To deploy your app:
1. Go to repository Settings
2. Navigate to Pages
3. Select source: GitHub Actions
4. Create deployment workflow

### Create Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Common Issues

### Authentication Error
If you get authentication errors:
```bash
# Use personal access token
git remote set-url origin https://YOUR_TOKEN@github.com/yourusername/neuron-tasks.git
```

### Large Files
If you have large files:
```bash
# Check file sizes
git ls-files -s | sort -k 4 -n -r | head -10
```

### Undo Last Commit
If you need to undo:
```bash
git reset --soft HEAD~1
```

## Useful Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Pull latest changes
git pull origin main

# Push changes
git push origin main
```

## 📝 Commit Message Guidelines

Use clear, descriptive commit messages:

```bash
# Good examples
git commit -m "Add user profile editing feature"
git commit -m "Fix mobile menu overlap issue"
git commit -m "Update particle animation performance"

# Bad examples
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

## 🔒 Security Notes

- Never commit `.env` files with sensitive data
- Keep API keys in environment variables
- Review `.gitignore` before committing

## Need Help?

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- Open an issue in the repository

---

**Happy Coding! 🚀**
