import type { Metadata } from 'next';
import {  Open_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';
import  Navbar  from '@/components/Navbar/Navbar';
import { Toaster } from "@/components/ui/sonner"
import UserPage from '@/components/UserPage';
import { UserProvider } from '@/components/Usercontext';



const OpenSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',

})

export const siteMetadata: Metadata = {
  title: 'Next.js + Golang',
  description: 'Golang and next js FullStack',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth h-full ">
      
      <UserProvider>
     
        
        <body className={cn('relative h-full font-sans antialiased', OpenSans.variable)}
        >
          <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
            <main className='relative flex flex-col min-h-screen'>
             
              <UserPage  />
              <Navbar />
          
              <div className='flex-grow flex-1'>{children}</div>
            </main>
          </ThemeProvider>
        
            <Toaster position="top-center" richColors  />
        
        </body>
        
      </UserProvider>
    </html>
  );
}

