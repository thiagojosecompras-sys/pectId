
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
import { INITIAL_PATIENTS, Patient } from "@/lib/static-data"
import { useToast } from "@/hooks/use-toast"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  
  // Usamos os dados estáticos como base
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS)

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.clinicalId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const handleCreatePatient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    
    const formData = new FormData(e.currentTarget)
    const newPatient: Patient = {
      id: `custom-${Date.now()}`,
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      clinicalId: formData.get('clinicalId') as string,
      status: 'active',
      type: 'Avaliar',
      lastVisit: new Date().toISOString().split('T')[0],
      evolutions: [],
      activities: []
    }
    
    // Simula salvamento fechando o modal imediatamente
    setPatients(prev => [newPatient, ...prev])
    setOpen(false)
    setIsSaving(false)
    toast({ title: "Paciente Cadastrado", description: "O registro foi criado com sucesso (sessão local)." })
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
            <Button className="gap-2 w-full md:w-auto shadow-md rounded-xl">
              <UserPlus className="h-4 w-4" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <form onSubmit={handleCreatePatient}>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
                <DialogDescription>
                  Preencha as informações básicas para iniciar o prontuário.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" name="name" placeholder="Ex: João da Silva" required className="rounded-xl h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input id="age" name="age" type="number" required className="rounded-xl h-11" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clinicalId">ID Clínico</Label>
                    <Input id="clinicalId" name="clinicalId" placeholder="HOSP-XXXX" required className="rounded-xl h-11" />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSaving}>Cancelar</Button>
                <Button type="submit" disabled={isSaving} className="min-w-[120px] shadow-sm rounded-xl">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Registro"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="pb-3 bg-white border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou ID..."
              className="pl-10 h-11 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="min-w-[200px] font-bold">Paciente</TableHead>
                  <TableHead className="font-bold">ID</TableHead>
                  <TableHead className="hidden sm:table-cell font-bold">Idade</TableHead>
                  <TableHead className="hidden md:table-cell font-bold">Especialidade</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="group hover:bg-slate-50/80 transition-colors">
                    <TableCell className="font-semibold">{patient.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{patient.clinicalId}</TableCell>
                    <TableCell className="hidden sm:table-cell">{patient.age} anos</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="font-medium">{patient.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={patient.status === "active" ? "default" : "secondary"}
                        className={patient.status === "critical" ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100" : 
                                   patient.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : ""}
                      >
                        {patient.status === 'active' ? 'Em Reabilitação' : patient.status === 'critical' ? 'Crítico' : 'Estável'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuLabel>Ações Clínicas</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/patients/${patient.id}`} className="flex items-center gap-2 cursor-pointer">
                              <FileText className="h-4 w-4" />
                              Ver Prontuário Completo
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPatients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2">
                        <Activity className="h-10 w-10 text-slate-200" />
                        <p className="text-muted-foreground font-medium">Nenhum registro encontrado.</p>
                      </div>
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
