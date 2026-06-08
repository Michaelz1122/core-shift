import { useAppStore } from '@/store/useAppStore';
import { TRANSLATIONS, TranslationSet } from './translations';
import type { Language } from '@/types';

// ─── Main hook ────────────────────────────────────────────────────────────────

export function useTranslation(): {
  t: TranslationSet;
  language: Language;
  isRTL: boolean;
} {
  const language = useAppStore((s) => s.language);
  return {
    t: TRANSLATIONS[language],
    language,
    isRTL: language === 'ar',
  };
}

// ─── Static helper (outside components) ──────────────────────────────────────

export function getT(language: Language): TranslationSet {
  return TRANSLATIONS[language];
}

export { TRANSLATIONS };
export type { TranslationSet };
