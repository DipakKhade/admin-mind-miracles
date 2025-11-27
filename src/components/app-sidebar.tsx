"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Users, BookOpen, ShoppingCart, MessageSquare, UserCheck, BarChart3 } from "lucide-react"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { href: "/home", label: "Home", icon: LayoutGrid },
  { href: "/home/users", label: "Users", icon: Users },
  { href: "/home/courses", label: "Courses", icon: BookOpen },
  { href: "/home/enrollments", label: "Enrollments", icon: ShoppingCart },
  { href: "/home/payments", label: "Payments", icon: BarChart3 },
  { href: "/home/contact-us", label: "Contact Us", icon: MessageSquare },
  { href: "/home/trans-theory", label: "Trans Theropy Members", icon: UserCheck },
  { href: "/home/assessments", label: "Assessment Results", icon: BarChart3 },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2">
          <Image
            src="/mind_miracles_logo.png"
            alt="MindMiracles logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="font-semibold text-sm">MindMiracles</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} className="text-base">
                      <Link href={item.href}>
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
