import { secureStorage } from '../utils/secureStorage';

interface LoginAttempt {
  email: string;
  attempts: number;
  lockedUntil: string | null;
  lastAttempt: string;
}

class LoginAttemptService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  private readonly STORAGE_KEY = 'loginAttempts';

  /**
   * Get login attempts for an email
   */
  private getAttempts(email: string): LoginAttempt | null {
    const allAttempts = secureStorage.getItem<Record<string, LoginAttempt>>(this.STORAGE_KEY) || {};
    return allAttempts[email.toLowerCase()] || null;
  }

  /**
   * Save login attempts for an email
   */
  private saveAttempts(email: string, attempt: LoginAttempt): void {
    const allAttempts = secureStorage.getItem<Record<string, LoginAttempt>>(this.STORAGE_KEY) || {};
    allAttempts[email.toLowerCase()] = attempt;
    secureStorage.setItem(this.STORAGE_KEY, allAttempts);
  }

  /**
   * Check if account is locked
   */
  isAccountLocked(email: string): boolean {
    const attempt = this.getAttempts(email);

    if (!attempt || !attempt.lockedUntil) {
      return false;
    }

    const lockExpiry = new Date(attempt.lockedUntil).getTime();
    const now = Date.now();

    // If lock has expired, unlock the account
    if (now >= lockExpiry) {
      this.unlockAccount(email);
      return false;
    }

    return true;
  }

  /**
   * Get remaining lock time in minutes
   */
  getRemainingLockTime(email: string): number {
    const attempt = this.getAttempts(email);

    if (!attempt || !attempt.lockedUntil) {
      return 0;
    }

    const lockExpiry = new Date(attempt.lockedUntil).getTime();
    const now = Date.now();
    const remaining = lockExpiry - now;

    return remaining > 0 ? Math.ceil(remaining / 60000) : 0;
  }

  /**
   * Record a failed login attempt
   */
  recordFailedAttempt(email: string): { locked: boolean; attemptsLeft: number; lockTimeMinutes?: number } {
    let attempt = this.getAttempts(email);

    if (!attempt) {
      attempt = {
        email: email.toLowerCase(),
        attempts: 1,
        lockedUntil: null,
        lastAttempt: new Date().toISOString(),
      };
    } else {
      attempt.attempts += 1;
      attempt.lastAttempt = new Date().toISOString();
    }

    // Lock account after max attempts
    if (attempt.attempts >= this.MAX_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + this.LOCK_DURATION);
      attempt.lockedUntil = lockUntil.toISOString();
      this.saveAttempts(email, attempt);

      return {
        locked: true,
        attemptsLeft: 0,
        lockTimeMinutes: Math.ceil(this.LOCK_DURATION / 60000),
      };
    }

    this.saveAttempts(email, attempt);

    return {
      locked: false,
      attemptsLeft: this.MAX_ATTEMPTS - attempt.attempts,
    };
  }

  /**
   * Record a successful login (clears attempts)
   */
  recordSuccessfulLogin(email: string): void {
    const allAttempts = secureStorage.getItem<Record<string, LoginAttempt>>(this.STORAGE_KEY) || {};
    delete allAttempts[email.toLowerCase()];
    secureStorage.setItem(this.STORAGE_KEY, allAttempts);
  }

  /**
   * Unlock an account (used after password reset)
   */
  unlockAccount(email: string): void {
    const allAttempts = secureStorage.getItem<Record<string, LoginAttempt>>(this.STORAGE_KEY) || {};
    delete allAttempts[email.toLowerCase()];
    secureStorage.setItem(this.STORAGE_KEY, allAttempts);
  }

  /**
   * Get current attempt count for an email
   */
  getAttemptCount(email: string): number {
    const attempt = this.getAttempts(email);
    return attempt ? attempt.attempts : 0;
  }
}

export const loginAttemptService = new LoginAttemptService();
