import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { secureStorage } from '../utils/secureStorage';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [storageStats, setStorageStats] = useState(secureStorage.getStorageStats());
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    if (!user) return;

    try {
      secureStorage.exportUserData(user.id);
      showMessage('Data exported successfully!', 'success');
    } catch (error) {
      showMessage('Failed to export data', 'error');
      console.error(error);
    }
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      await secureStorage.importUserData(file, user.id);
      showMessage('Data imported successfully! Refreshing...', 'success');

      // Refresh page to load new data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      showMessage('Failed to import data', 'error');
      console.error(error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFullBackup = () => {
    try {
      secureStorage.createFullBackup();
      showMessage('Full backup created successfully!', 'success');
    } catch (error) {
      showMessage('Failed to create backup', 'error');
      console.error(error);
    }
  };

  const handleRefreshStats = () => {
    setStorageStats(secureStorage.getStorageStats());
    showMessage('Storage stats refreshed', 'success');
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #4a5568 0%, #2d3748 30%, #1a202c 70%, #000000 100%)',
      }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(251, 146, 60, 0) 70%)',
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, rgba(251, 146, 60, 0) 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-6">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants}>
          <h1 className="text-white text-4xl font-bold mb-2">Settings</h1>
          <p className="text-white/60">Manage your account and data</p>
        </motion.div>

        {/* Message Display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl ${
              message.type === 'success'
                ? 'bg-green-500/20 border-2 border-green-400 text-green-300'
                : 'bg-red-500/20 border-2 border-red-400 text-red-300'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Account Info */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.1 }}>
          <GlassCard>
            <h3 className="text-white text-xl font-bold mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-white/60">Username</span>
                <span className="text-white font-semibold">{user?.username}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/60">User ID</span>
                <span className="text-white font-mono text-sm">{user?.id}</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Button variant="secondary" onClick={logout} className="w-full">
                  Logout
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Data Management */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.2 }}>
          <GlassCard>
            <h3 className="text-white text-xl font-bold mb-4">Data Management</h3>

            <div className="space-y-4">
              {/* Export Data */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-2">Export Your Data</h4>
                    <p className="text-white/60 text-sm mb-3">
                      Download your workout history and progression data as a JSON file.
                      Keep this as a backup!
                    </p>
                    <Button variant="primary" onClick={handleExportData}>
                      📥 Export Data
                    </Button>
                  </div>
                </div>
              </div>

              {/* Import Data */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-2">Import Data</h4>
                    <p className="text-white/60 text-sm mb-3">
                      Restore your data from a previously exported JSON file.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                      id="file-import"
                    />
                    <label htmlFor="file-import">
                      <Button
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                      >
                        📤 Import Data
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {/* Full Backup */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-2">Full System Backup</h4>
                    <p className="text-white/60 text-sm mb-3">
                      Export all data from all users (admin function). Use for complete recovery.
                    </p>
                    <Button variant="secondary" onClick={handleFullBackup}>
                      💾 Create Full Backup
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Storage Stats */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.3 }}>
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold">Storage Usage</h3>
              <button
                onClick={handleRefreshStats}
                className="text-orange-400 hover:text-orange-300 text-sm"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60">Used Storage</span>
                  <span className="text-white font-semibold">
                    {formatBytes(storageStats.used)} / {formatBytes(storageStats.total)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      storageStats.percentage > 80
                        ? 'bg-red-500'
                        : storageStats.percentage > 50
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${storageStats.percentage}%` }}
                  />
                </div>

                <p className="text-white/50 text-xs mt-2">
                  {storageStats.percentage.toFixed(2)}% of available storage used
                </p>
              </div>

              {storageStats.percentage > 80 && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                  <p className="text-red-300 text-sm">
                    ⚠️ Storage is running low! Consider exporting old data to free up space.
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Security Info */}
        <motion.div initial="hidden" animate="visible" variants={cardVariants} transition={{ delay: 0.4 }}>
          <GlassCard>
            <h3 className="text-white text-xl font-bold mb-4">🔒 Data Security</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>✅ All data is encrypted before being stored in your browser</p>
              <p>✅ Automatic backup created after every workout</p>
              <p>✅ Data recovery available if corruption occurs</p>
              <p>✅ Unique encryption key per device</p>
              <p className="text-white/60 mt-4">
                Your data is stored locally in your browser. Export backups regularly to prevent data loss!
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
