# ⚡ QUICK START INSTRUCTIONS

Your LMS application is almost ready! Follow these steps:

## ❌ Current Issue: MongoDB Not Connected

The backend server is running but cannot connect to MongoDB database.

## ✅ FASTEST SOLUTION: MongoDB Atlas (Cloud - FREE)

### 1. Create MongoDB Atlas Account (2 minutes)
- Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up with email/Google
- Verify email

### 2. Create Free Cluster (1 minute)
- Click "Build a Database"
- Choose "FREE" M0 tier
- Select your nearest region
- Click "Create"

### 3. Create Database User (1 minute)
- In "Database Access" tab → Add New User
- Username: `lms_admin`
- Password: Click "Autogenerate Secure Password" (SAVE THIS!)
- Database User Privileges: "Atlas Admin"
- Click "Add User"

### 4. Whitelist IP Address (30 seconds)
- In "Network Access" tab → Add IP Address
- Click "Allow Access from Anywhere"
- This adds `0.0.0.0/0` (for development only)
- Click "Confirm"

### 5. Get Connection String (30 seconds)
- Go back to "Database" tab
- Click "Connect" button on your cluster
- Choose "Connect your application"
- Copy the connection string
- It looks like: `mongodb+srv://lms_admin:<password>@cluster.mongodb.net/`

### 6. Update Your .env File
Open `server\.env` and replace the MONGODB_URI line with:

```
MONGODB_URI=mongodb+srv://lms_admin:YOUR_PASSWORD_HERE@cluster.mongodb.net/lms_db?retryWrites=true&w=majority
```

**IMPORTANT**: Replace `YOUR_PASSWORD_HERE` with the password you saved!

### 7. Restart Backend Server
```powershell
# Stop the current server (Ctrl+C in the backend terminal)
# Or just close the PowerShell window and open a new one

cd G:\Semester-7\Capstone_Project\server
node server.js
```

---

## 🎉 Once MongoDB is Connected

You'll see:
```
✓ MongoDB connected successfully
✓ Server running on port 5000
✓ Socket.IO initialized
```

Then your app will be fully functional:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

---

## 📝 Default Test Accounts

After MongoDB is connected, register accounts at:
http://localhost:3000/register

**Test Student**:
- Email: student@test.com
- Password: Test1234
- Role: Student

**Test Teacher**:
- Email: teacher@test.com
- Password: Test1234
- Role: Teacher

---

## 🔄 Alternative: Install MongoDB Locally

If you prefer local MongoDB:

1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings (installs as Windows service)
3. MongoDB will automatically start
4. Keep current .env setting: `MONGODB_URI=mongodb://localhost:27017/digital_learning_hub`
5. Restart backend server

---

## ⚠️ Current Status

✅ Backend server: **RUNNING** (waiting for MongoDB)
✅ Frontend React app: **READY TO START**
❌ Database: **NOT CONNECTED**

---

## 🚀 Next Steps

1. **SETUP MONGODB** (follow steps above)
2. **Restart backend** after updating .env
3. **Open browser** to http://localhost:3000
4. **Register** your first user
5. **Start using** the LMS!

---

Need help? Check these files:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [README.md](README.md) - Project overview
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
