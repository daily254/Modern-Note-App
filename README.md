# Modern Notes App

A beautiful, feature-rich note-taking application built with React and TypeScript. This application provides a seamless experience for creating, organizing, and managing your notes with Markdown support.

![Modern Notes App](https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.1)

## Features

### Core Functionality
- 📝 Create, edit, and delete notes
- 🏷️ Tag-based organization
- 🔍 Full-text search across titles, content, and tags
- 📱 Responsive design for all devices
- 🔐 User authentication

### Advanced Features
- ✨ Markdown support with live preview
- ⌨️ Keyboard shortcuts
  - `Ctrl/Cmd + S` to save
  - `Enter` to add tags
- ⏱️ Reading time estimates
- 📊 Character count
- 🔄 Sort notes by date
- 🎯 Filter notes by tags

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
cd modern-notes-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Technology Stack

- **Frontend Framework**: React 18
- **Type System**: TypeScript
- **Styling**: Tailwind CSS
- **Markdown Support**: react-markdown with remark-gfm
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/        # React components
├── context/          # React context providers
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── main.tsx         # Application entry point
```

## Local Storage

The application uses browser's local storage for:
- User authentication data
- Notes and their metadata
- User preferences

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.