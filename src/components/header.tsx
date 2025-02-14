import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";

interface HeaderProps {
  user?: User;
}

export function Header({ user }: HeaderProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-black text-primary-foreground py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="relative w-14 h-12 bg-black rounded-lg mr-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/STG_ICON_LOW-001-MpE6LuBK5SE8fiPQ69rXmRfLqi8Bqe.png"
              alt="STG Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-12">
              <NavigationMenuItem>
                <NavigationMenuLink href="/home">Inicio</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/project">
                  Projetos
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">Reuniões</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          <p>Hello, {user?.name}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
