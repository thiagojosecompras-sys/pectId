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
    <Sidebar className="border-r-0 shadow-xl z-30">
      <SidebarHeader className="p-6 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none">PCTE.ID</span>
            <span className="text-[10px] text-sidebar-foreground/50 font-bold uppercase tracking-widest mt-1">Reabilitação</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-6 no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest opacity-50 mb-3">Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url || (item.url !== "/dashboard" && pathname?.startsWith(item.url))}
                    className="h-11 px-4 rounded-xl transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4.5 w-4.5" />
                      <span className="font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="my-6 opacity-5 mx-4" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest opacity-50 mb-3">Especialidades</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-11 px-4 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 group">
                  <Accessibility className="h-4.5 w-4.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Fisioterapia</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-11 px-4 rounded-xl hover:bg-purple-500/10 hover:text-purple-400 group">
                  <Brain className="h-4.5 w-4.5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Neurocognição</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-11 px-4 rounded-xl hover:bg-amber-500/10 hover:text-amber-400 group">
                  <Home className="h-4.5 w-4.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Terapia ADL</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 bg-sidebar-accent/20">
        <div className="flex items-center gap-3 px-2 mb-6 group cursor-default">
          <Avatar className="h-11 w-11 border-2 border-primary/20 shadow-sm transition-transform group-hover:scale-105">
            <AvatarImage src="https://picsum.photos/seed/doc1/200/200" />
            <AvatarFallback className="bg-primary/20 text-primary-foreground font-bold">DR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate">Dr. Ricardo Silva</span>
            <span className="text-[10px] text-sidebar-foreground/40 font-black uppercase tracking-tighter">Gestor Clínico</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-red-400 hover:text-white hover:bg-red-500/90 h-11 px-4 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span className="font-bold">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}