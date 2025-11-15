import { useSettingsStore } from '../store/settingsStore';
import { translations, TranslationKey } from './translations';

export function useTranslation() {
  const { language } = useSettingsStore();
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };
  
  return { t, language };
}
