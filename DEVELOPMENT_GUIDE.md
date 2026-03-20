# 🛠️ Development Guide - Adding Features to EduVerse

## How to Add New Features

### Adding a New API Endpoint

1. **Create the route file** (e.g., `server/src/routes/students.js`)
```javascript
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Example: Get student profile
router.get('/profile', protect, authorize('student'), async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
```

2. **Register the route in server.js**
```javascript
import studentRoutes from './routes/students.js';
app.use('/api/students', studentRoutes);
```

### Adding a New Database Model

1. **Create model file** (`server/src/models/YourModel.js`)
```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const YourModel = sequelize.define('YourModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Add your fields
}, {
  timestamps: true
});

export default YourModel;
```

2. **Add to index.js** (`server/src/models/index.js`)
```javascript
import YourModel from './YourModel.js';

// Add associations if needed
YourModel.belongsTo(User, { foreignKey: 'userId' });

export { YourModel };
```

### Adding a New Frontend Page

1. **Create page component** (`client/src/pages/Student/pages/NewFeature.jsx`)
```javascript
import React from 'react';
import { motion } from 'framer-motion';

const NewFeature = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h1 className="text-3xl font-bold">New Feature</h1>
      </motion.div>
    </div>
  );
};

export default NewFeature;
```

2. **Add route** in `Dashboard.jsx`
```javascript
import NewFeature from './pages/NewFeature';

// In navItems array
{ path: 'new-feature', icon: YourIcon, label: 'New Feature' }

// In Routes
<Route path="new-feature" element={<NewFeature />} />
```

### Making API Calls from Frontend

1. **Create API function** (`client/src/utils/api.js` or separate file)
```javascript
import api from './api';

export const getStudentProfile = async () => {
  const { data } = await api.get('/students/profile');
  return data;
};
```

2. **Use in component with React Query**
```javascript
import { useQuery } from '@tanstack/react-query';
import { getStudentProfile } from '../utils/api';

const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-profile'],
    queryFn: getStudentProfile
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Use data here */}</div>;
};
```

## Implementing Specific Features

### QR Code Attendance

**Backend:**
```javascript
// Generate QR for class
import QRCode from 'qrcode';

router.post('/classes/:id/qr', async (req, res) => {
  const { id } = req.params;
  const data = { classId: id, timestamp: Date.now() };
  const qrCode = await QRCode.toDataURL(JSON.stringify(data));
  
  await Class.update({ qrCode, qrExpiry: Date.now() + 300000 }, { where: { id } });
  res.json({ success: true, qrCode });
});

// Mark attendance via QR
router.post('/attendance/qr', async (req, res) => {
  const { qrData } = req.body;
  const { classId, timestamp } = JSON.parse(qrData);
  
  // Verify QR not expired
  // Create attendance record
  
  res.json({ success: true });
});
```

**Frontend:**
```javascript
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = () => {
  const startScanning = () => {
    const scanner = new Html5Qrcode("reader");
    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        // Send to API
        markAttendance({ qrData: decodedText });
      }
    );
  };

  return <div id="reader"></div>;
};
```

### File Upload (Assignment Submission)

**Backend:**
```javascript
import multer from 'multer';

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/assignments/:id/submit', 
  protect, 
  upload.array('files', 5),
  async (req, res) => {
    const files = req.files.map(f => ({
      name: f.originalname,
      path: f.path,
      size: f.size
    }));
    
    await AssignmentSubmission.create({
      assignmentId: req.params.id,
      studentId: req.user.Student.id,
      files
    });
    
    res.json({ success: true });
  }
);
```

**Frontend:**
```javascript
import { useDropzone } from 'react-dropzone';

const FileUpload = () => {
  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('files', file);
    });
    
    await api.post('/assignments/123/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-8">
      <input {...getInputProps()} />
      <p>Drag files here or click to select</p>
    </div>
  );
};
```

### Real-time Notifications

