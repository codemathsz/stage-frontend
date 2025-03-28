import { API } from "@/lib/axios";

interface AuthProps {
  email: string
  password: string
}

export async function authenticate({ email, password }: AuthProps) {
  const response = await API.post<string>('/users/auth', { email, password });
  return response.data;
};