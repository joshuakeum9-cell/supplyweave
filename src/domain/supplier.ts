import { assess } from './compatibility'
import { remainingCapacity, toSupplierVisible } from './matching'
import { tierFor } from './pricing'
import { timesUnits } from './money'
import type {
  BuyerRequirement,
  Money4,
  ProductionWindow,
  Units,
} from './types'

/**
 * What a supplier sees after saving a production window: how much compatible
 * standing demand exists, which of it fits the remaining capacity under each
 * buyer's own fill rule, and what the consolidated supplemental order is worth.
 *
 * Buyers appear as neutral labels. No buyer's maximum price, current price or
 * identity is available here, because the requirements are passed through
 * `toSupplierVisible` first.
 */

export interface SupplierMatchRow {
  buyerLabel: string
  quantity: Units
  destinationZip3: string
  fits: boolean
  note: string
}

export interface SupplierResults {
  compatibleCount: number
  compatibleUnits: Units
  rows: SupplierMatchRow[]
  acceptedUnits: Units
  acceptedRows: SupplierMatchRow[]
  productValue: Money4
  remainingBefore: Units
  remainingAfter: Units
  destinations: string[]
}

export function supplierResults(
  window: ProductionWindow,
  demand: BuyerRequirement[],
): SupplierResults {
  const visible = demand.map(toSupplierVisible)

  const compatible = visible.filter(
    (requirement) => assess(requirement.product, window.compatibility).state === 'full',
  )

  const remainingBefore = remainingCapacity(window)
  let capacityLeft = remainingBefore
  const rows: SupplierMatchRow[] = []
  const acceptedRows: SupplierMatchRow[] = []

  for (const requirement of compatible) {
    const fullFill = requirement.minFillPct >= 100
    const fits = fullFill
      ? requirement.quantity <= capacityLeft
      : Math.min(requirement.quantity, capacityLeft) >= window.minAdditional

    const row: SupplierMatchRow = {
      buyerLabel: requirement.buyerLabel,
      quantity: requirement.quantity,
      destinationZip3: `${requirement.destinationZip.slice(0, 3)}xx`,
      fits,
      note: fits
        ? 'Fits the remaining capacity'
        : `Needs ${requirement.quantity.toLocaleString('en-US')} units, ${capacityLeft.toLocaleString('en-US')} remain`,
    }
    rows.push(row)

    if (fits) {
      acceptedRows.push(row)
      capacityLeft -= requirement.quantity
    }
  }

  const acceptedUnits = acceptedRows.reduce((sum, row) => sum + row.quantity, 0)

  return {
    compatibleCount: compatible.length,
    compatibleUnits: compatible.reduce((sum, requirement) => sum + requirement.quantity, 0),
    rows,
    acceptedUnits,
    acceptedRows,
    productValue: acceptedUnits > 0 ? timesUnits(tierFor(window, acceptedUnits), acceptedUnits) : 0,
    remainingBefore,
    remainingAfter: capacityLeft,
    destinations: acceptedRows.map((row) => row.destinationZip3),
  }
}
