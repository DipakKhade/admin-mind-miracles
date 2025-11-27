import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function HomeLayout({children}:{children: ReactNode}) {
    return <SidebarProvider>
    <AppSidebar />
    <main className="md:w-[80vw] w-full">
      <SidebarTrigger />
      {children}
    </main>
  </SidebarProvider>

}