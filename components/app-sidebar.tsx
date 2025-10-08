"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "@/lib/auth-client"
import {
  IconDashboard,
  IconCalendar,
  IconBriefcase,
  IconUsers,
  IconUserCircle,
  IconSettings,
  IconHelp,
  IconSearch,
  IconChartBar,
  IconReport,
  IconBuilding,
  IconShield,
  IconKey,
  IconPackage,
  IconCreditCard,
  IconUser,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavAdmin } from "@/components/nav-admin"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const staticData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Business",
      url: "/dashboard/business",
      icon: IconBuilding,
    },
    {
      title: "Programări",
      url: "/dashboard/bookings",
      icon: IconCalendar,
    },
    {
      title: "Servicii",
      url: "/dashboard/services",
      icon: IconBriefcase,
    },
    {
      title: "Personal",
      url: "/dashboard/staff",
      icon: IconUsers,
    },
    {
      title: "Clienți",
      url: "/dashboard/clients",
      icon: IconUserCircle,
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: IconCreditCard,
    },
  ],
  adminNav: [
    {
      title: "Businesses",
      url: "/admin/businesses",
      icon: IconBuilding,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconUser,
    },
    {
      title: "API Keys",
      url: "/admin/api-keys",
      icon: IconKey,
    },
    {
      title: "Packages",
      url: "/admin/packages",
      icon: IconPackage,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Setări",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Ajutor",
      url: "/dashboard/help",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Rapoarte",
      url: "#",
      icon: IconChartBar,
    },
    {
      name: "Statistici",
      url: "#",
      icon: IconReport,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false)
  
  const userData = session?.user ? {
    name: session.user.name || "User",
    email: session.user.email,
    avatar: session.user.image || "/favicon.ico",
  } : {
    name: "Guest",
    email: "guest@example.com", 
    avatar: "/favicon.ico",
  }

  React.useEffect(() => {
    const checkRole = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch('/api/auth/role');
        const result = await response.json();
        if (result.success) {
          setIsSuperAdmin(result.data.isSuperAdmin);
        }
      } catch (err) {
        console.error('Error checking role:', err);
      }
    };
    
    checkRole();
  }, [session]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  BZ
                </div>
                <span className="text-base font-semibold font-parkinsans">BIZNIZZ.EU</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={staticData.navMain} />
        {session?.user && isSuperAdmin && (
          <NavAdmin items={staticData.adminNav} />
        )}
        <NavDocuments items={staticData.documents} />
        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
