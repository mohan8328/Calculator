import React from 'react';
import { AngleMode, CalculatorMode, KeyConfig } from '../types';
import { SCIENTIFIC_KEYS, STANDARD_KEYS } from '../utils/buttons';
import { motion } from 'motion/react';

interface KeypadProps {
  mode: CalculatorMode;
  angleMode: AngleMode;
  onKeyPress: (key: KeyConfig) => void;
  activeOperator?: string | null;
}

export const Keypad: React.FC<KeypadProps> = ({
  mode,
  angleMode,
  onKeyPress,
  activeOperator,
}) => {
  const getKeyStyle = (key: KeyConfig) => {
    // Check if operator is active
    const isActiveOp = activeOperator && key.value === activeOperator;

    if (key.id === 'btn-equals') {
      return 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 font-semibold shadow-sm';
    }

    if (key.id === 'btn-clear') {
      return 'bg-neutral-200/90 dark:bg-neutral-800/90 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold';
    }

    if (key.type === 'operator') {
      if (isActiveOp) {
        return 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 font-semibold ring-2 ring-neutral-400';
      }
      return 'bg-neutral-200/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-semibold';
    }

    if (key.type === 'function' || key.type === 'constant') {
      return 'bg-neutral-100 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800/60 text-xs sm:text-sm font-medium';
    }

    if (key.type === 'action') {
      return 'bg-neutral-200/70 dark:bg-neutral-800/70 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-medium';
    }

    // Digits
    return 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-750 font-semibold shadow-2xs border border-neutral-200/50 dark:border-neutral-700/50';
  };

  return (
    <div id="calculator-keypad" className="flex flex-col gap-2 select-none">
      {/* Scientific Keys Grid (visible in scientific mode) */}
      {mode === 'scientific' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          id="scientific-keys-grid"
          className="grid grid-cols-5 gap-1.5 pt-1 pb-2 border-b border-neutral-200 dark:border-neutral-800"
        >
          {SCIENTIFIC_KEYS.map((key) => {
            const displayLabel =
              key.id === 'btn-rad-deg'
                ? angleMode.toUpperCase()
                : key.displayLabel || key.label;

            return (
              <motion.button
                key={key.id}
                id={key.id}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => onKeyPress(key)}
                aria-label={key.ariaLabel || key.label}
                className={`h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${getKeyStyle(
                  key
                )}`}
              >
                <span className="font-mono">{displayLabel}</span>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      {/* Standard Keys Grid */}
      <div id="standard-keys-grid" className="grid grid-cols-4 gap-2">
        {STANDARD_KEYS.flat().map((key) => {
          return (
            <motion.button
              key={key.id}
              id={key.id}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => onKeyPress(key)}
              aria-label={key.ariaLabel || key.label}
              className={`h-14 rounded-2xl flex items-center justify-center text-lg sm:text-xl transition-all cursor-pointer ${getKeyStyle(
                key
              )}`}
            >
              <span className="font-mono">{key.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
