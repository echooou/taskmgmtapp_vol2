import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../i18n/useTranslation';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Project } from '../types/project';
import { GripVertical, X, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';

interface SortableProjectItemProps {
  project: Project;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

function SortableProjectItem({ project, onSelect, isSelected }: SortableProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/80 backdrop-blur-sm border border-blue-100 rounded-lg p-3 md:p-4 mb-3 cursor-pointer transition-all hover:shadow-lg hover:bg-white ${
        isSelected ? 'ring-2 ring-blue-300 shadow-lg' : ''
      }`}
      onClick={() => onSelect(project.id)}
    >
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1 grid grid-cols-6 gap-4 items-center">
          <div className="col-span-2 font-medium">{project.accountName}</div>
          <div className="text-sm text-gray-600">{project.category}</div>
          <div className="text-sm text-gray-600">{project.product || '-'}</div>
          <div className="text-sm text-gray-600">
            {project.startDate} 〜 {project.endDate}
          </div>
          <div className="text-sm text-gray-600">{project.relatedTasks.length}件</div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-medium text-base mb-1">{project.accountName}</div>
            <div className="text-sm text-gray-600 line-clamp-2">{project.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="bg-blue-50 px-2 py-1 rounded text-xs">{project.category}</span>
          {project.product && <span className="text-xs">{project.product}</span>}
          <span className="text-xs">{project.relatedTasks.length}件</span>
        </div>
        <div className="text-xs text-gray-500">
          {project.startDate} 〜 {project.endDate}
        </div>
      </div>
    </div>
  );
}

export default function ProjectList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { projects, reorderProjects, selectedProjectId, setSelectedProject, getProjectById, deleteProject } = useProjectStore();
  const { categories, products } = useSettingsStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');

  // フィルター適用
  const filteredProjects = projects.filter(project => {
    if (filterCategory !== 'all' && project.category !== filterCategory) return false;
    if (filterProduct !== 'all' && project.product !== filterProduct) return false;
    return true;
  });

  const selectedProject = selectedProjectId ? getProjectById(selectedProjectId) : null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = filteredProjects.findIndex((p) => p.id === active.id);
      const newIndex = filteredProjects.findIndex((p) => p.id === over.id);
      
      const newOrder = [...filteredProjects];
      const [movedProject] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedProject);

      reorderProjects(newOrder.map((project) => project.id));
    }
  };

  const handleSelectProject = (id: string) => {
    setSelectedProject(id);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const handleEdit = () => {
    if (selectedProject) {
      navigate(`/projects/edit/${selectedProject.id}`);
    }
  };

  const handleDelete = () => {
    if (selectedProject && confirm(t('confirmDeleteProject'))) {
      deleteProject(selectedProject.id);
      handleCloseSidebar();
    }
  };

  return (
    <div className="relative h-full overflow-hidden">
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t('projectList')}</h1>
          <Button onClick={() => navigate('/new')} className="shadow-lg">
            + {t('registerProject')}
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-700">{t('filter')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Project List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="text-gray-400 mb-6">
              <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg md:text-xl font-medium">{t('noProjects')}</p>
            </div>
            <Button onClick={() => navigate('/new')} size="lg">
              {t('registerProject')}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-2 text-sm font-medium text-gray-500 border-b">
              <div className="col-span-2">{t('accountName')}</div>
              <div>{t('category')}</div>
              <div>{t('product')}</div>
              <div>{t('period')}</div>
              <div>{t('relatedTasks')}</div>
            </div>

            {/* Sortable Project List */}
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                {filteredProjects.map((project) => (
                  <SortableProjectItem
                    key={project.id}
                    project={project}
                    onSelect={handleSelectProject}
                    isSelected={project.id === selectedProjectId}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      {/* Sidebar - Desktop */}
      {selectedProject && (
        <div className="hidden md:block">
          <div
            className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50`}
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold">{t('projectDetails')}</h2>
                <button onClick={handleCloseSidebar} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('accountName')}</label>
                  <p className="text-lg font-medium">{selectedProject.accountName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('description')}</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedProject.description || '-'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('ssp')}</label>
                  <p className="text-gray-700">{selectedProject.ssp || '-'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('category')}</label>
                    <p className="text-gray-700">{selectedProject.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('product')}</label>
                    <p className="text-gray-700">{selectedProject.product || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('startDate')}</label>
                    <p className="text-gray-700">{selectedProject.startDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('dueDate')}</label>
                    <p className="text-gray-700">{selectedProject.endDate}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('relatedTasks')}</label>
                  <p className="text-gray-700">{selectedProject.relatedTasks.length}件</p>
                </div>

                <div className="text-sm text-gray-500">
                  <p>{t('createdAt')}: {new Date(selectedProject.createdAt).toLocaleString()}</p>
                  <p>{t('updatedAt')}: {new Date(selectedProject.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 border-t space-y-3">
                <Button onClick={handleEdit} variant="outline" className="w-full">
                  {t('editProject')}
                </Button>
                <Button onClick={handleDelete} variant="destructive" className="w-full">
                  {t('deleteProject')}
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
      {selectedProject && (
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
                <h2 className="text-xl font-bold">{t('projectDetails')}</h2>
                <button onClick={handleCloseSidebar} className="text-gray-400">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('accountName')}</label>
                  <p className="text-lg font-medium">{selectedProject.accountName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('description')}</label>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedProject.description || '-'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('ssp')}</label>
                  <p className="text-gray-700">{selectedProject.ssp || '-'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('category')}</label>
                    <p className="text-gray-700">{selectedProject.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('product')}</label>
                    <p className="text-gray-700">{selectedProject.product || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('startDate')}</label>
                    <p className="text-gray-700">{selectedProject.startDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('dueDate')}</label>
                    <p className="text-gray-700">{selectedProject.endDate}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">{t('relatedTasks')}</label>
                  <p className="text-gray-700">{selectedProject.relatedTasks.length}件</p>
                </div>

                <div className="text-sm text-gray-500">
                  <p>{t('createdAt')}: {new Date(selectedProject.createdAt).toLocaleString()}</p>
                  <p>{t('updatedAt')}: {new Date(selectedProject.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 border-t space-y-3 bg-white">
                <Button onClick={handleEdit} variant="outline" className="w-full">
                  {t('editProject')}
                </Button>
                <Button onClick={handleDelete} variant="destructive" className="w-full">
                  {t('deleteProject')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
