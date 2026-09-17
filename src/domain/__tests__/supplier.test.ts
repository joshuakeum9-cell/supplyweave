import { describe, expect, it } from 'vitest'
import { supplierResults } from '../supplier'
import { formatTotal } from '../money'
import { PRODUCTION_WINDOW } from '@/data/productionWindow'
import { STANDING_DEMAND } from '@/data/standingDemand'

describe('supplier results', () => {
  const results = supplierResults(PRODUCTION_WINDOW, STANDING_DEMAND)

  it('finds all compatible standing demand', () => {
    expect(results.compatibleCount).toBe(3)
    expect(results.compatibleUnits).toBe(42_000)
  })

  it('accepts only what fits the remaining capacity under each fill rule', () => {
    expect(results.remainingBefore).toBe(25_000)
    expect(results.acceptedUnits).toBe(20_000)
    expect(results.acceptedRows).toHaveLength(1)
    expect(results.acceptedRows[0].buyerLabel).toBe('Buyer A')
    expect(results.remainingAfter).toBe(5_000)
  })

  it('values the consolidated supplemental order at the supplier tier', () => {
    expect(formatTotal(results.productValue)).toBe('$6,750.00')
  })

  it('summarises destinations by ZIP prefix only', () => {
    expect(results.destinations).toEqual(['113xx'])
  })
})
