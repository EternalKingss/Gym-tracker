/**
 * Secure Storage Utility with Encryption and Backup
 * Ensures data persistence and security for user workout data
 */

// Simple encryption using Base64 + XOR cipher
// For production, use a proper encryption library like crypto-js
class SecureStorage {
  private encryptionKey: string;

  constructor() {
    // Generate or retrieve encryption key per browser
    this.encryptionKey = this.getOrCreateEncryptionKey();
  }

  /**
   * Get or create a unique encryption key for this browser
   */
  private getOrCreateEncryptionKey(): string {
    const keyName = '__gym_encryption_key__';
    let key = localStorage.getItem(keyName);

    if (!key) {
      // Generate a random key
      key = this.generateRandomKey(32);
      localStorage.setItem(keyName, key);
    }

    return key;
  }

  /**
   * Generate a random encryption key
   */
  private generateRandomKey(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Encrypt data using XOR cipher
   */
  private encrypt(data: string): string {
    try {
      const key = this.encryptionKey;
      let encrypted = '';

      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encrypted += String.fromCharCode(charCode);
      }

      // Base64 encode for safe storage
      return btoa(encrypted);
    } catch (error) {
      console.error('Encryption failed:', error);
      return btoa(data); // Fallback to just base64
    }
  }

  /**
   * Decrypt data
   */
  private decrypt(encryptedData: string): string {
    try {
      const key = this.encryptionKey;
      const decoded = atob(encryptedData);
      let decrypted = '';

      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }

      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }

  /**
   * Set encrypted data in localStorage
   */
  setItem(key: string, value: any): boolean {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = this.encrypt(jsonString);
      localStorage.setItem(key, encrypted);

      // Auto-backup after every write
      this.autoBackup(key, value);

      return true;
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      return false;
    }
  }

  /**
   * Get and decrypt data from localStorage
   */
  getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted);
      if (!decrypted) return null;

      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);

      // Try to recover from backup
      return this.recoverFromBackup<T>(key);
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_backup`);
  }

  /**
   * Clear all data (except encryption key)
   */
  clear(): void {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key !== '__gym_encryption_key__') {
        localStorage.removeItem(key);
      }
    }
  }

  /**
   * Auto-backup data to a separate key
   */
  private autoBackup(key: string, value: any): void {
    try {
      const backupKey = `${key}_backup`;
      const backup = {
        data: value,
        timestamp: new Date().toISOString(),
        version: '1.0',
      };

      const jsonString = JSON.stringify(backup);
      const encrypted = this.encrypt(jsonString);
      localStorage.setItem(backupKey, encrypted);
    } catch (error) {
      console.error(`Failed to create backup for ${key}:`, error);
    }
  }

  /**
   * Recover data from backup
   */
  private recoverFromBackup<T>(key: string): T | null {
    try {
      const backupKey = `${key}_backup`;
      const encrypted = localStorage.getItem(backupKey);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted);
      if (!decrypted) return null;

      const backup = JSON.parse(decrypted);
      console.log(`Recovered ${key} from backup (${backup.timestamp})`);

      // Restore the main key
      this.setItem(key, backup.data);

      return backup.data as T;
    } catch (error) {
      console.error(`Failed to recover from backup for ${key}:`, error);
      return null;
    }
  }

  /**
   * Export all user data to JSON file
   */
  exportUserData(userId: string): void {
    try {
      const userData = {
        userId,
        exportDate: new Date().toISOString(),
        progression: this.getItem(`progression_${userId}`),
        workoutHistory: this.getItem(`workoutHistory_${userId}`),
        version: '1.0',
      };

      const jsonString = JSON.stringify(userData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `gym-tracker-backup-${userId}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('User data exported successfully');
    } catch (error) {
      console.error('Failed to export user data:', error);
    }
  }

  /**
   * Import user data from JSON file
   */
  importUserData(file: File, userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          const userData = JSON.parse(jsonString);

          // Validate data structure
          if (!userData.userId || !userData.version) {
            throw new Error('Invalid backup file format');
          }

          // Restore data
          if (userData.progression) {
            this.setItem(`progression_${userId}`, userData.progression);
          }

          if (userData.workoutHistory) {
            this.setItem(`workoutHistory_${userId}`, userData.workoutHistory);
          }

          console.log('User data imported successfully');
          resolve(true);
        } catch (error) {
          console.error('Failed to import user data:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): { used: number; total: number; percentage: number } {
    try {
      let totalSize = 0;

      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }

      // localStorage typically has 5-10MB limit
      const totalLimit = 5 * 1024 * 1024; // 5MB in bytes

      return {
        used: totalSize,
        total: totalLimit,
        percentage: (totalSize / totalLimit) * 100,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { used: 0, total: 0, percentage: 0 };
    }
  }

  /**
   * Validate data integrity
   */
  validateData<T>(key: string, validator: (data: T) => boolean): boolean {
    try {
      const data = this.getItem<T>(key);
      if (!data) return false;

      return validator(data);
    } catch (error) {
      console.error(`Validation failed for ${key}:`, error);
      return false;
    }
  }

  /**
   * Create a complete backup of all app data
   */
  createFullBackup(): void {
    try {
      const allData: Record<string, any> = {};

      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key !== '__gym_encryption_key__') {
          const data = this.getItem(key);
          if (data) {
            allData[key] = data;
          }
        }
      }

      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: allData,
      };

      const jsonString = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `gym-tracker-full-backup-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Full backup created successfully');
    } catch (error) {
      console.error('Failed to create full backup:', error);
    }
  }
}

// Export singleton instance
export const secureStorage = new SecureStorage();

// Export type for TypeScript
export type { SecureStorage };
