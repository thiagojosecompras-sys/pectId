
"use client"

import { useState, useMemo } from "react"
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
  ClipboardList
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useDoc, useCollection } from "@/firebase"
import { doc, collection, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

export default function PatientDetailPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = useState("plan")
  const [isSaving, setIsSaving] = useState(false)

  const patientRef = useMemo(() => db ? doc(db, 'patients', id as string) : null, [db, id])
  const { data: patient } = useDoc(patientRef)
  
  const activitiesRef = useMemo(() => db ? collection(db, 'patients', id as string, 'suggestedActivities') : null, [db, id])
  const { data: activities, loading: loadingActivities } = useCollection(activitiesRef)

  const handleAddActivityManual = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!db) return

    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    
    const activityData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      difficultyType: formData.get('type') as string,
      status: 'pending',
      createdAt: serverTimestamp()
    }

    const activitiesCollectionRef = collection(db, 'patients', id as string, 'suggestedActivities')
    
    addDoc(activitiesCollectionRef, activityData)
      .then(() => {
        toast({ title: "Atividade Adicionada", description: "O cronograma foi atualizado com sucesso." })
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
    const activityDocRef = doc(db, 'patients', id as string, 'suggestedActivities', activityId)
    
    deleteDoc(activityDocRef)
      .then(() => {
        toast({ title: "Removido", description: "Atividade removida do cronograma." })
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: activityDocRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      })
  }

  if (!patient) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/patients"><ChevronLeft /></Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{patient.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="secondary">ID: {patient.clinicalId}</Badge>
            <Badge variant="outline">{patient.age} anos</Badge>
            <Badge className={patient.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
              {patient.status === 'active' ? 'Ativo' : 'Crítico'}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50 p-1 w-full justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="plan" className="flex-1 whitespace-nowrap">Plano de Reabilitação</TabsTrigger>
          <TabsTrigger value="add" className="flex-1 whitespace-nowrap">Nova Atividade</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 whitespace-nowrap">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="animate-slide-up">
          <Card className="border-none shadow-sm">
            <CardHeader className="px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Atividades em Execução</CardTitle>
                  <CardDescription>Cronograma vigente para o paciente.</CardDescription>
                </div>
                <ClipboardList className="text-muted-foreground h-5 w-5 hidden sm:block" />
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-4">
                {loadingActivities ? <Loader2 className="animate-spin mx-auto" /> : activities?.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <p className="text-muted-foreground">Nenhuma atividade ativa no momento.</p>
                    <Button variant="link" onClick={() => setActiveTab("add")} className="mt-2">
                      Adicionar primeira atividade
                    </Button>
                  </div>
                ) : activities?.map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors gap-4">
                    <div className="flex gap-4 items-start min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${activity.difficultyType === 'motor' ? 'bg-blue-100 text-blue-600' : activity.difficultyType === 'cognitive' ? 'bg-purple-100 text-purple-600' : 'bg-teal-100 text-teal-600'}`}>
                        {activity.difficultyType === 'motor' ? <Accessibility className="h-5 w-5" /> : activity.difficultyType === 'cognitive' ? <Brain className="h-5 w-5" /> : <Home className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-sm truncate max-w-[150px] sm:max-w-none">{activity.name}</h4>
                          <Badge variant="outline" className="text-[10px] capitalize shrink-0">{activity.difficultyType}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{activity.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteActivity(activity.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="animate-slide-up">
          <Card className="border-none shadow-sm max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Prescrever Nova Atividade</CardTitle>
              <CardDescription>Defina manualmente os detalhes da intervenção terapêutica.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddActivityManual} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Atividade</Label>
                  <Input id="name" name="name" placeholder="Ex: Treino de Marcha Lateral" required />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Foco</Label>
                    <Select name="type" required defaultValue="motor">
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motor">Motora</SelectItem>
                        <SelectItem value="cognitive">Cognitiva</SelectItem>
                        <SelectItem value="dailyActivity">Atividade Diária (ADL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Instruções e Objetivos</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Descreva detalhadamente como a atividade deve ser realizada e quais os objetivos clínicos." 
                    className="min-h-[120px]"
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

        <TabsContent value="history" className="animate-slide-up">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Histórico Clínico</CardTitle>
              <CardDescription>Registros de avaliações e evoluções anteriores.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground text-center px-4">
              <ClipboardList className="h-12 w-12 opacity-20 mb-4" />
              <p>O histórico de evolução será implementado em breve para acompanhamento longitudinal.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
