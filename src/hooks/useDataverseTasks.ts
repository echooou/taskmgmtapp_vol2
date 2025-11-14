import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskCategory } from '../types/task';

// Dataverse cr19f_Task テーブルのフィールド定義
interface DataverseTask {
  cr19f_taskid: string;
  cr19f_name: string;
  cr19f_customer: string;
  cr19f_category?: number;
  cr19f_startdate?: string;
  cr19f_duedate?: string;
  cr19f_status?: number;
  cr19f_workload?: number;
  cr19f_priority?: number;
  cr19f_memo?: string;
  createdon: string;
  modifiedon: string;
}

// カテゴリマッピング（スクリーンショットから確認）
const CATEGORY_TO_CHOICE: Record<TaskCategory, number> = {
  '公共': 100000000,
  '製薬': 100000001,
  'GCIT': 100000002,
  'Downstream': 100000003,
  'Activity': 100000004,
  'その他': 100000005,
};

const CHOICE_TO_CATEGORY: Record<number, TaskCategory> = {
  100000000: '公共',
  100000001: '製薬',
  100000002: 'GCIT',
  100000003: 'Downstream',
  100000004: 'Activity',
  100000005: 'その他',
};

// ステータスマッピング
const STATUS_TO_CHOICE: Record<TaskStatus, number> = {
  '未着手': 100000000,
  '進行中': 100000001,
  '完了': 100000002,
  '保留': 100000003,
};

const CHOICE_TO_STATUS: Record<number, TaskStatus> = {
  100000000: '未着手',
  100000001: '進行中',
  100000002: '完了',
  100000003: '保留',
};

// DataverseレコードをTaskに変換
function convertFromDataverse(record: DataverseTask): Task {
  return {
    id: record.cr19f_taskid,
    name: record.cr19f_name,
    customer: record.cr19f_customer,
    category: CHOICE_TO_CATEGORY[record.cr19f_category || 100000005] || 'その他',
    startDate: record.cr19f_startdate?.split('T')[0] || '',
    dueDate: record.cr19f_duedate?.split('T')[0] || '',
    status: CHOICE_TO_STATUS[record.cr19f_status || 100000000] || '未着手',
    workload: record.cr19f_workload || 0,
    priority: record.cr19f_priority || 999,
    memo: record.cr19f_memo || '',
    relatedTasks: [],
    createdAt: record.createdon,
    updatedAt: record.modifiedon,
  };
}

// TaskをDataverseレコードに変換
function convertToDataverse(task: Partial<Task>): Partial<DataverseTask> {
  const record: any = {};
  
  if (task.name) record.cr19f_name = task.name;
  if (task.customer) record.cr19f_customer = task.customer;
  if (task.category) record.cr19f_category = CATEGORY_TO_CHOICE[task.category] || 100000005;
  if (task.startDate) record.cr19f_startdate = task.startDate;
  if (task.dueDate) record.cr19f_duedate = task.dueDate;
  if (task.status) record.cr19f_status = STATUS_TO_CHOICE[task.status] || 100000000;
  if (task.workload !== undefined) record.cr19f_workload = task.workload;
  if (task.priority !== undefined) record.cr19f_priority = task.priority;
  if (task.memo !== undefined) record.cr19f_memo = task.memo;

  return record;
}

/**
 * Dataverse cr19f_Taskテーブル用カスタムフック
 * 
 * 環境URL: org83836b24.crm.dynamics.com
 * テーブル論理名: cr19f_task
 * テーブルセット名: cr19f_tasks
 */
export function useDataverseTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'https://org83836b24.crm.dynamics.com/api/data/v9.2';
  const ENTITY_SET = 'cr19f_tasks';

  // タスク一覧を取得
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${ENTITY_SET}?$orderby=cr19f_priority asc,createdon desc`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const loadedTasks = data.value.map(convertFromDataverse);
      setTasks(loadedTasks);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(err instanceof Error ? err.message : 'タスクの読み込みに失敗しました');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // タスク作成
  const addTask = async (task: Task) => {
    try {
      const record = convertToDataverse(task);
      
      const response = await fetch(`${API_URL}/${ENTITY_SET}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
      setError(err instanceof Error ? err.message : 'タスクの作成に失敗しました');
      throw err;
    }
  };

  // タスク更新
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const record = convertToDataverse(updates);
      
      const response = await fetch(`${API_URL}/${ENTITY_SET}(${id})`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
      setError(err instanceof Error ? err.message : 'タスクの更新に失敗しました');
      throw err;
    }
  };

  // タスク削除
  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${ENTITY_SET}(${id})`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await loadTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(err instanceof Error ? err.message : 'タスクの削除に失敗しました');
      throw err;
    }
  };

  // タスク順序変更
  const reorderTasks = async (taskIds: string[]) => {
    try {
      for (let i = 0; i < taskIds.length; i++) {
        await fetch(`${API_URL}/${ENTITY_SET}(${taskIds[i]})`, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cr19f_priority: i }),
        });
      }
      
      await loadTasks();
    } catch (err) {
      console.error('Failed to reorder tasks:', err);
      setError(err instanceof Error ? err.message : 'タスクの順序変更に失敗しました');
      throw err;
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    loadTasks,
  };
}
