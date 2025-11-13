import { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { X, Plus, RotateCcw } from 'lucide-react';

export default function Settings() {
  const { categories, addCategory, removeCategory, resetCategories } = useSettingsStore();
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError('カテゴリ名を入力してください');
      return;
    }

    if (categories.includes(newCategory.trim())) {
      setError('このカテゴリは既に存在します');
      return;
    }

    addCategory(newCategory.trim());
    setNewCategory('');
    setError('');
  };

  const handleRemoveCategory = (category: string) => {
    if (categories.length <= 1) {
      setError('最低1つのカテゴリが必要です');
      return;
    }
    removeCategory(category);
    setError('');
  };

  const handleReset = () => {
    if (window.confirm('カテゴリをデフォルトに戻しますか?')) {
      resetCategories();
      setError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">設定</h2>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>カテゴリ管理</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              デフォルトに戻す
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 新しいカテゴリを追加 */}
          <div>
            <label className="block text-sm font-medium mb-2">新しいカテゴリを追加</label>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="カテゴリ名を入力"
                className="flex-1"
              />
              <Button onClick={handleAddCategory} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                追加
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          {/* カテゴリ一覧 */}
          <div>
            <label className="block text-sm font-medium mb-3">登録済みカテゴリ ({categories.length}件)</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg px-4 py-3"
                >
                  <span className="font-medium">{category}</span>
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="削除"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-sm text-blue-900 mb-2">ℹ️ 注意事項</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• カテゴリは最低1つ必要です</li>
              <li>• 削除したカテゴリを使用している既存のタスクには影響しません</li>
              <li>• カテゴリの順序は追加順に表示されます</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
