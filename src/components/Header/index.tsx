import { routes } from "@/Router";
import { RootState } from "@/store/store";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export function Header() {
  const user = useSelector((state: RootState) => state.user.userData) as User;
  const location = useLocation();
  const [title, setTitle] = useState("");

  useEffect(() => {
    const currentRoute = routes.find(
      (route) => route.path === location.pathname
    );
    if (currentRoute) {
      setTitle(currentRoute.title);
    }
  }, [location]);


  return (
    <header className="flex justify-center items-center px-6 w-full h-20 border-b-2 mt-2 ">
      <div className="w-full flex justify-between pt-2">
        <div>
          <h1 className="font-poppins text-[1.75rem] font-bold text-primary">
            {title}
          </h1>
        </div>
        <div className="flex gap-4">
          <img
            src="https://t3.ftcdn.net/jpg/05/70/71/06/360_F_570710660_Jana1ujcJyQTiT2rIzvfmyXzXamVcby8.jpg"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <div className="flex gap-1">
              <p className="font-poppins text-sm font-medium">{user?.name}</p>
            </div>
            <p className="font-poppins text-[#757575] text-xs">
              {user?.role.name}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
