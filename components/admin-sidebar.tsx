"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  Key, 
  Settings, 
  Users, 
  BarChart3,
  Shield,
  Crown
} from "lucide-react"

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Businesses", url: "/admin/businesses", icon: Building2 },
  { title: "Packages", url: "/admin/packages", icon: Package },
  { title: "API Keys", url: "/admin/api-keys", icon: Key },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-6">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white shadow-xl">
              <Crown className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black font-parkinsans bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                SUPER ADMIN
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Control Panel</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link 
                    href={item.url}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-semibold">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <Shield className="w-5 h-5 text-orange-600" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-orange-900 dark:text-orange-100">Super Admin</p>
            <p className="text-xs text-orange-600">Full Access</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}



