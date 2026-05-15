
"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Search, 
  MoreHorizontal, 
  FileText, 
  Activity,
  UserPlus,
  Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"
import { seedDemoData } from "@/lib/demo-data"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  
  const db = useFirestore()
  const patientsQuery = useMemoFirebase(() => db ? collection(db, 'patients') : null, [db])
  const { data: patients, loading } = useCollection(patientsQuery)

  useEffect(() => {
    if (db) seedDemoData(db)
  }, [db])

  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    return patients.filter((p: any) => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.clinicalId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const handleCreatePatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!db) return
    
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    const patientData = {
      name: formData.get('name'),
      age: Number(formData.get('age')),
      clinicalId: formData.get('clinicalId'),
      status: 'active',
      type: 'Avaliar',
      lastVisit: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp()
    }
    
    const patientsCollectionRef = collection(db, 'patients')

    addDoc(patientsCollectionRef, patientData)
      .then(() => {
        toast({ title: "Paciente Cadastrado", description: "O registro foi criado com sucesso." })
        setOpen(false)
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: patientsCollectionRef.path,
          operation: 'create',
          requestResourceData: patientData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registro de Pacientes</h1>
          <p className="text-muted-foreground">Gestão completa de prontuários eletrônicos.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full md:w-auto">
              <UserPlus className="h-4 w-4" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreatePatient}>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
                <DialogDescription>
                  Informações iniciais para o prontuário.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input id="age" name="age" type="number" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clinicalId">ID Clínico</Label>
                    <Input id="clinicalId" name="clinicalId" placeholder="HOSP-XXXX" required />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Registro
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Paciente</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="hidden sm:table-cell">Idade</TableHead>
                  <TableHead className="hidden md:table-cell">Especialidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filteredPatients?.map((patient: any) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell className="font-mono text-xs">{patient.clinicalId}</TableCell>
                    <TableCell className="hidden sm:table-cell">{patient.age} anos</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{patient.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={patient.status === "active" ? "default" : "secondary"}
                        className={patient.status === "critical" ? "bg-red-100 text-red-700 border-red-200" : ""}
                      >
                        {patient.status === 'active' ? 'Em Reabilitação' : patient.status === 'critical' ? 'Crítico' : 'Estável'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/patients/${patient.id}`} className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Ver Prontuário
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {(!filteredPatients || filteredPatients.length === 0) && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      Nenhum paciente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
