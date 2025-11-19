import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../i18n/useTranslation';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus } from '../types/task';
import { GripVertical, X, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';

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
      className={`bg-white/80 backdrop-blur-sm border border-blue-100 rounded-lg p-3 md:p-4 mb-3 cursor-pointer transition-all hover:shadow-lg hover:bg-white ${
        isSelected ? 'ring-2 ring-blue-300 shadow-lg' : ''
      }`}
      onClick={() => onSelect(task.id)}
    >
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <div className={`flex-1 grid grid-cols-7 gap-4 items-center ${task.status === '完了' ? 'opacity-60' : ''}`}>
          <div className={`col-span-2 font-medium ${task.status === '完了' ? 'line-through' : ''}`}>{task.name}</div>
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

      {/* Mobile Layout */}
      <div className={`md:hidden space-y-2 ${task.status === '完了' ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`font-medium text-base mb-1 ${task.status === '完了' ? 'line-through' : ''}`}>{task.name}</div>
            <div className="text-sm text-gray-600">{task.customer}</div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ml-2 ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="bg-blue-50 px-2 py-1 rounded text-xs">{task.category}</span>
          <span className="text-xs">{task.workload}h</span>
        </div>
        <div className="text-xs text-gray-500">
          {task.startDate} 〜 {task.dueDate}
        </div>
      </div>
    </div>
  );
}

export default function TaskList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { tasks, reorderTasks, selectedTaskId, setSelectedTask, getTaskById, deleteTask, updateTask } = useTaskStore();
  const { projects, getProjectById } = useProjectStore();
  const { categories, products } = useSettingsStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');

  // フィルター適用
  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (filterProduct !== 'all' && task.product !== filterProduct) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // 完了タスクを最下位に
    if (a.status === '完了' && b.status !== '完了') return 1;
    if (a.status !== '完了' && b.status === '完了') return -1;
    return a.priority - b.priority;
  });
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
    setSidebarOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };

  const handleEdit = () => {
    if (selectedTask) {
      navigate(`/task/edit/${selectedTask.id}`);
    }
  };

  const handleDelete = () => {
    if (selectedTask && confirm(t('confirmDeleteTask'))) {
      deleteTask(selectedTask.id);
      handleCloseSidebar();
    }
  };

  return (
    <div className="relative h-full overflow-hidden">
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t('taskList')}</h1>
          <Button onClick={() => navigate('/new')} className="shadow-lg">
            + {t('newTask')}
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-700">{t('filter')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t('status')}</label>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">{t('all')}</option>
                <option value="未着手">{t('notStarted')}</option>
                <option value="進行中">{t('inProgress')}</option>
                <option value="完了">{t('completed')}</option>
                <option value="保留">{t('onHold')}</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t('category')}</label>
              <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">{t('all')}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t('product')}</label>
              <Select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}>
                <option value="all">{t('all')}</option>
                {products.map((prod) => (
                  <option key={prod} value={prod}>{prod}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="text-gray-400 mb-6">
              <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg md:text-xl font-medium">{t('noTasks')}</p>
            </div>
            <Button onClick={() => navigate('/new')} size="lg">
              {t('newTask')}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b">
              <div className="col-span-2">{t('taskName')}</div>
              <div>{t('customer')}</div>
              <div>{t('status')}</div>
              <div>{t('category')}</div>
              <div>{t('period')}</div>
              <div>{t('workload')}</div>
            </div>

            {/* Sortable Task List */}
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
          </div>
        )}
      </div>

      {/* Sidebar - Desktop */}
      {selectedTask && (
        <div className="hidden md:block">
          <div
            className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50`}
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold">{t('taskDetails')}</h2>
                <button onClick={handleCloseSidebar} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('taskName')}</label>
                  <p className="text-lg font-medium">{selectedTask.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer')}</label>
                  <p className="text-gray-700">{selectedTask.customer}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('category')}</label>
                    <p className="text-gray-700">{selectedTask.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('product')}</label>
                    <p className="text-gray-700">{selectedTask.product || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('startDate')}</label>
                    <p className="text-gray-700">{selectedTask.startDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('dueDate')}</label>
                    <p className="text-gray-700">{selectedTask.dueDate}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('status')}</label>
                  <Select
                    value={selectedTask.status}
                    onChange={(e) => selectedTask && updateTask(selectedTask.id, { status: e.target.value as TaskStatus })}
                  >
                    <option value="未着手">{t('notStarted')}</option>
                    <option value="進行中">{t('inProgress')}</option>
                    <option value="完了">{t('completed')}</option>
                    <option value="保留">{t('onHold')}</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('workload')}</label>
                  <p className="text-gray-700">{selectedTask.workload}{t('hours')}</p>
                </div>

                {selectedTask.relatedTasks.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('relatedTasks')}</label>
                    <div className="space-y-1">
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

                {selectedTask.relatedProjects && selectedTask.relatedProjects.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('relatedProjects')}</label>
                    <div className="space-y-1">
                      {selectedTask.relatedProjects.map((projectId) => {
                        const relatedProject = getProjectById(projectId);
                        return relatedProject ? (
                          <p key={projectId} className="text-sm text-purple-600">
                            {relatedProject.accountName}
                          </p>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {selectedTask.memo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('memo')}</label>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTask.memo}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  <p>{t('createdAt')}: {new Date(selectedTask.createdAt).toLocaleString()}</p>
                  <p>{t('updatedAt')}: {new Date(selectedTask.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 border-t space-y-3">
                <Button onClick={handleEdit} variant="outline" className="w-full">
                  {t('editTask')}
                </Button>
                <Button onClick={handleDelete} variant="destructive" className="w-full">
                  {t('deleteTask')}
                </Button>
              </div>
            </div>
          </div>

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={handleCloseSidebar}
            />
          )}
        </div>
      )}

      {/* Bottom Sheet - Mobile */}
      {selectedTask && (
        <div className="md:hidden">
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
              sidebarOpen ? 'bg-opacity-30' : 'bg-opacity-0 pointer-events-none'
            }`}
            onClick={handleCloseSidebar}
          />
          
          <div
            className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 z-50 ${
              sidebarOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ maxHeight: '85vh' }}
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              <div className="flex justify-between items-center px-6 pb-4">
                <h2 className="text-xl font-bold">{t('taskDetails')}</h2>
                <button onClick={handleCloseSidebar} className="text-gray-400">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('taskName')}</label>
                  <p className="text-lg font-medium">{selectedTask.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('customer')}</label>
                  <p className="text-gray-700">{selectedTask.customer}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('category')}</label>
                    <p className="text-gray-700">{selectedTask.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('product')}</label>
                    <p className="text-gray-700">{selectedTask.product || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('startDate')}</label>
                    <p className="text-gray-700">{selectedTask.startDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('dueDate')}</label>
                    <p className="text-gray-700">{selectedTask.dueDate}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('status')}</label>
                  <Select
                    value={selectedTask.status}
                    onChange={(e) => selectedTask && updateTask(selectedTask.id, { status: e.target.value as TaskStatus })}
                  >
                    <option value="未着手">{t('notStarted')}</option>
                    <option value="進行中">{t('inProgress')}</option>
                    <option value="完了">{t('completed')}</option>
                    <option value="保留">{t('onHold')}</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('workload')}</label>
                  <p className="text-gray-700">{selectedTask.workload}{t('hours')}</p>
                </div>

                {selectedTask.relatedTasks.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('relatedTasks')}</label>
                    <div className="space-y-1">
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

                {selectedTask.relatedProjects && selectedTask.relatedProjects.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('relatedProjects')}</label>
                    <div className="space-y-1">
                      {selectedTask.relatedProjects.map((projectId) => {
                        const relatedProject = getProjectById(projectId);
                        return relatedProject ? (
                          <p key={projectId} className="text-sm text-purple-600">
                            {relatedProject.accountName}
                          </p>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {selectedTask.memo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('memo')}</label>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTask.memo}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  <p>{t('createdAt')}: {new Date(selectedTask.createdAt).toLocaleString()}</p>
                  <p>{t('updatedAt')}: {new Date(selectedTask.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 border-t space-y-3 bg-white">
                <Button onClick={handleEdit} variant="outline" className="w-full">
                  {t('editTask')}
                </Button>
                <Button onClick={handleDelete} variant="destructive" className="w-full">
                  {t('deleteTask')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
