import { describe, expect, it } from 'vitest'
import { breakdown, freightHandlingFor, tierFor } from '../pricing'
import { BUYER_REQUIREMENT } from '@/data/buyerRequirement'
import { PRODUCTION_WINDOW } from '@/data/productionWindow'

describe('pricing', () => {
  it('picks the supplier tier that applies to the quantity', () => {
    expect(tierFor(PRODUCTION_WINDOW, 10_000)).toBe(3450)
    expect(tierFor(PRODUCTION_WINDOW, 20_000)).toBe(3375)
    expect(tierFor(PRODUCTION_WINDOW, 30_000)).toBe(3375)
    expect(tierFor(PRODUCTION_WINDOW, 40_000)).toBe(3300)
  })

  it('uses the freight rate for the destination', () => {
    expect(freightHandlingFor(PRODUCTION_WINDOW, '11373')).toBe(290)
    expect(freightHandlingFor(PRODUCTION_WINDOW, '99999')).toBe(340)
  })

  it('builds the documented delivered breakdown', () => {
    const costs = breakdown(BUYER_REQUIREMENT, PRODUCTION_WINDOW)
    expect(costs.product).toBe(3375)
    expect(costs.freightHandling).toBe(290)
    expect(costs.fee).toBe(75)
    expect(costs.delivered).toBe(3740)
  })

  it('does not let the buyer maximum become the price', () => {
    const generous = { ...BUYER_REQUIREMENT, maxDelivered: 9_000 }
    expect(breakdown(generous, PRODUCTION_WINDOW).delivered).toBe(3740)
  })
})
