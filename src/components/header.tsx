"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useRouter } from "next/navigation"

export function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            toast.loading('')
            const response = await axios.post("/api/auth/logout",{})
            if (response.data.success) {
            toast('logged out')
            localStorage.removeItem("token")
            router.push("/login")
        }
            toast.dismiss()
        } catch (error) {
            console.error("Logout failed:", error)
        }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-end px-6">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
           Logout
        </Button>
      </div>
    </header>
  )
}
