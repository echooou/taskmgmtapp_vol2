import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../i18n/useTranslation';
import { ProjectCategory, ProjectProduct } from '../types/project';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';

export default function ProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getProjectById, updateProject } = useProjectStore();
  const { tasks } = useTaskStore();
  const { categories, products } = useSettingsStore();
  
  const project = id ? getProjectById(id) : null;
  
  const [formData, setFormData] = useState({
    accountName: '',
    description: '',
    ssp: '',
    category: (categories && categories.length > 0 ? categories[0] : '公共') as ProjectCategory,
    product: '' as ProjectProduct,
    startDate: '',
    endDate: '',
    relatedTasks: [] as string[],
  });

  useEffect(() => {
    if (project) {
      setFormData({
        accountName: project.accountName,
        description: project.description,
        ssp: project.ssp || '',
        category: project.category,
        product: project.product || '',
        startDate: project.startDate,
        endDate: project.endDate,
        relatedTasks: project.relatedTasks,
      });
    } else if (id) {
      // 案件が見つからない場合は一覧に戻る
      navigate('/projects');
    }
  }, [project, id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      updateProject(id, formData);
      console.log('Project updated successfully, navigating to projects');
      navigate('/projects');
    } catch (error) {
      console.error('Error updating project:', error);
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

  if (!project) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-0 md:border shadow-none md:shadow-sm">
        <CardHeader>
          <CardTitle>{t('editProjectTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('accountNameRequired')}</label>
              <Input
                required
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder={t('enterCustomerName')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('description')}</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('descriptionPlaceholder')}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('ssp')}</label>
              <Input
                value={formData.ssp}
                onChange={(e) => setFormData({ ...formData, ssp: e.target.value })}
                placeholder={t('sspPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('category')}</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
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
                onChange={(e) => setFormData({ ...formData, product: e.target.value as ProjectProduct })}
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
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t('dueDateRequired')}</label>
                <Input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
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
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </Select>
              <p className="text-sm text-gray-500 mt-1">{t('multiSelectHint')}</p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
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
