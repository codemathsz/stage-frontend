import { authenticate } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useGetUser } from "@/hooks/useGetUser";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const userAuth = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha precisa conter no minimo 8 caracteres."),
});

export type NewUserAuth = z.infer<typeof userAuth>;

export function Login() {
  
  const getUser = useGetUser();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<NewUserAuth>({
    resolver: zodResolver(userAuth)
  });

  const handleLogin = async (data: NewUserAuth) => {
    try {
      const token = await authenticate(data);
      if (token && typeof token === "string") {
        await Promise.all([getUser(token), login(token)]);
      } else {
        toast.error("E-mail e/ou senha incorretos.");
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 401) {
        toast.error("E-mail e/ou senha incorretos.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary/90">
      <div className="w-full max-w-[65.9rem] bg-white flex rounded-lg shadow-sm h-[600px]">
        <div className="w-1/2 bg-gray-300 rounded-l-lg" />
        <div className="w-1/2 p-6">
          <h1 className="text-3xl font-bold text-center">Login</h1>
          <p className="font-bold text-center mt-3">
            Faça o login e veja seus projetos
          </p>
          <div className="flex h-full items-center justify-center">
            <form
              onSubmit={handleSubmit(handleLogin)}
              className="w-full flex flex-col space-y-3"
            >
              <Label className="font-bold">Informe seu e-mail</Label>
              <Input
                type="email"
                {...register("email")}
                className="w-full"
                required
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
              <Label className="font-bold">Informe sua senha</Label>
              <Input type="password" {...register("password")} className="w-full" required />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
              <Button
                disabled={isSubmitting}
                className="bg-black/90 text-white"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
