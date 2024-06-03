'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getCookie } from 'cookies-next';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { buttonVariants } from '@/components/ui/Button';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUser } from '@/components/Usercontext';
interface UserContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface User {
  name: string;
  email: string;
  imageUrl: string | null | undefined;
  subscriptionPlan?: string;
  stripeCurrentPeriodEnd?: string;
  subscriptionId?: string;
}

const SuccessPage = () => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { setUser } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionIdParam = searchParams.get('sessionId');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
    setLoading(true);
    const fetchPaymentInfo = async () => {
      try {
        if (!sessionId) {
          throw new Error('Session ID is required');
        }
        const response = await fetch(`http://localhost:8000/api/checkout/success?sessionId=${sessionId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment info');
        }

        const data = await response.json();
        setPaymentInfo(data);
      } catch (error) {
        console.error('Error fetching payment info:', error);
      }
      setLoading(false);
    };

    if (sessionId) {
      fetchPaymentInfo();
    }
  }, [sessionId]);

  const fetchUserData = async () => {
    try {
      const jwt = localStorage.getItem('jwt');
      const cookie = document.cookie
      const userCook = JSON.parse(decodeURIComponent(cookie).split(' ')[0]);
      const headers: HeadersInit = {};

      if (jwt) {
        headers.Authorization = `Bearer ${jwt}`;
      }
      if (userCook) {
        headers.Cookie = cookie;
      }

      const response = await fetch('http://localhost:8000/api/auth/me', {
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();

      if (!data || Object.keys(data).length === 0) {
        throw new Error('User data is empty');
      }

      setUser({
        ...data,
        subscriptionPlan: data.subscriptionPlan || 'Free',
        stripeCurrentPeriodEnd: data.stripeCurrentPeriodEnd || '...',
      });
    } catch (error) {
      setError('Error fetching user data: ' + (error as Error).message);
      toast({
        title: 'Error',
        description: 'Failed to fetch user data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <MaxWidthWrapper className="py-40">
      {loading ? (
        <div className="flex items-center justify-center px-4 py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        sessionId ? (
          <div className="flex flex-col items-center justify-center px-4 py-12">
            <div className="flex items-center justify-center border w-20 h-20 mb-6 rounded-full bg-foreground">
              <CheckIcon className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Payment Successful
            </h1>
            <p className="mb-5 py-2 text-center text-gray-500 dark:text-gray-400">
              Your payment has been processed successfully. Thank you for your business!
            </p>
            <Link
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
              href="/"
            >
              Go Back Home
            </Link>
          </div>
        ) : (
          <h1 className="text-center text-3xl font-bold text-orange-500">404</h1>
        )
      )}
    </MaxWidthWrapper>
  );
};

export default SuccessPage;
