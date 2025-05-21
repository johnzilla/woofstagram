import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem('woofstagram_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login logic for demo purposes
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('woofstagram_user', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Mock registration logic for demo purposes
      const exists = mockUsers.some(
        (u) => 
          u.email.toLowerCase() === email.toLowerCase() || 
          u.username.toLowerCase() === username.toLowerCase()
      );
      
      if (exists) {
        return false;
      }
      
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        username,
        email,
        fullName: username, // Default full name to username for demo
        profileImage: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`,
        bio: "Dog lover",
        followers: [],
        following: [],
        posts: []
      };
      
      // In a real app we would save this to a database
      mockUsers.push(newUser);
      
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('woofstagram_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('woofstagram_user');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};