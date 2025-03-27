import { API } from "@/lib/axios";

interface IAuth {
  email: string;
  password: string;
}

export const authenticate = async ({
  email,
  password,
}: IAuth): Promise<string> => {
  const response = await API.post("/users/auth", { email, password });
  const token = response.data;
  return token;
};
