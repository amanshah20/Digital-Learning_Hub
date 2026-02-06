# Complete Setup Guide - DLH Learning Management System

Follow these steps carefully to set up the entire LMS platform on your local machine.

---

## Prerequisites Installation

### 1. Install Node.js
1. Download Node.js v16.x or higher from https://nodejs.org/
2. Run the installer and follow prompts
3. Verify installation:
```powershell
node --version
npm --version
```

### 2. Install MongoDB

#### Option A: MongoDB Community Edition (Local)
1. Download from https://www.mongodb.com/try/download/community
2. Run installer with default settings
3. MongoDB will install as Windows service
4. Verify:
```powershell
net start MongoDB
mongo --version
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier M0)
3. Create database user with password
4. Whitelist IP: 0.0.0.0/0 (for development)
5. Get connection string from "Connect" → "Connect your application"

### 3. Install Git (if not already installed)
1. Download from https://git-scm.com/
2. Install with default settings
3. Verify: `git --version`

---

## Step 1: Project Setup

### Clone or Create Project Directory
```powershell
# If using Git
git clone <repository-url>
cd Capstone_Project

# Or create manually
mkdir Capstone_Project
cd Capstone_Project
```

---

## Step 2: Backend Setup

### Navigate to Server Directory
```powershell
cd server
```

### Install Dependencies
```powershell
npm install
```

This will install:
- express (v4.18.2)
- mongoose (v8.0.3)
- jsonwebtoken (v9.0.2)
- bcryptjs (v2.4.3)
- socket.io (v4.6.1)
- And all other required packages

**Expected time**: 2-3 minutes

### Configure Environment Variables

1. Create `.env` file in `server` directory:
```powershell
# Create file
New-Item .env
```

2. Open `.env` in VS Code or notepad and paste:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - LOCAL MONGODB
MONGODB_URI=mongodb://localhost:27017/lms_db

# OR - MONGODB ATLAS (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms_db?retryWrites=true&w=majority

# JWT Secrets - GENERATE STRONG RANDOM STRINGS
JWT_ACCESS_SECRET=dlh_lms_access_secret_2024_production_key_min_32_chars_required
JWT_REFRESH_SECRET=dlh_lms_refresh_secret_2024_production_key_min_32_chars_required

# Token Expiry
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Frontend URL
CLIENT_URL=http://localhost:3000

# Email Configuration (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

3. **IMPORTANT**: Replace JWT secrets with your own strong random strings in production

### Generate Secure JWT Secrets (Recommended)
```powershell
# In PowerShell, run twice to get two different secrets:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Start Backend Server
```powershell
# Development mode (with auto-reload)
npm run dev

# You should see:
# ✓ MongoDB connected
# ✓ Server running on port 5000
# ✓ Socket.IO initialized
```

**Keep this terminal open**

---

## Step 3: Frontend Setup

### Open New Terminal (Keep backend running)
```powershell
# Navigate to client directory from project root
cd client
```

### Install Dependencies
```powershell
npm install
```

This will install:
- react (v18.2.0)
- redux toolkit (v2.0.1)
- react-router-dom (v6.21.1)
- axios (v1.6.2)
- tailwindcss (v3.4.0)
- And all other required packages

**Expected time**: 3-5 minutes

### Configure Environment Variables

1. Create `.env` file in `client` directory:
```powershell
New-Item .env
```

2. Add this content:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Start Frontend Development Server
```powershell
npm start
```

Browser will automatically open at http://localhost:3000

**Expected time to compile**: 30-60 seconds

---

## Step 4: Verify Installation

### Check Backend
1. Open browser → http://localhost:5000
2. You should see JSON response or server message

### Check Frontend
1. Should automatically open at http://localhost:3000
2. You should see the Login page

### Test Complete Flow

#### 1. **Register a Student Account**
- Navigate to http://localhost:3000/register
- Select "Student" role
- Fill in:
  - First Name: John
  - Last Name: Doe
  - Email: student@test.com
  - Password: Test1234
  - Confirm Password: Test1234
- Click "Create Account"

#### 2. **Login as Student**
- Should redirect to login automatically
- Enter email: student@test.com
- Password: Test1234
- Click "Sign In"
- Should redirect to `/student` dashboard

#### 3. **Register a Teacher Account**
- Logout or open incognito window
- Go to /register
- Select "Teacher" role
- Email: teacher@test.com
- Password: Test1234
- Login → Should go to `/teacher` dashboard

#### 4. **Create Admin User (Via MongoDB)**
Since there's no admin registration, create manually:

