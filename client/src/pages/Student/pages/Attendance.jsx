import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, QrCode, MapPin, Camera, X, Clock, Loader } from 'lucide-react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [attendanceStats, setAttendanceStats] = useState({
    overall: 0,
    present: 0,
    absent: 0,
    late: 0
  });
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showQRModal, setShowQRModal] = useState(false);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  
  // Submission states
  const [submitting, setSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  
  // Camera refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchAttendance();
    fetchSubjects();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/student/attendance');
      if (data.success) {
        setAttendanceStats(data.stats);
        setAttendanceHistory(data.history);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await api.get('/student/subjects');
      if (data.success) {
        setSubjects(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  // QR Code Scanning
  const handleScanQR = async () => {
    if (!qrCode.trim()) {
      toast.error('Please enter a QR code');
      return;
    }
    
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post('/student/attendance/mark', {
        method: 'qr',
        qrCode: qrCode.trim(),
        subjectId: selectedSubject
      });

      if (data.success) {
        toast.success('Attendance marked successfully via QR!');
        setShowQRModal(false);
        setQrCode('');
        setSelectedSubject('');
        fetchAttendance();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  // Face Recognition
  const startFaceRecognition = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      toast.error('Cannot access camera. Please check permissions.');
    }
  };

  const captureFace = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    try {
      setSubmitting(true);
      
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        const imageData = canvasRef.current.toDataURL('image/jpeg');

        const { data } = await api.post('/student/attendance/mark', {
          method: 'face',
          faceImage: imageData,
          subjectId: selectedSubject
        });

        if (data.success) {
          toast.success('Attendance marked successfully via Face Recognition!');
          stopFaceRecognition();
          setShowFaceModal(false);
          setSelectedSubject('');
          fetchAttendance();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to capture face');
    } finally {
      setSubmitting(false);
    }
  };

  const stopFaceRecognition = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  // Geolocation
  const handleGeolocation = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    try {
      setSubmitting(true);
      
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude, accuracy } = position.coords;

      const { data } = await api.post('/student/attendance/mark', {
        method: 'geolocation',
        latitude,
        longitude,
        accuracy,
        subjectId: selectedSubject
      });

      if (data.success) {
        toast.success('Attendance marked successfully via Geolocation!');
        setShowGeoModal(false);
        setSelectedSubject('');
        fetchAttendance();
      }
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        toast.error('Please enable location services');
      } else {
        toast.error(error.response?.data?.message || 'Failed to get location');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Manual Attendance
  const handleManualAttendance = async () => {
    if (!selectedSubject) {
      toast.error('Please select a subject');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post('/student/attendance/mark', {
        method: 'manual',
        subjectId: selectedSubject
      });

      if (data.success) {
        toast.success('Attendance marked successfully!');
        setShowManualModal(false);
        setSelectedSubject('');
        fetchAttendance();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h1 className="text-3xl font-bold mb-2">Attendance Tracker</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track your presence and maintain consistency
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {attendanceStats.overall}%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Overall</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-4xl font-bold text-green-600 mb-2">
            {attendanceStats.present}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Present</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-4xl font-bold text-red-600 mb-2">
            {attendanceStats.absent}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Absent</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-4xl font-bold text-orange-600 mb-2">
            {attendanceStats.late}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Late</div>
        </motion.div>
      </div>

      {/* Mark Attendance Methods */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowQRModal(true)}
            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 hover:from-primary-500/30 hover:to-primary-600/30 border border-primary-500/50 transition-all"
          >
            <QrCode className="w-8 h-8 text-primary-600" />
            <span className="font-semibold">Scan QR</span>
          </button>
          <button 
            onClick={() => {
              setShowFaceModal(true);
              startFaceRecognition();
            }}
            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-500/50 transition-all"
          >
            <Camera className="w-8 h-8 text-purple-600" />
            <span className="font-semibold">Face Recognition</span>
          </button>
          <button 
            onClick={() => setShowGeoModal(true)}
            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/50 transition-all"
          >
            <MapPin className="w-8 h-8 text-green-600" />
            <span className="font-semibold">Geolocation</span>
          </button>
          <button 
            onClick={() => setShowManualModal(true)}
            className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 border border-orange-500/50 transition-all"
          >
            <CalendarIcon className="w-8 h-8 text-orange-600" />
            <span className="font-semibold">Manual</span>
          </button>
        </div>
      </div>

      {/* Attendance History */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Attendance History</h2>
        <div className="space-y-2">
          {attendanceHistory.map((record, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  record.status === 'present' ? 'bg-green-500/20 text-green-600' :
                  record.status === 'late' ? 'bg-orange-500/20 text-orange-600' :
                  'bg-red-500/20 text-red-600'
                }`}>
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold">{record.subject}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs badge badge-info">{record.method}</span>
                <span className={`badge ${
                  record.status === 'present' ? 'badge-success' :
                  record.status === 'late' ? 'badge-warning' :
                  'badge-danger'
                }`}>
                  {record.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Scan QR Code</h3>
              <button onClick={() => setShowQRModal(false)} className="text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                >
                  <option value="">Choose a subject...</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Enter QR Code</label>
                <input
                  type="text"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="Scan or paste QR code"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScanQR}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary-600 text-white flex items-center justify-center gap-2"
                >
                  {submitting && <Loader className="w-4 h-4 animate-spin" />}
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Face Recognition Modal */}
      {showFaceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Face Recognition</h3>
              <button 
                onClick={() => {
                  setShowFaceModal(false);
                  stopFaceRecognition();
                }} 
                className="text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                >
                  <option value="">Choose a subject...</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
              </div>
              <canvas ref={canvasRef} className="hidden" width="320" height="240" />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowFaceModal(false);
                    stopFaceRecognition();
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={captureFace}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white flex items-center justify-center gap-2"
                >
                  {submitting && <Loader className="w-4 h-4 animate-spin" />}
                  Capture
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Geolocation Modal */}
      {showGeoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Mark via Geolocation</h3>
              <button onClick={() => setShowGeoModal(false)} className="text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                >
                  <option value="">Choose a subject...</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Your location will be verified to confirm you are at the correct venue for the class.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowGeoModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGeolocation}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white flex items-center justify-center gap-2"
                >
                  {submitting && <Loader className="w-4 h-4 animate-spin" />}
                  Mark Attendance
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Manual Attendance Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Mark Attendance Manually</h3>
              <button onClick={() => setShowManualModal(false)} className="text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                >
                  <option value="">Choose a subject...</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  You are marking attendance manually. This will be recorded with a manual entry timestamp.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualAttendance}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-orange-600 text-white flex items-center justify-center gap-2"
                >
                  {submitting && <Loader className="w-4 h-4 animate-spin" />}
                  Mark
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
