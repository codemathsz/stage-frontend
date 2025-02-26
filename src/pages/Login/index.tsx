import { authenticate } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useGetUser } from "@/hooks/useGetUser";

const userAuth = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha precisa conter no minimo 8 caracteres."),
});

export type NewUserAuth = z.infer<typeof userAuth>;

export function Login() {
  const getUser = useGetUser();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<NewUserAuth>({
    resolver: zodResolver(userAuth),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: NewUserAuth) => {
    try {
      const token = await authenticate(data);
      if (token && typeof token === "string") {
        await Promise.all([getUser(token), login(token)]);
      } else {
        setError("E-mail ou senha incorreto.");
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 401) {
        setError("E-mail ou senha incorreto.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold" htmlFor="email">
                E-mail
              </Label>
              <Input
                className="border-0"
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                {...register("email")}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold" htmlFor="password">
                Senha
              </Label>
              <Input
                className="border-0"
                id="password"
                type="password"
                {...register("password")}
                placeholder="Digite sua senha"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full text-white">
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Esqueci minha senha
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
