import { describe, expect, it } from 'vitest'
import {
  addMoney,
  dollars,
  formatTotal,
  formatUnitPrice,
  formatUnits,
  percentOf,
  subtractMoney,
  timesUnits,
} from '../money'

describe('money', () => {
  it('holds four decimal places exactly', () => {
    expect(dollars(0.3375)).toBe(3375)
    expect(dollars(0.0075)).toBe(75)
    expect(dollars(0.029)).toBe(290)
  })

  it('adds the delivered components without float drift', () => {
    // 0.3375 + 0.029 + 0.0075 is 0.374 exactly, which floats do not guarantee.
    expect(addMoney(3375, 290, 75)).toBe(3740)
    expect(0.3375 + 0.029 + 0.0075).not.toBe(0.374)
  })

  it('multiplies a unit price by a quantity', () => {
    expect(timesUnits(3740, 20_000)).toBe(74_800_000)
    expect(formatTotal(timesUnits(3740, 20_000))).toBe('$7,480.00')
  })

  it('computes a percentage to one decimal place', () => {
    expect(percentOf(subtractMoney(86_000_000, 74_800_000), 86_000_000)).toBe(13)
  })

  it('formats prices, totals and units', () => {
    expect(formatUnitPrice(3740)).toBe('$0.3740')
    expect(formatTotal(86_000_000)).toBe('$8,600.00')
    expect(formatUnits(20_000)).toBe('20,000')
  })
})
