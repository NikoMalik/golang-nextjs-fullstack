"use client"
import React, { useState, useEffect } from 'react';
import { XCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/Button';
import Link from 'next/link';
import { toast } from 'sonner';

interface VerifyEmailProps {
  token: string;
}

const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          toast.success('Email verified successfully!');
          
          setVerificationResult({ success: true });
        } else {
          const data = await response.json();
          setVerificationResult({ success: false, message: data.message });
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationResult({
          success: false,
          message: 'An error occurred during verification.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (isLoading) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='animate-spin h-8 w-8 text-zinc-300' />
        <h3 className='font-semibold text-xl'>Verifying...</h3>
        <p className='text-muted-foreground text-sm'>
          This won&apos;t take long.
        </p>
      </div>
    );
  }

  if (verificationResult?.success) {
    return (
      <div className='flex h-full flex-col items-center justify-center'>
        <div className='relative mb-4 h-60 w-60 text-muted-foreground'>
          <Image src='/images/tatsumaki.jpg' fill alt='the email was sent' />
        </div>

        <h3 className='font-semibold text-2xl'>You&apos;re all set!</h3>
        <p className='text-muted-foreground text-center mt-1'>
          Thank you for verifying your email.
        </p>
        <Link
          className={buttonVariants({ className: 'mt-4' })}
          href='/sign-in'>
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <XCircle className='h-8 w-8 text-red-600' />
      <h3 className='font-semibold text-xl'>There was a problem</h3>
      <p className='text-muted-foreground text-sm'>
        {verificationResult?.message ||
          'This token is not valid or might be expired. Please try again.'}
      </p>
    </div>
  );
};

export default VerifyEmail;
