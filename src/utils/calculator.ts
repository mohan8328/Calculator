import { AngleMode } from '../types';

/**
 * Clean floating point arithmetic noise like 0.1 + 0.2 = 0.30000000000000004
 */
export function cleanFloat(num: number): number {
  if (!isFinite(num) || isNaN(num)) return num;
  return parseFloat(num.toPrecision(12));
}

/**
 * Format a number or expression string nicely for display
 */
export function formatDisplayNumber(value: string | number): string {
  if (value === '' || value === undefined || value === null) return '0';
  if (typeof value === 'number') {
    if (isNaN(value)) return 'Error';
    if (!isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';
    value = cleanFloat(value).toString();
  }

  // If it's already an error message or non-numeric
  if (value === 'Error' || value === 'Infinity' || value === '-Infinity') {
    return value;
  }

  // Handle scientific notation e.g., 1e+20
  if (value.includes('e') || value.includes('E')) {
    return value;
  }

  // Split into integer and decimal parts
  const parts = value.split('.');
  const intPart = parts[0];
  const decPart = parts.length > 1 ? '.' + parts[1] : '';

  // Format integer part with commas
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formattedInt + decPart;
}

/**
 * Factorial function
 */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // JS max float limit
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Tokenize and evaluate mathematical expressions safely
 */
export function evaluateExpression(expr: string, angleMode: AngleMode = 'deg'): { result: number; error: string | null } {
  try {
    if (!expr.trim()) {
      return { result: 0, error: null };
    }

    // Replace display symbols with JavaScript math equivalents
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `${Math.PI}`)
      .replace(/e(?![a-zA-Z0-9_])/g, `${Math.E}`);

    // Preprocessing for trigonometry considering angleMode
    // Replace sin, cos, tan functions with angle conversions
    const toRad = angleMode === 'deg' ? `*(Math.PI/180)` : '';

    // Handle factorials (e.g. 5! -> factorial(5))
    sanitized = sanitized.replace(/(\d+(\.\d+)?)!/g, 'factorial($1)');

    // Functions replacements
    sanitized = sanitized
      .replace(/sin\(([^)]+)\)/g, `Math.sin(($1)${toRad})`)
      .replace(/cos\(([^)]+)\)/g, `Math.cos(($1)${toRad})`)
      .replace(/tan\(([^)]+)\)/g, `Math.tan(($1)${toRad})`)
      .replace(/asin\(([^)]+)\)/g, angleMode === 'deg' ? `(Math.asin($1)*(180/Math.PI))` : `Math.asin($1)`)
      .replace(/acos\(([^)]+)\)/g, angleMode === 'deg' ? `(Math.acos($1)*(180/Math.PI))` : `Math.acos($1)`)
      .replace(/atan\(([^)]+)\)/g, angleMode === 'deg' ? `(Math.atan($1)*(180/Math.PI))` : `Math.atan($1)`)
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/cbrt\(([^)]+)\)/g, 'Math.cbrt($1)')
      .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
      .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
      .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)')
      .replace(/\^/g, '**');

    // Percentage replacement: e.g. 50% -> (50/100)
    sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // Safe mathematical evaluation scope
    const evaluateFn = new Function('Math', 'factorial', `return (${sanitized});`);
    const evalResult = evaluateFn(Math, factorial);

    if (typeof evalResult !== 'number' || isNaN(evalResult)) {
      return { result: NaN, error: 'Invalid calculation' };
    }

    if (!isFinite(evalResult)) {
      return { result: evalResult, error: evalResult > 0 ? 'Infinity' : '-Infinity' };
    }

    return { result: cleanFloat(evalResult), error: null };
  } catch (err: unknown) {
    return { result: NaN, error: err instanceof Error ? err.message : 'Syntax error' };
  }
}
