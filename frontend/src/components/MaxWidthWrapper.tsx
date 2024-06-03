import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div
      className={cn(
        ' mx-auto w-full max-w-screen-xl px-2.5 md:px-20 lg:px-28 xl:px-40',
        'sm:max-w-screen-sm sm:px-4',
        'md:max-w-screen-md md:px-6',
        'lg:max-w-screen-lg lg:px-8',
        'xl:max-w-screen-xl xl:px-10',
        
        className
      )}>
      {children}
    </div>
  )
}

export default MaxWidthWrapper
