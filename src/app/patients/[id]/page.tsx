"use client"

import { useState } from "react"
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
  Calendar, 
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { suggestRehabilitationActivities, type SuggestedActivity } from "@/ai/flows/suggest-rehabilitation-activities"

const MOTOR_DIFFICULTIES = ["Fraqueza em membros inferiores", "Dificuldade de equilíbrio", "Espasticidade", "Amplitude de movimento reduzida"]
const COGNITIVE_DIFFICULTIES = ["Lapsos de memória", "Dificuldade de concentração", "Desorientação temporal", "Afasia de expressão"]
const ADL_DIFFICULTIES = ["Dificuldade ao se vestir", "Necessidade de auxílio na higiene", "Dificuldade na alimentação", "Dependência para locomoção externa"]

export default function PatientDetailPage() {
  const { id } = useParams()
  const { toast } = useToast()
  
  const [selectedMotor, setSelectedMotor] = useState<string[]>([])
  const [selectedCognitive, setSelectedCognitive] = useState<string[]>([])
  const [selectedADL, setSelectedADL] = useState<string[]>([])
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])

  const handleGeneratePlan = async () => {
    if (selectedMotor.length === 0 && selectedCognitive.length === 0 && selectedADL.length === 0) {
      toast({
        title: "Seleção necessária",
        description: "Selecione pelo menos uma dificuldade para gerar o plano.",
        variant: "destructive"
      })
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
      toast({
        title: "Plano Gerado",
        description: "A IA sugeriu novas atividades baseadas nas dificuldades registradas."
      })
    } catch (error) {
      toast({
        title: "Erro ao gerar",
        description: "Houve um problema ao consultar o Arquiteto de Atividades.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingAI(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/patients"><ChevronLeft /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Maria das Dores Oliveira</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">ID: HOSP-0021</Badge>
            <Badge variant="outline">74 anos</Badge>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Ativo</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 w-full justify-start max-w-md">
          <TabsTrigger value="assessment" className="flex-1">Avaliação</TabsTrigger>
          <TabsTrigger value="timeline" className="flex-1">Cronograma</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">Evolução</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-8 animate-slide-up">
          <div className="grid md:grid-cols-3 gap-6">
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
                    <label htmlFor={`motor-${item}`} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {item}
                    </label>
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
                    <label htmlFor={`cog-${item}`} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {item}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-teal-600">
                  <Home className="h-5 w-5" />
                  <CardTitle className="text-lg">Atividades (ADL)</CardTitle>
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
                    <label htmlFor={`adl-${item}`} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {item}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              className="gap-2 px-8 h-12 bg-secondary hover:bg-secondary/90 text-white" 
              onClick={handleGeneratePlan}
              disabled={isLoadingAI}
            >
              {isLoadingAI ? "Consultando Arquiteto de Atividades..." : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Arquitetar Plano de Reabilitação IA
                </>
              )}
            </Button>
          </div>

          {aiSuggestions.length > 0 && (
            <div className="space-y-6 pt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="text-secondary h-6 w-6" />
                  Atividades Sugeridas pela IA
                </h2>
                <Button variant="outline" onClick={() => setAiSuggestions([])}>Limpar Sugestões</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {aiSuggestions.map((act, i) => (
                  <Card key={i} className="border-l-4 border-l-secondary shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{act.name}</CardTitle>
                        <Badge variant="outline" className="capitalize text-[10px]">{act.difficultyType}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{act.description}</p>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="secondary">Adicionar ao Cronograma</Button>
                        <Button size="sm" variant="ghost">Ver Detalhes</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="animate-slide-up">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Linha do Tempo de Tratamento</CardTitle>
              <CardDescription>Acompanhe o cronograma de sessões e atividades planejadas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {[
                  { title: "Sessão de Fisioterapia Motora", time: "Hoje, 14:00", status: "Agendado", icon: Accessibility, color: "text-blue-500", bg: "bg-blue-100" },
                  { title: "Treino de ADL: Higiene Pessoal", time: "Amanhã, 09:30", status: "Pendente", icon: Home, color: "text-teal-500", bg: "bg-teal-100" },
                  { title: "Avaliação de Memória Semântica", time: "25 Nov, 15:00", status: "Pendente", icon: Brain, color: "text-purple-500", bg: "bg-purple-100" },
                  { title: "Exercício de Equilíbrio Estático", time: "22 Nov, 10:00", status: "Concluído", icon: Accessibility, color: "text-green-500", bg: "bg-green-100" },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-primary text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-white shadow-sm">
                      <div className="flex items-center justify-between space-x-1 mb-1">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <time className="font-medium text-xs text-secondary">{item.time}</time>
                      </div>
                      <div className="text-slate-500 text-sm mb-2">{item.status}</div>
                      <Button variant="outline" size="sm" className="h-7 text-xs">Ajustar Horário</Button>
                    </div>
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