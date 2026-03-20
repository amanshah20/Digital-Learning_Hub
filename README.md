# EduVerse - Advanced Digital Learning Platform

<div align="center">
  <h3>🎓 Transform Your Learning Journey</h3>
  <p>A next-generation Learning Management System with AI-powered features, gamification, and advanced analytics</p>
</div>

## ✨ Features

### 👨‍🎓 Student Dashboard
- **Academic Overview**: Track subjects, attendance, assignments, and exams
- **Smart Attendance**: QR Code, Face Recognition, and Geolocation-based marking
- **Performance Analytics**: Real-time GPA tracking, grade visualization, and performance predictions
- **Gamification System**: XP points, levels, badges, leaderboards, and study streaks
- **Learning Analytics**: AI-powered behavior tracking and personalized recommendations
- **Study Planner**: Smart scheduling with Pomodoro timer and notifications
- **Digital Record System**: Complete academic history and certificates
- **Wellness Tracker**: Mood tracking and mental health support
- **Skill & Career Tracker**: Resume builder and placement readiness score

### 👩‍🏫 Teacher Dashboard
- **Class Management**: Create and manage subjects, materials, and schedules
- **Attendance Management**: Multiple marking methods with QR code generation
- **Student Analytics**: Performance tracking, weak student identification
- **Content Management**: Upload lectures, notes, assignments, and quizzes
- **Communication Hub**: Announcements, chat, and feedback system
- **Intelligence System**: Engagement heatmaps and dropout prediction

### 👨‍💼 Admin Dashboard
- **User Management**: RBAC-based access control for all users
- **Academic Control**: Manage courses, semesters, timetables, and exams
- **System Analytics**: Institution-wide performance metrics
- **Fee Management**: Track payments and generate reports
- **Security**: Audit logs, activity monitoring, and data backup
- **Multi-Institution Support**: SaaS-ready architecture

## 🚀 Technology Stack

### Backend
- **Node.js** + **Express.js** - RESTful API
- **SQLite** - Database (production-ready, easily switchable to PostgreSQL/MySQL)
- **Sequelize ORM** - Database management
- **JWT** + **Passport.js** - Authentication & Google OAuth
- **Socket.IO** - Real-time communication
- **Winston** - Logging
- **Helmet** + **Rate Limiting** - Security

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Three.js** + **React Three Fiber** - 3D graphics
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Query** - Data fetching
- **Zustand** - State management
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Capstone_Project
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Configure environment variables**
```bash
# Copy example env file in server directory
cd server
copy .env.example .env
```

Edit `.env` and configure:
- `JWT_SECRET` - Your JWT secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- Other settings as needed

4. **Initialize database**
```bash
cd server
npm run db:migrate
```

This will create:
- All database tables
- Default admin user (admin@eduverse.com / Admin@123)
- Sample course data

5. **Start the application**
```bash
# From root directory
npm run dev
```

This starts both server (port 5000) and client (port 5173)

Access the application at: http://localhost:5173

## 🔐 Default Credentials

**Admin:**
- Email: admin@eduverse.com
- Password: Admin@123

**Note:** Change the default admin password immediately after first login!

## 📁 Project Structure

```
Capstone_Project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   │   ├── Auth/      # Login, Register
│   │   │   ├── Student/   # Student dashboard
│   │   │   ├── Teacher/   # Teacher dashboard
│   │   │   └── Admin/     # Admin dashboard
│   │   ├── store/         # State management
│   │   ├── utils/         # Utilities
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── database/      # Database setup
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Utilities
│   │   └── server.js      # Server entry point
│   ├── uploads/           # File uploads
│   ├── logs/              # Application logs
│   └── package.json
│
├── .env.example           # Environment variables template
└── package.json           # Root package.json
```

## 🎯 Key Features Implementation

### Authentication
- Email/Password authentication with JWT
- Google OAuth integration
- Role-based access control (Student, Teacher, Admin)
- Secure password hashing with bcrypt

### Real-time Features
- Socket.IO for instant notifications
- Live attendance updates
- Real-time chat system

### Advanced Features
- 3D animated backgrounds using Three.js
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Progressive Web App (PWA) ready
- Optimized performance with lazy loading

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - http://localhost:5000/api/auth/google/callback
6. Copy Client ID and Secret to `.env`

### Database Migration
To reset database:
```bash
cd server
npm run db:migrate
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# Preview production build
npm run preview

# Start production server
cd ../server
npm start
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

More endpoints will be added as features are implemented.

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Secondary**: Purple (#d946ef)
- **Accent**: Orange (#f97316)

### Components
- Glass-morphism cards
- Gradient buttons
- Smooth animations
- 3D visual effects

## 🤝 Contributing

This is an academic capstone project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is created for educational purposes.

## 👥 Support

For issues or questions:
- Create an issue in the repository
- Contact the development team

## 🚀 Roadmap

- [ ] Complete all student dashboard features
- [ ] Implement all teacher features
- [ ] Complete admin panel
- [ ] Add blockchain certificates
- [ ] Implement AI question generator
- [ ] Add video conferencing
- [ ] Mobile app development
- [ ] Multi-language support

## 📸 Screenshots

(Screenshots will be added after deployment)

---

<div align="center">
  <p>Built with ❤️ for the future of education</p>
  <p><strong>EduVerse - Where Learning Meets Innovation</strong></p>
</div>
