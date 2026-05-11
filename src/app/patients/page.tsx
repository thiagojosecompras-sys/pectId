"use client"

import { useState } from "react"
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
  Plus, 
  Search, 
  MoreHorizontal, 
  FileText, 
  Activity,
  UserPlus
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

const initialPatients = [
  { id: "1", name: "Maria das Dores Oliveira", age: 74, clinicalId: "HOSP-0021", lastVisit: "2023-11-20", status: "Em Reabilitação", type: "Motor" },
  { id: "2", name: "José Roberto Santos", age: 62, clinicalId: "HOSP-0045", lastVisit: "2023-11-22", status: "Estável", type: "Cognitivo" },
  { id: "3", name: "Alice Maria Ferreira", age: 48, clinicalId: "HOSP-0122", lastVisit: "2023-11-19", status: "Crítico", type: "ADL" },
  { id: "4", name: "Benedito Silva", age: 81, clinicalId: "HOSP-0008", lastVisit: "2023-11-23", status: "Em Reabilitação", type: "Motor" },
  { id: "5", name: "Clara Mendes", age: 55, clinicalId: "HOSP-0099", lastVisit: "2023-11-15", status: "Alta Programada", type: "Multimodal" },
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registro de Pacientes</h1>
          <p className="text-muted-foreground">Gerencie o prontuário e histórico clínico dos seus pacientes.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
              <DialogDescription>
                Insira as informações básicas para iniciar o acompanhamento clínico.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome Completo</Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">Idade</Label>
                <Input id="age" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clinical_id" className="text-right">ID Clínico</Label>
                <Input id="clinical_id" className="col-span-3" placeholder="HOSP-XXXX" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar Registro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, ID ou diagnóstico..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Activity className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>ID Clínico</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Tipo Principal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell className="font-mono text-xs">{patient.clinicalId}</TableCell>
                  <TableCell>{patient.age} anos</TableCell>
                  <TableCell>
                    <Badge variant="outline">{patient.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={patient.status === "Em Reabilitação" ? "default" : "secondary"}
                      className={patient.status === "Crítico" ? "bg-red-100 text-red-700 border-red-200" : ""}
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações Clínicas</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/patients/${patient.id}`} className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Ver Prontuário
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Nova Avaliação
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          Arquivar Paciente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}