
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, Calendar, ClipboardCheck, ArrowUpRight, TrendingUp } from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { INITIAL_PATIENTS } from "@/lib/static-data"

const chartData = [
  { name: "Seg", avaliacoes: 4, atividades: 24 },
  { name: "Ter", avaliacoes: 7, atividades: 38 },
  { name: "Qua", avaliacoes: 5, atividades: 32 },
  { name: "Qui", avaliacoes: 8, atividades: 45 },
  { name: "Sex", avaliacoes: 6, atividades: 40 },
]

export default function Dashboard() {
  const patients = INITIAL_PATIENTS

  const stats = [
    {
      title: "Total de Pacientes",
      value: patients.length.toString(),
      change: "+12% este mês",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Avaliações Pendentes",
      value: "14",
      change: "3 urgentes",
      icon: ClipboardCheck,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Atividades Concluídas",
      value: "84%",
      change: "+5% vs semana passada",
      icon: Activity,
      color: "text-teal-600",
      bg: "bg-teal-100",
    },
    {
      title: "Consultas Hoje",
      value: "8",
      change: "Próxima às 14:00",
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ]

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Bem-vindo, Dr. Ricardo</h1>
          <p className="text-muted-foreground">Resumo clínico do Hospital Central.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:inline-flex shadow-sm rounded-xl">Exportar Dados</Button>
          <Button asChild className="shadow-sm rounded-xl">
            <Link href="/patients">Pacientes Ativos</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm transition-all hover:shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`${stat.bg} p-2 rounded-xl`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Volume de Atendimento</CardTitle>
            <CardDescription>Atividades semanais registradas no sistema.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pl-0 pr-4 sm:pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12} 
                  tick={{fill: '#6b7280'}}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  fontSize={12} 
                  tick={{fill: '#6b7280'}}
                />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="atividades" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Pacientes Recentes</CardTitle>
            <CardDescription>Últimas interações clínicas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {patients.slice(0, 5).map((patient) => (
                <div key={patient.id} className="flex items-center justify-between group p-2 hover:bg-accent/50 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-10 rounded-full ${patient.status === 'critical' ? 'bg-red-500' : 'bg-primary'}`} />
                    <div>
                      <p className="text-sm font-semibold leading-none">{patient.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{patient.age} anos • {patient.type}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Link href={`/patients/${patient.id}`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
