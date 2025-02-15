import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { SideBar } from "../SideBar";

export function DefaultLayout() {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 flex-col m-3">
      <Header />
      <Outlet/>
      </div>
    </div>
  );
}
