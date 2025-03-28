import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { SideBar } from "../SideBar";
import { useState } from "react";

export function DefaultLayout() {
  const [isOpenSidebar, setOpenSidebar] = useState(true);

  function handleOpenAndCloseSidebar() {
    setOpenSidebar(!isOpenSidebar);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideBar isOpenSidebar={isOpenSidebar} handleOpenAndCloseSidebar={handleOpenAndCloseSidebar} />
      <div className={`flex-1 transition-all duration-200 flex-col m-3 ${isOpenSidebar ? "ml-72" : "ml-28"} `}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
