# 🚀 Quick Start Guide - EduVerse

## Prerequisites Check
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)

## Installation (5 minutes)

### Step 1: Install All Dependencies
```bash
# Navigate to project root
cd g:\Semester-7\Capstone_Project

# Install all dependencies at once
npm install
```

### Step 2: Setup Database
```bash
# Navigate to server directory
cd server

# Run database migration (creates tables + default admin)
npm run db:migrate
```

You should see:
```
✅ Database tables created successfully
✅ Default admin user created
   Email: admin@eduverse.com
   Password: Admin@123
```

### Step 3: Start the Application
```bash
# Go back to root directory
cd ..

# Start both client and server
npm run dev
```

This will start:
- **Backend Server**: http://localhost:5000
- **Frontend Client**: http://localhost:5173

## First Login

### Option 1: Admin Login
1. Open browser to http://localhost:5173
2. Click "Sign In"
3. Use credentials:
   - Email: `admin@eduverse.com`
   - Password: `Admin@123`

### Option 2: Register as Student/Teacher
1. Click "Register now"
2. Choose role (Student or Teacher)
3. Fill in details:
   - **Student**: Provide enrollment number (e.g., ENR2024001)
   - **Teacher**: Provide employee ID (e.g., EMP2024001)
4. Click "Create Account"

### Option 3: Google OAuth (Optional)
1. First setup Google OAuth in `.env` file
2. Click "Sign in as Student" or "Sign in as Teacher"
3. Authenticate with Google

## Testing the Platform

### As Student
- View dashboard with stats
- Check attendance page
- Browse subjects
- View gamification achievements

### As Teacher
- View classes overview
- Manage attendance
- Create assignments
- View student analytics

### As Admin
- Manage users
- View system analytics
- Configure courses
- Monitor security logs

## Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Kill process on port 5000 (Backend)
npx kill-port 5000

# Kill process on port 5173 (Frontend)
npx kill-port 5173
```

### Issue: Database Not Found
```bash
cd server
npm run db:migrate
```

### Issue: Dependencies Error
```bash
# Clean install
rm -rf node_modules
npm install
```

### Issue: Can't Access from Other Devices
Update `client\.env`:
```
VITE_API_URL=http://YOUR_IP_ADDRESS:5000/api
```

And `server\.env`:
```
CLIENT_URL=http://YOUR_IP_ADDRESS:5173
```

## Development Commands

### Root Directory
- `npm run dev` - Start both client and server
- `npm run client` - Start only frontend
- `npm run server` - Start only backend

### Client Directory
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

### Server Directory
- `npm run dev` - Development with nodemon
- `npm start` - Production mode
- `npm run db:migrate` - Reset and migrate database

## File Structure Overview

```
Capstone_Project/
├── client/              # React Frontend
│   ├── src/
│   │   ├── pages/      # Student, Teacher, Admin dashboards
│   │   ├── components/ # Reusable components
│   │   └── store/      # State management
│   └── package.json
│
├── server/              # Node.js Backend
│   ├── src/
│   │   ├── models/     # Database models
│   │   ├── routes/     # API endpoints
│   │   └── server.js   # Main server file
│   └── package.json
│
├── .env.example        # Environment template
└── README.md           # Full documentation
```

## Next Steps

1. ✅ Explore all three dashboards
2. ✅ Customize student/teacher data
3. ✅ Test attendance marking features
4. ✅ Try gamification system
5. ✅ Check analytics and reports

## Google OAuth Setup (Optional)

If you want to enable Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy credentials to `server\.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

## Production Deployment

When ready to deploy:

1. Build frontend:
   ```bash
   cd client
   npm run build
   ```

2. Set environment to production in `server\.env`:
   ```
   NODE_ENV=production
   ```

3. Use production database (PostgreSQL/MySQL instead of SQLite)

4. Deploy to cloud provider (Vercel, Heroku, AWS, etc.)

## Features Overview

### ✨ Implemented
- ✅ Role-based authentication (Student, Teacher, Admin)
- ✅ Google OAuth integration
- ✅ Beautiful 3D UI with animations
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Complete dashboard layouts
- ✅ Real-time notifications setup
- ✅ Database models for all features
- ✅ Security (JWT, rate limiting, audit logs)

### 🚧 Ready to Implement (Backend APIs Available)
- Attendance marking (QR, Face, Geo)
- Assignment submission and grading
- Quiz creation and attempts
- Performance analytics
- Gamification (XP, badges, levels)
- Study planner
- Material upload/download
- Chat and announcements

## Support

Need help? Check:
1. README.md for full documentation
2. Check console for error messages
3. Verify all dependencies installed
4. Ensure ports 5000 and 5173 are available

---

**You're all set! Happy coding!** 🎉

Visit: http://localhost:5173