**MongoDB Compass Method:**
1. Open MongoDB Compass
2. Connect to: mongodb://localhost:27017
3. Select `lms_db` database
4. Go to `users` collection
5. Click "Insert Document"
6. Paste this JSON:
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@dlh.com",
  "password": "$2a$12$K8R7bXYzxgC.mHvBTOVxmO7GEGNvVxU.123.hashed",
  "role": "admin",
  "isActive": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```
**Note**: You'll need to hash password properly. Better to use API or registration endpoint with role override.

**Alternative - Via API (Postman/Thunder Client):**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@dlh.com",
  "password": "Admin123!",
  "role": "admin"
}
```

Then login at /login with these credentials.

---

## Step 5: Test Key Features

### Test Real-Time Notifications
1. Login as student in one browser
2. Login as teacher in another browser (incognito)
3. Teacher creates a course
4. Student should receive real-time notification

### Test Attendance
1. Login as teacher
2. Navigate to Attendance
3. Create attendance session with geolocation
4. Login as student
5. Try to mark attendance (device/location validated)

### Test Course Enrollment
1. Login as teacher → Create a course
2. Login as student → Browse courses → Enroll
3. Check "My Courses" - should appear

---

## Common Setup Issues

### Issue: "MongoDB connection failed"
**Solutions:**
1. If using local MongoDB:
   ```powershell
   net start MongoDB
   ```
2. If using Atlas:
   - Check connection string format
   - Verify IP whitelist (0.0.0.0/0 for dev)
   - Ensure user has read/write permissions

### Issue: "Port 5000 already in use"
**Solutions:**
1. Find and kill process:
   ```powershell
   netstat -ano | findstr :5000
   taskkill /PID <process_id> /F
   ```
2. Or change PORT in server/.env to 5001

### Issue: "Port 3000 already in use"
**Solution:**
```powershell
# Will prompt to run on different port (3001)
# Or set PORT=3001 in client environment
```

### Issue: "Module not found" errors
**Solution:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: CORS errors in browser console
**Solution:**
1. Verify CLIENT_URL in server/.env matches frontend URL
2. Check both servers are running
3. Clear browser cache

### Issue: "JWT malformed" or token errors
**Solution:**
1. Clear browser localStorage:
   - Open DevTools → Application → Local Storage → Clear
2. Re-login

### Issue: React shows blank page
**Solution:**
1. Check browser console for errors
2. Verify .env variables are correct
3. Try hard refresh: Ctrl + Shift + R

---

## Optional: Install Database GUI Tools

### MongoDB Compass (Recommended)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: mongodb://localhost:27017
3. Browse collections, documents visually

### MongoDB Shell (mongosh)
```powershell
# Install
npm install -g mongosh

# Connect
mongosh mongodb://localhost:27017
```

---

## Development Workflow

### Daily Startup
1. **Start MongoDB** (if local):
   ```powershell
   net start MongoDB
   ```

2. **Start Backend** (Terminal 1):
   ```powershell
   cd server
   npm run dev
   ```

3. **Start Frontend** (Terminal 2):
   ```powershell
   cd client
   npm start
   ```

### Before Committing Code
```powershell
# Format code
npm run format

# Run linting
npm run lint

# Run tests
npm test
```

---

## Next Steps After Setup

1. **Explore the dashboards**: Login as different roles
2. **Test API endpoints**: Use Postman or Thunder Client extension
3. **Check database**: View collections in MongoDB Compass
4. **Read documentation**: Review README files in server/ and client/
5. **Customize**: Modify colors, branding in Tailwind config

---

## Production Deployment Checklist

- [ ] Change JWT secrets to production values
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas for database
- [ ] Enable MongoDB authentication
- [ ] Configure SMTP for real emails
- [ ] Set up SSL certificates (HTTPS)
- [ ] Configure reverse proxy (nginx)
- [ ] Set up PM2 for process management
- [ ] Configure automated backups
- [ ] Set up monitoring (logs, errors)
- [ ] Review and adjust rate limits
- [ ] Enable compression
- [ ] Optimize bundle size
- [ ] Set up CDN for static assets

---

## Getting Help

### Check Logs
**Backend logs:**
- Console output in terminal
- `server/logs/` directory (if configured)

**Frontend logs:**
- Browser DevTools → Console
- Network tab for API calls

### Documentation
- Main README.md
- server/README.md
- client/README.md

### Common Commands Reference
```powershell
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Check Node version
node --version

# Check MongoDB status
net start MongoDB
mongosh --version

# Clear npm cache
npm cache clean --force

# Update all packages
npm update

# Check for vulnerabilities
npm audit
npm audit fix
```

---

## Success Criteria

✅ Backend server running on port 5000
✅ Frontend server running on port 3000
✅ MongoDB connected successfully
✅ Can register new users
✅ Can login and see role-based dashboard
✅ Socket.IO connected (check DevTools → Network → WS)
✅ No errors in console
✅ Can navigate between pages
✅ Tokens stored in localStorage
✅ API calls successful (check Network tab)

---

**Setup Complete! 🎉**

You now have a fully functional LMS platform running locally. Start building and customizing!
