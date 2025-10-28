# Authentication Setup

## Overview
The app now has a complete authentication system for student login.

## Features Implemented

### 1. Login Screen (`app/login.tsx`)
- Matric number input field
- Password input field with show/hide toggle
- Form validation
- Beautiful UI with Tailwind CSS
- Loading state during login

### 2. Authentication Context (`contexts/AuthContext.tsx`)
- Manages authentication state
- Provides login/logout functions
- Stores user information
- Can be accessed throughout the app

### 3. Protected Routes
- App redirects to login if user is not authenticated
- After successful login, user is redirected to tabs
- Logout functionality on profile page

### 4. Profile Page Updates
- Shows user matric number and name
- Logout button
- Profile options menu

## How to Use

### For Testing (Currently)
The authentication is set up but uses mock data. Any matric number and password combination will work for now.

### To Add Real Authentication

1. **Update `contexts/AuthContext.tsx`** - Replace the mock login function with actual API calls:
```typescript
const login = async (matricNumber: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch('YOUR_API_URL/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricNumber, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setIsLoggedIn(true);
      setUser(data.user);
      // Store token if using JWT
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
```

2. **Add Persistent Storage** - Install and use AsyncStorage to persist login state:
```bash
npx expo install @react-native-async-storage/async-storage
```

3. **Add Token Management** - Store and use JWT tokens for API requests

## File Structure
```
app/
├── index.tsx          # Redirect to login or tabs
├── login.tsx          # Login screen
├── _layout.tsx        # Root layout with AuthProvider
└── (tabs)/
    └── profile.tsx    # Profile with logout

contexts/
└── AuthContext.tsx    # Authentication state management
```

## Next Steps
- [ ] Connect to real backend API
- [ ] Add persistent login (AsyncStorage)
- [ ] Add signup functionality
- [ ] Add forgot password
- [ ] Add form validation improvements
- [ ] Add biometric authentication (optional)