**Backend:**
```javascript
// In server.js, io is already setup
import { io } from './server.js';

// Send notification
export const sendNotification = (userId, notification) => {
  io.to(`user-${userId}`).emit('notification', notification);
};

// In routes
router.post('/announcements', async (req, res) => {
  const announcement = await Announcement.create(req.body);
  
  // Send to all students
  req.app.get('io').emit('announcement', announcement);
  
  res.json({ success: true, announcement });
});
```

**Frontend:**
```javascript
import io from 'socket.io-client';

useEffect(() => {
  const socket = io('http://localhost:5000');
  
  socket.emit('join-room', `user-${user.id}`);
  
  socket.on('notification', (notification) => {
    toast.info(notification.message);
  });
  
  return () => socket.disconnect();
}, []);
```

### Adding Charts

```javascript
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const MyChart = () => {
  const data = [
    { month: 'Jan', score: 85 },
    { month: 'Feb', score: 88 },
    { month: 'Mar', score: 90 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#8b5cf6" />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

## Best Practices

### 1. Error Handling
```javascript
// Backend
try {
  // Your code
} catch (error) {
  logger.error('Error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong' 
  });
}

// Frontend
try {
  await api.post('/endpoint', data);
  toast.success('Success!');
} catch (error) {
  toast.error(error.response?.data?.message || 'Error occurred');
}
```

### 2. Loading States
```javascript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await api.post('/endpoint', data);
  } finally {
    setLoading(false);
  }
};

return (
  <button disabled={loading} className="btn-primary">
    {loading ? <div className="loading-spinner" /> : 'Submit'}
  </button>
);
```

### 3. Form Validation
```javascript
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!formData.name) newErrors.name = 'Name is required';
  if (!formData.email) newErrors.email = 'Email is required';
  return newErrors;
};

const handleSubmit = (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  // Submit form
};
```

### 4. Responsive Design
```javascript
// Use Tailwind responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>

// Or use hooks
import { useMediaQuery } from '@/hooks/useMediaQuery';

const isMobile = useMediaQuery('(max-width: 768px)');
```

### 5. Animations
```javascript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

## Testing

### Unit Tests (Jest)
```javascript
// Install: npm install --save-dev jest
describe('Authentication', () => {
  it('should login successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password' });
    
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
```

### Component Tests (React Testing Library)
```javascript
import { render, screen } from '@testing-library/react';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByText('Sign In')).toBeInTheDocument();
});
```

## Debugging Tips

1. **Check console** for errors
2. **Use React DevTools** for component inspection
3. **Network tab** to see API requests
4. **Backend logs** in `server/src/logs/`
5. **Database viewer** for SQLite (DB Browser)

## Common Issues & Solutions

### Issue: CORS Error
**Solution:** Check `server/src/server.js` CORS configuration

### Issue: Token Expired
**Solution:** Implement token refresh or increase JWT_EXPIRE

### Issue: Port Already in Use
**Solution:** `npx kill-port 5000` or `npx kill-port 5173`

### Issue: Module Not Found
**Solution:** `npm install` in respective directory

### Issue: Database Locked
**Solution:** Close DB viewers, restart server

## Performance Optimization

1. **Code Splitting**
```javascript
const LazyComponent = lazy(() => import('./Component'));

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

2. **Memoization**
```javascript
const memoizedValue = useMemo(() => expensiveFunction(), [deps]);
const memoizedCallback = useCallback(() => {}, [deps]);
```

3. **Image Optimization**
- Use WebP format
- Lazy load images
- Compress before upload

4. **Database Indexing**
```javascript
// In model definition
indexes: [
  { fields: ['email'] },
  { fields: ['studentId', 'date'] }
]
```

## Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Update environment variables
- [ ] Build frontend (`npm run build`)
- [ ] Setup production database
- [ ] Configure domain and SSL
- [ ] Setup monitoring
- [ ] Enable logging
- [ ] Backup strategy
- [ ] Performance testing
- [ ] Security audit

---

Happy coding! 🚀
