"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, LayoutGrid, Users, BookOpen, ShoppingCart, MessageSquare, UserCheck, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navItems = [
  { href: "/home", label: "home", icon: LayoutGrid },
  { href: "/home/users", label: "Users", icon: Users },
  { href: "/home/courses", label: "Courses", icon: BookOpen },
  { href: "/home/enrollments", label: "Enrollments", icon: ShoppingCart },
  { href: "/home/payments", label: "Payments", icon: BarChart3 },
  { href: "/home/contact-us", label: "Contact Us", icon: MessageSquare },
  { href: "/home/trans-theory", label: "Trans Theropy Members", icon: UserCheck },
  { href: "/home/assessments", label: "Assessment Results", icon: BarChart3 },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const router = useRouter()

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-10 w-10">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 z-30",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
            <Image
              src="/mind_miracles_logo.png"
              alt="Sign in illustration"
              width={60}
              height={60}
              className="object-contain"
            />
          <p className="text-sm text-muted-foreground mt-1">MindMiracles</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push(`${item.href}`)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
            )
          })}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
