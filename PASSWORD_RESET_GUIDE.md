# Password Reset & Security Features Guide

## Overview

The Gym Tracker now includes comprehensive password reset functionality and brute force protection to keep user accounts secure.

## Features Implemented

### 1. **Password Reset Flow**
Users who forget their password can easily reset it:

#### How it Works:
1. User clicks "Forgot your password?" link on login page
2. Enters their email address
3. System checks if email exists (without revealing it for security)
4. If using Supabase: Email with reset link sent automatically
5. If offline mode: Reset link displayed in console
6. User clicks link, enters new password
7. Account unlocked and ready to use

#### For Supabase (Cloud Mode):
- Uses Supabase Auth's built-in password reset
- Sends professional email with reset link
- Link expires after 1 hour for security
- Completely automated

#### For localStorage (Offline Mode):
- Generates secure reset token
- Token stored temporarily (1 hour expiry)
- Reset link shown in browser console
- Simulates email functionality

### 2. **Brute Force Protection**
Prevents attackers from guessing passwords:

#### How it Works:
- System tracks all login attempts per email
- After **5 failed attempts**, account is locked for **30 minutes**
- User sees clear warning messages showing remaining attempts
- Locked users can immediately reset password to regain access
- Successful login clears all failed attempts

#### User Experience:
```
Attempt 1: "Invalid email or password. 4 attempts remaining."
Attempt 2: "Invalid email or password. 3 attempts remaining."
Attempt 3: "Invalid email or password. 2 attempts remaining."
Attempt 4: "Invalid email or password. 1 attempts remaining."
Attempt 5: "Too many failed attempts. Your account has been locked for 30 minutes. Please reset your password."
```

### 3. **Security Features**
- ✅ **Email masking**: System doesn't reveal if email exists
- ✅ **Encrypted storage**: Login attempts stored securely
- ✅ **Auto-unlock**: Account unlocks after password reset
- ✅ **Time-based locks**: Locks automatically expire
- ✅ **Minimum password length**: 6 characters required
- ✅ **Loading states**: Prevents double submissions

## User Interface

### Login Page
- Clean, modern golden glass aesthetic
- Email and password fields
- "Forgot your password?" link below form
- Shows remaining attempts on failed login
- Loading spinner during authentication
- Color-coded messages (success/warning/error)

### Forgot Password Page
- Simple email-only form
- Clear instructions
- Back button to return to login
- Success message confirmation
- Auto-redirects to login after 3 seconds

### Messages
- ✅ **Success** (Green): "Password reset link has been sent to your email"
- ⚠️ **Warning** (Amber): "Invalid credentials. 3 attempts remaining"
- ❌ **Error** (Red): "Account locked for 30 minutes"

## Technical Implementation

### Files Created/Modified:

1. **`src/services/loginAttemptService.ts`** (NEW)
   - Tracks login attempts per email
   - Manages account locking/unlocking
   - 30-minute lock duration
   - Encrypted secure storage

2. **`src/contexts/AuthContext.tsx`** (UPDATED)
   - Added `resetPassword()` method
   - Added `updatePassword()` method
   - Updated `login()` with attempt tracking
   - Integrated Supabase password reset
   - localStorage fallback support

3. **`src/pages/Auth.tsx`** (UPDATED)
   - Added forgot password view
   - Enhanced error messaging
   - Loading states and animations
   - Attempt counter display
   - Golden glass aesthetic

### Data Storage:

```typescript
// Login attempts stored in encrypted localStorage
{
  "loginAttempts": {
    "user@example.com": {
      "attempts": 3,
      "lastAttempt": "2025-12-05T12:00:00Z",
      "lockedUntil": null // or timestamp if locked
    }
  }
}
```

## Usage Examples

### For Users:

#### Forgot Password:
1. Go to login page
2. Click "Forgot your password?"
3. Enter email address
4. Check email for reset link
5. Click link and enter new password
6. Login with new password

#### Account Locked:
1. If locked out, message shows: "Account locked for 30 minutes"
2. Click "Forgot your password?"
3. Enter email
4. Follow reset link in email
5. Account immediately unlocked

