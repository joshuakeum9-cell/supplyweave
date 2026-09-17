import { describe, expect, it } from 'vitest'
import { plan, revealCount, stagesAt } from '../engine'
import { evaluate } from '../matching'
import { formatTotal, formatUnitPrice, dollars } from '../money'
import { BUYER_REQUIREMENT } from '@/data/buyerRequirement'
import {
  DEMO_TODAY,
  DEMO_TODAY_AFTER_CUTOFF,
  PRODUCTION_WINDOW,
} from '@/data/productionWindow'
import { HEAVY_PRODUCT, PRINTED_PRODUCT } from '@/data/product'

describe('engine, documented scenario', () => {
  const result = plan(BUYER_REQUIREMENT, PRODUCTION_WINDOW, DEMO_TODAY)

  it('executes with no blocked stage', () => {
    expect(result.blockedAt).toBeNull()
    expect(result.reason).toBeNull()
    expect(result.commitment).not.toBeNull()
  })

  it('produces the documented delivered price and totals', () => {
    const commitment = result.commitment
    expect(commitment).not.toBeNull()
    if (!commitment) return
    expect(commitment.delivered).toBe(3740)
    expect(formatUnitPrice(commitment.delivered)).toBe('$0.3740')
    expect(formatTotal(commitment.total)).toBe('$7,480.00')
    expect(formatTotal(commitment.baselineTotal)).toBe('$8,600.00')
    expect(formatTotal(commitment.savings)).toBe('$1,120.00')
    expect(commitment.savingsPct).toBe(13)
  })

  it('moves matched volume from 35,000 to 55,000 and leaves 5,000', () => {
    expect(PRODUCTION_WINDOW.committed).toBe(35_000)
    expect(result.committedAfter).toBe(55_000)
    expect(result.remainingAfter).toBe(5_000)
  })

  it('schedules the order for production', () => {
    expect(result.fulfillment).toBe('scheduled')
  })

  it('reveals every stage as done', () => {
    const stages = stagesAt(result, revealCount(result))
    expect(stages).toHaveLength(8)
    expect(stages.every((stage) => stage.status === 'done')).toBe(true)
  })
})

describe('engine, blocked outcomes', () => {
  it('blocks when the delivered price is above the buyer maximum', () => {
    const strict = { ...BUYER_REQUIREMENT, maxDelivered: dollars(0.36) }
    const result = plan(strict, PRODUCTION_WINDOW, DEMO_TODAY)
    expect(result.reason).toBe('price_limit')
    expect(result.commitment).toBeNull()
    expect(result.blockedAt).not.toBeNull()
    expect(result.stages[result.blockedAt ?? 0].id).toBe('price-guards')
    expect(result.committedAfter).toBe(35_000)
  })

  it('blocks when a full fill does not fit the remaining capacity', () => {
    const large = { ...BUYER_REQUIREMENT, quantity: 30_000 }
    const result = plan(large, PRODUCTION_WINDOW, DEMO_TODAY)
    expect(result.reason).toBe('full_fill')
    const blocked = result.stages[result.blockedAt ?? 0]
    expect(blocked.id).toBe('capacity-check')
    expect(blocked.note).toContain('25,000')
  })

  it('blocks when the production cutoff has passed', () => {
    const result = plan(BUYER_REQUIREMENT, PRODUCTION_WINDOW, DEMO_TODAY_AFTER_CUTOFF)
    expect(result.reason).toBe('cutoff_expired')
  })

  it('blocks when the supplier has declined the opportunity', () => {
    const result = plan(BUYER_REQUIREMENT, PRODUCTION_WINDOW, DEMO_TODAY, true)
    expect(result.reason).toBe('supplier_declined')
    expect(result.commitment).toBeNull()
  })

  it('never reveals a stage after the blocked one as done', () => {
    const strict = { ...BUYER_REQUIREMENT, maxDelivered: dollars(0.36) }
    const result = plan(strict, PRODUCTION_WINDOW, DEMO_TODAY)
    const stages = stagesAt(result, revealCount(result))
    const blockedAt = result.blockedAt ?? 0
    expect(stages.filter((stage) => stage.status === 'blocked')).toHaveLength(1)
    expect(stages.slice(blockedAt + 1).every((s) => s.status === 'waiting')).toBe(true)
  })
})

describe('matching, search outcomes', () => {
  it('returns an opportunity for a fully compatible requirement', () => {
    const outcome = evaluate(BUYER_REQUIREMENT, PRODUCTION_WINDOW, DEMO_TODAY)
    expect(outcome.kind).toBe('opportunity')
  })

  it('awaits supplier confirmation for partial compatibility', () => {
    const printed = { ...BUYER_REQUIREMENT, product: PRINTED_PRODUCT }
    expect(evaluate(printed, PRODUCTION_WINDOW, DEMO_TODAY).kind).toBe('awaiting_supplier')
  })

  it('returns no match for an incompatible requirement', () => {
    const heavy = { ...BUYER_REQUIREMENT, product: HEAVY_PRODUCT }
    expect(evaluate(heavy, PRODUCTION_WINDOW, DEMO_TODAY).kind).toBe('no_match')
  })

  it('returns an expired cutoff before pricing anything', () => {
    const outcome = evaluate(BUYER_REQUIREMENT, PRODUCTION_WINDOW, DEMO_TODAY_AFTER_CUTOFF)
    expect(outcome.kind).toBe('cutoff_expired')
  })
})
