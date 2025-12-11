'use client';

import { useState } from 'react';

interface HelpTooltipProps {
  content: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function HelpTooltip({ 
  content, 
  title,
  position = 'top' 
}: HelpTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-xs font-medium cursor-help"
        aria-label="帮助"
      >
        ?
      </button>
      {show && (
        <div
          className={`absolute z-50 w-64 p-3 text-xs bg-zinc-900 dark:bg-zinc-800 text-white rounded-lg shadow-lg ${
            position === 'top' ? 'bottom-full mb-2' :
            position === 'bottom' ? 'top-full mt-2' :
            position === 'left' ? 'right-full mr-2' :
            'left-full ml-2'
          }`}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {title && (
            <div className="font-semibold mb-1 text-violet-300">{title}</div>
          )}
          <div className="text-zinc-200 leading-relaxed">{content}</div>
          <div className={`absolute w-2 h-2 bg-zinc-900 dark:bg-zinc-800 transform rotate-45 ${
            position === 'top' ? 'bottom-0 left-4 -mb-1' :
            position === 'bottom' ? 'top-0 left-4 -mt-1' :
            position === 'left' ? 'right-0 top-4 -mr-1' :
            'left-0 top-4 -ml-1'
          }`}></div>
        </div>
      )}
    </div>
  );
}







