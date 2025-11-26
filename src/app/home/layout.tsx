import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar_old";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function HomeLayout({children}:{children: ReactNode}) {
    return <SidebarProvider>
    {/* <AppSidebar /> */}
    <main>
      <SidebarTrigger />
      {children}
    </main>
  </SidebarProvider>

}