"use client"

import { SidebarNavigation } from "@/components/layout/SidebarNavigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"
import { ShieldCheck, User } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-svh w-full bg-background overflow-hidden font-body selection:bg-primary/10">
        <SidebarNavigation />
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/40">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:px-6 bg-white/90 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
            <SidebarTrigger className="-ml-1 text-slate-500 hover:text-primary transition-colors" />
            <Separator orientation="vertical" className="mx-2 h-4 opacity-50" />
            <div className="flex-1 flex items-center justify-between min-w-0">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] truncate mr-4">Unidade Central Hospitalar</span>
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100/50">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-tight">LGPD Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
                     <User className="h-4.5 w-4.5 text-slate-500" />
                   </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-slide-up">
              {children}
            </div>
          </main>
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}