import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useSettingsStore } from '../store/settingsStore';
import { Task, TaskStatus, TaskCategory } from '../types/task';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';

export default function TaskNew() {
  const navigate = useNavigate();
  const { addTask, tasks } = useTaskStore();
  const { categories } = useSettingsStore();
  
  const [formData, setFormData] = useState({
    name: '',
    customer: '',
    category: (categories && categories.length > 0 ? categories[0] : '公共') as TaskCategory,
    startDate: '',
    dueDate: '',
    status: '未着手' as TaskStatus,
    workload: 0,
    relatedTasks: [] as string[],
    memo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...formData,
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

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>新規タスク登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">タスク名 *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="タスク名を入力"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">顧客 *</label>
              <Input
                required
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="顧客名を入力"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">カテゴリ</label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">開始日 *</label>
                <Input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">終了予定日 *</label>
                <Input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ステータス</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              >
                <option value="未着手">未着手</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
                <option value="保留">保留</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">工数(時間)</label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={formData.workload}
                onChange={(e) => setFormData({ ...formData, workload: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">関連タスク</label>
              <Select
                multiple
                size={5}
                onChange={handleRelatedTasksChange}
                className="h-auto"
              >
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name}
                  </option>
                ))}
              </Select>
              <p className="text-sm text-gray-500 mt-1">Ctrlキーを押しながらクリックで複数選択</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">メモ</label>
              <Textarea
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                placeholder="メモを入力"
                rows={5}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                キャンセル
              </Button>
              <Button type="submit">
                登録
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
