export type TaskStatus = '未着手' | '進行中' | '完了' | '保留';

export type TaskCategory = '公共' | '製薬' | 'GCIT' | 'Downstream' | 'Activity' | 'その他' | string;

export interface Task {
  id: string;
  name: string;
  customer: string;
  category: TaskCategory;
  startDate: string;
  dueDate: string;
  status: TaskStatus;
  workload: number; // 工数(時間)
  relatedTasks: string[]; // 関連タスクのID配列
  memo: string;
  priority: number; // 優先順位(小さいほど優先)
  createdAt: string;
  updatedAt: string;
}
