import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface WorkspaceAvatarProps {
  image?: string
  name: string
  className?: string
}

const WorkspaceAvatar = ({ image, name, className}: WorkspaceAvatarProps) => {
  if (image) {
    return (
      <div className={cn(
        "size-10 relative rounded-md overflow-hidden",
        className
      )}>
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    )
  }
  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback className='text-white bg-violet-600 font-semibold text-lg uppercase rounded-md'>
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}

export default WorkspaceAvatar