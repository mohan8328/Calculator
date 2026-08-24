import React from 'react';
import { formatDisplayNumber } from '../utils/calculator';

interface MemoryBarProps {
  memory: number | null;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => void;
}

export const MemoryBar: React.FC<MemoryBarProps> = ({ memory, onMemoryAction }) => {
  const hasMemory = memory !== null && memory !== 0;

  return (
    <div id="calculator-memory-bar" className="flex items-center justify-between gap-1 px-1 py-1">
      <div className="flex items-center gap-1 w-full">
        <button
          id="btn-memory-clear"
          type="button"
          disabled={!hasMemory}
          onClick={() => onMemoryAction('MC')}
          className={`flex-1 py-1 px-2 rounded-lg text-xs font-mono font-medium transition-all ${
            hasMemory
              ? 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 active:scale-95'
              : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
          }`}
          title="Memory Clear"
        >
          MC
        </button>

        <button
          id="btn-memory-recall"
          type="button"
          disabled={!hasMemory}
          onClick={() => onMemoryAction('MR')}
          className={`flex-1 py-1 px-2 rounded-lg text-xs font-mono font-medium transition-all ${
            hasMemory
              ? 'text-neutral-900 dark:text-neutral-100 font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-800 active:scale-95'
              : 'text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
          }`}
          title={hasMemory ? `Memory Recall (Stored: ${formatDisplayNumber(memory!)})` : 'Memory Recall'}
        >
          MR
        </button>

        <button
          id="btn-memory-add"
          type="button"
          onClick={() => onMemoryAction('M+')}
          className="flex-1 py-1 px-2 rounded-lg text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 active:scale-95 transition-all"
          title="Memory Add"
        >
          M+
        </button>

        <button
          id="btn-memory-subtract"
          type="button"
          onClick={() => onMemoryAction('M-')}
          className="flex-1 py-1 px-2 rounded-lg text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 active:scale-95 transition-all"
          title="Memory Subtract"
        >
          M−
        </button>

        <button
          id="btn-memory-store"
          type="button"
          onClick={() => onMemoryAction('MS')}
          className="flex-1 py-1 px-2 rounded-lg text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 active:scale-95 transition-all"
          title="Memory Store"
        >
          MS
        </button>
      </div>

      {hasMemory && (
        <span
          id="memory-indicator"
          className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 uppercase"
          title={`Memory: ${formatDisplayNumber(memory!)}`}
        >
          M
        </span>
      )}
    </div>
  );
};
