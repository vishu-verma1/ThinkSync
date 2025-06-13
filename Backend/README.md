
# ThinkSync Backend

ThinkSync is a real-time collaborative platform that allows teams to work together on projects, communicate in real-time, and leverage AI assistance for enhanced productivity.

## Technology Stack

- **Node.js & Express**: Server-side framework
- **MongoDB**: Database (with Mongoose ORM)
- **Socket.IO**: Real-time communication
- **Redis**: Caching and token blacklisting
- **JWT**: Authentication
- **Google AI (Gemini)**: AI assistant integration

## Project Structure

```
Backend/
├── controllers/           # Route controllers
│   ├── ai.controller.js
│   ├── project.controller.js
│   ├── user.controller.js
│   └── ...
├── db/                    # Database connection
│   └── db.js
├── middlewares/           # Express middlewares
│   └── user.auth.middleware.js
├── models/                # Mongoose models
│   ├── message.model.js
│   ├── project.model.js
│   ├── user.model.js
│   └── ...
├── routes/                # API routes
│   ├── ai.routes.js
│   ├── message.route.js
│   ├── project.routes.js
│   ├── user.routes.js
│   └── ...
├── services/              # Business logic
│   ├── ai.service.js
│   ├── project.service.js
│   ├── redis.service.js
│   ├── user.service.js
│   └── ...
├── validators/            # Input validation
│   ├── projectValidator.js
│   ├── userValidator.js
│   └── ...
├── .env                   # Environment variables (not tracked by git)
├── app.js                 # Express application setup
├── server.js              # Server entry point with Socket.IO setup
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## Installation & Setup

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd ThinkSync/Backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Copy `.env.example` to `.env`
    - Update the values in `.env` with your configuration

4. Run the application:
    ```bash
    npm start
    ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
GOOGLE_AI_KEY=your_google_ai_api_key
ENCRYPTION_KEY=32_character_encryption_key_for_messages
```

## API Documentation

### Authentication
All protected routes require a valid JWT token in the request headers:
```
Authorization: Bearer <token>
```

### User Routes

#### Register New User
- **Endpoint**: `POST /users/register`
- **Description**: Create a new user account
- **Body**:
  ```json
  {
     "username": "johndoe",
     "email": "john@example.com",
     "password": "password123"
  }
  ```
- **Response**: Returns user object with JWT token

#### User Login
- **Endpoint**: `POST /users/login`
- **Description**: Authenticate a user and return token
- **Body**:
  ```json
  {
     "email": "john@example.com",
     "password": "password123"
  }
  ```
- **Response**: Returns user object with JWT token

#### Get User Profile
- **Endpoint**: `GET /users/profile`
- **Description**: Get current user's profile
- **Authentication**: Required
- **Response**: Returns user profile data

#### User Logout
- **Endpoint**: `GET /users/logout`
- **Description**: Invalidate user's token
- **Authentication**: Required
- **Response**: Logout confirmation

#### Get All Users
- **Endpoint**: `GET /users/all`
- **Description**: Get list of all users (except current user)
- **Authentication**: Required
- **Response**: Returns array of users

### Project Routes

#### Create Project
- **Endpoint**: `POST /project/create-project`
- **Description**: Create a new project
- **Authentication**: Required
- **Body**:
  ```json
  {
     "name": "New Project"
  }
  ```
- **Response**: Returns created project

#### Get User Projects
- **Endpoint**: `GET /project/get-projects`
- **Description**: Get all projects for current user
- **Authentication**: Required
- **Response**: Returns array of projects

#### Add Users to Project
- **Endpoint**: `PUT /project/add-user`
- **Description**: Add users to an existing project
- **Authentication**: Required
- **Body**:
  ```json
  {
     "projectId": "project_id",
     "users": ["user_id1", "user_id2"]
  }
  ```
- **Response**: Returns updated project

#### Get Project by ID
- **Endpoint**: `GET /project/get-project/:projectId`
- **Description**: Get project details by ID
- **Authentication**: Required
- **Response**: Returns project details with users

#### Delete Project
- **Endpoint**: `DELETE /project/delete-project/:projectId`
- **Description**: Delete a project (only by project members)
- **Authentication**: Required
- **Response**: Success message

### Message Routes

#### Get Project Messages
- **Endpoint**: `GET /api/messages/:projectId`
- **Description**: Get all messages for a specific project
- **Response**: Array of messages with decrypted content

### AI Routes

#### Get AI Response
- **Endpoint**: `GET /ai/get-result`
- **Description**: Get AI-generated response for a prompt
- **Query Parameters**: `prompt` - The text prompt for AI
- **Response**: AI-generated response

## Database Models

### User Model
- `username`: String (required)
- `email`: String (required, unique)
- `password`: String (hashed, not selected in queries by default)
- **Methods**:
  - `hashPassword`: Static method to hash password
  - `isValidPassword`: Method to verify password
  - `generateJWT`: Method to generate authentication token

### Project Model
- `name`: String (required, unique)
- `users`: Array of ObjectIds (references User model)

### Message Model
- `projectId`: ObjectId (references Project model)
- `sender`: Object with _id and email
- `message`: String (encrypted)
- `isAiResponse`: Boolean
- `timestamps`: Created and updated timestamps
- **Methods**:
  - `decryptMessage`: Method to decrypt message content

## Authentication Flow

ThinkSync uses JWT (JSON Web Token) for authentication:

1. User registers or logs in to receive a JWT token
2. Token is stored in cookies and/or sent in Authorization header
3. Protected routes verify the token using isLogin middleware
4. On logout, the token is blacklisted in Redis
5. Tokens expire after 24 hours

## WebSocket Implementation

Socket.IO is used for real-time messaging:

- Client connects with authentication token and project ID
- Socket middleware verifies token and checks project validity
- Messages are encrypted before storage and decrypted when retrieved
- AI can be triggered with "@ai" prefix in messages

### Socket Events:
- `connection`: User connects to a project room
- `project-message`: Send and receive messages in a project
- `disconnect`: User leaves the project room

## AI Integration

ThinkSync integrates with Google's Gemini AI:

- AI can be triggered in chat using "@ai" followed by a prompt
- AI responses are formatted as structured JSON
- The AI is configured to assist with development tasks
- AI responses are stored in the database with special flag
- The AI model uses system instructions to maintain context

## Message Encryption

All messages in ThinkSync are encrypted for security:

- Using AES-256-CBC encryption for all message content
- Each message has a unique initialization vector (IV)
- Messages are automatically encrypted before saving to database
- Messages are decrypted when retrieved using decryptMessage method

## Error Handling

All API endpoints include proper error handling:

- Validation errors return 400 status with detailed messages
- Authentication errors return 401 status
- Authorization errors return 403 status
- Not found errors return 404 status
- Server errors return 500 status with minimal details for security

## Security Features

- Password hashing using bcrypt
- JWT authentication with Redis blacklisting
- Message encryption using AES-256-CBC
- Input validation with express-validator
- MongoDB input sanitization
- Proper error handling to prevent information leakage

## Production Considerations

When deploying to production:

- Set appropriate NODE_ENV values
- Configure proper CORS settings
- Use secure Redis and MongoDB connections
- Implement rate limiting
- Consider using a process manager like PM2
- Set up proper logging and monitoring
- Configure SSL/TLS for all connections

## API Development Guidelines

- Use consistent naming conventions
- Implement proper validation for all inputs
- Return meaningful error messages
- Follow REST principles
- Document all endpoints
- Use middleware for common functionality
- Implement proper security measures

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for efficient remote collaboration tools
- Leveraging modern web technologies for a seamless experience
