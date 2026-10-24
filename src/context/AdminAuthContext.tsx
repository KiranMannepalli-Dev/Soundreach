/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Campaign Manager' | 'Operator';
  avatar?: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (pinOrPassword: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const STORAGE_KEY = 'yedz_admin_auth_session';

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Super Admin' | 'Campaign Manager' | 'Operator';
}

// Configured Enterprise Admin Accounts
export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'admin-karthik',
    name: 'Karthik Mannepalli',
    email: 'karthik@yedzmedia.com',
    password: 'Yedzmedia@_02',
    role: 'Super Admin',
  },
  {
    id: 'admin-kiran',
    name: 'Kiran Mannepalli',
    email: 'kiran@yedzmedia.com',
    password: 'Yedzmedia@_02',
    role: 'Super Admin',
  },
];

const VALID_LEGACY_PINS = ['1234', '2026', 'admin'];

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Boolean(parsed?.authenticated);
      }
    } catch {
      // Ignore storage error
    }
    return false;
  });

  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.user || ADMIN_ACCOUNTS[0];
      }
    } catch {
      // Ignore storage error
    }
    return null;
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ authenticated: true, user, timestamp: Date.now() })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isAuthenticated, user]);

  const login = async (pinOrPassword: string, email?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedPass = pinOrPassword.trim();
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // 1. If an email was provided, check matching account
    if (cleanEmail) {
      const match = ADMIN_ACCOUNTS.find((acc) => acc.email.toLowerCase() === cleanEmail);
      if (match) {
        if (trimmedPass === match.password || VALID_LEGACY_PINS.includes(trimmedPass.toLowerCase())) {
          const authUser: AdminUser = {
            id: match.id,
            name: match.name,
            email: match.email,
            role: match.role,
          };
          setUser(authUser);
          setIsAuthenticated(true);
          return { success: true };
        }
        return { success: false, error: 'Incorrect password for this admin account.' };
      }
    }

    // 2. Direct password match across configured accounts
    const matchByPass = ADMIN_ACCOUNTS.find((acc) => acc.password === trimmedPass);
    if (matchByPass) {
      const authUser: AdminUser = {
        id: matchByPass.id,
        name: matchByPass.name,
        email: cleanEmail || matchByPass.email,
        role: matchByPass.role,
      };
      setUser(authUser);
      setIsAuthenticated(true);
      return { success: true };
    }

    // 3. Fallback quick PIN match
    if (VALID_LEGACY_PINS.includes(trimmedPass.toLowerCase())) {
      const authUser: AdminUser = {
        id: ADMIN_ACCOUNTS[0].id,
        name: ADMIN_ACCOUNTS[0].name,
        email: cleanEmail || ADMIN_ACCOUNTS[0].email,
        role: ADMIN_ACCOUNTS[0].role,
      };
      setUser(authUser);
      setIsAuthenticated(true);
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Invalid login details. Please check your email and password.' 
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
