import React from 'react';
import { CalculatorMode } from '../types';
import { History, Moon, Sun, Volume2, VolumeX, Keyboard } from 'lucide-react';

interface HeaderProps {
  mode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleHistory: () => void;
  onOpenShortcuts: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  isDark,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  onToggleHistory,
  onOpenShortcuts,
  historyCount,
}) => {
  return (
    <header id="calculator-header" className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
      {/* Mode Switcher */}
      <div id="mode-switcher-container" className="flex items-center bg-neutral-200/80 dark:bg-neutral-800/80 p-1 rounded-xl text-xs font-semibold">
        <button
          id="btn-mode-standard"
          type="button"
          onClick={() => onModeChange('standard')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            mode === 'standard'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Standard
        </button>
        <button
          id="btn-mode-scientific"
          type="button"
          onClick={() => onModeChange('scientific')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            mode === 'scientific'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          Scientific
        </button>
      </div>

      {/* Tool Actions */}
      <div id="header-actions" className="flex items-center gap-1">
        <button
          id="btn-shortcuts-toggle"
          type="button"
          onClick={onOpenShortcuts}
          title="Keyboard shortcuts"
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <button
          id="btn-sound-toggle"
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
        </button>

        <button
          id="btn-theme-toggle"
          type="button"
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
        </button>

        <button
          id="btn-history-toggle"
          type="button"
          onClick={onToggleHistory}
          title="Calculation History"
          className="relative p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          aria-label="Open History"
        >
          <History className="w-4 h-4" />
          {historyCount > 0 && (
            <span
              id="history-count-badge"
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-100 text-[10px] font-bold text-neutral-100 dark:text-neutral-900"
            >
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
