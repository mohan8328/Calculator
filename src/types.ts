export type CalculatorMode = 'standard' | 'scientific';
export type AngleMode = 'deg' | 'rad';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type KeyType =
  | 'digit'
  | 'operator'
  | 'function'
  | 'memory'
  | 'action'
  | 'constant';

export interface KeyConfig {
  id: string;
  label: string;
  displayLabel?: string;
  type: KeyType;
  value: string;
  shortcut?: string[];
  ariaLabel?: string;
  scientificOnly?: boolean;
  highlight?: 'primary' | 'secondary' | 'accent' | 'default';
  gridSpan?: number;
}
