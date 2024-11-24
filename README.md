# Shoob-Estate
A full-stack (MERN) real estate platform that enables users to list, browse, and interact with property listings in real-time. Features modern UI, real-time chat, and comprehensive property management.

## 🌟 Features:
### 🏘️ Property Management

- Create, edit, and delete property listings
- Rich text description editor
- Multi-image upload with preview
- Interactive map location picker
- Detailed property information

### 🔍 Advanced Search & Filtering

- Property type filtering
- Price range selection
- Location-based search
- Bedroom/bathroom filters

### 👥 User Features

- Role-based access (Customer/Seller)
- Profile management
- Property bookmarking
- View saved properties
- Instant messaging between users
- Chat notifications
- Message read receipts
- Highly Interactive chat window for desktop
- Real-time Chat System
- Contact Mailing System using Nodemailer

## 🛠️ Tech Stack
### 🖥️Frontend
- React.js with Vite ⚛️
- Zustand for State Management 🗃️
- TailwindCSS for Styling 🎨
- Framer Motion for Animations 🎭
- Socket.IO Client 🔌
- React Router for Navigation 🗺️
- React-Leaflet for Maps 🗺️
- React-Quill for Rich Text 📝

### 📡Backend
- Node.js & Express.js 🟢
- Prisma ORM with MongoDB 🍃
- Socket.IO for Real-time Features 🔌
- JWT Authentication 🔒
- Cloudinary for Image Storage ☁️
- Express Rate Limiting Feature🛡️

## 🚀 Getting Started Locally

### Project Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/5h0ov/Shoob-Estate.git
   ```

### Frontend Setup

1. Navigate to frontend

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

3. Set up environment variables:
   Create a `.env` file in the **frontend directory** and add **your required environment variables** according to this format: 

   ```bash
    VITE_API_URL='<your-backend-api-url>'
    VITE_SOCKET_URL='<your-socket-server-url>'
    VITE_CLOUDINARY_API_KEY='<your-cloudinary-api-key>'
   ```
    Format also present in the frontend folder in the file [.env.example.frontend](./frontend/.env.example.frontend)
    <br>

4. Start the development frontend server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to backend(**In Another Terminal**)

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

3. Set up environment variables:
   Create a `.env` file in the **backend directory** and add **your required environment variables** according to this format: 

   ```bash
    MONGODB_URI=
    PORT= 
    JWT_SECRET= 
    NODE_ENV= 
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_NAME=

    EMAIL_USER=
    EMAIL_APP_PASSWORD=
    ADMIN_EMAIL=

   ```
    Format also present in the backend folder in the file [.env.example.backend](./backend/.env.example.backend)
    <br>

4. Start the server:
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints (SUBJECT TO CHANGE)
### Authentication Routes:
- `POST /api/auth/signup`:          User registration
- `POST /api/auth/login`:          User login
- `POST /api/auth/logout`:         User logout
- `GET  /api/auth/getAuth`:        Get authenticated user details
- `PUT  /api/auth/editUser`:       Edit user profile
- `PUT  /api/auth/updateAvatar`:   Update user avatar
- `GET  /api/auth/notifications`:  Get user notifications
- `GET  /api/auth/getAgents`:      Get all agents/sellers

### Post Listing Routes:
- `GET    /api/posts`:               Get all properties (with filters)
- `GET    /api/posts/:id`:           Get single property details
- `POST   /api/posts/create-post`:   Create new property listing
- `PUT    /api/posts/:id`:          Update property listing
- `DELETE /api/posts/:id`:           Delete property listing

### User Post-Related Routes:
- `GET  /api/auth/userPosts`: Get user's created posts
- `GET  /api/auth/savedPosts`: Get user's saved posts
- `POST /api/auth/savePost`: Save/unsave a post

### Chat Routes:
- `GET  /api/chat`: Get all user chats
- `GET  /api/chat/:id`: Get specific chat
- `POST /api/chat`: Create new chat
- `PUT  /api/chat/read/:id`: Mark chat as read

### Message Route(s):
- `POST /api/message/:id`: Send message in a chat

### Contact Route(s):

- `POST /api/contact`: Send contact form email

### Utility Route(s):
- `POST /api/util/existing-images`: Delete existing images
- ~~`POST /api/sign`: Generate Cloudinary signature~~ **(NOT IMPLEMENTED)**

## 📄 License

This project is licensed under: [MIT licensed](./LICENSE)
