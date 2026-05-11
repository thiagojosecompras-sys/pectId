"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity, ShieldCheck, Stethoscope } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <div className="bg-primary p-3 rounded-2xl">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter">PCTE.ID</h1>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Sistema de Gestão de Reabilitação</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Plataforma integrada para profissionais de saúde gerenciarem pacientes, 
              avaliarem dificuldades e planejarem tratamentos com auxílio de inteligência artificial.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="text-secondary h-5 w-5" />
              <span>Dados Criptografados</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Stethoscope className="text-secondary h-5 w-5" />
              <span>Foco Clínico</span>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Acesso Profissional</CardTitle>
            <CardDescription>
              Entre com suas credenciais clínicas autorizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Institucional</Label>
                <Input id="email" type="email" placeholder="nome@hospital.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Button variant="link" className="p-0 h-auto text-xs">Esqueceu a senha?</Button>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full h-11 text-lg font-semibold">
                Acessar Sistema
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-xs text-muted-foreground">
                Ao acessar, você concorda com os termos de privacidade e LGPD para dados sensíveis de saúde.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}