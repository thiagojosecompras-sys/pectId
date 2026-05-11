"use client"

import { SidebarNavigation } from "@/components/layout/SidebarNavigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <SidebarNavigation />
        <SidebarInset className="flex-1 overflow-auto">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1">
              <span className="text-sm font-medium text-muted-foreground">Sistema PCTE.ID / Hospital Central</span>
            </div>
          </header>
          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-slide-up">
            {children}
          </main>
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}