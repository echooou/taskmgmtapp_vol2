import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../i18n/useTranslation';
import { TaskStatus, TaskCategory, TaskProduct } from '../types/task';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';

export default function TaskEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getTaskById, updateTask, tasks } = useTaskStore();
  const { categories } = useSettingsStore();
  
  const task = id ? getTaskById(id) : null;
  
  const [formData, setFormData] = useState({
    name: '',
    customer: '',
    category: (categories && categories.length > 0 ? categories[0] : '公共') as TaskCategory,
    product: '' as TaskProduct,
    startDate: '',
    dueDate: '',
    status: '未着手' as TaskStatus,
    workload: 0,
    relatedTasks: [] as string[],
    memo: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        customer: task.customer,
        category: task.category,
        product: task.product || '',
        startDate: task.startDate,
        dueDate: task.dueDate,
        status: task.status,
        workload: task.workload,
        relatedTasks: task.relatedTasks,
        memo: task.memo,
      });
    } else if (id) {
      // タスクが見つからない場合は一覧に戻る
      navigate('/');
    }
  }, [task, id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      updateTask(id, formData);
      console.log('Task updated successfully, navigating to home');
      navigate('/');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleRelatedTasksChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({ ...formData, relatedTasks: selected });
  };

  if (!task) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t('editTaskTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('taskNameRequired')}</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('enterTaskName')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('customerRequired')}</label>
              <Input
                required
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder={t('enterCustomerName')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('category')}</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
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
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value as TaskProduct })}
              >
                <option value="">{t('selectNone')}</option>
                <option value="Copilot Studio">Copilot Studio</option>
                <option value="Power Apps">Power Apps</option>
                <option value="Power Automate">Power Automate</option>
                <option value="PAD">PAD</option>
                <option value="Power Pages">Power Pages</option>
                <option value="Power Platform">Power Platform</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('startDateRequired')}</label>
                <Input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('dueDateRequired')}</label>
                <Input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('status')}</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
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
                value={formData.workload}
                onChange={(e) => setFormData({ ...formData, workload: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('relatedTasksSelect')}</label>
              <Select
                multiple
                size={5}
                value={formData.relatedTasks}
                onChange={handleRelatedTasksChange}
                className="h-auto"
              >
                {tasks.filter(t => t.id !== id).map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </Select>
              <p className="text-sm text-gray-500 mt-1">{t('multiSelectHint')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('memo')}</label>
              <Textarea
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                placeholder={t('memoPlaceholder')}
                rows={5}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                {t('cancel')}
              </Button>
              <Button type="submit">
                {t('update')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
