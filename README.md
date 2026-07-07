# TravelEase - AI-Powered Tourism Management Platform

A full-stack MERN application for managing tourism services with AI-powered trip planning capabilities.

## 🌟 Features

### User Features
- **Authentication** - JWT-based login/register with role-based access
- **Destinations** - Browse 10+ Indian destinations with search, filters, and detailed info
- **Hotels** - Find hotels by location, view amenities, read reviews, and book rooms
- **Travel Packages** - Explore curated packages (Luxury, Budget, Adventure, Family, Couple)
- **Booking System** - Complete booking flow with PDF confirmation download
- **AI Trip Planner** - Get AI-generated personalized itineraries (OpenAI integration)
- **Budget Planner** - Track trip expenses with visual charts (Recharts)
- **Wishlist** - Save favorite destinations, hotels, and packages
- **User Dashboard** - View bookings, stats, and manage profile
- **Reviews & Ratings** - Rate destinations, hotels, and packages
- **Dark Mode** - Toggle between light and dark themes
- **Interactive Maps** - Leaflet/OpenStreetMap integration for location viewing

### Admin Features
- **Admin Dashboard** - Analytics with charts (users, bookings, revenue, destinations)
- **Manage Destinations** - CRUD operations for destinations
- **Manage Hotels** - CRUD operations for hotels
- **Manage Packages** - CRUD operations for travel packages
- **Manage Bookings** - View and update booking status
- **Manage Users** - View and toggle user ban/unban status
- **Manage Reviews** - Moderate user reviews

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Styling with glassmorphism effects
- **React Router v6** - Navigation
- **Context API** - State management (Auth, Theme)
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Recharts** - Charts and graphs
- **React-Leaflet** - Maps
- **React-Hot-Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **OpenAI API** - AI trip planning (with mock fallback)

## 📁 Project Structure

```
tourism/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth & error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── seeds/          # Seed data script
│   ├── utils/          # Helper functions
│   ├── .env.example    # Environment variables template
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   │   ├── common/ # Chatbot, Loading, ScrollToTop, StarRating
    │   │   └── layout/ # Footer, Navbar, ProtectedRoute
    │   ├── context/    # AuthContext, ThemeContext
    │   ├── pages/      # Page components
    │   │   └── admin/  # Admin dashboard pages
    │   ├── services/   # API service
    │   ├── App.jsx     # Main app component
    │   └── main.jsx    # Entry point
    └── vite.config.js  # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kavya-2905/toursim_elewayte.git
   cd tourism
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   OPENAI_API_KEY=your_openai_api_key_optional
   ```

5. **Seed the database**
   ```bash
   cd backend
   node seeds/seed.js
   ```

6. **Start the servers**
   
   Backend (in `backend/` folder):
   ```bash
   npm run dev
   ```
   
   Frontend (in `frontend/` folder):
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👤 Default Users

After seeding the database:

| Role  | Email                  | Password |
|-------|------------------------|----------|
| Admin | admin@travelease.com   | admin123 |
| User  | user@travelease.com    | user123  |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination details

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel details

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings

### AI Trip Planner
- `POST /api/ai/generate-plan` - Generate trip plan

### Budget Planner
- `POST /api/budget` - Save budget plan
- `GET /api/budget` - Get user's budget plans

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:type/:id` - Remove from wishlist

## 🎨 Features Showcase

- **10+ Destinations** - Goa, Jaipur, Kerala, Manali, Varanasi, Ladakh, Udaipur, Rishikesh, Darjeeling, Andaman
- **10 Hotels** - Various categories across destinations
- **7 Packages** - Luxury, Budget, Adventure, Family, Couple types
- **Dark Mode** - Full theme support
- **Responsive Design** - Mobile-friendly UI
- **Glassmorphism** - Modern UI effects

## 🔐 Security

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Role-based access control
- CORS enabled for client URL

## 📝 License

MIT License

## 👨‍💻 Author

**V Kavya**
- Email: kavyachandrashekhar29@gmail.com
- Location: Raichur, Karnataka, India

---

