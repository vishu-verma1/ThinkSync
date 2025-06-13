# ThinkSync Frontend Documentation

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Authentication](#authentication)
- [Components](#components)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [UI and Styling](#ui-and-styling)
- [Contributing](#contributing)

## Overview
ThinkSync is a collaborative platform that enables users to create projects, collaborate in real-time, and communicate through integrated messaging. The frontend is built with React and utilizes modern web technologies to provide a responsive and interactive user experience.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/ThinkSync.git
cd ThinkSync/Frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
     - Create a `.env` file based on `.envsample` in the root directory
     - Set the appropriate API URL in `VITE_BASE_API_URL`

### Running the Application
Development mode:
```bash
npm run dev
# or
yarn dev
```

Build for production:
```bash
npm run build
# or
yarn build
```

## Project Structure
```
/Frontend
├── public/             # Static assets
├── src/
│   ├── assets/         # Application assets
│   ├── auth/           # Authentication components
│   ├── components/     # Reusable UI components
│   │   ├── headerFooter/  # Layout components
│   │   ├── projectComponents/ # Project-related components
│   │   └── ui/         # UI elements
│   ├── config/         # Config files for services
│   ├── context/        # React context providers
│   ├── ErrorBoundary/  # Error handling
│   ├── lib/            # Utility functions
│   ├── routes/         # Routing configuration
│   ├── screens/        # Main page components
│   ├── App.jsx         # Main application component
│   ├── index.css       # Global styles
│   └── main.jsx        # Entry point
├── .env                # Environment variables (create from .envsample)
├── components.json     # UI component configuration
├── eslint.config.js    # ESLint configuration
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## Key Features
- **User Authentication**: Register and login functionality
- **Project Management**: Create, view, and delete projects
- **Real-time Collaboration**: Socket.io integration for live updates
- **Messaging System**: Chat functionality within projects
- **Responsive Design**: Works across various screen sizes

## Authentication
ThinkSync uses token-based authentication stored in localStorage. The authentication flow is handled by:

- **UserAuth Component**: Protects routes that require authentication
- **User Context**: Manages global user state
- **Login/Register Screens**: Handle user credentials and token storage

Protected routes redirect unauthenticated users to the login page.

### Authentication Flow
1. User enters credentials on the Login/Register screen
2. The application sends credentials to the backend via Axios
3. Upon successful authentication, the backend returns a token
4. The token is stored in localStorage and the user state is updated
5. Protected routes check for the token before rendering

## Components

### Core Components
- **NavBar**: Main navigation component with search and user menu
- **Footer**: Application footer with copyright and social links
- **ErrorBoundary**: Catches and handles errors in the React component tree

### UI Components
- **Button**: Customizable button component with variants
- **Card**: Content container with header, body, and footer sections
- **Dialog**: Modal dialog for forms and confirmations
- **Input**: Form input component with styling

### Project Components
- **ShowProject**: Card component for displaying project information
- **Project**: Main interface for working within a project, including messaging

## Routing
The application uses React Router (v7) for navigation between screens:

```jsx
<Routes>
        <Route path='/' element={<UserAuth><Home/></UserAuth>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/project' element={<UserAuth><Project/></UserAuth>}/>
</Routes>
```

Protected routes are wrapped with the UserAuth component, which checks for authentication before rendering.

## State Management
ThinkSync uses React Context API for global state management:

- **userContext**: Manages the authenticated user's information

```jsx
const { user, setUser } = useContext(userContext);
```

Component-level state is managed using React's useState hook.

## API Integration
The application uses Axios for API requests. A configured instance is created in `config/axios.js` with:

- Base URL from environment variables
- Default headers
- Request/response interceptors

Example API call:
```jsx
axiosInstance.get('/project/get-projects').then((res) => {
    setProjects(res.data.Projects);
});
```

### Real-time Communication
Socket.IO is used for real-time communication, particularly in the Project component:

- Socket initialization in `config/socket.js`
- Message sending and receiving in real-time
- Project collaboration features

## UI and Styling
ThinkSync uses a combination of:

- **Tailwind CSS**: For utility-based styling
- **DaisyUI**: For additional UI components
- **Custom CSS**: For specific styling needs
- **CSS Variables**: For theming with light and dark modes

The `cn` utility function is used to combine Tailwind classes conditionally.

### Theme Configuration
CSS variables are defined in `index.css` for consistent theming across the application, with support for both light and dark modes.

## Contributing
### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run tests and linting
5. Submit a pull request

### Coding Standards
- Follow ESLint configuration
- Use functional components with hooks
- Keep components small and focused
- Document complex logic with comments
