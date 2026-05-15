"use client"

import { 
  Users, 
  LayoutDashboard, 
  Activity, 
  Calendar, 
  Settings, 
  LogOut,
  Brain,
  Accessibility,
  Home,
  ShieldAlert
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
    title: "Início / Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Gestão de Pacientes",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Cronograma Geral",
    url: "/timeline",
    icon: Calendar,
  },
  {
    title: "Métricas Clínicas",
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
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none">PCTE.ID</span>
            <span className="text-[10px] text-sidebar-foreground/50 font-bold uppercase tracking-widest mt-1">Reabilitação</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Operacional</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    className="h-10 px-4 rounded-xl transition-all duration-200"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator className="my-4 opacity-10" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Especialidades</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 px-4 rounded-xl">
                  <Accessibility className="h-4 w-4 text-emerald-400" />
                  <span className="font-medium">Fisioterapia</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 px-4 rounded-xl">
                  <Brain className="h-4 w-4 text-purple-400" />
                  <span className="font-medium">Neurocognição</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 px-4 rounded-xl">
                  <Home className="h-4 w-4 text-amber-400" />
                  <span className="font-medium">Terapia ADL</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 bg-sidebar-accent/30">
        <div className="flex items-center gap-3 px-2 mb-6 group cursor-default">
          <Avatar className="h-10 w-10 border-2 border-primary/30 transition-transform group-hover:scale-110">
            <AvatarImage src="https://picsum.photos/seed/doc1/200/200" />
            <AvatarFallback className="bg-primary/20 text-primary-foreground font-bold">DR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate">Dr. Ricardo Silva</span>
            <span className="text-[10px] text-sidebar-foreground/40 font-bold uppercase">Gestor Clínico</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-red-400 hover:text-white hover:bg-red-500/80 h-10 px-4 rounded-xl transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-bold">Sair do Sistema</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}