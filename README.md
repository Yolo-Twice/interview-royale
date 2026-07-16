# Interview Buddy

Interview Buddy is an advanced platform designed to help candidates prepare for their technical and behavioral interviews. Built with a modern React stack, it offers a fast, interactive, and responsive experience for users to practice, review, and track their interview history.

## 🚀 Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/) (formerly Remix)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/)
- **Markdown & Syntax Highlighting**: `react-markdown`, `remark-gfm`, and `shiki`

## 📂 Project Structure

- `app/routes/` - Contains the application routes (e.g., Dashboard, Interview History, Active Interview, Post Interview).
- `app/components/` - Reusable UI components powered by shadcn/ui.
- `public/` - Static assets.

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v22+ recommended)
- **npm** (or your preferred package manager)

### Installation

1. **Clone the repository** (or navigate to the frontend directory):
   ```bash
   cd interview-buddy
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Copy the example environment file and fill in your Firebase configuration and backend endpoints.
   ```bash
   cp .env.example .env
   ```

### Development

To start the local development server:
```bash
npm run dev
```

### Build for Production

To build the application for production:
```bash
npm run build
```

To start the production server after building:
```bash
npm run start
```

## ✨ Features

- **Interactive Interviews**: Real-time coding and behavioral mock interviews.
- **Markdown Support**: Rich text rendering with syntax highlighting for code snippets.
- **Performance Tracking**: Visual charts using Recharts to track your progress over time.
- **Firebase Integration**: Seamless authentication and database interactions.

## 🎨 UI & Theming

This project uses [shadcn/ui](https://ui.shadcn.com/). To add new components to the app, you can use the CLI:

```bash
npx shadcn@latest add <component-name>
```

Example:
```bash
npx shadcn@latest add button
```

This will automatically configure and add the component into your `app/components/ui/` directory.
