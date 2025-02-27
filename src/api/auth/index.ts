import { API } from "@/lib/axios";

interface IAuth {
  email: string
  password: string
}

export const authenticate = async (credentials: IAuth): Promise<string> => {
  const response = await API.post('/users/auth', credentials);
  const token = response.data;
  return token;
};
