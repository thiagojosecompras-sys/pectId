
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
import { INITIAL_PATIENTS, Patient, Activity, Evolution } from "@/lib/static-data"

export default function PatientDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState("plan")
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Buscamos o paciente na lista estática
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

    // Atualiza estado local da página
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 hover:bg-slate-100 rounded-full">
            <Link href="/patients"><ChevronLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{patient.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-mono bg-slate-100">ID: {patient.clinicalId}</Badge>
              <Badge variant="outline" className="px-2 py-0.5 text-[10px]">{patient.age} anos</Badge>
              <Badge className={patient.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                {patient.status === 'active' ? 'Em Reabilitação' : 'Estado Crítico'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button size="sm" variant="outline" className="flex-1 sm:flex-none gap-2 shadow-sm rounded-xl">
            <FileText className="h-4 w-4" /> Relatório
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100/50 p-1.5 w-full flex overflow-x-auto no-scrollbar justify-start border border-slate-200/50 rounded-xl">
          <TabsTrigger value="plan" className="flex-1 min-w-[120px] gap-2 py-2 rounded-lg">
            <History className="h-4 w-4" /> Plano
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 min-w-[120px] gap-2 py-2 rounded-lg">
            <CalendarDays className="h-4 w-4" /> Evolução
          </TabsTrigger>
          <TabsTrigger value="add" className="flex-1 min-w-[120px] gap-2 py-2 rounded-lg">
            <PlusCircle className="h-4 w-4" /> Prescrever
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="animate-slide-up focus-visible:outline-none">
          <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-primary" /> Cronograma Ativo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="divide-y sm:divide-y-0 sm:space-y-4">
                {patient.activities.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-slate-50/30 m-6">
                    <p className="text-muted-foreground text-sm">Nenhum protocolo ativo para este paciente.</p>
                  </div>
                ) : patient.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start justify-between p-4 sm:p-5 sm:border sm:rounded-2xl bg-card hover:bg-slate-50/50 transition-colors gap-4">
                    <div className="flex gap-4 items-start min-w-0">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        activity.difficultyType === 'motor' ? 'bg-blue-100 text-blue-600' : 
                        activity.difficultyType === 'cognitive' ? 'bg-purple-100 text-purple-600' : 
                        'bg-teal-100 text-teal-600'
                      }`}>
                        {activity.difficultyType === 'motor' ? <Accessibility className="h-5 w-5" /> : 
                         activity.difficultyType === 'cognitive' ? <Brain className="h-5 w-5" /> : 
                         <Home className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm leading-tight mb-1">{activity.name}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{activity.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteActivity(activity.id)} className="text-muted-foreground hover:text-red-600 shrink-0 h-9 w-9 rounded-full">
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
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-primary" /> Histórico Longitudinal
              </CardTitle>
              <CardDescription>Registro cronológico de evoluções clínicas.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 py-8 sm:px-10">
              <div className="relative space-y-10 before:absolute before:inset-0 before:ml-5 sm:before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                {patient.evolutions.length === 0 ? (
                   <div className="text-center py-10">
                    <p className="text-muted-foreground text-sm">Sem histórico clínico registrado.</p>
                   </div>
                ) : patient.evolutions.map((ev) => (
                  <div key={ev.id} className="relative flex items-start gap-4 sm:gap-8 pl-10 sm:pl-12">
                    <div className="absolute left-0 mt-1 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-white border-2 border-primary shadow-sm z-10">
                      <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-primary/20 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                        <time className="text-xs font-black uppercase tracking-wider text-primary">
                          {ev.date}
                        </time>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          <UserRound className="h-3.5 w-3.5" />
                          <span>{ev.professional}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{ev.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="animate-slide-up focus-visible:outline-none">
          <Card className="border-none shadow-sm max-w-2xl mx-auto overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg">Prescrever Nova Conduta</CardTitle>
              <CardDescription>Adicione uma atividade específica ao cronograma do paciente.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddActivityManual} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Atividade</Label>
                  <Input id="name" name="name" placeholder="Ex: Exercício de Propriocepção MMII" required className="rounded-xl h-11" />
                </div>
                
                <div className="grid sm:grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="type">Especialidade / Foco</Label>
                    <Select name="type" required defaultValue="motor">
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motor">Fisioterapia Motora</SelectItem>
                        <SelectItem value="cognitive">Terapia Cognitiva</SelectItem>
                        <SelectItem value="dailyActivity">Atividades de Vida Diária (ADL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição e Orientações Técnicas</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Descreva a série, repetições e observações..." 
                    className="min-h-[140px] rounded-xl resize-none"
                    required 
                  />
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl gap-2 font-bold shadow-sm" disabled={isSaving}>
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
