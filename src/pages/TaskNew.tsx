import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../i18n/useTranslation';
import { Task, TaskStatus, TaskCategory, TaskProduct } from '../types/task';
import { Project, ProjectCategory, ProjectProduct } from '../types/project';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';

export default function TaskNew() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addTask, tasks } = useTaskStore();
  const { addProject, projects } = useProjectStore();
  const { categories, products } = useSettingsStore();
  
  const [registrationType, setRegistrationType] = useState<'task' | 'project'>('task');
  
  const [taskFormData, setTaskFormData] = useState({
    name: '',
    customer: '',
    category: (categories && categories.length > 0 ? categories[0] : '公共') as TaskCategory,
    product: '' as TaskProduct,
    startDate: '',
    dueDate: '',
    status: '未着手' as TaskStatus,
    workload: 0,
    relatedTasks: [] as string[],
    relatedProjects: [] as string[],
    memo: '',
  });

  const [projectFormData, setProjectFormData] = useState({
    accountName: '',
    description: '',
    ssp: '',
    category: (categories && categories.length > 0 ? categories[0] : '公共') as ProjectCategory,
    product: '' as ProjectProduct,
    startDate: '',
    endDate: '',
    relatedTasks: [] as string[],
  });

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...taskFormData,
        priority: tasks.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Creating new task:', newTask);
      addTask(newTask);
      console.log('Task created successfully, navigating to home');
      navigate('/');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newProject: Project = {
        id: crypto.randomUUID(),
        ...projectFormData,
        priority: projects.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Creating new project:', newProject);
      addProject(newProject);
      console.log('Project created successfully, navigating to projects');
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };


  const handleTaskRelatedTasksChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setTaskFormData({ ...taskFormData, relatedTasks: selected });
  };

  const handleTaskRelatedProjectsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setTaskFormData({ ...taskFormData, relatedProjects: selected });
  };

  const handleProjectRelatedTasksChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setProjectFormData({ ...projectFormData, relatedTasks: selected });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-0 md:border shadow-none md:shadow-sm">
        <CardHeader>
          <CardTitle>{t('newProjectRegistration')}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 案件/タスク選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t('selectRegistrationType')}</label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={registrationType === 'task' ? 'default' : 'outline'}
                onClick={() => setRegistrationType('task')}
                className="flex-1"
              >
                {t('registerTask')}
              </Button>
              <Button
                type="button"
                variant={registrationType === 'project' ? 'default' : 'outline'}
                onClick={() => setRegistrationType('project')}
                className="flex-1"
              >
                {t('registerProject')}
              </Button>
            </div>
          </div>

          {/* タスク登録フォーム */}
          {registrationType === 'task' && (
            <form onSubmit={handleTaskSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('taskNameRequired')}</label>
                <Input
                  required
                  value={taskFormData.name}
                  onChange={(e) => setTaskFormData({ ...taskFormData, name: e.target.value })}
                  placeholder={t('enterTaskName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('customerRequired')}</label>
                <Input
                  required
                  value={taskFormData.customer}
                  onChange={(e) => setTaskFormData({ ...taskFormData, customer: e.target.value })}
                  placeholder={t('enterCustomerName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('category')}</label>
                <Select
                  value={taskFormData.category}
                  onChange={(e) => setTaskFormData({ ...taskFormData, category: e.target.value as TaskCategory })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('product')}</label>
                <Select
                  value={taskFormData.product}
                  onChange={(e) => setTaskFormData({ ...taskFormData, product: e.target.value as TaskProduct })}
                >
                  <option value="">{t('selectNone')}</option>
                  {products.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('startDateRequired')}</label>
                  <Input
                    type="date"
                    required
                    value={taskFormData.startDate}
                    onChange={(e) => setTaskFormData({ ...taskFormData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('dueDateRequired')}</label>
                  <Input
                    type="date"
                    required
                    value={taskFormData.dueDate}
                    onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('status')}</label>
                <Select
                  value={taskFormData.status}
                  onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value as TaskStatus })}
                >
                  <option value="未着手">{t('notStarted')}</option>
                  <option value="進行中">{t('inProgress')}</option>
                  <option value="完了">{t('completed')}</option>
                  <option value="保留">{t('onHold')}</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('workloadHours')}</label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={taskFormData.workload}
                  onChange={(e) => setTaskFormData({ ...taskFormData, workload: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('relatedTasksSelect')}</label>
                <Select
                  multiple
                  size={5}
                  onChange={handleTaskRelatedTasksChange}
                  className="h-auto"
                >
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
                </Select>
                <p className="text-sm text-gray-500 mt-1">{t('multiSelectHint')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('relatedProjects')}</label>
                <Select
                  multiple
                  size={5}
                  onChange={handleTaskRelatedProjectsChange}
                  className="h-auto"
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.accountName}
                    </option>
                  ))}
                </Select>
                <p className="text-sm text-gray-500 mt-1">{t('multiSelectHint')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('memo')}</label>
                <Textarea
                  value={taskFormData.memo}
                  onChange={(e) => setTaskFormData({ ...taskFormData, memo: e.target.value })}
                  placeholder={t('memoPlaceholder')}
                  rows={5}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  {t('cancel')}
                </Button>
                <Button type="submit">
                  {t('register')}
                </Button>
              </div>
            </form>
          )}

          {/* 案件登録フォーム */}
          {registrationType === 'project' && (
            <form onSubmit={handleProjectSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('accountNameRequired')}</label>
                <Input
                  required
                  value={projectFormData.accountName}
                  onChange={(e) => setProjectFormData({ ...projectFormData, accountName: e.target.value })}
                  placeholder={t('enterCustomerName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('description')}</label>
                <Textarea
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder={t('descriptionPlaceholder')}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('ssp')}</label>
                <Input
                  value={projectFormData.ssp}
                  onChange={(e) => setProjectFormData({ ...projectFormData, ssp: e.target.value })}
                  placeholder={t('sspPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('category')}</label>
                <Select
                  value={projectFormData.category}
                  onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value as ProjectCategory })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('product')}</label>
                <Select
                  value={projectFormData.product}
                  onChange={(e) => setProjectFormData({ ...projectFormData, product: e.target.value as ProjectProduct })}
                >
                  <option value="">{t('selectNone')}</option>
                  {products.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('startDateRequired')}</label>
                  <Input
                    type="date"
                    required
                    value={projectFormData.startDate}
                    onChange={(e) => setProjectFormData({ ...projectFormData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('dueDateRequired')}</label>
                  <Input
                    type="date"
                    required
                    value={projectFormData.endDate}
                    onChange={(e) => setProjectFormData({ ...projectFormData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('relatedTasksSelect')}</label>
                <Select
                  multiple
                  size={5}
                  onChange={handleProjectRelatedTasksChange}
                  className="h-auto"
                >
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
                </Select>
                <p className="text-sm text-gray-500 mt-1">{t('multiSelectHint')}</p>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  {t('cancel')}
                </Button>
                <Button type="submit">
                  {t('register')}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
