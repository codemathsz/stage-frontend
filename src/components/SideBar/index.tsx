import { useAuth } from "@/context/AuthContext";
import { CaretRight, Kanban, Gear, House } from "phosphor-react";
import { Link, useLocation } from "react-router-dom";

export function SideBar() {
  const { logout } = useAuth()
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
    <nav className="bg-white flex flex-col w-72 border-r border-gray-200 px-6 shadow-md">
      <div className="flex justify-center items-center mx-auto w-32 h-32 bg-transparent rounded-lg"> 
        <img
          src="https://static.vecteezy.com/system/resources/previews/029/145/939/large_2x/stg-letter-logo-design-inspiration-for-a-unique-identity-modern-elegance-and-creative-design-watermark-your-success-with-the-striking-this-logo-vector.jpg"
          alt="STG Logo"
          className="max-w-44 h-auto mx-auto object-contain"
        /> 
     
      </div>
      <div className="w-full flex flex-col gap-3 mt-12 ">
        {items.map((item, _index) => (
          <Link
            to={item.link}
            key={_index}
            data-state-active={location.pathname === item.link}
            className="flex items-center px-4 py-3 rounded-lg cursor-pointer text-secondary data-[state-active=true]:bg-primary data-[state-active=true]:text-white hover:bg-primary hover:text-white"
          >
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex gap-4 font-poppins items-center">
                <span className="text-sm">{item.icon}</span>
                <span>
                  {item.title}
                </span>
              </div>
              <CaretRight size={20} />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center gap-4 absolute bottom-10">
        <div className="flex items-center px-4 py-3" onClick={() => logout()}>
          <span className="font-poppins text-secondary underline cursor-pointer">Sair</span>
        </div>
      </div>
    </nav>
  );
}
