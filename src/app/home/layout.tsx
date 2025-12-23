import { AppSidebar } from "@/components/app-sidebar";
import { ReactNode } from "react";

export default function HomeLayout({children}:{children: ReactNode}) {
    return <AppSidebar children={children} />
}