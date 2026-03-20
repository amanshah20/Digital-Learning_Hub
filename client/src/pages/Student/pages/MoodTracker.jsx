import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Smile, Frown, Meh, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const MoodTracker = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stressLevel, setStressLevel] = useState(0);
  const [wellnessNote, setWellnessNote] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);

  const mockMoodData = [
    { date: '2026-03-07', mood: 4, stress: 3, sleep: 7 },
    { date: '2026-03-08', mood: 3, stress: 5, sleep: 6 },
    { date: '2026-03-09', mood: 4, stress: 4, sleep: 7 },
    { date: '2026-03-10', mood: 5, stress: 2, sleep: 8 },
    { date: '2026-03-11', mood: 4, stress: 4, sleep: 7 },
    { date: '2026-03-12', mood: 3, stress: 6, sleep: 5 },
    { date: '2026-03-13', mood: 4, stress: 3, sleep: 7 },
  ];

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Bad', color: 'bg-red-500' },
    { value: 2, emoji: '😕', label: 'Bad', color: 'bg-orange-500' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'bg-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'bg-green-500' },
    { value: 5, emoji: '😄', label: 'Excellent', color: 'bg-blue-500' }
  ];

  useEffect(() => {
    fetchWellnessData();
  }, []);

  const fetchWellnessData = async () => {
    try {
      setLoading(true);
      // const { data } = await api.get('/student/wellness');
      // setMoodHistory(data.moodHistory);
      setMoodHistory(mockMoodData);
    } catch (error) {
      console.error('Error fetching wellness data:', error);
      toast.error('Failed to load wellness data');
      setMoodHistory(mockMoodData);
    } finally {
      setLoading(false);
    }
  };

  const logMood = async () => {
    if (selectedMood !== null) {
      try {
        // const { data } = await api.post('/student/mood', {
        //   mood: selectedMood,
        //   stress: stressLevel,
        //   note: wellnessNote
        // });
        
        setMoodHistory([...moodHistory, {
          date: new Date().toISOString().split('T')[0],
          mood: selectedMood,
          stress: stressLevel,
          sleep: 7
        }]);
        
        setSelectedMood(null);
        setStressLevel(0);
        setWellnessNote('');
        toast.success('Mood logged successfully!');
      } catch (error) {
        console.error('Error logging mood:', error);
        toast.error('Failed to log mood');
      }
    }
  };

  const avgMood = moodHistory.length > 0 
    ? (moodHistory.reduce((acc, curr) => acc + curr.mood, 0) / moodHistory.length).toFixed(1)
    : 0;
  const avgStress = moodHistory.length > 0 
    ? (moodHistory.reduce((acc, curr) => acc + curr.stress, 0) / moodHistory.length).toFixed(1)
    : 0;

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
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Wellness & Mood Tracker</h1>
        <p className="text-slate-600 dark:text-slate-400">Monitor your mental health and stress levels</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Current Mood</p>
              <p className="text-3xl font-bold">{selectedMood || 4}/5</p>
            </div>
            <Smile className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Stress Level</p>
              <p className="text-3xl font-bold">{stressLevel}/10</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Mood</p>
            <p className="text-3xl font-bold">{avgMood}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">This week</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Stress</p>
            <p className="text-3xl font-bold">{avgStress}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">This week</p>
          </div>
        </motion.div>
      </div>

      {/* Log Mood */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">How are you feeling today?</h2>
        
        <div className="mb-6">
          <div className="flex justify-between gap-2 mb-4">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex-1 p-4 rounded-lg transition-all ${
                  selectedMood === mood.value
                    ? `${mood.color} text-white scale-110 shadow-lg`
                    : 'bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="text-3xl mb-2">{mood.emoji}</div>
                <div className="text-xs font-semibold">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stress Level */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3">Stress Level: {stressLevel}/10</label>
          <input
            type="range"
            min="0"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Additional Notes</label>
          <textarea
            value={wellnessNote}
            onChange={(e) => setWellnessNote(e.target.value)}
            placeholder="Write how you're feeling..."
            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows="3"
          />
        </div>

        <button
          onClick={logMood}
          className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-medium"
        >
          Log Mood
        </button>
      </motion.div>

      {/* Mood Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Mood Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodHistory.map(d => ({
            date: d.date.substring(5),
            mood: d.mood,
            stress: d.stress
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.2)" />
            <XAxis dataKey="date" stroke="rgba(100,116,139,0.5)" />
            <YAxis stroke="rgba(100,116,139,0.5)" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Mood" />
            <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} name="Stress" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Wellness Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-4">Wellness Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">💚 Stay Active</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Take regular breaks and exercise daily for better mental health.</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">💙 Sleep Well</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Aim for 7-8 hours of quality sleep each night.</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">💜 Meditate</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Practice mindfulness and meditation for stress relief.</p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">💛 Connect</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Spend time with friends and family for emotional support.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MoodTracker;
