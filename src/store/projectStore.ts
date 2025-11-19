import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '../types/project';

interface ProjectState {
  projects: Project[];
  selectedProjectId: string | null;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (projectIds: string[]) => void;
  setSelectedProject: (id: string | null) => void;
  getProjectById: (id: string) => Project | undefined;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      selectedProjectId: null,
      
      addProject: (project) => {
        console.log('Adding project:', project);
        set((state) => ({
          projects: [...state.projects, project]
        }));
      },
      
      updateProject: (id, updates) => {
        console.log('Updating project:', id, updates);
        set((state) => ({
          projects: state.projects.map(project => 
            project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project
          )
        }));
      },
      
      deleteProject: (id) => {
        console.log('Deleting project:', id);
        set((state) => ({
          projects: state.projects.filter(project => project.id !== id),
          selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId
        }));
      },
      
      reorderProjects: (projectIds) => {
        console.log('Reordering projects:', projectIds);
        set((state) => {
          const projectMap = new Map(state.projects.map(project => [project.id, project]));
          const reorderedProjects = projectIds
            .map((id, index) => {
              const project = projectMap.get(id);
              return project ? { ...project, priority: index } : null;
            })
            .filter((project): project is Project => project !== null);
          
          return { projects: reorderedProjects };
        });
      },
      
      setSelectedProject: (id) => set({ selectedProjectId: id }),
      
      getProjectById: (id) => get().projects.find(project => project.id === id),
    }),
    {
      name: 'project-storage',
      version: 1,
    }
  )
);
