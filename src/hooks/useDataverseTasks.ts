import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskCategory } from '../types/task';

// カテゴリマッピング
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

/**
 * Dataverse cr19f_taskテーブル用カスタムフック
 * 
 * 注意: 現在は開発中のため、実際のDataverse統合は後続フェーズで実装します。
 * 当面はZustandストアを使用してください。
 */
export function useDataverseTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Dataverse APIを使用してタスクを取得
      console.log('Dataverse integration will be implemented in next phase');
      setTasks([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Task) => {
    try {
      // TODO: Dataverse APIを使用してタスクを作成
      console.log('Creating task:', task);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの作成に失敗しました');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // TODO: Dataverse APIを使用してタスクを更新
      console.log('Updating task:', id, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの更新に失敗しました');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      // TODO: Dataverse APIを使用してタスクを削除
      console.log('Deleting task:', id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスクの削除に失敗しました');
      throw err;
    }
  };

  const reorderTasks = async (taskIds: string[]) => {
    try {
      // TODO: Dataverse APIを使用してタスクの順序を更新
      console.log('Reordering tasks:', taskIds);
    } catch (err) {
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
