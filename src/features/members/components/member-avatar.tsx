import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import React from 'react'

interface MemberAvatarProps {
  name: string
  className?: string
  fallBackClassName?: string
}

const MemberAvatar = ({ fallBackClassName, name, className}: MemberAvatarProps) => {

  return (
    <Avatar className={cn("size-10 transition border border-neutral-300 rounded-full", className)}>
      <AvatarFallback className={cn(
        "bg-neutral-200 text-neutral-500 font-medium items-center justify-center",
        fallBackClassName
      )}>
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

export default MemberAvatar