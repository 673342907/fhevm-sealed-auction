'use client';

import { useState } from 'react';

interface Step {
  title: string;
  description: string;
  icon: string;
}

interface StepGuideProps {
  steps: Step[];
  currentStep?: number;
  onClose?: () => void;
}

export default function StepGuide({ steps, currentStep, onClose }: StepGuideProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-violet-900 dark:text-violet-100 mb-1">
            📚 操作指南
          </h3>
          <p className="text-sm text-violet-700 dark:text-violet-300">
            按照以下步骤快速上手
          </p>
        </div>
        <button
          onClick={() => {
            setDismissed(true);
            if (onClose) onClose();
          }}
          className="p-1 text-violet-600 hover:text-violet-800 dark:hover:text-violet-400"
        >
          ✕
        </button>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              currentStep === index
                ? 'bg-violet-100 dark:bg-violet-900/50 border border-violet-300 dark:border-violet-700'
                : 'bg-white dark:bg-zinc-900/50'
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep === index
                ? 'bg-violet-600 text-white'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{step.icon}</span>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                  {step.title}
                </h4>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}







