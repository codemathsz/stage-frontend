import { CaretRight, Kanban, Gear, House } from "phosphor-react";
import { Link, useLocation } from "react-router-dom";

export function SideBar() {
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
    <nav className="flex flex-col  h-screen w-96 border-r border-gray-200 rounded-tr-lg rounded-br-lg px-6">
      <img className="w-48 mx-auto" src="../src/assets/Logo.jpg" />
      <div className=" w-full h-0.5 bg-gray-200" />
      <div className="w-full flex flex-col gap-3 mt-12 ">
        {items.map((item) => (
          <Link
            to={item.link}
            data-state-active={location.pathname === item.link}
            className="flex items-center text-gray-500 rounded-lg px-4 py-3 cursor-pointer data-[state-active=true]:bg-black data-[state-active=true]:text-white hover:bg-black hover:text-white"
          >
            <div className="w-full flex justify-between gap-3">
              <span className="flex gap-4">
                {item.icon}
                {item.title}
              </span>
              <CaretRight size={20} />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center gap-4 absolute bottom-10">
        <img
          src="https://media.licdn.com/dms/image/v2/D4D03AQE3go0EdDm7Mg/profile-displayphoto-shrink_800_800/B4DZRCPoiBGUBw-/0/1736278182916?e=1744848000&v=beta&t=qBV_oQ1yvTK6auxwifXkNR5Bz7_XhH1kTqTadDLPQGI"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <div className="flex gap-1">
            <p>Olá,</p>
            <strong>João Pedro</strong>
          </div>
          <p className="text-gray-600 font-bold">Developer</p>
        </div>
      </div>
    </nav>
  );
}
