import React, { useState } from 'react';
import { AngleMode, CalculatorMode } from '../types';
import { formatDisplayNumber } from '../utils/calculator';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DisplayProps {
  expression: string;
  currentValue: string;
  mode: CalculatorMode;
  angleMode: AngleMode;
  onToggleAngleMode?: () => void;
  isEvaluated: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  currentValue,
  mode,
  angleMode,
  onToggleAngleMode,
  isEvaluated,
}) => {
  const [copied, setCopied] = useState(false);

  const formattedValue = formatDisplayNumber(currentValue);

  // Dynamic font sizing based on length of the number
  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len <= 8) return 'text-4xl sm:text-5xl';
    if (len <= 12) return 'text-3xl sm:text-4xl';
    if (len <= 16) return 'text-2xl sm:text-3xl';
    return 'text-xl sm:text-2xl';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard write failed fallback
    }
  };

  return (
    <div
      id="calculator-display"
      className="relative flex flex-col justify-end p-5 bg-neutral-50/80 dark:bg-neutral-900/90 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 min-h-[130px] select-text overflow-hidden"
    >
      {/* Top bar with Angle mode (scientific) and Copy button */}
      <div className="flex items-center justify-between gap-2 mb-1 min-h-[24px]">
        <div className="flex items-center gap-2">
          {mode === 'scientific' && (
            <button
              id="btn-angle-indicator"
              type="button"
              onClick={onToggleAngleMode}
              className="text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-neutral-200/90 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors uppercase cursor-pointer"
              title="Click to toggle DEG / RAD"
            >
              {angleMode}
            </button>
          )}
        </div>

        {/* Copy Result Button */}
        <button
          id="btn-copy-result"
          type="button"
          onClick={handleCopy}
          title="Copy result to clipboard"
          className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors"
          aria-label="Copy result"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expression / Previous operations formula preview */}
      <div
        id="display-expression"
        className="text-right text-sm font-mono text-neutral-400 dark:text-neutral-500 h-6 truncate font-medium tracking-tight select-all"
        title={expression}
      >
        {expression}
      </div>

      {/* Main active display value */}
      <div className="flex items-baseline justify-end overflow-hidden">
        <motion.div
          key={currentValue}
          initial={{ opacity: 0.8, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          id="display-value"
          className={`font-mono font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 text-right break-all transition-all ${getFontSizeClass(
            formattedValue
          )}`}
        >
          {formattedValue}
        </motion.div>
      </div>

      {/* Evaluated pulse indicator */}
      <AnimatePresence>
        {isEvaluated && (
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-neutral-500/10 dark:bg-neutral-400/10 pointer-events-none rounded-2xl"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
