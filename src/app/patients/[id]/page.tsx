
"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  Accessibility, 
  Home, 
  Sparkles, 
  ChevronLeft,
  Loader2,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { suggestRehabilitationActivities } from "@/ai/flows/suggest-rehabilitation-activities"
import { useFirestore, useDoc, useCollection } from "@/firebase"
import { doc, collection, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore"

const MOTOR_DIFFICULTIES = ["Fraqueza em membros inferiores", "Dificuldade de equilíbrio", "Espasticidade", "Amplitude de movimento reduzida"]
const COGNITIVE_DIFFICULTIES = ["Lapsos de memória", "Dificuldade de concentração", "Desorientação temporal", "Afasia de expressão"]
const ADL_DIFFICULTIES = ["Dificuldade ao se vestir", "Necessidade de auxílio na higiene", "Dificuldade na alimentação", "Dependência para locomoção externa"]

export default function PatientDetailPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const db = useFirestore()
  
  const patientRef = useMemo(() => db ? doc(db, 'patients', id as string) : null, [db, id])
  const { data: patient } = useDoc(patientRef)
  
  const activitiesRef = useMemo(() => db ? collection(db, 'patients', id as string, 'suggestedActivities') : null, [db, id])
  const { data: activities, loading: loadingActivities } = useCollection(activitiesRef)

  const [selectedMotor, setSelectedMotor] = useState<string[]>([])
  const [selectedCognitive, setSelectedCognitive] = useState<string[]>([])
  const [selectedADL, setSelectedADL] = useState<string[]>([])
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])

  const handleGeneratePlan = async () => {
    if (selectedMotor.length === 0 && selectedCognitive.length === 0 && selectedADL.length === 0) {
      toast({ title: "Seleção necessária", description: "Selecione dificuldades para a IA analisar.", variant: "destructive" })
      return
    }

    setIsLoadingAI(true)
    try {
      const result = await suggestRehabilitationActivities({
        motorDifficulties: selectedMotor,
        cognitiveDifficulties: selectedCognitive,
        dailyActivityDifficulties: selectedADL
      })
      setAiSuggestions(result.suggestedActivities)
      toast({ title: "Sugestões Geradas", description: "O Arquiteto de Atividades propôs novas intervenções." })
    } catch (error) {
      toast({ title: "Erro na IA", description: "Não foi possível gerar sugestões agora.", variant: "destructive" })
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleSaveActivity = async (activity: any) => {
    if (!db) return
    try {
      await addDoc(collection(db, 'patients', id as string, 'suggestedActivities'), {
        ...activity,
        status: 'pending',
        createdAt: serverTimestamp()
      })
      setAiSuggestions(prev => prev.filter(a => a.name !== activity.name))
      toast({ title: "Atividade Adicionada", description: "O plano do paciente foi atualizado." })
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao salvar atividade.", variant: "destructive" })
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (!db) return
    try {
      await deleteDoc(doc(db, 'patients', id as string, 'suggestedActivities', activityId))
      toast({ title: "Removido", description: "Atividade removida do cronograma." })
    } catch (err) {
      toast({ title: "Erro", description: "Não foi possível remover.", variant: "destructive" })
    }
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

      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 w-full justify-start overflow-x-auto">
          <TabsTrigger value="assessment" className="flex-1">Nova Avaliação</TabsTrigger>
          <TabsTrigger value="plan" className="flex-1">Plano Atual</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-8 animate-slide-up">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <Accessibility className="h-5 w-5" />
                  <CardTitle className="text-lg">Motora</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {MOTOR_DIFFICULTIES.map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`motor-${item}`} 
                      checked={selectedMotor.includes(item)}
                      onCheckedChange={(checked) => {
                        setSelectedMotor(prev => checked ? [...prev, item] : prev.filter(i => i !== item))
                      }}
                    />
                    <label htmlFor={`motor-${item}`} className="text-sm cursor-pointer">{item}</label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-purple-600">
                  <Brain className="h-5 w-5" />
                  <CardTitle className="text-lg">Cognitiva</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {COGNITIVE_DIFFICULTIES.map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`cog-${item}`} 
                      checked={selectedCognitive.includes(item)}
                      onCheckedChange={(checked) => {
                        setSelectedCognitive(prev => checked ? [...prev, item] : prev.filter(i => i !== item))
                      }}
                    />
                    <label htmlFor={`cog-${item}`} className="text-sm cursor-pointer">{item}</label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-teal-600">
                  <Home className="h-5 w-5" />
                  <CardTitle className="text-lg">ADL</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {ADL_DIFFICULTIES.map(item => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`adl-${item}`} 
                      checked={selectedADL.includes(item)}
                      onCheckedChange={(checked) => {
                        setSelectedADL(prev => checked ? [...prev, item] : prev.filter(i => i !== item))
                      }}
                    />
                    <label htmlFor={`adl-${item}`} className="text-sm cursor-pointer">{item}</label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="gap-2 w-full max-w-md h-12 bg-secondary hover:bg-secondary/90" 
              onClick={handleGeneratePlan}
              disabled={isLoadingAI}
            >
              {isLoadingAI ? <Loader2 className="animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {isLoadingAI ? "Processando..." : "Gerar Estratégia com IA"}
            </Button>
          </div>

          {aiSuggestions.length > 0 && (
            <div className="space-y-4 pt-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="text-secondary h-5 w-5" />
                Sugestões do Arquiteto
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {aiSuggestions.map((act, i) => (
                  <Card key={i} className="border-l-4 border-l-secondary shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-start justify-between">
                      <CardTitle className="text-base">{act.name}</CardTitle>
                      <Badge variant="outline" className="capitalize text-[10px]">{act.difficultyType}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-4">{act.description}</p>
                      <Button size="sm" variant="secondary" onClick={() => handleSaveActivity(act)} className="w-full">
                        Adicionar ao Prontuário
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="plan" className="animate-slide-up">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Plano de Reabilitação Vigente</CardTitle>
              <CardDescription>Atividades ativas no cronograma.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingActivities ? <Loader2 className="animate-spin mx-auto" /> : activities?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">Nenhuma atividade ativa. Gere um plano acima.</p>
                ) : activities?.map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-colors">
                    <div className="flex gap-4 items-start">
                      <div className={`p-2 rounded-lg ${activity.difficultyType === 'motor' ? 'bg-blue-100 text-blue-600' : activity.difficultyType === 'cognitive' ? 'bg-purple-100 text-purple-600' : 'bg-teal-100 text-teal-600'}`}>
                        {activity.difficultyType === 'motor' ? <Accessibility className="h-5 w-5" /> : activity.difficultyType === 'cognitive' ? <Brain className="h-5 w-5" /> : <Home className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{activity.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteActivity(activity.id)} className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
