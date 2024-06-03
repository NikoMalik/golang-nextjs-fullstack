"use client"
import React from 'react';
import { useForm, watch } from 'react-hook-form';
import { Icons } from '@/components/Navbar/Icons';
import { buttonVariants } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'; 
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { AuthCredentialsValidator, TAuthCredentialsValidator } from '@/lib/validators/account-credentials-validator';
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner';
import { useState } from 'react';


const Page = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<TAuthCredentialsValidator>({
        resolver: zodResolver(AuthCredentialsValidator),
      }) 
    const router = useRouter();
    

    const onSubmit = async (data: any) => { 
        try {
            const response = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                toast.success(`Verification email sent to ${data.email}.`);
                router.push('/verify-email?to=' + data.email);
            } else {
                const errorData = await response.json();
                if (errorData.message === 'This email is already in use.') {
                    toast.error('This email is already in use. Sign in instead?');
                } else {
                    throw new Error(errorData.message);
                }
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again later.');
        }
    };

    return (
        <>
            <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
                <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
                    <div className='flex flex-col items-center space-y-2 text-center'>
                        <Icons.logo className='h-20 w-20' />
                        <h1 className='text-2xl font-semibold tracking-tight'>
                            Create an account
                        </h1>
    
                        <Link
                            className={buttonVariants({
                                variant: 'link',
                                className: 'gap-1.5',
                            })}
                            href='/sign-in'>
                            Already have an account? Sign-in
                            <ArrowRight className='h-4 w-4' />
                        </Link>
                    </div>

                    <div className='grid gap-6'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='grid gap-3'>
                                <div className='grid gap-1 py-2'>
                                    <Label htmlFor='name' className='text-sm'>Name</Label>
                                    <Input
                                        {...register('name', { required: 'Name is required' })}
                                        className={cn({
                                            'focus-visible:ring-rose-500': errors.name,
                                        })}
                                        placeholder='Your name'
                                    />
                                    {errors?.name && (
                                        <p className='text-sm text-red-500'>
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className='grid gap-1 py-2'>
                                    <Label htmlFor='email' className='text-sm' >Email</Label>
                                    <Input
                                        {...register('email', { required: 'Email is required' })}
                                        className={cn({
                                            'focus-visible:ring-rose-500': errors.email,
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
                                    <Label htmlFor='password' className='text-sm'>Password</Label>
                                    <Input
                                        {...register('password', { required: 'Password is required' })}
                                        type='password'
                                        className={cn({
                                            'focus-visible:ring-rose-500': errors.password,
                                        })}
                                        placeholder='Password'
                                    />
                                    {errors?.password && (
                                        <p className='text-sm text-red-500'>
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <div className='grid gap-1 py-2'>
                                    <Label htmlFor='password_confirm' className='text-sm'>Confirm Password</Label>
                                    <Input
                                        {...register('password_confirm', { required: 'Password confirmation is required',
                                        validate: value => value === watch('password') || 'The passwords do not match'
                                         })}
                                        type='password'
                                        className={cn({
                                            'focus-visible:ring-rose-500': errors.password_confirm,
                                        })}
                                        placeholder='Confirm Password'
                                    />
                                    {errors?.password_confirm && (
                                        <p className='text-sm text-rose-500'>
                                            {errors.password_confirm.message}
                                        </p>
                                    )}
                                </div>

                                <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                  Sign up
                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
