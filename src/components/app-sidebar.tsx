"use client"

import { ReactNode, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { LayoutGrid, Users, BookOpen, ShoppingCart, MessageSquare, UserCheck, BarChart3 } from "lucide-react"
import { Header } from "./header";

const navItems = [
  { href: "/home", label: "Home", icon: <LayoutGrid className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
  { href: "/home/users", label: "Users", icon: <Users className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
  { href: "/home/courses", label: "Courses", icon: <BookOpen className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
  { href: "/home/enrollments", label: "Enrollments", icon: <ShoppingCart className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
  { href: "/home/payments", label: "Payments", icon: <BarChart3 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
  { href: "/home/contact-us", label: "Contact Us", icon: <MessageSquare className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
  { href: "/home/trans-theory", label: "Trans Theropy Members", icon: <UserCheck className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
  { href: "/home/assessments", label: "Assessment Results", icon: <BarChart3 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
]

export function AppSidebar({children}: {children: ReactNode}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {navItems.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                // label: localStorage.getItem("username") ?? "",
                label: "username",
                href: "#",
                icon: (
                  <img
                    src="https://mindmiracles.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmind_miracles_logo.8a717bdd.png&w=1080&q=75"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                )
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-col w-full">
              <Header/>
              {children}
      </div>
    </div>
  );
}


export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-green-600"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-green-600" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-green-600 dark:text-white"
      >
        Mind Miracles
      </motion.span>
    </a>
  );
};


export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-green-600 dark:bg-white" />
    </a>
  );
};

