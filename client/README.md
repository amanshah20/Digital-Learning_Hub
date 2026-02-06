# LMS Frontend Client

Modern React application with Redux Toolkit, Tailwind CSS, and Socket.IO client.

## Quick Start

```powershell
# Install dependencies
npm install

# Configure .env file
cp .env.example .env

# Start development server
npm start

# Build for production
npm run build
```

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── DashboardLayout.js    # Main layout with sidebar
│   ├── PrivateRoute.js       # Auth protection
│   └── RoleBasedRoute.js     # RBAC protection
├── pages/              # Page components
│   ├── auth/
│   │   ├── Login.js
│   │   └── Register.js
│   └── dashboards/
│       ├── student/          # Student pages
│       ├── teacher/          # Teacher pages
│       └── admin/            # Admin pages
├── redux/              # State management
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       ├── courseSlice.js
│       └── notificationSlice.js
├── services/           # API layer
│   ├── api.js              # Axios instance
│   ├── apiService.js       # API methods
│   └── socketService.js    # Socket.IO
├── App.js
├── index.js
└── index.css
```

## Key Features

### Authentication Flow
1. User enters credentials on `/login`
2. Redux `login` action dispatched
3. JWT tokens stored in localStorage
4. Socket.IO connection established
5. User redirected to role-specific dashboard

### Token Refresh
- Axios interceptor catches 401 errors
- Automatically attempts token refresh
- Retries original request with new token
- Redirects to login if refresh fails

### Real-Time Updates
Socket.IO integration for:
- Attendance notifications
- Exam alerts
- New notifications
- Live updates

### State Management

#### Auth Slice
```javascript
{
  user: { id, firstName, lastName, email, role },
  isAuthenticated: boolean,
  loading: boolean,
  error: string
}
```

#### Course Slice
```javascript
{
  enrolledCourses: [],
  teacherCourses: [],
  currentCourse: null,
  loading: boolean,
  error: string
}
```

#### Notification Slice
```javascript
{
  notifications: [],
  unreadCount: number,
  loading: boolean
}
```

## Components

### DashboardLayout
Reusable layout component with:
- Responsive sidebar (collapsible on mobile)
- Top navigation bar
- Notification bell with counter
- Profile dropdown menu
- Role-specific navigation items

### PrivateRoute
Protects routes requiring authentication:
- Checks if user is authenticated
- Redirects to `/login` if not
- Wraps child components

### RoleBasedRoute
Enforces role-based access:
- Verifies user role
- Redirects to appropriate dashboard if unauthorized
- Accepts `allowedRoles` prop

## Pages

### Student Dashboard
- Overview with stat cards
- Enrolled courses grid
- Attendance percentage
- Pending assignments counter
- Recent activity feed

### Teacher Dashboard
- Course statistics
- Total students count
- Pending reviews counter
- Course management cards
- Recent submissions

### Admin Dashboard
- Platform-wide statistics
- User counts by role
- Course analytics
- Quick action buttons
- System health indicators
- Activity logs

## Styling

### Tailwind Configuration
Custom theme with:
- Primary colors: Blue shades
- Secondary colors: Purple shades
- Custom card styles
- Button variants
- Badge components

### Custom Classes
```css
.card - White card with shadow
.btn-primary - Primary button style
.btn-secondary - Secondary button style
.input-field - Styled input field
.badge - Badge component
```

## API Service

### Structure
```javascript
authService {
  register, login, logout,
  getProfile, updateProfile
}

courseService {
  getAllCourses, getCourse,
  createCourse, updateCourse,
  enrollCourse, getEnrolledCourses
}

attendanceService {
  createSession, markAttendance,
  getStudentAttendance
}

assignmentService {
  getCourseAssignments, createAssignment,
  submitAssignment, gradeSubmission
}

examService {
  getCourseExams, submitExam,
  getResults
}

notificationService {
  getNotifications, markAsRead
}

adminService {
  getAllUsers, getAllCourses,
  getAnalytics, getActivityLogs
}
```

## Socket.IO Usage

```javascript
// Connect
socketService.connect(userId);

// Listen for events
socketService.onNotification((notification) => {
  // Handle notification
});

// Disconnect
socketService.disconnect();
```

## Available Scripts

### `npm start`
Runs app in development mode on http://localhost:3000

### `npm run build`
Builds app for production to `build/` folder

### `npm test`
Launches test runner in interactive mode

### `npm run eject`
Ejects from Create React App (one-way operation)

## Deployment

### Build Optimization
```powershell
npm run build
```

Creates optimized production build with:
- Minified JavaScript
- CSS optimization
- Asset compression
- Source maps

### Hosting Options
- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repo
- **AWS S3**: Upload build folder + CloudFront CDN

### Environment Variables (Production)
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_SOCKET_URL=https://api.yourdomain.com
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting (React.lazy)
- Redux DevTools disabled in production
- Image optimization
- Memoized selectors
- Debounced API calls

## Security

- No sensitive data in localStorage (only tokens)
- XSS protection via React
- CSRF protection via JWT
- CORS configuration
- Secure HTTP headers

## Troubleshooting

### Issue: Blank page after build
**Solution**: Check console for errors, ensure API_URL is correct

### Issue: Socket not connecting
**Solution**: Verify SOCKET_URL, check CORS configuration

### Issue: 401 errors
**Solution**: Token may be expired, clear localStorage and re-login

## Contributing

Follow these guidelines:
1. Use functional components with hooks
2. Follow Tailwind utility-first approach
3. Use Redux for global state only
4. Keep components small and focused
5. Add PropTypes for component props
6. Write meaningful commit messages
