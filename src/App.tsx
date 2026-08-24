/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AngleMode, CalculatorMode, HistoryItem, KeyConfig } from './types';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { MemoryBar } from './components/MemoryBar';
import { Keypad } from './components/Keypad';
import { HistoryTape } from './components/HistoryTape';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { evaluateExpression, cleanFloat, factorial } from './utils/calculator';
import { playKeySound } from './utils/audio';
import { motion } from 'motion/react';

export default function App() {
  // Calculator state
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [activeOperator, setActiveOperator] = useState<string | null>(null);

  // Memory state
  const [memory, setMemory] = useState<number | null>(() => {
    const saved = localStorage.getItem('calc_memory');
    return saved !== null ? Number(saved) : null;
  });

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('calc_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('calc_sound') !== 'false';
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Sync theme with DOM document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('calc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('calc_theme', 'light');
    }
  }, [isDark]);

  // Persist history and memory
  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (memory !== null) {
      localStorage.setItem('calc_memory', memory.toString());
    } else {
      localStorage.removeItem('calc_memory');
    }
  }, [memory]);

  useEffect(() => {
    localStorage.setItem('calc_sound', soundEnabled.toString());
  }, [soundEnabled]);

  const triggerSound = useCallback(
    (type: 'digit' | 'operator' | 'action' | 'equals' | 'clear') => {
      if (soundEnabled) {
        playKeySound(type);
      }
    },
    [soundEnabled]
  );

  // Clear All
  const handleClear = useCallback(() => {
    triggerSound('clear');
    setDisplayValue('0');
    setExpression('');
    setActiveOperator(null);
    setIsEvaluated(false);
  }, [triggerSound]);

  // Backspace
  const handleBackspace = useCallback(() => {
    triggerSound('action');
    if (isEvaluated) {
      setDisplayValue('0');
      setExpression('');
      setIsEvaluated(false);
      return;
    }

    if (displayValue.length > 1) {
      setDisplayValue((prev) => prev.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  }, [isEvaluated, displayValue.length, triggerSound]);

  // Input Digit
  const handleDigit = useCallback(
    (digit: string) => {
      triggerSound('digit');
      if (isEvaluated) {
        setDisplayValue(digit);
        setExpression('');
        setIsEvaluated(false);
        setActiveOperator(null);
        return;
      }

      if (displayValue === '0' && digit !== '.') {
        setDisplayValue(digit);
      } else if (digit === '.') {
        if (!displayValue.includes('.')) {
          setDisplayValue((prev) => prev + '.');
        }
      } else {
        if (displayValue.length < 18) {
          setDisplayValue((prev) => prev + digit);
        }
      }
      setActiveOperator(null);
    },
    [isEvaluated, displayValue, triggerSound]
  );

  // Input Operator (+, -, ×, ÷, ^)
  const handleOperator = useCallback(
    (op: string) => {
      triggerSound('operator');
      setActiveOperator(op);

      if (isEvaluated) {
        setExpression(`${displayValue} ${op} `);
        setIsEvaluated(false);
        setDisplayValue('0');
        return;
      }

      if (displayValue !== '0' || expression === '') {
        const newExpr = expression ? `${expression}${displayValue} ${op} ` : `${displayValue} ${op} `;
        setExpression(newExpr);
        setDisplayValue('0');
      } else if (expression) {
        // Change the last operator if user pressed another operator
        const trimmed = expression.trimEnd();
        const replaced = trimmed.slice(0, -1) + op + ' ';
        setExpression(replaced);
      }
    },
    [displayValue, expression, isEvaluated, triggerSound]
  );

  // Equals
  const handleEquals = useCallback(() => {
    triggerSound('equals');
    const fullExpr = expression ? `${expression}${displayValue}` : displayValue;

    if (!fullExpr || fullExpr === '0') return;

    const { result, error } = evaluateExpression(fullExpr, angleMode);

    if (error || isNaN(result)) {
      setDisplayValue('Error');
      setIsEvaluated(true);
      return;
    }

    const resultStr = cleanFloat(result).toString();
    setDisplayValue(resultStr);
    setExpression(`${fullExpr} =`);
    setIsEvaluated(true);
    setActiveOperator(null);

    // Save to history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: fullExpr,
      result: resultStr,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // Keep last 50
  }, [expression, displayValue, angleMode, triggerSound]);

  // Negate (+/-)
  const handleNegate = useCallback(() => {
    triggerSound('action');
    if (displayValue === '0' || displayValue === 'Error') return;
    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.substring(1));
    } else {
      setDisplayValue('-' + displayValue);
    }
  }, [displayValue, triggerSound]);

  // Percentage
  const handlePercent = useCallback(() => {
    triggerSound('operator');
    const val = parseFloat(displayValue);
    if (isNaN(val)) return;

    if (expression) {
      // e.g., 200 + 10% -> 200 * (10 / 100) = 20
      const exprMatch = expression.trim().match(/(\d+(\.\d+)?)\s*([+\-×÷])\s*$/);
      if (exprMatch) {
        const base = parseFloat(exprMatch[1]);
        const calculatedPercent = (base * val) / 100;
        setDisplayValue(calculatedPercent.toString());
        return;
      }
    }

    const result = cleanFloat(val / 100);
    setDisplayValue(result.toString());
  }, [displayValue, expression, triggerSound]);

  // Scientific & Function Keys
  const handleFunction = useCallback(
    (func: string) => {
      triggerSound('operator');

      if (func === 'TOGGLE_ANGLE') {
        setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'));
        return;
      }

      if (func === 'INV') {
        // 1/x
        const val = parseFloat(displayValue);
        if (isNaN(val) || val === 0) {
          setDisplayValue('Error');
        } else {
          setDisplayValue(cleanFloat(1 / val).toString());
          setExpression(`1/(${displayValue})`);
          setIsEvaluated(true);
        }
        return;
      }

      if (func === '^2') {
        // x²
        const val = parseFloat(displayValue);
        if (isNaN(val)) return;
        setDisplayValue(cleanFloat(val * val).toString());
        setExpression(`sqr(${displayValue})`);
        setIsEvaluated(true);
        return;
      }

      if (func === '!') {
        // Factorial
        const val = parseInt(displayValue, 10);
        if (isNaN(val) || val < 0) {
          setDisplayValue('Error');
        } else {
          const res = factorial(val);
          setDisplayValue(isNaN(res) ? 'Error' : res.toString());
          setExpression(`fact(${val})`);
          setIsEvaluated(true);
        }
        return;
      }

      if (func === '(' || func === ')') {
        if (isEvaluated) {
          setExpression(func);
          setDisplayValue('0');
          setIsEvaluated(false);
        } else {
          setExpression((prev) => prev + func);
        }
        return;
      }

      // Functions like sin(, cos(, tan(, sqrt(, ln(, log(
      if (['sin(', 'cos(', 'tan(', 'sqrt(', 'ln(', 'log('].includes(func)) {
        if (displayValue !== '0') {
          // Wrap current display value: sin(displayValue)
          const wrapped = `${func}${displayValue})`;
          const { result, error } = evaluateExpression(wrapped, angleMode);
          if (!error && !isNaN(result)) {
            setDisplayValue(cleanFloat(result).toString());
            setExpression(wrapped);
            setIsEvaluated(true);
          } else {
            setDisplayValue('Error');
          }
        } else {
          setExpression((prev) => prev + func);
        }
        return;
      }
    },
    [displayValue, isEvaluated, angleMode, triggerSound]
  );

  // Constants (π, e)
  const handleConstant = useCallback(
    (constant: string) => {
      triggerSound('digit');
      let val = '';
      if (constant === 'π') val = Math.PI.toString();
      if (constant === 'e') val = Math.E.toString();

      setDisplayValue(val);
      if (isEvaluated) {
        setExpression('');
        setIsEvaluated(false);
      }
    },
    [isEvaluated, triggerSound]
  );

  // Memory Actions (MC, MR, M+, M-, MS)
  const handleMemoryAction = useCallback(
    (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
      triggerSound('action');
      const current = parseFloat(displayValue) || 0;

      switch (action) {
        case 'MC':
          setMemory(null);
          break;
        case 'MR':
          if (memory !== null) {
            setDisplayValue(memory.toString());
            if (isEvaluated) {
              setExpression('');
              setIsEvaluated(false);
            }
          }
          break;
        case 'MS':
          setMemory(current);
          break;
        case 'M+':
          setMemory((prev) => (prev !== null ? cleanFloat(prev + current) : current));
          break;
        case 'M-':
          setMemory((prev) => (prev !== null ? cleanFloat(prev - current) : -current));
          break;
      }
    },
    [displayValue, memory, isEvaluated, triggerSound]
  );

  // Key dispatcher
  const handleKeyPress = useCallback(
    (key: KeyConfig) => {
      switch (key.value) {
        case 'CLEAR':
          handleClear();
          break;
        case 'BACKSPACE':
          handleBackspace();
          break;
        case 'EQUALS':
          handleEquals();
          break;
        case 'NEGATE':
          handleNegate();
          break;
        case '%':
          handlePercent();
          break;
        case '+':
        case '−':
        case '×':
        case '÷':
        case '^':
          handleOperator(key.value);
          break;
        default:
          if (key.type === 'digit') {
            handleDigit(key.value);
          } else if (key.type === 'constant') {
            handleConstant(key.value);
          } else if (key.type === 'function') {
            handleFunction(key.value);
          }
          break;
      }
    },
    [
      handleClear,
      handleBackspace,
      handleEquals,
      handleNegate,
      handlePercent,
      handleOperator,
      handleDigit,
      handleConstant,
      handleFunction,
    ]
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if modifier keys or if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDigit('.');
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('−');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      } else if (e.key === '%') {
        handlePercent();
      } else if (e.key === '(' || e.key === ')') {
        handleFunction(e.key);
      } else if (e.key === '^') {
        handleOperator('^');
      } else if (e.key === 'p' || e.key === 'P') {
        handleConstant('π');
      } else if (e.key === 'e' || e.key === 'E') {
        handleConstant('e');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClear,
    handlePercent,
    handleFunction,
    handleConstant,
  ]);

  return (
    <main
      id="calculator-root"
      className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200"
    >
      {/* Calculator Body Card */}
      <motion.section
        id="calculator-card"
        layout
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className={`relative w-full ${
          mode === 'scientific' ? 'max-w-[480px]' : 'max-w-[360px]'
        } bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xl overflow-hidden`}
      >
        {/* Header with Mode & Utilities */}
        <Header
          mode={mode}
          onModeChange={setMode}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          historyCount={history.length}
        />

        {/* Calculator Main Section */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          {/* Display screen */}
          <Display
            expression={expression}
            currentValue={displayValue}
            mode={mode}
            angleMode={angleMode}
            onToggleAngleMode={() =>
              setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'))
            }
            isEvaluated={isEvaluated}
          />

          {/* Memory Bar */}
          <MemoryBar memory={memory} onMemoryAction={handleMemoryAction} />

          {/* Keypad */}
          <Keypad
            mode={mode}
            angleMode={angleMode}
            onKeyPress={handleKeyPress}
            activeOperator={activeOperator}
          />
        </div>

        {/* History Tape Drawer */}
        <HistoryTape
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectHistory={(item) => {
            setDisplayValue(item.result);
            setExpression(item.expression + ' =');
            setIsEvaluated(true);
            setIsHistoryOpen(false);
          }}
          onClearHistory={() => setHistory([])}
        />

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
      </motion.section>
    </main>
  );
}
