"use client"
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import UpgradeButton from '@/components/UpgrageButton';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getServerSideUser } from '@/lib/payload-utils';
import { ArrowRight, Check, HelpCircle, Minus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User as UserType } from "@/lib/types/payload-types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PricingFaq } from '@/components/faq';
import { useUser } from '@/components/Usercontext';
import { useRouter } from 'next/navigation';





interface User {
  name: string;
  email: string;
  imageUrl: string | null | undefined;
  subscriptionPlan: string | null | undefined;
  stripeCurrentPeriodEnd: string | null | undefined;
}

const Page = () => {
    const [isYearly, setIsYearly] = useState<boolean>(true);
    const router = useRouter();
    

    const toggleBilling = () => {
        setIsYearly(!isYearly);
    };

    const { user, loading, setUser, getUserInfo } = useUser();



    useEffect(() => {
        const redirectToBilling = async () => {
            // Check if there is user and subscription information in the cookies
            

            if (user) {
                // If cookies are present, extract user information and subscription information
                

                if (getUserInfo() && getUserInfo()?.subscriptionPlan == "Pro" || getUserInfo()?.subscriptionPlan == "Business") {
                    // If the user has a subscription, redirect them to the dashboard/billing page
                    router.push('/dashboard/billing');
                }
            } else {
                // If there are no cookies, make an API request to get user information and subscription information
                try {
                    const response = await fetch('http://localhost:8000/api/auth/me', {
                        credentials: 'include',
                    });
                
                    if (response.ok) {
                        const data = await response.text();
                        console.log(data); // Log the response
                        const parsedData = JSON.parse(data);
                        if (parsedData && parsedData.subscriptionPlan) {
                            // If the user has a subscription, redirect them to the dashboard/billing page
                            router.push('/dashboard/billing');
                        }
                    } else {
                        console.error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        redirectToBilling();
    }, [loading, user, router]);; // Empty dependency array to run the effect only once


   

    const PLANS = [
        {
            name: 'Free',
            slug: 'free',
            quota: 10,
            pagesTracking: 5,
            price: {
                monthly: 0,
                yearly: 0,
                priceIds: {
                    test: '',
                    production: '',
                },
            },
        },
        {
            name: 'Pro',
            slug: 'pro',
            quota: 50,
            pagesTracking: 25,
            price: {
                monthly: 100,
                yearly: 100,
                priceIds: {
                    test: 'price_1PITHJGTP4UBVwg7Wy5YRt6P',
                    production: '',
                },
            },
        },
        {
            name: 'Business',
            slug: 'business',
            quota: 100,
            pagesTracking: 100,
            price: {
                monthly: 150,
                yearly: 150,
                priceIds: {
                    test: 'price_1PIWcRGTP4UBVwg7CS2f6Vgm',
                    production: '',
                },
            },
        },
    ];

    const pricingItems = [
        {
            plan: 'Free',
            tagline: 'For small side projects.',
            quota: 10,
            features: [
                { text: '5 tracking ssl and domains', footnote: 'The maximum amount of tracking' },
                { text: '4MB file size limit', footnote: 'The maximum amount of tracking ' },
                { text: 'Mobile-friendly interface' },
                { text: 'Higher-quality responses', footnote: 'Better algorithmic responses for enhanced content quality', negative: true },
                { text: 'Priority support', negative: true },
            ],
        },
        {
            plan: 'Pro',
            tagline: 'For larger projects with higher needs.',
            quota: PLANS.find((p) => p.slug === 'pro')!.quota,
            features: [
                { text: '25 tracking ssl and domains', footnote: 'The maximum amount of tracking' },
                { text: '16MB file size limit', footnote: 'The maximum amount of tracking' },
                { text: 'Mobile-friendly interface' },
                { text: 'Higher-quality responses', footnote: 'Better algorithmic responses for enhanced content quality' },
                { text: 'Priority support' },
            ],
        },
        {
            plan: 'Business',
            tagline: 'For big teams with multiple projects.',
            quota: PLANS.find((p) => p.slug === 'business')!.quota,
            features: [
                { text: '100 tracking ssl and domains', footnote: 'The maximum amount of tracking ssl and domains.' },
                { text: '160MB file size limit', footnote: 'The maximum file size of a single domains.' },
                { text: 'Mobile-friendly interface' },
                { text: 'Higher-quality responses', footnote: 'Better algorithmic responses for enhanced content quality' },
                { text: 'Priority support' },
            ],
        },
    ];

    const getPrice = (plan) => {
        const selectedPlan = PLANS.find((p) => p.slug === plan.toLowerCase());
        if (!selectedPlan) return 0;
        return isYearly ? selectedPlan.price.yearly || 0 : selectedPlan.price.monthly || 0;
    };

    const getPriceId = (plan) => {
        const selectedPlan = PLANS.find((p) => p.slug === plan.toLowerCase());
        if (!selectedPlan) return '';
        return isYearly ? selectedPlan.price.priceIds.production : selectedPlan.price.priceIds.test;
    };

    return (
        <div className='mb-8 mt-24 container flex flex-col items-center text-center'>
            <h1 className="text-3xl font-bold text-default-foreground text-center text-orange-500"> Pricing</h1>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-default-foreground">
                Start at your plan!
            </h1>
            <p className='mt-4 text-lg sm:text-xl text-gray-600 text-center'>
                Whether you&apos;re just trying out our service or need more, we&apos;ve got you covered.
            </p>

            <div className="container flex-col items-center text-center mt-10 flex gap-5">
                <ToggleGroup
                    type="single"
                    size="sm"
                    defaultValue={isYearly ? "yearly" : "monthly"}
                    onValueChange={toggleBilling}
                    aria-label="toggle-year"
                    className="h-9 overflow-hidden rounded-full border bg-background p-1 *:h-7 *:text-muted-foreground"
                >
                    <ToggleGroupItem
                        value="yearly"
                        className="rounded-full px-5 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
                        aria-label="Toggle yearly billing"
                    >
                        Yearly (-20%)
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="monthly"
                        className="rounded-full px-5 data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground"
                        aria-label="Toggle monthly billing"
                    >
                        Monthly
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            <div className='pt-8 grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                <TooltipProvider>
                    {pricingItems.map(({ plan, tagline, quota, features }) => {
                        const price = getPrice(plan);
                        const priceId = getPriceId(plan);

                        return (
                            <div
                                key={plan}
                                className={cn('relative flex flex-col overflow-hidden rounded-3xl border shadow-sm', {
                                    'border-2 border-orange-500 shadow-[0px_5px_30px_0px_#ed8936]': plan === 'Pro',
                                    'border border-gray-200': plan !== 'Pro',
                                })}
                            >
                                <div className='items-start space-y-4 bg-muted/50 p-5'>
                                    <h3 className='my-3 text-center font-display text-3xl font-bold'>{plan}</h3>
                                    <p className='flex font-urban text-sm font-bold uppercase tracking-wider text-center text-muted-foreground'>{tagline}</p>
                                    <p className='flex text-left text-3xl font-semibold leading-6'>
                                        {plan === 'Pro' && isYearly ? (
                                            <>
                                                <span className="mr-2 text-gray-300 line-through">${price}</span>
                                                <span>${price - 50}</span>
                                            </>
                                        ) : (
                                            <>
                                                {plan === 'Business' && isYearly ? (
                                                    <>
                                                        <span className="mr-2 text-gray-300 line-through">${price}</span>
                                                        <span>${price - 50}</span>
                                                    </>
                                                ) : (
                                                    `$${price}`
                                                )}
                                            </>
                                        )}
                                        <span className='text-left ml-4 py-1 text-sm text-gray-500'>{isYearly ? '/year' : '/month'}</span>
                                    </p>
                                </div>

                                <div className='flex h-20 items-center justify-center border-b border-t border-gray-200 bg-muted/50 p-5'>
                                    <div className='flex items-center space-x-1'>
                                        <p>{quota.toLocaleString()} SSL AND DOMAINS</p>
                                        <div className="flex text-left text-3xl font-semibold leading-6">
                                            <Tooltip delayDuration={300}>
                                                <TooltipTrigger className='cursor-default ml-1.5'>
                                                    <HelpCircle className='h-4 w-4 text-zinc-500' />
                                                </TooltipTrigger>
                                                <TooltipContent className='w-80 p-2'>
                                                    How many ssl and domains you can tracking {isYearly ? 'year' : 'month'}.
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>

                                <div className='p-5'>
                                    <ul className='space-y-3 text-sm'>
                                        {features.map(({ text, footnote, negative }) => (
                                            <li key={text} className='flex space-x-3'>
                                                <span className='flex-shrink-0'>
                                                    {negative ? (
                                                        <Minus className='h-5 w-5 text-red-500' />
                                                    ) : (
                                                        <Check className='h-5 w-5 text-green-500' />
                                                    )}
                                                </span>
                                                <span className='text-left'>
                                                    <span>{text}</span>
                                                    {footnote && (
                                                        <Tooltip delayDuration={300}>
                                                            <TooltipTrigger className='cursor-default ml-1.5'>
                                                                <HelpCircle className='inline h-4 w-4 text-zinc-500' />
                                                            </TooltipTrigger>
                                                            <TooltipContent className='w-80 p-2'>
                                                                {footnote}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                             
                                <div className='border-t border-gray-200 bg-muted/50 p-5'>
                                {plan === 'Free' ? (
                                    <Link
                                        href={user ? '/dashboard' : '/sign-in'} 
                                        className={buttonVariants({
                                            className: 'w-full',
                                            variant: 'secondary',
                                        })}
                                    >
                                        {user ? 'Upgrade now' : 'Sign up'}
                                        <ArrowRight className='h-5 w-5 ml-1.5' />
                                    </Link>
                                ) : (
                                    <UpgradeButton user={user} plan={plan} priceId={priceId} />
                                )}
                            </div>
                                  
                               
                               
                            </div>
                        );
                    })}
                </TooltipProvider>
            </div>

            <PricingFaq />
        </div>
    );
};

export default Page;
