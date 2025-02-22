import { useAuth } from "@/context/AuthContext";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { CaretRight, Kanban, Gear, House } from "phosphor-react";
import { Link, useLocation } from "react-router-dom";
import logoS from "../../assets/logo-s.jpg";
import logoStg from "../../assets/logo-stg.jpg";
type SideBarProps = {
  isOpen: boolean;
  handleClick: VoidFunction;
};

export function SideBar({ isOpen, handleClick }: SideBarProps) {
  const { logout } = useAuth();



  const items = [
    {
      title: "Projects",
      icon: <Kanban size={20} />,
      link: "/projects",
    },
    {
      title: "Home",
      icon: <House size={20} />,
      link: "/home",
    },
    {
      title: "Settings",
      icon: <Gear size={20} />,
      link: "/settings",
    },
  ];

  const location = useLocation();

  return (
    <nav
      className={`bg-white flex flex-col fixed min-h-screen shadow-md ${
        isOpen ? "w-72" : "w-28"
      }`}
    >
      <div
        onClick={handleClick}
        className="bg-primary p-2 z-20 rounded-full absolute cursor-pointer -right-4 top-9"
      >
        {isOpen ? (
          <ChevronsLeft className="text-white" size={26} />
        ) : (
          <ChevronsRight className="text-white" size={26} />
        )}
      </div>
      <div className="w-full flex justify-center items-center mx-auto rounded-lg">
        <img
          src={isOpen ? logoStg : logoS}
          alt="STG Logo"
          className={`object-contain my-4`}
        />
      </div>
      <div className="w-full flex justify-center flex-col gap-3 px-6 ">
        {items.map((item) => (
          <Link
            to={item.link}
            key={item.title}
            data-state-active={location.pathname === item.link}
            className="flex items-center min-w-12 px-4 py-3 rounded-lg cursor-pointer text-secondary data-[state-active=true]:bg-primary data-[state-active=true]:text-white hover:bg-primary hover:text-white"
          >
            <div className="w-full flex items-center justify-between gap-3">
              <div
                className={`w-full flex gap-4 font-poppins items-center ${
                  !isOpen && "justify-center"
                }`}
              >
                <span className="text-sm text-center">{item.icon}</span>
                <span className={`${!isOpen && "hidden"}`}>{item.title}</span>
              </div>
              <CaretRight size={20} />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center gap-4 absolute bottom-10 px-6 ">
        <div className="flex items-center px-4 py-3" onClick={() => logout()}>
          <span className="font-poppins text-secondary underline cursor-pointer">
            Sair
          </span>
        </div>
      </div>
    </nav>
  );
}
