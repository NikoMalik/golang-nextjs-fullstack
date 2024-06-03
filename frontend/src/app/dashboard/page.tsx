"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Ghost } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/components/Usercontext';

interface User {
  name: string;
  email: string;
  imageUrl: string | null | undefined;
  subscriptionPlan?: string;
  stripeCurrentPeriodEnd?: string;
  subscriptionId?: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const {user, setUser, getUserInfo} = useUser();
  const [domains, setDomains] = useState([]);
  const [sslCertificates, setSslCertificates] = useState([]);

  const fetchUserData = async () => {
    try {
      const jwt = localStorage.getItem('jwt');
      const headers: HeadersInit = {};

      if (jwt) {
        headers.Authorization = `Bearer ${jwt}`;
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

      setUser(data);
    } catch (error) {
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

  useEffect(() => {
    if (user) {
    
      setTimeout(() => {
        setDomains([]);
        setSslCertificates([]);
      }, 2000); 
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className='flex justify-center py-20'>
        <Skeleton className='my-2' />
      </div>
    );
  }

  if (!user) {
    return (
      <main className='mx-auto max-w-7xl md:p-10 mb-10'>
        <div className='mt-16 flex flex-col items-center gap-2'>
          <Ghost className='h-8 w-8 text-foreground' />
          <h3 className='font-semibold text-xl'>Please log in to view this page</h3>
        </div>
      </main>
    );
  }

  return (
    <MaxWidthWrapper className='mx-auto max-w-7xl md:p-10 mb-10'>
     
      <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-foreground pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='mb-3 font-bold text-5xl text-orange-500'>
          Domain & SSL Management
        </h1>
      </div>

      {/* domains */}
      <section className='mt-8'>
        <h2 className='text-3xl font-bold mb-4'>Domains</h2>
       
        {domains.length > 0 ? (
          <ul className='grid grid-cols-1 gap-4'>
            {domains.map((domain) => (
              <li key={domain.id} className='bg-white shadow rounded-lg p-4'>
                <Link href={`/domains/${domain.id}`}>
                  <a className='text-blue-500 hover:underline'>{domain.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className='flex flex-col items-center gap-2'>
            <Ghost className='h-8 w-8 text-foreground' />
            <p className='text-lg'>No domains found.</p>
          </div>
        )}
      </section>

      {/* ssl */}
      <section className='mt-8'>
        <h2 className='text-3xl font-bold mb-4'>SSL Certificates</h2>
      
        {sslCertificates.length > 0 ? (
          <ul className='grid grid-cols-1 gap-4'>
            {sslCertificates.map((ssl) => (
              <li key={ssl.id} className='bg-white shadow rounded-lg p-4'>
                <Link href={`/ssl/${ssl.id}`}>
                  <a className='text-blue-500 hover:underline'>{ssl.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className='flex flex-col items-center gap-2'>
            <Ghost className='h-8 w-8 text-foreground' />
            <p className='text-lg'>No SSL certificates found.</p>
          </div>
        )}
      </section>

     
      <section className='mt-8 text-center items-center '>
        <Button className="w-full outline" onClick={() => console.log('Add domain clicked')}>
          <span>Add Domain</span>
        </Button>
      </section>

      <section className='mt-8 text-center'>
        <Link href="/dashboard/billing"
           className={buttonVariants({ variant: 'outline', size: 'lg' })}>Go to Billing Dashboard
        </Link>
      </section>
    </MaxWidthWrapper>
  );
};

export default Dashboard;
