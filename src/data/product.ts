import type { ProductSpec } from '@/domain/types'

/** Illustrative demo data. Fictional specifications for a fictional run. */

export const BASE_PRODUCT: ProductSpec = {
  id: 'rsc-12-32ect',
  name: '12 x 12 x 12 RSC corrugated box, 32 ECT kraft',
  boardGrade: '32 ECT',
  wall: 'single',
  flute: 'C',
  style: 'RSC',
  dimensionsIn: '12 x 12 x 12',
  print: 'none',
  finishing: 'none',
  certifications: [],
}

/** Same box, one colour printed. Shares board and die, needs its own print pass. */
export const PRINTED_PRODUCT: ProductSpec = {
  ...BASE_PRODUCT,
  id: 'rsc-12-32ect-printed',
  name: '12 x 12 x 12 RSC corrugated box, 32 ECT kraft, 1-color flexo print',
  print: '1-color flexo',
}

/** Looks like the same box. Different board and corrugator setup entirely. */
export const HEAVY_PRODUCT: ProductSpec = {
  ...BASE_PRODUCT,
  id: 'rsc-12-44ect-double',
  name: '12 x 12 x 12 RSC corrugated box, 44 ECT double wall',
  boardGrade: '44 ECT',
  wall: 'double',
  flute: 'BC',
}
