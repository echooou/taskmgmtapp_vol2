export type ProjectCategory = '公共' | '製薬' | 'GCIT' | 'Downstream' | 'Activity' | 'その他' | string;

export type ProjectProduct = 'Copilot Studio' | 'Power Apps' | 'Power Automate' | 'PAD' | 'Power Pages' | 'Power Platform' | '';

export interface Project {
  id: string;
  accountName: string; // アカウント名
  description: string; // 詳細
  ssp: string; // 担当営業
  startDate: string;
  endDate: string;
  category: ProjectCategory;
  product: ProjectProduct;
  relatedTasks: string[]; // 関連タスクのID配列
  priority: number; // 優先順位(小さいほど優先)
  createdAt: string;
  updatedAt: string;
}
