import { addMoney } from './money'
import type {
  BuyerRequirement,
  DeliveredCostBreakdown,
  Money4,
  ProductionWindow,
  Units,
} from './types'

/**
 * Delivered cost, not factory price alone.
 *
 * The supplier privately sets the tiers and the floor. The buyer privately sets
 * a maximum. Neither of those numbers is the price: the price is the supplier's
 * tier for this quantity, plus freight and handling to the destination, plus the
 * disclosed SupplyWeave fee.
 */

/** The supplier's private tier that applies to this quantity. */
export function tierFor(window: ProductionWindow, quantity: Units): Money4 {
  const applicable = window.private.tiers
    .filter((tier) => quantity >= tier.minQty)
    .sort((a, b) => b.minQty - a.minQty)[0]

  // Below the smallest tier the buyer does not reach production economics at
  // all, so the highest tier price applies.
  const fallback = [...window.private.tiers].sort((a, b) => a.minQty - b.minQty)[0]
  return (applicable ?? fallback).product
}

/** Freight and handling per unit for the destination, by the first three digits. */
export function freightHandlingFor(window: ProductionWindow, destinationZip: string): Money4 {
  const zip3 = destinationZip.slice(0, 3)
  return window.freightHandlingByZip3[zip3] ?? window.freightHandlingByZip3.default
}

export function breakdown(
  requirement: BuyerRequirement,
  window: ProductionWindow,
): DeliveredCostBreakdown {
  const product = tierFor(window, requirement.quantity)
  const freightHandling = freightHandlingFor(window, requirement.destinationZip)
  const fee = window.fee

  return {
    product,
    freightHandling,
    fee,
    delivered: addMoney(product, freightHandling, fee),
  }
}
