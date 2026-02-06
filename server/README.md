# LMS Backend Server

Production-ready Node.js + Express.js backend with MongoDB, JWT authentication, and Socket.IO.

## Quick Start

```powershell
# Install dependencies
npm install

# Configure .env file (copy from .env.example)
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/lms_db
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_secret_here
CLIENT_URL=http://localhost:3000
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## Database Models

### User
- Email, password (bcrypt hashed)
- Role: student, teacher, admin
- Auto-generated studentId/teacherId
- Login attempt tracking and account locking

### Course
- Title, code, description, duration
- Instructor reference
- Enrollment tracking with progress
- Lessons array

### Attendance
- Session-based tracking
- Device fingerprinting
- IP and geolocation validation
- Anomaly detection system

### Assignment
- Course reference, due dates
- Submissions with file uploads
- Grading system

### Exam
- Multiple question types
- Auto-grading for MCQs
- Result tracking

### Notification
- Real-time alerts via Socket.IO
- Read/unread tracking
- Priority levels

## API Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

Token refresh flow:
1. Access token expires (15 minutes)
2. Frontend automatically calls `/api/auth/refresh-token` with refresh token
3. New access token returned
4. Original request retried

## Rate Limiting

- Auth routes: 5 requests per 15 minutes
- API routes: 100 requests per 15 minutes  
- Upload routes: 50 requests per hour

## File Uploads

- Max file size: 10MB
- Allowed types: PDF, DOC, DOCX, PPT, PPTX, ZIP
- Storage: `./uploads` directory
- Multer middleware configured

## Socket.IO Events

### Server emits:
- `attendance:update` - New attendance marked
- `notification:new` - New notification
- `exam:update` - Exam status change

### Client sends:
- `join` - Join user room

## Error Handling

Centralized error handler returns:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Security Features

- Helmet for HTTP headers
- CORS configuration
- bcrypt password hashing (12 rounds)
- JWT token rotation
- Input validation (express-validator)
- Rate limiting
- XSS protection
- Account lockout after 5 failed attempts

## Logging

Winston logger configured with:
- Console transport (development)
- File transport (production)
- Timestamp and level formatting

## Database Indexes

Optimized queries with indexes on:
- User: email (unique)
- Course: courseCode (unique), instructor
- Attendance: course, student
- Assignment: course, dueDate

## Attendance Algorithm

Advanced features:
- Geolocation validation (radius check)
- Device fingerprinting (one device per session by default)
- IP whitelisting
- Time window enforcement
- Late threshold tracking
- Anomaly detection (unusual patterns)

## Admin API

Special routes for platform management:
- User CRUD operations
- Course oversight
- Activity logs retrieval
- Platform analytics

## Production Checklist

- [ ] Set strong JWT secrets (32+ characters)
- [ ] Configure MongoDB Atlas production cluster
- [ ] Enable MongoDB authentication
- [ ] Set NODE_ENV=production
- [ ] Configure SMTP for email notifications
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Configure automated backups
- [ ] Review and adjust rate limits
