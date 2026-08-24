import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '0 - 9', description: 'Enter numbers' },
  { key: '+  -  *  /', description: 'Basic arithmetic operators' },
  { key: 'Enter or =', description: 'Calculate result (Equals)' },
  { key: 'Escape or C', description: 'All Clear (AC)' },
  { key: 'Backspace', description: 'Delete last character' },
  { key: '%', description: 'Percentage' },
  { key: '.', description: 'Decimal point' },
  { key: '(  )', description: 'Parentheses (in Scientific mode)' },
  { key: '^', description: 'Power exponent' },
  { key: 's, c, t', description: 'sin, cos, tan functions' },
  { key: 'l', description: 'Natural log (ln)' },
  { key: 'p', description: 'Pi (π) constant' },
  { key: 'e', description: 'Euler (e) constant' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="shortcuts-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 rounded-3xl"
          onClick={onClose}
        >
          <motion.div
            id="shortcuts-modal-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  Keyboard Shortcuts
                </h3>
              </div>
              <button
                id="btn-close-shortcuts"
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
              {SHORTCUTS.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800"
                >
                  <span className="text-neutral-600 dark:text-neutral-300">
                    {s.description}
                  </span>
                  <kbd className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 shadow-2xs">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
