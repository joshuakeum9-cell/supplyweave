import type { Money4, Units } from './types'

/**
 * All money is held as an integer count of ten-thousandths of a dollar, so the
 * documented results ($0.3740 per unit, $7,480.00, $1,120.00) come out exactly
 * every time. Floating point only appears when a value is formatted for display.
 */

export const MONEY_SCALE = 10_000

/** Build a Money4 from a decimal dollar amount, for fixtures and tests. */
export function dollars(amount: number): Money4 {
  return Math.round(amount * MONEY_SCALE)
}

export function addMoney(...parts: Money4[]): Money4 {
  return parts.reduce((sum, part) => sum + part, 0)
}

/** Multiply a per-unit price by a quantity. The result stays in Money4. */
export function timesUnits(price: Money4, quantity: Units): Money4 {
  return price * quantity
}

export function subtractMoney(a: Money4, b: Money4): Money4 {
  return a - b
}

/** Percentage of `part` against `whole`, rounded to one decimal place. */
export function percentOf(part: Money4, whole: Money4): number {
  if (whole === 0) return 0
  return Math.round((part / whole) * 1000) / 10
}

/** A per-unit price, for example "$0.3740". Always four decimal places. */
export function formatUnitPrice(value: Money4): string {
  return `$${(value / MONEY_SCALE).toFixed(4)}`
}

/** A total, for example "$7,480.00". Always two decimal places. */
export function formatTotal(value: Money4): string {
  return `$${(value / MONEY_SCALE).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/** A whole number of units, for example "20,000". */
export function formatUnits(value: Units): string {
  return value.toLocaleString('en-US')
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)} percent`
}
