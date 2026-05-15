"use client"

import { 
  Users, 
  LayoutDashboard, 
  Activity, 
  Calendar, 
  LogOut,
  Brain,
  Accessibility,
  Home,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pacientes",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Cronograma",
    url: "/timeline",
    icon: Calendar,
  },
  {
    title: "Métricas",
    url: "/analytics",
    icon: Activity,
  },
]

export function SidebarNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <Sidebar className="border-r-0 shadow-2xl z-30 ring-1 ring-white/5">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/30">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none text-white">PCTE.ID</span>
            <span className="text-[10px] text-sidebar-foreground/40 font-bold uppercase tracking-widest mt-1">Hospital Central</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4 no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/30 mb-4">Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url || (item.url !== "/dashboard" && pathname?.startsWith(item.url))}
                    className="h-12 px-4 rounded-2xl transition-all duration-300 hover:bg-sidebar-accent/40 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-xl data-[active=true]:shadow-primary/20"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-bold text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="my-8 opacity-10 mx-4 bg-white" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/30 mb-4">Especialidades</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton className="h-12 px-4 rounded-2xl hover:bg-emerald-500/10 hover:text-emerald-400 group">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Accessibility className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="font-bold text-sm">Fisioterapia</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-12 px-4 rounded-2xl hover:bg-purple-500/10 hover:text-purple-400 group">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="h-4 w-4 text-purple-400" />
                  </div>
                  <span className="font-bold text-sm">Neurocognição</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-12 px-4 rounded-2xl hover:bg-amber-500/10 hover:text-amber-400 group">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Home className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="font-bold text-sm">Terapia ADL</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <div className="bg-sidebar-accent/30 rounded-3xl p-4 mb-4 border border-white/5">
          <div className="flex items-center gap-3 group cursor-default">
            <Avatar className="h-10 w-10 border-2 border-primary/40 shadow-xl shadow-black/20">
              <AvatarImage src="https://picsum.photos/seed/doc1/200/200" />
              <AvatarFallback className="bg-primary/20 text-primary-foreground font-black text-xs">RS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate text-white">Dr. Ricardo Silva</span>
              <span className="text-[10px] text-sidebar-foreground/40 font-black uppercase tracking-widest">Gestor Clínico</span>
            </div>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-red-400/80 hover:text-white hover:bg-red-500 h-12 px-4 rounded-2xl transition-all active:scale-95 group"
            >
              <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-bold">Encerrar Sessão</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
