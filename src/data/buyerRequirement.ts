import { dollars } from '@/domain/money'
import type { BuyerRequirement } from '@/domain/types'
import { BASE_PRODUCT } from './product'

/** Illustrative demo data. The visitor plays this buyer. */
export const BUYER_REQUIREMENT: BuyerRequirement = {
  id: 'req-buyer-a',
  buyerLabel: 'Buyer A',
  product: BASE_PRODUCT,
  quantity: 20_000,
  destinationZip: '11373',
  currentDelivered: dollars(0.43),
  maxDelivered: dollars(0.4),
  minFillPct: 100,
  allowEquivalents: true,
  deliveryWindow: { start: '2026-10-26', end: '2026-10-28' },
}
