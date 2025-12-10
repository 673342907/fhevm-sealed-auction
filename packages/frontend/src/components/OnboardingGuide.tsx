'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OnboardingGuideProps {
  onComplete: () => void;
  onSkip: () => void;
}

/**
 * 引导模式组件
 * 首次访问时显示，引导用户完成基本设置
 */
export default function OnboardingGuide({ onComplete, onSkip }: OnboardingGuideProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    // 检查是否已经看过引导
    const seen = localStorage.getItem('voting-platform-onboarding-seen');
    if (seen === 'true') {
      setHasSeenGuide(true);
      onSkip();
    }
  }, [onSkip]);

  if (hasSeenGuide) return null;

  const steps = [
    {
      title: `🔐 ${t.onboarding.step1Title}`,
      description: t.onboarding.step1Desc,
      icon: '🔐',
    },
    {
      title: `📝 ${t.onboarding.step2Title}`,
      description: t.onboarding.step2Desc,
      icon: '📝',
    },
    {
      title: `🗳️ ${t.onboarding.step3Title}`,
      description: t.onboarding.step3Desc,
      icon: '🗳️',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('voting-platform-onboarding-seen', 'true');
    setHasSeenGuide(true);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('voting-platform-onboarding-seen', 'true');
    setHasSeenGuide(true);
    onSkip();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black dark:bg-black rounded-2xl shadow-2xl max-w-lg w-full p-6 border-2 border-zama-500/60 dark:border-zama-500/70 backdrop-blur-md">
        {/* 进度指示 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index <= currentStep
                    ? 'bg-zama-500'
                    : 'bg-zinc-800 dark:bg-zinc-900'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="ml-4 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm"
          >
            {t.common.skip}
          </button>
        </div>

        {/* 步骤内容 */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{steps[currentStep].icon}</div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            {steps[currentStep].title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            {steps[currentStep].description}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {t.common.previous}
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 bg-zama-500 text-black rounded-lg font-bold hover:bg-zama-400 transition-all shadow-lg shadow-zama-500/50"
          >
            {currentStep < steps.length - 1 ? t.common.next : t.onboarding.startUsing}
          </button>
        </div>
      </div>
    </div>
  );
}


