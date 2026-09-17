import { describe, expect, it } from 'vitest'
import { assess } from '../compatibility'
import { BASE_PRODUCT, HEAVY_PRODUCT, PRINTED_PRODUCT } from '@/data/product'
import { PRODUCTION_WINDOW } from '@/data/productionWindow'

const requirements = PRODUCTION_WINDOW.compatibility

describe('compatibility', () => {
  it('reports full compatibility when every relevant attribute matches', () => {
    const result = assess(BASE_PRODUCT, requirements)
    expect(result.state).toBe('full')
    expect(result.separateSteps).toHaveLength(0)
    expect(result.sharedSteps).toContain('Board and corrugation')
  })

  it('reports partial compatibility when printing differs', () => {
    const result = assess(PRINTED_PRODUCT, requirements)
    expect(result.state).toBe('partial')
    expect(result.sharedSteps).toContain('Board and corrugation')
    expect(result.separateSteps).toContain('Printing')
  })

  it('reports false compatibility when the board and wall differ', () => {
    const result = assess(HEAVY_PRODUCT, requirements)
    expect(result.state).toBe('false')
    expect(result.sharedSteps).toHaveLength(0)
    expect(result.reasons.join(' ')).toContain('Board grade differs')
  })

  it('always marks compatibility as supplier approved demo data', () => {
    expect(assess(BASE_PRODUCT, requirements).source).toBe('supplier_approved_demo_data')
    expect(assess(HEAVY_PRODUCT, requirements).source).toBe('supplier_approved_demo_data')
  })
})
