import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Project, User } from "@/types";
import { getProjectByUserId } from "@/api/project-api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ProjectContextType {
  getProjects: (userId: string) => {};
  projects: Project[] | undefined
}

interface ProjectProviderProps {
  children: ReactNode;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>();
  const user = useSelector((state: RootState) => state.user.userData) as User;

  useEffect(() =>{
    if(user){
      getProjects(user.id)
    }
  },[])

  const getProjects = async (userId: string) => {
    const response = await getProjectByUserId(userId)
    setProjects(response)
  };

  return (
    <ProjectContext.Provider value={{ getProjects, projects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within an ProjectProvider");
  }
  return context;
};
