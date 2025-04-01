import { useAuth } from "@/context/AuthContext";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { CaretRight, Kanban, House } from "phosphor-react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { useMemo } from "react";
import logoS from "../../assets/logo-s.jpg";
import logoStg from "../../assets/logo-stg.jpg";

type SideBarProps = {
  isOpenSidebar: boolean;
  handleOpenAndCloseSidebar: VoidFunction;
};

export function SideBar({ isOpenSidebar, handleOpenAndCloseSidebar }: SideBarProps) {
  const { logout } = useAuth();
  const location = useLocation();

  const items = useMemo(
    () => [
      { title: "Projects", icon: <Kanban size={20} />, link: "/projects" },
      { title: "Home", icon: <House size={20} />, link: "/home" },
      { title: "Meetings", icon: <Kanban size={20} />, link: "/meetings" },
    ],
    []
  );

  return (
    <nav
      className={clsx(
        "bg-white flex flex-col fixed min-h-screen shadow-md transition-all duration-200",
        isOpenSidebar ? "w-72" : "w-28"
      )}
    >
      <button
        onClick={handleOpenAndCloseSidebar}
        className="bg-primary p-2 z-20 rounded-full absolute cursor-pointer -right-4 top-9"
        aria-label="Toggle Sidebar"
      >
        {isOpenSidebar ? (
          <ChevronsLeft className="text-white" size={26} />
        ) : (
          <ChevronsRight className="text-white" size={26} />
        )}
      </button>

      <div className="w-full flex justify-center mx-auto rounded-lg">
        <img
          src={isOpenSidebar ? logoStg : logoS}
          alt="STG Logo"
          className="object-contain my-4 transition-all duration-300"
        />
      </div>

      <div
        className={clsx(
          "w-full flex flex-col gap-3 px-6 mt-16 transition-all duration-300",
          !isOpenSidebar && "items-center"
        )}
      >
        {items.map((item) => (
          <Link
            to={item.link}
            key={item.title}
            data-state-active={location.pathname === item.link}
            className={clsx(
              "flex items-center min-w-12 h-12 px-4 py-3 rounded-lg cursor-pointer text-secondary hover:bg-primary hover:text-white",
              location.pathname === item.link && "bg-primary text-white"
            )}
          >
            <div className="w-full flex items-center justify-between">
              <div
                className={clsx(
                  "w-full flex items-center gap-4",
                  !isOpenSidebar && "justify-center"
                )}
              >
                <span className="text-sm text-center">{item.icon}</span>
                {isOpenSidebar && <span>{item.title}</span>}
              </div>
              {isOpenSidebar && <CaretRight size={20} />}
            </div>
          </Link>
        ))}
      </div>

      <LogoutButton logout={logout} />
    </nav>
  );
}

type LogoutButtonProps = {
  logout: VoidFunction;
};

const LogoutButton = ({ logout }: LogoutButtonProps) => (
  <div className="absolute bottom-10 w-full flex justify-start px-6">
    <button
      onClick={logout}
      className="flex items-center px-4 py-3 text-secondary underline cursor-pointer transition-all duration-300 hover:text-primary"
      aria-label="Logout"
    >
      Sair
    </button>
  </div>
);
