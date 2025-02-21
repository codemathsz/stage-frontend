import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { SideBar } from "../SideBar";
import { useState } from "react";

export function DefaultLayout() {
  const [isOpen, setOpen] = useState(true);

  function handleClick() {
    setOpen(!isOpen);
  }

  return (
    <div className="flex h-screen bg-background">
      <SideBar isOpen={isOpen} handleClick={handleClick} />
      <div className={`flex-1 flex-col m-3 ${isOpen ? "ml-72" : "ml-20"} `}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
