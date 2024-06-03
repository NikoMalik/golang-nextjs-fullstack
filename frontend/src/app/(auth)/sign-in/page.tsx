"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Icons } from '@/components/Navbar/Icons';
import { buttonVariants } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'; 
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignInCredentialsValidator, TSignInCredentialsValidator } from '@/lib/validators/sign-validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';


const Page = () => {
  const searchParams = useSearchParams();
  const isSeller = searchParams.get('as') === 'seller';

  const [isLoading, setIsLoading] = useState(false);
  
  
  const { register, handleSubmit, formState: { errors } } = useForm<TSignInCredentialsValidator>({
    resolver: zodResolver(SignInCredentialsValidator),
  });

  

 

  const onSubmit = async (data: any) => { 
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
        ,
      });

      if (response.ok) {

        const responseData = await response.json();
         
        const token = responseData.token;
        if (token) {
         
          localStorage.setItem('jwt', token);
          toast.success('Login successful');

          
          window.location.reload()

          
        } if (!token) {
          const refreshResponse = await fetch('http://localhost:8000/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken: localStorage.getItem('jwt'),
            }),
          });

          const refreshResponseData = await refreshResponse.json();
          if (refreshResponseData.token) {
            localStorage.setItem('jwt', refreshResponseData.token);
            
            toast.success('Login successful');
            
            window.location.reload()
           
           
            
          } else {
            toast.error('Token not found in response data');
          }
        }
      } else {
        toast.error('Password or email is incorrect');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
   
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <Icons.logo className='h-20 w-20' />
          <h1 className='text-2xl font-semibold tracking-tight'>
            Sign in to your {isSeller ? 'seller' : ''} account
          </h1>

          <Link
            className={buttonVariants({
              variant: 'link',
              className: 'gap-1.5',
            })}
            href='/sign-up'> 
            Don&apos;t have an account?
            <ArrowRight className='h-4 w-4' />
          </Link>
        </div>

        <div className='grid gap-6 '>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-2 '>
              <div className='grid gap-1 py-2  '>
                <Label htmlFor='email'>Email</Label>
                <Input
                  {...register('email')}
                  className={cn({
                    'focus-visible:ring-red-500': errors.email 
                  })}
                  placeholder='you@example.com'
                />
                {errors?.email && (
                  <p className='text-sm text-red-500'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className='grid gap-1 py-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  {...register('password')}
                  type='password'
                  autoComplete='current-password'
                  className={cn({
                    'focus-visible:ring-red-500': errors.password ,
                  })}
                  placeholder='Password'
                />
                {errors?.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Sign in
              </Button>
            </div>
          </form>

         </div>
      </div>
    </div>
  );
};

export default Page;

