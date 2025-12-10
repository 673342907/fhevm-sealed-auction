'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('zh')}
        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
          language === 'zh'
            ? 'bg-zama-500 text-black shadow-lg shadow-zama-500/50'
            : 'bg-black/50 text-zinc-400 hover:bg-black/70 hover:text-white border border-zama-500/30'
        }`}
      >
        中文
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
          language === 'en'
            ? 'bg-zama-500 text-black shadow-lg shadow-zama-500/50'
            : 'bg-black/50 text-zinc-400 hover:bg-black/70 hover:text-white border border-zama-500/30'
        }`}
      >
        English
      </button>
    </div>
  );
}

