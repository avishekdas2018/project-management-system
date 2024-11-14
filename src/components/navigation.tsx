"use client"

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { SettingsIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';
import { usePathname } from 'next/navigation';


const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill
  },
  {
    label: "My tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill
  },
  {
    label: "Setttings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon
  }
]

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();


  return (
    <ul className='flex flex-col'>
      {routes.map((items) => {
        const fullHref = `/workspaces/${workspaceId}${items.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? items.activeIcon : items.icon;
        return (
          <Link key={items.href} href={fullHref}>
            <div className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
              isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
            )}>
              <Icon className='size-5 text-neutral-500' />
              {items.label}

            </div>
          </Link>
        )
      })}
    </ul>
  )
}