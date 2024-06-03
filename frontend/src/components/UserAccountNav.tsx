"use client"
import { useTheme } from 'next-themes';
import { Button } from './ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { toast } from 'sonner';
import {
  AppWindow,
  CreditCard,
  LogOut,
  Mail,
  Settings,
  User as UserIcon,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { deleteCookie } from 'cookies-next';
import { User } from './Usercontext';






export interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "imageUrl" | "email" | "subscriptionPlan" | "stripeCurrentPeriodEnd">
}






const UserAccountNav = ({ user }: UserAccountNavProps) => {

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Signed out successfully');
        localStorage.clear();
        deleteCookie("userCache");
        window.location.reload();
      } else if (response.status === 401) {
        const refreshResponse = await fetch('http://localhost:8000/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });
        if (refreshResponse.ok) {
          localStorage.clear();
          deleteCookie("userCache");
          toast.success('Session expired. Please sign in again.');
          window.location.reload();
        } else {
          localStorage.clear();
          deleteCookie("userCache");
          toast.error('Session expired. Please sign in again.');
          window.location.reload();
        }
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      deleteCookie("userCache");
      toast.error('Logout failed. Please try again.');
      window.location.reload();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='overflow-visible'>
        <Button className='rounded-full h-8 w-8 bg-foreground'>
          <Avatar className='relative w-8 h-8'>
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt='profile picture'
                className='object-cover rounded-full'
                
                width={32}
                height={32}
              />
            ) : (
              <AvatarFallback>
                <UserIcon className='h-4 w-4 text-foreground' />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link className='flex w-full hover:bg-foreground/20 ' href='/dashboard/profile'>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <span className="font-medium">
                {user.name}
              </span>
              <span className="text-sm opacity-50">
                {user.email}
              </span>
            </div>
          </div>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <AppWindow className='mr-2 h-4 w-4' />
          <Link href='/dashboard'>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className='mr-2 h-4 w-4' />
          <Link href='/dashboard/profile'>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mail className='mr-2 h-4 w-4' />
          <Link href='/settings/get-messages'>Get Notification when update</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className='mr-2 h-4 w-4' />
          <Link href='/dashboard/billing'>Manage Subscription</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;