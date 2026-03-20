import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Lock, Eye, Zap, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    institutionName: 'Tech Institute',
    institutionEmail: 'admin@techinstitute.edu',
    institutionPhone: '+91-9876543210',
    website: 'www.techinstitute.edu',
    address: '123 Education Street, City, State 100000',
    city: 'Delhi',
    state: 'Delhi',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    autoBackup: true,
    backupFrequency: 'daily',
    maintenanceMode: false,
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
    setHasChanges(false);
  };

  const handleBackup = () => {
    toast.success('Backup initiated - Check email for details');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:p-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">System Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Configure institution and system preferences</p>
        </div>
      </motion.div>

      {/* Institution Settings */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-bold">Institution Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Institution Name</label>
            <input type="text" name="institutionName" value={settings.institutionName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input type="email" name="institutionEmail" value={settings.institutionEmail} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Phone</label>
            <input type="tel" name="institutionPhone" value={settings.institutionPhone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Website</label>
            <input type="url" name="website" value={settings.website} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Address</label>
            <textarea name="address" value={settings.address} onChange={handleChange} rows="2" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">City</label>
            <input type="text" name="city" value={settings.city} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">State</label>
            <input type="text" name="state" value={settings.state} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-slate-800/30 rounded-lg cursor-pointer transition-all">
            <input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} className="w-5 h-5 cursor-pointer" />
            <div className="flex-1">
              <p className="font-semibold">Email Notifications</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Receive updates via email</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-slate-800/30 rounded-lg cursor-pointer transition-all">
            <input type="checkbox" name="smsNotifications" checked={settings.smsNotifications} onChange={handleChange} className="w-5 h-5 cursor-pointer" />
            <div className="flex-1">
              <p className="font-semibold">SMS Notifications</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Receive critical alerts via SMS</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-slate-800/30 rounded-lg cursor-pointer transition-all">
            <input type="checkbox" name="pushNotifications" checked={settings.pushNotifications} onChange={handleChange} className="w-5 h-5 cursor-pointer" />
            <div className="flex-1">
              <p className="font-semibold">Push Notifications</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">In-app notifications for system updates</p>
            </div>
          </label>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-bold">Security Settings</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-slate-800/30 rounded-lg cursor-pointer transition-all">
            <input type="checkbox" name="twoFactorAuth" checked={settings.twoFactorAuth} onChange={handleChange} className="w-5 h-5 cursor-pointer" />
            <div className="flex-1">
              <p className="font-semibold">Two-Factor Authentication</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Require 2FA for all admin accounts</p>
            </div>
          </label>

          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <label className="block text-sm font-semibold mb-2">Session Timeout (minutes)</label>
            <input type="number" name="sessionTimeout" value={settings.sessionTimeout} onChange={handleChange} min="5" max="120" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Users will be logged out after inactivity</p>
          </div>

          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <label className="block text-sm font-semibold mb-2">Max Login Attempts</label>
            <input type="number" name="maxLoginAttempts" value={settings.maxLoginAttempts} onChange={handleChange} min="3" max="10" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Failed attempts before account lockout</p>
          </div>
        </div>
      </motion.div>

      {/* Backup Settings */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Download className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-bold">Backup & Storage</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-slate-800/30 rounded-lg cursor-pointer transition-all">
            <input type="checkbox" name="autoBackup" checked={settings.autoBackup} onChange={handleChange} className="w-5 h-5 cursor-pointer" />
            <div className="flex-1">
              <p className="font-semibold">Enable Automatic Backups</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Automatically backup database</p>
            </div>
          </label>

          {settings.autoBackup && (
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
              <label className="block text-sm font-semibold mb-2">Backup Frequency</label>
              <select name="backupFrequency" value={settings.backupFrequency} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}

          <button onClick={handleBackup} className="w-full px-4 py-3 flex items-center justify-center gap-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-lg font-medium transition-all">
            <Download className="w-5 h-5" /> Create Backup Now
          </button>
        </div>
      </motion.div>

      {/* Maintenance */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-bold">Maintenance</h2>
        </div>
        <label className="flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-slate-800/30 rounded-lg cursor-pointer transition-all">
          <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="w-5 h-5 cursor-pointer" />
          <div className="flex-1">
            <p className="font-semibold">Enable Maintenance Mode</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Put system in maintenance mode (admins only)</p>
          </div>
        </label>
      </motion.div>

      {/* Action Buttons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-end">
        <button className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-all">Cancel</button>
        <button onClick={handleSave} disabled={!hasChanges} className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${hasChanges ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
          <SettingsIcon className="w-5 h-5" /> {hasChanges ? 'Save Changes' : 'No Changes'}
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;
