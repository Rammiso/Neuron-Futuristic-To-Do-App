# 🚀 NEURON Tasks - Futuristic Task Management System

A high-performance, cyberpunk-inspired task management application built with React, featuring AI assistance, real-time animations, and a stunning neon-green aesthetic.

![NEURON Tasks](https://img.shields.io/badge/version-1.0.0-00ff88?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/license-MIT-00ff88?style=for-the-badge)

## ✨ Features

### 🎨 **Stunning UI/UX**
- **Cyberpunk Design** - Clean, futuristic interface with neon green accents
- **Dual Theme** - Professional light mode and cyberpunk dark mode
- **Animated Particles** - Moving particle background with neural network connections
- **Glass Morphism** - Modern glass effects with subtle blur
- **Smooth Animations** - Powered by Framer Motion for 60fps performance

### 📊 **Core Features**
- **Dashboard** - Real-time task overview with statistics
- **Calendar View** - Visual task scheduling with date picker
- **Task Management** - Create, edit, delete, and organize tasks
- **Priority System** - High, Medium, Low priority levels
- **AI Assistant** - Natural language task creation (demo)
- **Profile Management** - Editable user profiles with stats
- **Settings** - Comprehensive configuration options

### 🎯 **Smart Features**
- Task completion tracking
- Overdue task detection
- Priority-based organization
- Search and filter capabilities
- Responsive mobile design
- Keyboard shortcuts ready

### 🔒 **Security & Data**
- Local session storage
- Two-factor authentication ready
- Data export functionality
- Session timeout management

## 🛠️ Tech Stack

- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.8
- **Routing:** React Router DOM 6.20.0
- **State Management:** Zustand 4.4.1
- **Animations:** Framer Motion 10.16.4
- **Styling:** Tailwind CSS 3.3.6
- **Icons:** Lucide React 0.294.0
- **Date Handling:** date-fns 2.30.0
- **Fonts:** Inter & JetBrains Mono

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/neuron-tasks.git
cd neuron-tasks
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

## 🎮 Usage

### Login
- Use any email and password to login (demo mode)
- No backend required - runs entirely in browser

### Creating Tasks
1. Click "Add Task" button
2. Fill in task details (title, description, due date, priority)
3. Save to add to your task list

### AI Assistant
1. Navigate to AI Assistant page
2. Type natural language commands
3. Accept AI-generated task suggestions

### Profile Management
1. Click your profile icon in top-right
2. Edit your information
3. View your stats and achievements

## 🎨 Design System

### Color Palette

#### Light Mode
- **Primary:** `#00cc6a` (Neon Dark Green)
- **Background:** `#f5f5f5` (Light Gray)
- **Text:** `#1a1a1a` (Near Black)

#### Dark Mode
- **Primary:** `#00ff88` (Neon Green)
- **Background:** `#050a0a` (Cyber Darker)
- **Text:** `#e2e8f0` (Light Gray)

### Typography
- **Body:** Inter
- **Code/Stats:** JetBrains Mono

## 📱 Responsive Design

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

Fully responsive with mobile-first approach and touch-optimized interactions.

## ⚡ Performance

- **Bundle Size:** ~344 KB (gzipped: ~104 KB)
- **First Paint:** < 1.5s
- **Interactive:** < 3s
- **Smooth 60fps** animations
- **Optimized particles** with canvas rendering
- **Memoized components** for minimal re-renders

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_NAME=NEURON Tasks
VITE_APP_VERSION=1.0.0
```

### Customization
- **Colors:** Edit `tailwind.config.js`
- **Fonts:** Update `src/index.css`
- **Particles:** Adjust density in `src/components/AmbientEffects.jsx`

## 📂 Project Structure

```
neuron-tasks/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── AmbientEffects.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── ProfileModal.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskModal.jsx
│   │   └── Topbar.jsx
│   ├── context/         # State management
│   │   ├── authStore.js
│   │   ├── taskStore.js
│   │   └── themeStore.js
│   ├── hooks/           # Custom React hooks
│   │   └── useCalendar.js
│   ├── layouts/         # Page layouts
│   │   └── DashboardLayout.jsx
│   ├── pages/           # Application pages
│   │   ├── AIAssistantPage.jsx
│   │   ├── CalendarPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── TasksPage.jsx
│   ├── utils/           # Utility functions
│   │   └── dateUtils.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from cyberpunk aesthetics
- Icons by [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

## 📧 Contact

**Project Link:** [https://github.com/yourusername/neuron-tasks](https://github.com/yourusername/neuron-tasks)

---

<div align="center">
  <p>Made with ❤️ and ⚡ by Your Name</p>
  <p>
    <a href="#-neuron-tasks---futuristic-task-management-system">Back to Top ↑</a>
  </p>
</div>