### For Developers:

#### Check if Account is Locked:
```typescript
import { loginAttemptService } from './services/loginAttemptService';

const isLocked = loginAttemptService.isAccountLocked('user@example.com');
const remainingTime = loginAttemptService.getRemainingLockTime('user@example.com');
```

#### Manually Unlock Account:
```typescript
loginAttemptService.unlockAccount('user@example.com');
```

#### Reset Attempts on Successful Login:
```typescript
loginAttemptService.recordSuccessfulLogin('user@example.com');
```

## Configuration

### Adjust Lock Settings:
Edit `src/services/loginAttemptService.ts`:

```typescript
private readonly MAX_ATTEMPTS = 5;        // Change max attempts
private readonly LOCK_DURATION = 30 * 60 * 1000;  // Change lock time (ms)
```

### Supabase Email Configuration:
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Customize "Reset Password" template
4. Set redirect URL: `${YOUR_DOMAIN}/reset-password`

## Security Best Practices

### Implemented:
✅ Rate limiting (5 attempts per email)
✅ Time-based account locks
✅ Secure token generation
✅ Token expiration (1 hour)
✅ Email masking (don't reveal if email exists)
✅ Encrypted local storage
✅ Minimum password length enforcement

### Recommended for Production:
- [ ] Add CAPTCHA after 2 failed attempts
- [ ] Send email notification on account lock
- [ ] Log all password reset attempts
- [ ] Implement IP-based rate limiting
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Use HTTPS only
- [ ] Monitor for suspicious patterns

## Troubleshooting

### "Email not received"
**Solution:**
- Check spam/junk folder
- Verify email is correct
- Wait 5 minutes (may be delayed)
- In offline mode, check browser console for reset link

### "Reset link expired"
**Solution:**
- Request a new reset link
- Links expire after 1 hour
- Use the new link immediately

### "Account still locked"
**Solution:**
- Reset password immediately (unlocks account)
- Or wait 30 minutes for auto-unlock
- Check remaining time in error message

### "Can't reset password in offline mode"
**Solution:**
- Check browser console for reset link
- Copy link and open in same browser
- Or configure Supabase for cloud mode

## Testing

### Manual Testing Checklist:

#### Password Reset Flow:
- [ ] Click "Forgot password" link
- [ ] Enter valid email
- [ ] Check email received (or console in offline mode)
- [ ] Click reset link
- [ ] Enter new password
- [ ] Verify can login with new password

#### Brute Force Protection:
- [ ] Enter wrong password 5 times
- [ ] Verify account locked
- [ ] See lock time in message
- [ ] Reset password
- [ ] Verify account unlocked
- [ ] Login successfully

#### Edge Cases:
- [ ] Non-existent email (should not reveal)
- [ ] Empty email field
- [ ] Password under 6 characters
- [ ] Multiple rapid submissions
- [ ] Expired reset token

## FAQ

**Q: How long does account lock last?**
A: 30 minutes from the 5th failed attempt. Or unlock immediately by resetting password.

**Q: Can I change the number of attempts?**
A: Yes, edit `MAX_ATTEMPTS` in `loginAttemptService.ts`.

**Q: Does this work offline?**
A: Yes! Uses localStorage fallback with simulated email (console output).

**Q: Is this secure enough for production?**
A: Good baseline security. Consider adding CAPTCHA, 2FA, and monitoring for production.

**Q: What if someone resets my password without permission?**
A: They need access to your email. Secure your email account with 2FA.

**Q: Can I customize the reset email?**
A: Yes, in Supabase Dashboard → Authentication → Email Templates.

## Future Enhancements

Potential improvements:
- Email notifications on account lock
- CAPTCHA after failed attempts
- Two-Factor Authentication (2FA)
- Password strength meter
- Account activity log
- Suspicious login detection
- Remember this device option
- Social login integration

---

**Security Note**: This system provides solid baseline protection. For high-security applications, implement additional layers like CAPTCHA, 2FA, and monitoring.
