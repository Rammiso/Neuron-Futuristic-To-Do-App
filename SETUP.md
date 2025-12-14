# 🚀 NEURON Tasks - Setup Guide

Complete setup instructions for the NEURON Tasks project.

## 📋 Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher
- **Git** (for version control)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/neuron-tasks.git
cd neuron-tasks
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 Available Scripts

### Frontend Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📁 Project Structure

```
neuron-tasks/
├── frontend/                    # Frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # State management (Zustand)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Page layouts
│   │   ├── pages/              # Application pages
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Static assets
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── README.md
├── .gitignore                  # Root gitignore
├── .gitattributes              # Git attributes
├── README.md                   # Main documentation
└── SETUP.md                    # This file
```

## 🌐 Environment Variables

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_APP_NAME=NEURON Tasks
VITE_APP_VERSION=1.0.0
```

## 🎨 Development

### Frontend Development

1. **Start the dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Make your changes** in the `src` directory

3. **Hot reload** will automatically update the browser

### Building for Production

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login/Register pages work
- [ ] Dashboard displays correctly
- [ ] Tasks can be created, edited, deleted
- [ ] Calendar view functions properly
- [ ] AI Assistant responds to input
- [ ] Profile can be edited
- [ ] Settings save correctly
- [ ] Theme toggle works (light/dark)
- [ ] Responsive on mobile devices
- [ ] Particles animate smoothly

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill the process using the port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change the port in vite.config.js
```

### Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear Vite cache
rm -rf .vite
rm -rf dist

# Rebuild
npm run build
```

## 📦 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel
   ```

### Netlify

1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

### GitHub Pages

1. Update `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/neuron-tasks/',
     // ... other config
   })
   ```

2. Build and deploy:
   ```bash
   npm run build
   # Deploy dist folder to gh-pages branch
   ```

## 🔐 Security Notes

- Never commit `.env` files
- Keep dependencies updated
- Review `.gitignore` before committing
- Use environment variables for sensitive data

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## 💡 Tips

- Use React DevTools for debugging
- Enable Tailwind CSS IntelliSense in VS Code
- Use the browser console for error messages
- Check Network tab for API issues

## 🆘 Getting Help

- Check the [Issues](https://github.com/yourusername/neuron-tasks/issues) page
- Read the [Contributing Guide](./frontend/CONTRIBUTING.md)
- Contact the maintainers

---

**Happy Coding! 🚀**
