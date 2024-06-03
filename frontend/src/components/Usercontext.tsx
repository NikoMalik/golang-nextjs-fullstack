"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';

export interface User {
  name: string;
  email: string;
  imageUrl: string | null | undefined;
  subscriptionPlan: string | null | undefined;
  stripeCurrentPeriodEnd: string | null | undefined;
}

interface UserContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  getUserInfo: () => User | null;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const COOKIE_KEY = 'userCache';
const COOKIE_EXPIRY_HOURS = 2;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateUserCookie = (userData: User) => {
    setCookie(COOKIE_KEY, JSON.stringify(userData), { maxAge: COOKIE_EXPIRY_HOURS * 60 * 60 });
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error('User data is empty');
        }
        setUser({
          ...data,
          subscriptionPlan: data.subscriptionPlan || 'Free',
          stripeCurrentPeriodEnd: data.stripeCurrentPeriodEnd || '...',
        });
        updateUserCookie(data);
      } else {
        setError('Failed to fetch user data');
      }
    } catch (error) {
      setError('Error fetching user data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = () => {
    return user;
  };

  useEffect(() => {
    const cachedUser = getCookie(COOKIE_KEY);
    if (cachedUser) {
      setUser(JSON.parse(cachedUser as string));
      setLoading(false);
    } else {
      fetchUserData();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, setUser, getUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
