import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '../types/task';

interface TaskState {
  tasks: Task[];
  selectedTaskId: string | null;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (taskIds: string[]) => void;
  setSelectedTask: (id: string | null) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTaskId: null,
      
      addTask: (task) => {
        console.log('Adding task:', task);
        set((state) => ({
          tasks: [...state.tasks, task]
        }));
      },
      
      updateTask: (id, updates) => {
        console.log('Updating task:', id, updates);
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
          )
        }));
      },
      
      deleteTask: (id) => {
        console.log('Deleting task:', id);
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId
        }));
      },
      
      reorderTasks: (taskIds) => {
        console.log('Reordering tasks:', taskIds);
        set((state) => {
          const taskMap = new Map(state.tasks.map(task => [task.id, task]));
          const reorderedTasks = taskIds
            .map((id, index) => {
              const task = taskMap.get(id);
              return task ? { ...task, priority: index } : null;
            })
            .filter((task): task is Task => task !== null);
          
          return { tasks: reorderedTasks };
        });
      },
      
      setSelectedTask: (id) => set({ selectedTaskId: id }),
      
      getTaskById: (id) => get().tasks.find(task => task.id === id),
    }),
    {
      name: 'task-storage',
      version: 1,
    }
  )
);
