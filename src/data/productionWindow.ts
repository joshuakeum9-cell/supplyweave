import { dollars } from '@/domain/money'
import type { DemoDate, ProductionWindow } from '@/domain/types'

/**
 * Illustrative demo data. A fictional New Jersey facility with a scheduled run
 * that has approved incremental capacity. The anchor customer, the private price
 * tiers and the price floor never leave this module for the buyer side.
 */

/** The demo clock. The real clock is never read, so the demo never expires. */
export const DEMO_TODAY: DemoDate = '2026-10-13'

/** Used by the expired cutoff scenario. */
export const DEMO_TODAY_AFTER_CUTOFF: DemoDate = '2026-10-17'

export const PRODUCTION_WINDOW: ProductionWindow = {
  id: 'pw-nj1-oct19',
  facilityLabel: 'Facility NJ-1, northern New Jersey',
  productFamily: 'Corrugated RSC, 32 ECT kraft, C flute, unprinted',
  compatibility: {
    boardGrade: '32 ECT',
    wall: 'single',
    flute: 'C',
    style: 'RSC',
    dimensionsIn: '12 x 12 x 12',
    print: 'none',
    finishing: 'none',
    certifications: [],
  },
  approvedIncremental: 60_000,
  committed: 35_000,
  minAdditional: 5_000,
  cutoff: '2026-10-16',
  productionWindow: { start: '2026-10-19', end: '2026-10-21' },
  deliveryWindow: { start: '2026-10-26', end: '2026-10-28' },
  private: {
    tiers: [
      { minQty: 5_000, product: dollars(0.345) },
      { minQty: 20_000, product: dollars(0.3375) },
      { minQty: 40_000, product: dollars(0.33) },
    ],
    floor: dollars(0.33),
    anchorCustomer: 'hidden',
  },
  serviceRegions: ['New Jersey', 'New York City', 'Long Island', 'Eastern Pennsylvania'],
  deliveryTerms: 'Delivered. The facility arranges outbound freight.',
  qualityRequirements: [
    '32 ECT board certificate',
    'Standard RSC dimensional tolerance',
    'Visual inspection on the line',
  ],
  freightHandlingByZip3: {
    '113': dollars(0.029),
    '100': dollars(0.031),
    '070': dollars(0.024),
    default: dollars(0.034),
  },
  fee: dollars(0.0075),
}
