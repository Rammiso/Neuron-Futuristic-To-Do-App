# Contributing to NEURON Tasks

First off, thank you for considering contributing to NEURON Tasks! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Test your changes**: `npm run build` and `npm run preview`
5. **Commit your changes** with clear commit messages
6. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/neuron-tasks.git

# Navigate to directory
cd neuron-tasks

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Coding Standards

### JavaScript/React
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Styling
- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Maintain responsive design
- Test on multiple screen sizes

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Example:
```
Add user profile editing feature

- Create ProfileModal component
- Add updateUser function to authStore
- Implement form validation
- Add success/error notifications

Closes #123
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # State management (Zustand stores)
├── hooks/          # Custom React hooks
├── layouts/        # Page layouts
├── pages/          # Application pages
└── utils/          # Utility functions
```

## Testing

Before submitting a PR:
- [ ] Code builds without errors (`npm run build`)
- [ ] No console errors in browser
- [ ] Tested on Chrome, Firefox, and Safari
- [ ] Tested on mobile viewport
- [ ] All existing features still work

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

Thank you for contributing! 🚀
