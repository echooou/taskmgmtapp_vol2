export type TaskStatus = '未着手' | '進行中' | '完了' | '保留';

export type TaskCategory = '公共' | '製薬' | 'GCIT' | 'Downstream' | 'Activity' | 'その他' | string;

export type TaskProduct = 'Copilot Studio' | 'Power Apps' | 'Power Automate' | 'PAD' | 'Power Pages' | 'Power Platform' | '';

export interface Task {
  id: string;
  name: string;
  customer: string;
  category: TaskCategory;
  product: TaskProduct; // 製品
  startDate: string;
  dueDate: string;
  status: TaskStatus;
  workload: number; // 工数(時間)
  relatedTasks: string[]; // 関連タスクのID配列
  relatedProjects: string[]; // 関連案件のID配列
  memo: string;
  priority: number; // 優先順位(小さいほど優先)
  createdAt: string;
  updatedAt: string;
}
