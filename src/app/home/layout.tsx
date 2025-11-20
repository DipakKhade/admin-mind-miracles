import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ReactNode } from "react";


export default function HomeLayout({children}:{children: ReactNode}) {
    return <main>
        <Sidebar />
      <div className="ml-0 lg:ml-64 h-screen overflow-auto">
        <Header />
        {children}
      </div>
    </main>

}