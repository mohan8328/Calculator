import React from 'react';
import { HistoryItem } from '../types';
import { formatDisplayNumber } from '../utils/calculator';
import { Trash2, X, Clock, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryTapeProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryTape: React.FC<HistoryTapeProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="history-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 bg-black/40 backdrop-blur-xs flex justify-end rounded-3xl overflow-hidden"
          onClick={onClose}
        >
          <motion.div
            id="history-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="w-full sm:w-80 h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* History Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-500" />
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                  Calculation History
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {history.length > 0 && (
                  <button
                    id="btn-clear-history"
                    type="button"
                    onClick={onClearHistory}
                    title="Clear history"
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  id="btn-close-history"
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Close history"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* History List */}
            <div id="history-items-list" className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400 py-12">
                  <Clock className="w-8 h-8 stroke-1 mb-2 opacity-40" />
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    No calculations yet
                  </p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-[200px]">
                    Your completed calculations will appear here.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    id={`history-item-${item.id}`}
                    onClick={() => onSelectHistory(item)}
                    className="group relative p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600 cursor-pointer transition-all hover:shadow-xs text-right"
                  >
                    <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 truncate">
                      {item.expression}
                    </div>
                    <div className="text-lg font-mono font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                      = {formatDisplayNumber(item.result)}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-neutral-100 dark:border-neutral-750 text-[10px] text-neutral-400">
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 text-neutral-700 dark:text-neutral-300 font-medium transition-opacity">
                        Recall <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
