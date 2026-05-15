"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts"
import { Activity, TrendingUp, Users, ClipboardList } from "lucide-react"

const typeData = [
  { name: 'Motor', value: 45, color: '#3b82f6' },
  { name: 'Cognitivo', value: 30, color: '#a855f7' },
  { name: 'ADL', value: 25, color: '#14b8a6' },
]

const performanceData = [
  { month: 'Jan', score: 65 },
  { month: 'Fev', score: 72 },
  { month: 'Mar', score: 85 },
  { month: 'Abr', score: 78 },
  { month: 'Mai', score: 90 },
]

const weeklyData = [
  { name: 'Seg', total: 12 },
  { name: 'Ter', total: 18 },
  { name: 'Qua', total: 15 },
  { name: 'Qui', total: 22 },
  { name: 'Sex', total: 20 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Métricas Clínicas</h1>
        <p className="text-muted-foreground">Análise de desempenho e distribuição de atendimentos.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Taxa de Sucesso", value: "92%", icon: TrendingUp, color: "text-emerald-600" },
          { label: "Sessões Ativas", value: "124", icon: Activity, color: "text-blue-600" },
          { label: "Novos Pacientes", value: "+12", icon: Users, color: "text-purple-600" },
          { label: "Aderência", value: "88%", icon: ClipboardList, color: "text-amber-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs text-emerald-500 font-medium">+2.5%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-sm md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Evolução do Desempenho</CardTitle>
            <CardDescription>Índice médio de progresso clínico (0-100)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Foco</CardTitle>
            <CardDescription>Especialidades mais demandadas</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {typeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
