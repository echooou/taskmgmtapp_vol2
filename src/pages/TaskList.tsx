import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useTranslation } from '../i18n/useTranslation';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types/task';
import { GripVertical, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface SortableTaskItemProps {
  task: Task;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

function SortableTaskItem({ task, onSelect, isSelected }: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusColor = (status: string) => {
    const colors = {
      '未着手': 'bg-blue-100 text-blue-700',
      '進行中': 'bg-purple-100 text-purple-700',
      '完了': 'bg-green-100 text-green-700',
      '保留': 'bg-pink-100 text-pink-700',
    };
    return colors[status as keyof typeof colors] || 'bg-blue-100 text-blue-700';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/80 backdrop-blur-sm border border-blue-100 rounded-lg p-4 mb-3 cursor-pointer transition-all hover:shadow-lg hover:bg-white ${
        isSelected ? 'ring-2 ring-blue-300 shadow-lg' : ''
      }`}
      onClick={() => onSelect(task.id)}
    >
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1 grid grid-cols-7 gap-4 items-center">
          <div className="col-span-2 font-medium">{task.name}</div>
          <div className="text-sm text-gray-600">{task.customer}</div>
          <div className="text-sm">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
          <div className="text-sm text-gray-600">{task.category}</div>
          <div className="text-sm text-gray-600">
            {task.startDate} 〜 {task.dueDate}
          </div>
          <div className="text-sm text-gray-600">{task.workload}h</div>
        </div>
      </div>
    </div>
  );
}

export default function TaskList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { tasks, reorderTasks, selectedTaskId, setSelectedTask, getTaskById, deleteTask } = useTaskStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
  const selectedTask = selectedTaskId ? getTaskById(selectedTaskId) : null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedTasks.findIndex((task) => task.id === active.id);
      const newIndex = sortedTasks.findIndex((task) => task.id === over.id);

      const newOrder = [...sortedTasks];
      const [movedTask] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedTask);

      reorderTasks(newOrder.map((task) => task.id));
    }
  };

  const handleSelectTask = (id: string) => {
    setSelectedTask(id);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSelectedTask(null);
    setSidebarOpen(false);
  };

  const handleDeleteTask = () => {
    if (selectedTaskId) {
      deleteTask(selectedTaskId);
      handleCloseSidebar();
    }
  };

  return (
    <div className="flex gap-6">
      <div className={`flex-1 transition-all ${sidebarOpen ? 'mr-96' : ''}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">{t('taskList')}</h2>
          <div className="grid grid-cols-7 gap-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-sm font-medium text-gray-700">
            <div className="col-span-2 pl-11">{t('taskName')}</div>
            <div>{t('customer')}</div>
            <div>{t('status')}</div>
            <div>{t('category')}</div>
            <div>{t('period')}</div>
            <div>{t('workload')}</div>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t('noTasks')}
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {sortedTasks.map((task) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  onSelect={handleSelectTask}
                  isSelected={selectedTaskId === task.id}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {sidebarOpen && selectedTask && (
        <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-blue-50/95 to-purple-50/95 backdrop-blur-md shadow-xl border-l border-blue-100 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{t('taskDetails')}</h3>
            <button onClick={handleCloseSidebar} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="text-sm font-medium text-gray-500">{t('taskName')}</label>
                <p className="mt-1 text-base">{selectedTask.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">{t('customer')}</label>
                <p className="mt-1 text-base">{selectedTask.customer}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">{t('category')}</label>
                <p className="mt-1 text-base">{selectedTask.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('startDate')}</label>
                  <p className="mt-1 text-base">{selectedTask.startDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('dueDate')}</label>
                  <p className="mt-1 text-base">{selectedTask.dueDate}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">{t('status')}</label>
                <p className="mt-1 text-base">{selectedTask.status}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">{t('workload')}</label>
                <p className="mt-1 text-base">{selectedTask.workload}{t('hours')}</p>
              </div>

              {selectedTask.relatedTasks.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('relatedTasks')}</label>
                  <div className="mt-1 space-y-1">
                    {selectedTask.relatedTasks.map((taskId) => {
                      const relatedTask = getTaskById(taskId);
                      return relatedTask ? (
                        <p key={taskId} className="text-sm text-blue-600">
                          {relatedTask.name}
                        </p>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {selectedTask.memo && (
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('memo')}</label>
                  <p className="mt-1 text-base whitespace-pre-wrap">{selectedTask.memo}</p>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full" onClick={() => navigate(`/task/edit/${selectedTaskId}`)}>
                  {t('editTask')}
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleDeleteTask}>
                  {t('deleteTask')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
