import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Zap, Star, Flame, Target, Book, Lightbulb } from 'lucide-react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const Gamification = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    level: 8,
    xpPoints: 2850,
    nextLevelXP: 3000,
    streak: 12,
    totalBadges: 15,
    earnedBadges: 9
  });

  const mockBadges = [
    { id: 1, name: 'Quick Learner', icon: Lightbulb, color: 'text-yellow-500', earned: true, date: '2026-02-15', description: 'Complete 5 assignments on time' },
    { id: 2, name: 'Perfect Attendance', icon: Trophy, color: 'text-blue-500', earned: true, date: '2026-02-20', description: 'Attend all classes in a month' },
    { id: 3, name: 'High Performer', icon: Star, color: 'text-purple-500', earned: true, date: '2026-02-28', description: 'Score above 80% in all subjects' },
    { id: 4, name: 'Consistency King', icon: Flame, color: 'text-red-500', earned: true, date: '2026-03-05', description: 'Maintain 90%+ attendance' },
    { id: 5, name: 'Problem Solver', icon: Target, color: 'text-green-500', earned: true, date: '2026-03-10', description: 'Submit all assignments' },
    { id: 6, name: 'Knowledge Master', icon: Book, color: 'text-indigo-500', earned: true, date: '2026-03-11', description: 'Complete study materials' },
    { id: 7, name: 'Rising Star', icon: Award, color: 'text-pink-500', earned: false, date: null, description: 'Achieve top rank' },
    { id: 8, name: 'Excellence Award', icon: Trophy, color: 'text-orange-500', earned: false, date: null, description: 'Maintain GPA above 9.0' },
    { id: 9, name: 'Dedication Badge', icon: Zap, color: 'text-cyan-500', earned: false, date: null, description: 'Complete all projects' },
  ];

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      // const { data } = await api.get('/student/badges');
      // setBadges(data.badges);
      setBadges(mockBadges);
    } catch (error) {
      console.error('Error fetching badges:', error);
      toast.error('Failed to load badges');
      setBadges(mockBadges);
    } finally {
      setLoading(false);
    }
  };

  const xpPercentage = (userStats.xpPoints / userStats.nextLevelXP) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 lg:p-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Achievements & Rewards</h1>
        <p className="text-slate-600 dark:text-slate-400">Track your progress and earn badges</p>
      </motion.div>

      {/* Level & XP Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">{userStats.level}</span>
            </div>
            <h3 className="text-xl font-bold">Level</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">You're a Master!</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-3">XP Progress</h3>
            <p className="text-2xl font-bold mb-2">{userStats.xpPoints}/{userStats.nextLevelXP}</p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500" 
                style={{width: `${Math.min(xpPercentage, 100)}%`}}
              ></div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{Math.round(xpPercentage)}% to next level</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  Streak
                </span>
                <span className="text-2xl font-bold text-red-500">{userStats.streak}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">days</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Badges</span>
                <span className="text-lg font-bold">{userStats.earnedBadges}/{userStats.totalBadges}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badges Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">Earned Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.filter(b => b.earned).map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="group"
                >
                  <div className="glass-card p-4 text-center h-full card-hover relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <badge.icon className={`w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform ${badge.color}`} />
                      <h4 className="font-semibold text-sm mb-2">{badge.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{badge.description}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">Earned on {new Date(badge.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Locked Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.filter(b => !b.earned).map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="group"
                >
                  <div className="glass-card p-4 text-center h-full opacity-50 hover:opacity-75 transition-opacity">
                    <div className="relative">
                      <badge.icon className={`w-12 h-12 mx-auto mb-3 blur-sm ${badge.color}`} />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">🔒</span>
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">{badge.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{badge.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'Rahul Singh', xp: 3500, level: 10, you: false },
            { rank: 2, name: 'Priya Sharma', xp: 3200, level: 9, you: false },
            { rank: 3, name: 'You', xp: 2850, level: 8, you: true },
            { rank: 4, name: 'Amit Kumar', xp: 2600, level: 8, you: false },
            { rank: 5, name: 'Neha Gupta', xp: 2400, level: 7, you: false },
          ].map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-lg ${
                entry.you 
                  ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/50' 
                  : 'bg-white/30 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  entry.rank === 1 ? 'bg-yellow-500' :
                  entry.rank === 2 ? 'bg-gray-500' :
                  entry.rank === 3 ? 'bg-orange-500' :
                  'bg-slate-500'
                } text-white`}>
                  {entry.rank}
                </div>
                <div>
                  <p className="font-semibold">{entry.name} {entry.you && <span className="text-xs text-primary-600">(You)</span>}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Level {entry.level}</p>
                </div>
              </div>
              <p className="font-bold text-primary-600">{entry.xp} XP</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default Gamification;
