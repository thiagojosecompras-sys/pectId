"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { CalendarDays, Clock, User, CheckCircle2, Circle } from "lucide-react"
import { Loader2 } from "lucide-react"

export default function TimelinePage() {
  const db = useFirestore()
  
  const activitiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, 'activities'), orderBy('createdAt', 'desc'))
  }, [db])

  const { data: activities, loading: loadingActivities } = useCollection(activitiesQuery)
  
  // Buscar pacientes para mapear nomes (opcional, mas melhora a experiência)
  const patientsQuery = useMemoFirebase(() => db ? collection(db, 'patients') : null, [db])
  const { data: patients } = useCollection(patientsQuery)

  const getPatientName = (id: string) => {
    return patients?.find(p => p.id === id)?.name || "Paciente não identificado"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Cronograma Geral</h1>
        <p className="text-muted-foreground">Visão consolidada de todas as atividades prescritas.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Fluxo de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
            {loadingActivities ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            ) : activities?.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground ml-10">
                Nenhuma atividade registrada no sistema.
              </div>
            ) : activities?.map((activity: any) => (
              <div key={activity.id} className="relative flex items-start gap-6 pl-10">
                <div className={`absolute left-0 mt-1 h-10 w-10 flex items-center justify-center rounded-full bg-white border-2 z-10 ${
                  activity.status === 'completed' ? 'border-emerald-500' : 'border-slate-300'
                }`}>
                  {activity.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-slate-50">
                        {activity.difficultyType === 'motor' ? 'Fisioterapia' : 
                         activity.difficultyType === 'cognitive' ? 'Cognição' : 'ADL'}
                      </Badge>
                      <span className="text-sm font-bold text-foreground">{activity.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.createdAt?.seconds ? new Date(activity.createdAt.seconds * 1000).toLocaleDateString() : 'Recentemente'}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {getPatientName(activity.patientId)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
