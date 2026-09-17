import { describe, expect, it } from 'vitest'
import { evaluate, toBuyerVisible, toSupplierVisible } from '../matching'
import { supplierResults } from '../supplier'
import { BUYER_REQUIREMENT } from '@/data/buyerRequirement'
import { STANDING_DEMAND } from '@/data/standingDemand'
import { DEMO_TODAY, PRODUCTION_WINDOW } from '@/data/productionWindow'

describe('privacy', () => {
  it('removes the supplier private terms from anything a buyer sees', () => {
    const visible = toBuyerVisible(PRODUCTION_WINDOW) as Record<string, unknown>
    expect(visible.private).toBeUndefined()
    expect(JSON.stringify(visible)).not.toContain('anchorCustomer')
  })

  it('keeps the price floor and tiers out of the opportunity given to the buyer', () => {
    const outcome = evaluate(BUYER_REQUIREMENT, PRODUCTION_WINDOW, DEMO_TODAY)
    expect(outcome.kind).toBe('opportunity')
    if (outcome.kind !== 'opportunity') return
    const serialised = JSON.stringify(outcome.opportunity)
    expect(serialised).not.toContain('floor')
    expect(serialised).not.toContain('tiers')
  })

  it('removes the buyer price position from anything a supplier sees', () => {
    const visible = toSupplierVisible(BUYER_REQUIREMENT) as Record<string, unknown>
    expect(visible.maxDelivered).toBeUndefined()
    expect(visible.currentDelivered).toBeUndefined()
    expect(visible.quantity).toBe(20_000)
  })

  it('never puts a buyer price position into the supplier results', () => {
    const results = supplierResults(PRODUCTION_WINDOW, STANDING_DEMAND)
    const serialised = JSON.stringify(results)
    expect(serialised).not.toContain('maxDelivered')
    expect(serialised).not.toContain('currentDelivered')
    expect(serialised).toContain('Buyer A')
  })
})
