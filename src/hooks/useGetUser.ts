import { API } from "@/lib/axios";
import { setUserData } from "@/store/userSlice";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

export function useGetUser() {
  const dispatch = useDispatch();

  const getUser = async (token: string) => {
    if (!token) return;
    const decode = jwtDecode(token);
    const response = await API.get(`/users/${decode.sub}`);
    dispatch(setUserData(response.data));
  };

  return getUser;
}
