'use client';
import { useState, useEffect } from 'react';
import { useToast } from './ui/use-toast';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/Button';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useUser } from './Usercontext';


export interface User {
  name: string;
  email: string;
  imageUrl: string | null | undefined;
  subscriptionPlan: string | null | undefined;
  stripeCurrentPeriodEnd: string | null | undefined;
}

const BillingForm = (  ) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, getUserInfo } = useUser()
  const [error, setError] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${localStorage.getItem('jwt')}`);

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
      setSubscriptionId(data.subscriptionId);
    } catch (error) {
      setError('Error fetching user data: ' + (error as Error).message);
      toast({
        title: 'Error',
        description: 'Failed to fetch user data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubscriptionManagement = async (
    action: string,
    newPlan?: string
  ) => {
    if (!subscriptionId) {
    console.error('Subscription ID not found');
    toast({
      title: 'Error',
      description: 'Subscription ID is required to manage the subscription.',
      variant: 'destructive',
    });
    return;
  }
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/checkout/manage-subscription', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          subscriptionId,
          newPlan,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url
        
      }
      if (data.message) {
        toast({
          title: 'Success',
          description: data.message,
        });
      } else {
        toast({
          title: 'There was a problem...',
          description: 'Please try again in a moment',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'There was a problem...',
        description: 'Please try again in a moment',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };


  


  return (
    <>
      {user ? (
        <MaxWidthWrapper className='py-40'>
          <form
            className='mt-12'
            onSubmit={(e) => {
              e.preventDefault();
              const action = getUserInfo()?.subscriptionPlan === 'Free' ? 'update' : 'cancel';
              handleSubscriptionManagement(action, 'new-plan-id');
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  You are currently on the{' '}
                  <strong className='text-orange-500'>{getUserInfo()?.subscriptionPlan}</strong> plan.
                </CardDescription>
              </CardHeader>

              <CardFooter className='flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0'>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className='mr-4 h-4 w-4 animate-spin' />
                  ) : null}
                  {getUserInfo()?.subscriptionPlan === 'Free'
                    ? 'Upgrade to PRO'
                    : 'Manage Subscription'}
                </Button>

                {getUserInfo()?.subscriptionPlan !== 'Free' ? (
                  <Link href='/dashboard'>
                    <Button variant='outline'>View Dashboard</Button>
                  </Link>
                ) : null}
              </CardFooter>
            </Card>
          </form>
        </MaxWidthWrapper>
      ) : (
        <div className='flex justify-center py-20'>
          <Link href='/dashboard'>
            <Button variant='outline'>Login to access billing</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default BillingForm;


