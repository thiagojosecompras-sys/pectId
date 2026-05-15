"use client"

import { SidebarNavigation } from "@/components/layout/SidebarNavigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"
import { ShieldCheck } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden font-body">
        <SidebarNavigation />
        <SidebarInset className="flex-1 overflow-auto bg-slate-50/50">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            <div className="flex-1 flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline-block">Unidade Hospitalar Central</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                <ShieldCheck className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase">Acesso Seguro LGPD</span>
              </div>
            </div>
          </header>
          <main className="p-4 md:p-10 max-w-7xl mx-auto w-full animate-slide-up">
            {children}
          </main>
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}