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
  login: (password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const STORAGE_KEY = 'yedz_admin_auth_session';
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24-hour session expiration

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'Super Admin' | 'Campaign Manager' | 'Operator';
}

// Cryptographic hash function using browser native Web Crypto API
async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Configured Enterprise Admin Accounts (Stored as SHA-256 hashes to prevent plaintext credential exposure)
export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'admin-karthik',
    name: 'Karthik Mannepalli',
    email: 'karthik@yedzmedia.com',
    passwordHash: '7acfdca91007ab1d3d7eab6b1312ae9890f09d513adffc2ad3b4ebb1ee1da569',
    role: 'Super Admin',
  },
  {
    id: 'admin-kiran',
    name: 'Kiran Mannepalli',
    email: 'kiran@yedzmedia.com',
    passwordHash: '7acfdca91007ab1d3d7eab6b1312ae9890f09d513adffc2ad3b4ebb1ee1da569',
    role: 'Super Admin',
  },
];

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const timestamp = Number(parsed?.timestamp || 0);
        const isNotExpired = Date.now() - timestamp < SESSION_MAX_AGE_MS;
        if (isNotExpired && Boolean(parsed?.authenticated)) {
          return true;
        }
        localStorage.removeItem(STORAGE_KEY);
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
        const timestamp = Number(parsed?.timestamp || 0);
        if (Date.now() - timestamp < SESSION_MAX_AGE_MS) {
          return parsed?.user || null;
        }
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

  const login = async (password: string, email?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedPass = password.trim();
    if (!trimmedPass) {
      return { success: false, error: 'Please enter a valid password.' };
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const inputHash = await hashPassword(trimmedPass);

    // 1. If an email was provided, match against that account
    if (cleanEmail) {
      const match = ADMIN_ACCOUNTS.find((acc) => acc.email.toLowerCase() === cleanEmail);
      if (match) {
        if (inputHash === match.passwordHash) {
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

    // 2. Direct password hash match across configured accounts
    const matchByPass = ADMIN_ACCOUNTS.find((acc) => acc.passwordHash === inputHash);
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

    return { 
      success: false, 
      error: 'Invalid login details. Please check your credentials.' 
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
