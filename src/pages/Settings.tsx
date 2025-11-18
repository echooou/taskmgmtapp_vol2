import { useState } from 'react';
import { useSettingsStore, Language } from '../store/settingsStore';
import { useTranslation } from '../i18n/useTranslation';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { X, Plus, RotateCcw } from 'lucide-react';

export default function Settings() {
  const { t } = useTranslation();
  const { categories, products, language, addCategory, removeCategory, resetCategories, addProduct, removeProduct, resetProducts, setLanguage } = useSettingsStore();
  const [newCategory, setNewCategory] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [error, setError] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError(t('errorEnterCategory'));
      return;
    }

    if (categories.includes(newCategory.trim())) {
      setError(t('errorCategoryExists'));
      return;
    }

    addCategory(newCategory.trim());
    setNewCategory('');
    setError('');
  };

  const handleRemoveCategory = (category: string) => {
    if (categories.length <= 1) {
      setError(t('errorMinCategory'));
      return;
    }
    removeCategory(category);
    setError('');
  };

  const handleReset = () => {
    if (window.confirm(t('confirmReset'))) {
      resetCategories();
      setError('');
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.trim()) {
      setError(t('errorEnterProduct'));
      return;
    }

    if (products.includes(newProduct.trim())) {
      setError(t('errorProductExists'));
      return;
    }

    addProduct(newProduct.trim());
    setNewProduct('');
    setError('');
  };

  const handleRemoveProduct = (product: string) => {
    if (products.length <= 1) {
      setError(t('errorMinProduct'));
      return;
    }
    removeProduct(product);
    setError('');
  };

  const handleResetProducts = () => {
    if (window.confirm(t('confirmResetProduct'))) {
      resetProducts();
      setError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  const handleProductKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddProduct();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold">{t('settings')}</h2>

      <Card className="border-0 md:border shadow-none md:shadow-sm">
        <CardHeader>
          <CardTitle>{t('languageSettings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium mb-2">{t('displayLanguage')}</label>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="max-w-xs"
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </Select>
            <p className="text-sm text-gray-500 mt-2">{t('languageNote')}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 md:border shadow-none md:shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
            <CardTitle>{t('categoryManagement')}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t('resetToDefault')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 新しいカテゴリを追加 */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('addNewCategory')}</label>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder={t('enterCategoryName')}
                className="flex-1"
              />
              <Button onClick={handleAddCategory} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('add')}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          {/* カテゴリ一覧 */}
          <div>
            <label className="block text-sm font-medium mb-3">{t('registeredCategories')} ({categories.length}{t('items')})</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg px-4 py-3"
                >
                  <span className="font-medium">{category}</span>
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title={t('deleteTask')}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-sm text-blue-900 mb-2">{t('notice')}</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>{t('noticeMinCategory')}</li>
              <li>{t('noticeExistingTasks')}</li>
              <li>{t('noticeOrder')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 md:border shadow-none md:shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
            <CardTitle>{t('productManagement')}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetProducts}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t('resetToDefault')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 新しい製品を追加 */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('addNewProduct')}</label>
            <div className="flex gap-2">
              <Input
                value={newProduct}
                onChange={(e) => {
                  setNewProduct(e.target.value);
                  setError('');
                }}
                onKeyPress={handleProductKeyPress}
                placeholder={t('enterProductName')}
                className="flex-1"
              />
              <Button onClick={handleAddProduct} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('add')}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          {/* 製品一覧 */}
          <div>
            <label className="block text-sm font-medium mb-3">{t('registeredProducts')} ({products.length}{t('items')})</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {products.map((product) => (
                <div
                  key={product}
                  className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg px-4 py-3"
                >
                  <span className="font-medium">{product}</span>
                  <button
                    onClick={() => handleRemoveProduct(product)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title={t('deleteTask')}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-sm text-blue-900 mb-2">{t('notice')}</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>{t('noticeMinProduct')}</li>
              <li>{t('noticeExistingTasksProduct')}</li>
              <li>{t('noticeOrderProduct')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
