
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
  UserRound
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase"
import { doc, collection, addDoc, serverTimestamp, deleteDoc, query, where } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function PatientDetailPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = useState("plan")
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Referência do Paciente
  const patientRef = useMemo(() => db ? doc(db, 'patients', id as string) : null, [db, id])
  const { data: patient } = useDoc(patientRef)
  
  // Consulta de Atividades (Relacionamento via patientId)
  const activitiesQuery = useMemoFirebase(() => {
    if (!db || !id) return null;
    return query(collection(db, 'activities'), where('patientId', '==', id));
  }, [db, id]);
  const { data: activities, loading: loadingActivities } = useCollection(activitiesQuery)

  // Consulta de Evoluções (Relacionamento via patientId)
  const evolutionsQuery = useMemoFirebase(() => {
    if (!db || !id) return null;
    return query(collection(db, 'evolutions'), where('patientId', '==', id));
  }, [db, id])
  const { data: evolutions, loading: loadingEvolutions } = useCollection(evolutionsQuery)

  const sortedEvolutions = useMemo(() => {
    if (!evolutions) return [];
    return [...evolutions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [evolutions]);

  const handleAddActivityManual = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!db || !id) return

    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    
    const activityData = {
      patientId: id as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      difficultyType: formData.get('type') as string,
      status: 'pending',
      createdAt: serverTimestamp()
    }

    const activitiesCollectionRef = collection(db, 'activities')
    
    addDoc(activitiesCollectionRef, activityData)
      .then(() => {
        toast({ title: "Atividade Adicionada", description: "O cronograma foi atualizado." })
        ;(e.target as HTMLFormElement).reset()
        setActiveTab("plan")
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: activitiesCollectionRef.path,
          operation: 'create',
          requestResourceData: activityData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  const handleDeleteActivity = (activityId: string) => {
    if (!db) return
    const activityDocRef = doc(db, 'activities', activityId)
    
    deleteDoc(activityDocRef)
      .then(() => {
        toast({ title: "Removido", description: "Atividade removida." })
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: activityDocRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      })
  }

  if (!mounted) return null
  if (!patient && mounted) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/patients"><ChevronLeft /></Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{patient?.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-[10px] sm:text-xs">ID: {patient?.clinicalId}</Badge>
              <Badge variant="outline" className="text-[10px] sm:text-xs">{patient?.age} anos</Badge>
              <Badge className={patient?.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                {patient?.status === 'active' ? 'Ativo' : 'Crítico'}
              </Badge>
            </div>
          </div>
        </div>
        <Button size="sm" variant="outline" className="sm:w-auto w-full">Exportar PDF</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 w-full flex overflow-x-auto no-scrollbar justify-start sm:justify-center">
          <TabsTrigger value="plan" className="flex-1 min-w-[100px]">Plano</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 min-w-[100px]">Histórico</TabsTrigger>
          <TabsTrigger value="add" className="flex-1 min-w-[100px]">Nova Ação</TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="animate-slide-up">
          <div className="grid gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="px-4 py-4 sm:p-6">
                <CardTitle className="text-lg">Cronograma de Reabilitação</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-3">
                  {loadingActivities ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                  ) : activities?.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed rounded-xl">
                      <p className="text-muted-foreground text-sm">Nenhuma atividade ativa.</p>
                    </div>
                  ) : activities?.map((activity: any) => (
                    <div key={activity.id} className="flex items-start justify-between p-3 border rounded-lg bg-card/50 gap-3">
                      <div className="flex gap-3 items-start min-w-0">
                        <div className={`p-2 rounded-lg shrink-0 ${activity.difficultyType === 'motor' ? 'bg-blue-100 text-blue-600' : activity.difficultyType === 'cognitive' ? 'bg-purple-100 text-purple-600' : 'bg-teal-100 text-teal-600'}`}>
                          {activity.difficultyType === 'motor' ? <Accessibility className="h-4 w-4" /> : activity.difficultyType === 'cognitive' ? <Brain className="h-4 w-4" /> : <Home className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm leading-tight mb-1">{activity.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteActivity(activity.id)} className="text-muted-foreground hover:text-red-600 shrink-0 h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="animate-slide-up">
          <Card className="border-none shadow-sm">
            <CardHeader className="px-4 py-4 sm:p-6">
              <CardTitle className="text-lg">Evolução Clínica</CardTitle>
              <CardDescription>Histórico de atendimentos e observações profissionais.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {loadingEvolutions ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                ) : sortedEvolutions.length === 0 ? (
                   <div className="text-center py-10 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground text-sm">Sem histórico registrado.</p>
                   </div>
                ) : sortedEvolutions.map((ev: any) => (
                  <div key={ev.id} className="relative flex items-start gap-4 sm:gap-6 pl-12">
                    <div className="absolute left-0 mt-1.5 h-10 w-10 flex items-center justify-center rounded-full bg-white border-2 border-primary shadow-sm z-10">
                      <CalendarDays className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 bg-muted/30 p-4 rounded-xl border border-muted-foreground/10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                        <time className="text-xs font-bold text-primary">
                          {mounted ? new Date(ev.date).toLocaleDateString('pt-BR') : ev.date}
                        </time>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <UserRound className="h-3 w-3" />
                          <span>{ev.professional}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80">{ev.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="animate-slide-up">
          <Card className="border-none shadow-sm max-w-2xl mx-auto">
            <CardHeader className="px-4 py-4 sm:p-6">
              <CardTitle className="text-lg">Prescrever Atividade</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleAddActivityManual} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs sm:text-sm">Nome da Atividade</Label>
                  <Input id="name" name="name" placeholder="Ex: Exercício de Propriocepção" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs sm:text-sm">Área de Foco</Label>
                  <Select name="type" required defaultValue="motor">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motor">Fisioterapia Motora</SelectItem>
                      <SelectItem value="cognitive">Terapia Cognitiva</SelectItem>
                      <SelectItem value="dailyActivity">Atividade de Vida Diária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs sm:text-sm">Descrição Técnica</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Descreva a conduta..." 
                    className="min-h-[100px]"
                    required 
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                  Salvar no Prontuário
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
