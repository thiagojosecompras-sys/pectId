"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Brain, 
  Accessibility, 
  Home, 
  ChevronLeft,
  Loader2,
  Trash2,
  PlusCircle,
  CalendarDays,
  UserRound,
  History,
  FileText
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { INITIAL_PATIENTS, Patient, Activity } from "@/lib/static-data"

export default function PatientDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState("plan")
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [patient, setPatient] = useState<Patient | null>(null)

  useEffect(() => {
    setMounted(true)
    const found = INITIAL_PATIENTS.find(p => p.id === id)
    if (found) {
      setPatient(found)
    }
  }, [id])

  const handleAddActivityManual = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!patient) return

    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      difficultyType: formData.get('type') as any,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    setPatient({
      ...patient,
      activities: [newActivity, ...patient.activities]
    })

    setTimeout(() => {
      toast({ title: "Atividade Adicionada", description: "O cronograma foi atualizado localmente." })
      ;(e.target as HTMLFormElement).reset()
      setActiveTab("plan")
      setIsSaving(false)
    }, 500)
  }

  const handleDeleteActivity = (activityId: string) => {
    if (!patient) return
    setPatient({
      ...patient,
      activities: patient.activities.filter(a => a.id !== activityId)
    })
  }

  if (!mounted) return null
  if (!patient) return <div className="p-20 text-center"><p className="text-lg font-medium">Paciente não localizado.</p><Button asChild variant="link" className="mt-2"><Link href="/patients">Voltar para a lista</Link></Button></div>

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Button variant="ghost" size="icon" asChild className="shrink-0 hover:bg-slate-100 rounded-full">
            <Link href="/patients"><ChevronLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-black tracking-tight truncate pr-2">{patient.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary" className="px-2 py-0.5 text-[9px] font-black bg-slate-100 uppercase tracking-tighter">ID: {patient.clinicalId}</Badge>
              <Badge variant="outline" className="px-2 py-0.5 text-[9px] font-bold">{patient.age} anos</Badge>
              <Badge className={`text-[9px] font-black uppercase tracking-tighter ${patient.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}`}>
                {patient.status === 'active' ? 'Reabilitação' : 'Crítico'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button size="sm" variant="outline" className="flex-1 sm:flex-none gap-2 shadow-sm rounded-xl font-bold">
            <FileText className="h-4 w-4" /> Relatório
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100/60 p-1 w-full flex overflow-x-auto no-scrollbar justify-start border border-slate-200/50 rounded-2xl sticky top-0 z-10 backdrop-blur-md">
          <TabsTrigger value="plan" className="flex-1 min-w-[100px] gap-2 py-2 rounded-xl font-bold transition-all data-[state=active]:shadow-md">
            <History className="h-4 w-4" /> Plano
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 min-w-[100px] gap-2 py-2 rounded-xl font-bold transition-all data-[state=active]:shadow-md">
            <CalendarDays className="h-4 w-4" /> Evolução
          </TabsTrigger>
          <TabsTrigger value="add" className="flex-1 min-w-[100px] gap-2 py-2 rounded-xl font-bold transition-all data-[state=active]:shadow-md">
            <PlusCircle className="h-4 w-4" /> Prescrever
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="animate-slide-up focus-visible:outline-none">
          <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-50/50 border-b py-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-black">
                <Accessibility className="h-5 w-5 text-primary" /> Cronograma Ativo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="divide-y sm:divide-y-0 sm:space-y-4">
                {patient.activities.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-slate-50/30 m-4 sm:m-0">
                    <p className="text-muted-foreground text-sm font-medium">Nenhum protocolo ativo.</p>
                  </div>
                ) : patient.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start justify-between p-4 sm:p-5 sm:border sm:rounded-2xl bg-card hover:bg-slate-50/50 transition-all gap-4 group">
                    <div className="flex gap-4 items-start min-w-0">
                      <div className={`p-3 rounded-2xl shrink-0 shadow-sm ${
                        activity.difficultyType === 'motor' ? 'bg-blue-100 text-blue-600' : 
                        activity.difficultyType === 'cognitive' ? 'bg-purple-100 text-purple-600' : 
                        'bg-teal-100 text-teal-600'
                      }`}>
                        {activity.difficultyType === 'motor' ? <Accessibility className="h-5 w-5" /> : 
                         activity.difficultyType === 'cognitive' ? <Brain className="h-5 w-5" /> : 
                         <Home className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm leading-tight mb-1 group-hover:text-primary transition-colors">{activity.name}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">{activity.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteActivity(activity.id)} className="text-muted-foreground hover:text-red-600 hover:bg-red-50 shrink-0 h-9 w-9 rounded-full transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="animate-slide-up focus-visible:outline-none">
          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader className="bg-slate-50/50 border-b py-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-black">
                <History className="h-5 w-5 text-primary" /> Histórico Longitudinal
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-8 sm:px-10">
              <div className="relative space-y-10 before:absolute before:inset-0 before:ml-5 sm:before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                {patient.evolutions.length === 0 ? (
                   <div className="text-center py-10">
                    <p className="text-muted-foreground text-sm font-medium">Sem histórico clínico.</p>
                   </div>
                ) : patient.evolutions.map((ev) => (
                  <div key={ev.id} className="relative flex items-start gap-4 sm:gap-8 pl-10 sm:pl-12">
                    <div className="absolute left-0 mt-1 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-2xl bg-white border-2 border-primary shadow-lg shadow-primary/10 z-10 transition-transform hover:scale-110">
                      <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                        <time className="text-[10px] font-black uppercase tracking-widest text-primary">
                          {ev.date}
                        </time>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tight text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                          <UserRound className="h-3.5 w-3.5" />
                          <span>{ev.professional}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">{ev.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="animate-slide-up focus-visible:outline-none">
          <Card className="border-none shadow-sm max-w-2xl mx-auto overflow-hidden rounded-3xl">
            <CardHeader className="bg-slate-50/50 border-b py-6">
              <CardTitle className="text-lg font-black">Prescrever Nova Conduta</CardTitle>
              <CardDescription className="font-medium">Adicione uma atividade específica ao cronograma.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleAddActivityManual} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest ml-1">Nome da Atividade</Label>
                  <Input id="name" name="name" placeholder="Ex: Exercício de Propriocepção" required className="rounded-2xl h-12 bg-slate-50/50 border-slate-200 focus:ring-primary/20" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-black uppercase tracking-widest ml-1">Foco / Especialidade</Label>
                  <Select name="type" required defaultValue="motor">
                    <SelectTrigger className="rounded-2xl h-12 bg-slate-50/50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="motor" className="rounded-lg">Fisioterapia Motora</SelectItem>
                      <SelectItem value="cognitive" className="rounded-lg">Terapia Cognitiva</SelectItem>
                      <SelectItem value="dailyActivity" className="rounded-lg">Atividades ADL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest ml-1">Descrição Técnica</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Orientações, séries e repetições..." 
                    className="min-h-[160px] rounded-2xl resize-none bg-slate-50/50 border-slate-200 focus:ring-primary/20"
                    required 
                  />
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl gap-2 font-black text-base shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
                  Confirmar Prescrição
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}