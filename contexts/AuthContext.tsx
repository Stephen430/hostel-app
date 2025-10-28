import { createContext, ReactNode, useContext, useState } from "react";

interface User {
  matricNumber: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (matricNumber: string, password: string) => Promise<boolean>;
  signup: (userData: {
    fullName: string;
    matricNumber: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  updateProfile: (userData: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (matricNumber: string, password: string): Promise<boolean> => {
    // TODO: Replace with actual API call
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // For now, accept any credentials
        setIsLoggedIn(true);
        setUser({
          matricNumber: matricNumber.toUpperCase(),
          name: "Student Name", // TODO: Get from API
        });
        resolve(true);
      }, 1000);
    });
  };

  const signup = async (userData: {
    fullName: string;
    matricNumber: string;
    email: string;
    phoneNumber: string;
    password: string;
  }): Promise<boolean> => {
    // TODO: Replace with actual API call
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // For now, accept any registration
        // In real app, this would create account on server
        resolve(true);
      }, 1500);
    });
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // TODO: Replace with actual API call
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // For now, always return success
        // In real app, this would send password reset email
        resolve(true);
      }, 1500);
    });
  };

  const updateProfile = async (userData: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  }): Promise<boolean> => {
    // TODO: Replace with actual API call
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update user state
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            name: userData.name || prevUser.name,
            email: userData.email || prevUser.email,
            phoneNumber: userData.phoneNumber || prevUser.phoneNumber,
          };
        });
        resolve(true);
      }, 1500);
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, forgotPassword, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
