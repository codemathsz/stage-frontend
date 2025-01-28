import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from 'react-router-dom'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Password reset requested for:', email)
    alert('Se um usuário com este email existir, você receberá um link para redefinir sua senha.')
    navigate('/');
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Esqueci minha senha</CardTitle>
        <CardDescription>Digite seu email para receber um link de redefinição de senha.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Enviar link de redefinição</Button>
        </form>
      </CardContent>
      <CardFooter>
        <Link to="/login" className="text-sm text-blue-600 hover:underline">
          Voltar para o login
        </Link>
      </CardFooter>
    </Card>
  )
}

