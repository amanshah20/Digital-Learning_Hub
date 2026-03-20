import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Award, Calendar, User, Mail, Phone, MapPin, BookOpen, Briefcase } from 'lucide-react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const StudentRecord = () => {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState({
    firstName: 'Arjun',
    lastName: 'Patel',
    rollNumber: 'B23CS001',
    email: 'arjun.patel@university.edu',
    phone: '+91 9876543210',
    address: '123 University Street, City, State 110001',
    dob: '2004-05-15',
    gender: 'Male',
    guardianName: 'Rajesh Patel',
    guardianPhone: '+91 9876543211',
    enrollmentDate: '2021-08-15',
    semester: 7,
    cgpa: 8.5,
    totalCredits: 120,
    completedCredits: 95,
    status: 'Active'
  });

  const [academicRecords, setAcademicRecords] = useState([
    { semester: 1, gpa: 7.8, credits: 16, cgpa: 7.8 },
    { semester: 2, gpa: 8.2, credits: 16, cgpa: 8.0 },
    { semester: 3, gpa: 8.1, credits: 16, cgpa: 8.03 },
    { semester: 4, gpa: 8.4, credits: 16, cgpa: 8.13 },
    { semester: 5, gpa: 8.5, credits: 16, cgpa: 8.2 },
    { semester: 6, gpa: 8.6, credits: 16, cgpa: 8.27 },
    { semester: 7, gpa: 8.7, credits: 15, cgpa: 8.35 },
  ]);

  useEffect(() => {
    fetchStudentRecord();
  }, []);

  const fetchStudentRecord = async () => {
    try {
      setLoading(true);
      // const { data } = await api.get('/student/record');
      // setStudentData(data.studentData);
      // setAcademicRecords(data.academicRecords);
    } catch (error) {
      console.error('Error fetching student record:', error);
      toast.error('Failed to load student record');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    toast.success('Certificate download started...');
  };

  const downloadTranscript = () => {
    toast.success('Transcript download started...');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Digital Student Record</h1>
        <p className="text-slate-600 dark:text-slate-400">Complete academic and personal records</p>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <User className="w-6 h-6 text-primary-500" />
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Full Name</p>
            <p className="font-semibold">{studentData.firstName} {studentData.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Roll Number</p>
            <p className="font-semibold">{studentData.rollNumber}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Date of Birth</p>
            <p className="font-semibold">{new Date(studentData.dob).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Mail className="w-4 h-4" /> Email
            </p>
            <p className="font-semibold break-all">{studentData.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Phone className="w-4 h-4" /> Phone
            </p>
            <p className="font-semibold">{studentData.phone}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Gender</p>
            <p className="font-semibold">{studentData.gender}</p>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Address
            </p>
            <p className="font-semibold">{studentData.address}</p>
          </div>
        </div>
      </motion.div>

      {/* Enrollment Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary-500" />
          Enrollment Information
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Enrollment Date</p>
            <p className="font-semibold">{new Date(studentData.enrollmentDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current Semester</p>
            <p className="text-2xl font-bold text-primary-600">{studentData.semester}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Status</p>
            <p className="font-semibold text-green-600">{studentData.status}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Credits Progress</p>
            <p className="font-semibold">{studentData.completedCredits}/{studentData.totalCredits}</p>
          </div>
        </div>
      </motion.div>

      {/* Academic Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-500" />
          Academic Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current CGPA</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{studentData.cgpa}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Out of 10.0</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Credits Earned</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{studentData.completedCredits}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">of {studentData.totalCredits}</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current Semester</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{studentData.semester}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">In Progress</p>
          </div>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" 
            style={{width: `${(studentData.completedCredits / studentData.totalCredits) * 100}%`}}
          ></div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          {Math.round((studentData.completedCredits / studentData.totalCredits) * 100)}% Program Completion
        </p>
      </motion.div>

      {/* Grade History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-primary-500" />
          Semester-wise Performance
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left p-3 font-semibold">Semester</th>
                <th className="text-left p-3 font-semibold">GPA</th>
                <th className="text-left p-3 font-semibold">Credits</th>
                <th className="text-left p-3 font-semibold">CGPA</th>
              </tr>
            </thead>
            <tbody>
              {academicRecords.map((record, index) => (
                <tr 
                  key={index} 
                  className={`border-b border-slate-200 dark:border-slate-700 ${
                    index === academicRecords.length - 1 ? 'bg-primary-500/10' : ''
                  }`}
                >
                  <td className="p-3 font-medium">{record.semester}</td>
                  <td className="p-3">{record.gpa}</td>
                  <td className="p-3">{record.credits}</td>
                  <td className="p-3 font-semibold">{record.cgpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-500" />
          Important Documents
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={downloadTranscript}
            className="p-6 rounded-lg border-2 border-primary-500/30 hover:border-primary-500/50 hover:bg-primary-500/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary-500/20 group-hover:bg-primary-500/30">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Academic Transcript</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Complete grade records</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-primary-600 text-sm font-medium">
              <Download className="w-4 h-4" />
              Download
            </div>
          </button>

          <button
            onClick={downloadCertificate}
            className="p-6 rounded-lg border-2 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/20 group-hover:bg-green-500/30">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Enrollment Certificate</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Certificate of enrollment</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium">
              <Download className="w-4 h-4" />
              Download
            </div>
          </button>

          <button
            onClick={downloadTranscript}
            className="p-6 rounded-lg border-2 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Character Certificate</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Character reference</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-blue-600 text-sm font-medium">
              <Download className="w-4 h-4" />
              Download
            </div>
          </button>

          <button
            onClick={downloadCertificate}
            className="p-6 rounded-lg border-2 border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Leave Certificate</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Bonafide certificate</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-orange-600 text-sm font-medium">
              <Download className="w-4 h-4" />
              Download
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentRecord;
