import { dollars } from '@/domain/money'
import type { BuyerRequirement } from '@/domain/types'
import { BASE_PRODUCT } from './product'
import { BUYER_REQUIREMENT } from './buyerRequirement'

/**
 * Illustrative demo data. Other standing requirements the network holds for this
 * product family. The supplier view sees these with every price field removed.
 */
export const STANDING_DEMAND: BuyerRequirement[] = [
  BUYER_REQUIREMENT,
  {
    id: 'req-buyer-b',
    buyerLabel: 'Buyer B',
    product: BASE_PRODUCT,
    quantity: 12_000,
    destinationZip: '07030',
    currentDelivered: dollars(0.445),
    maxDelivered: dollars(0.41),
    minFillPct: 100,
    allowEquivalents: true,
    deliveryWindow: { start: '2026-10-26', end: '2026-10-30' },
  },
  {
    id: 'req-buyer-c',
    buyerLabel: 'Buyer C',
    product: BASE_PRODUCT,
    quantity: 10_000,
    destinationZip: '11101',
    currentDelivered: dollars(0.438),
    maxDelivered: dollars(0.405),
    minFillPct: 100,
    allowEquivalents: false,
    deliveryWindow: { start: '2026-10-27', end: '2026-10-31' },
  },
]
