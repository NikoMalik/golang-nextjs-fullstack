// Navbar.tsx
"use client"
import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Icons } from '@/components/Navbar/Icons';
import { ModeToggle } from "@/components/SwitchMode";
import { Button, buttonVariants } from '@/components/ui/Button';
import { NavItems } from "./Navitems";

import { Progress } from "@/components/ui/progress";
import { User as UserType } from "@/lib/types/payload-types";
import UserAccountNav from "../UserAccountNav";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { getCookie } from "cookies-next";
import { getServerSideUser } from '../../lib/payload-utils';
import MobileNav from "./MobileNav";
import { useUser } from "../Usercontext";

const Navbar =  () => {
    const router = useRouter();
    const [tokenAccess, setTokenAccess] = useState<string | null>(null);
    
    const { user, loading } = useUser();

   

    return (
        <div className="dark:border-neutral-700/30 border-b fixed border-0 sm:border-r bg-background flex flex-col shadow-sm-adaptive lg:shadow-lg z-50 top-0 inset-x-0 h-16 transition-all">
          <header className="relative z-10">
            <MaxWidthWrapper>
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className='ml-4 flex lg:ml-0'>
                    <Link href='/' className="cursor-pointer">
                      <Icons.logo className='h-10 w-10 adaptive' />
                    </Link>
                    <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
                      <NavItems />
                    </div>
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='lg:hidden'>
                    <MobileNav isAuth={!!user} />
                  </div>
                  <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6 lg:pr-4'>
                    {loading ? (
                      <span>Loading...</span>
                    ) : user ? (
                      <UserAccountNav user={user} />
                    ) : (
                      <>
                        <Link href='/sign-in' className={buttonVariants({ variant: 'ghost' })}>
                          Sign in
                        </Link>
                        <span className='h-6 w-px bg-gray-200' aria-hidden='true' />
                        <Link href='/sign-up' className={buttonVariants({ variant: 'ghost' })}>
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                  <div className='hidden lg:flex'>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </MaxWidthWrapper>
          </header>
        </div>
      )
    }
    
    export default Navbar