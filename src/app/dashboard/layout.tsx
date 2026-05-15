"use client"

import { SidebarNavigation } from "@/components/layout/SidebarNavigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"
import { ShieldCheck, User, Bell } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/10">
        <SidebarNavigation />
        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
          <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 md:px-8 bg-white/80 backdrop-blur-2xl sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-slate-400 hover:text-primary transition-all active:scale-90" />
              <Separator orientation="vertical" className="mx-2 h-4 opacity-20" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] truncate hidden lg:inline-block">Unidade de Reabilitação Avançada</span>
            </div>
            
            <div className="flex-1 flex items-center justify-end gap-3 sm:gap-6">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="text-[9px] font-black uppercase tracking-wider">LGPD Certified</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="relative w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 hover:text-primary hover:bg-white hover:shadow-md transition-all">
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group cursor-pointer hover:bg-primary/20 transition-all">
                  <User className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
            <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full animate-slide-up">
              {children}
            </div>
          </main>
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
