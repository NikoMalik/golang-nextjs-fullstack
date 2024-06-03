'use client'

import { ArrowRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ModeToggle } from '@/components/SwitchMode'
import { buttonVariants } from '@/components/ui/Button'
import { Github } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import UserAccountNav from '../UserAccountNav'
import { useUser } from '../Usercontext'
const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setOpen] = useState<boolean>(false)

  const toggleOpen = () => setOpen((prev) => !prev)

  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) toggleOpen()
  }, [pathname])

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen()
    }
  }
  const { user } = useUser()

  return (
    <div className='sm:hidden'>
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Menu
            onClick={toggleOpen}
            className='relative z-50 h-5 w-5 text-foreground cursor-pointer'
          />
        </SheetTrigger>
        
          
          <SheetContent side="right">
          <div className="grid  gap-3   pb-8">
            {!isAuth ? (
              <>
               
                  <Link
                    onClick={() => closeOnCurrent('/sign-up')}
                    className='flex items-center w-full font-semibold text-orange-500'
                    href='/sign-up'>
                    Get started
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Link>
              
               
                  <Link
                    onClick={() => closeOnCurrent('/sign-in')}
                    className='flex items-center w-full font-semibold'
                    href='/sign-in'>
                    Sign in
                  </Link>
               
               
                  <Link
                    onClick={() => closeOnCurrent('/pricing')}
                    className='flex items-center w-full font-semibold'
                    href='/pricing'>
                    Pricing
                  </Link>

                  <Link
                    onClick={() => closeOnCurrent('/documentation')}
                    className='flex items-center w-full font-semibold'
                    href='/documentation'>
                    Documentation
                  </Link>
               
              </>
            ) : (
              <>
                <div className='flex items-center w-full mb-5  '>
                  <UserAccountNav user={user} />
                </div>
                
                  <Link
                    onClick={() => closeOnCurrent('/dashboard')}
                    className='flex items-center w-full font-semibold hover:underline underline-offset-4'
                    href='/dashboard'>
                    Dashboard
                  </Link>
                
                 <Link
                    onClick={() => closeOnCurrent('/pricing')}
                    className='flex items-center w-full font-semibold hover:underline underline-offset-4'
                    href='/pricing'>
                    Pricing
                  </Link>

                  <Link 
                    onClick={() => closeOnCurrent('/documentation')}
                    className='flex items-center w-full font-semibold hover:underline underline-offset-4'
                    href='/documentation'>
                    <span className='sr-only'>Documentation</span>
                  </Link>


          
            
            
                    <Link
                      className='flex items-center w-full font-semibold hover:underline underline-offset-4'
                      href='/sign-out'>
                      Sign out
                    </Link>
            
          
       
                
              </>
            )}
            <div className="mt-5 flex items-center justify-end space-x-4">
            <Link
            onClick={() => closeOnCurrent('https://github.com/NikoMalik/golang-nextjs-fullstack')}
            href="https://github.com/NikoMalik/golang-nextjs-fullstack" target="_blank" rel="noreferrer"
            >
              <Github className="size-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            
              <ModeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav