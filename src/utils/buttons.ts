import { KeyConfig } from '../types';

export const SCIENTIFIC_KEYS: KeyConfig[] = [
  { id: 'btn-rad-deg', label: 'RAD/DEG', type: 'function', value: 'TOGGLE_ANGLE', ariaLabel: 'Toggle radians or degrees' },
  { id: 'btn-sin', label: 'sin', type: 'function', value: 'sin(', ariaLabel: 'Sine function' },
  { id: 'btn-cos', label: 'cos', type: 'function', value: 'cos(', ariaLabel: 'Cosine function' },
  { id: 'btn-tan', label: 'tan', type: 'function', value: 'tan(', ariaLabel: 'Tangent function' },
  { id: 'btn-pi', label: 'π', type: 'constant', value: 'π', ariaLabel: 'Pi constant' },
  
  { id: 'btn-open-paren', label: '(', type: 'function', value: '(', ariaLabel: 'Open parenthesis' },
  { id: 'btn-close-paren', label: ')', type: 'function', value: ')', ariaLabel: 'Close parenthesis' },
  { id: 'btn-sqrt', label: '√x', displayLabel: '√', type: 'function', value: 'sqrt(', ariaLabel: 'Square root' },
  { id: 'btn-sqr', label: 'x²', displayLabel: 'x²', type: 'function', value: '^2', ariaLabel: 'Square' },
  { id: 'btn-power', label: 'xʸ', displayLabel: '^', type: 'operator', value: '^', ariaLabel: 'Power exponent' },
  
  { id: 'btn-ln', label: 'ln', type: 'function', value: 'ln(', ariaLabel: 'Natural logarithm' },
  { id: 'btn-log', label: 'log', type: 'function', value: 'log(', ariaLabel: 'Base 10 logarithm' },
  { id: 'btn-inv', label: '1/x', type: 'function', value: 'INV', ariaLabel: 'Reciprocal' },
  { id: 'btn-factorial', label: 'x!', displayLabel: 'n!', type: 'function', value: '!', ariaLabel: 'Factorial' },
  { id: 'btn-e', label: 'e', type: 'constant', value: 'e', ariaLabel: 'Euler number constant' },
];

export const STANDARD_KEYS: KeyConfig[][] = [
  [
    { id: 'btn-clear', label: 'AC', type: 'action', value: 'CLEAR', highlight: 'accent', ariaLabel: 'All Clear' },
    { id: 'btn-backspace', label: '⌫', type: 'action', value: 'BACKSPACE', highlight: 'secondary', ariaLabel: 'Backspace / Delete' },
    { id: 'btn-percent', label: '%', type: 'operator', value: '%', highlight: 'secondary', ariaLabel: 'Percentage' },
    { id: 'btn-divide', label: '÷', type: 'operator', value: '÷', highlight: 'primary', ariaLabel: 'Divide' },
  ],
  [
    { id: 'btn-7', label: '7', type: 'digit', value: '7', ariaLabel: 'Number 7' },
    { id: 'btn-8', label: '8', type: 'digit', value: '8', ariaLabel: 'Number 8' },
    { id: 'btn-9', label: '9', type: 'digit', value: '9', ariaLabel: 'Number 9' },
    { id: 'btn-multiply', label: '×', type: 'operator', value: '×', highlight: 'primary', ariaLabel: 'Multiply' },
  ],
  [
    { id: 'btn-4', label: '4', type: 'digit', value: '4', ariaLabel: 'Number 4' },
    { id: 'btn-5', label: '5', type: 'digit', value: '5', ariaLabel: 'Number 5' },
    { id: 'btn-6', label: '6', type: 'digit', value: '6', ariaLabel: 'Number 6' },
    { id: 'btn-subtract', label: '−', type: 'operator', value: '−', highlight: 'primary', ariaLabel: 'Subtract' },
  ],
  [
    { id: 'btn-1', label: '1', type: 'digit', value: '1', ariaLabel: 'Number 1' },
    { id: 'btn-2', label: '2', type: 'digit', value: '2', ariaLabel: 'Number 2' },
    { id: 'btn-3', label: '3', type: 'digit', value: '3', ariaLabel: 'Number 3' },
    { id: 'btn-add', label: '+', type: 'operator', value: '+', highlight: 'primary', ariaLabel: 'Add' },
  ],
  [
    { id: 'btn-negate', label: '±', type: 'action', value: 'NEGATE', highlight: 'secondary', ariaLabel: 'Toggle Positive/Negative' },
    { id: 'btn-0', label: '0', type: 'digit', value: '0', ariaLabel: 'Number 0' },
    { id: 'btn-decimal', label: '.', type: 'digit', value: '.', ariaLabel: 'Decimal point' },
    { id: 'btn-equals', label: '=', type: 'action', value: 'EQUALS', highlight: 'primary', ariaLabel: 'Calculate Equals' },
  ],
];
