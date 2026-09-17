import { assess } from './compatibility'
import { breakdown } from './pricing'
import type {
  BuyerRequirement,
  BuyerVisibleWindow,
  CommitmentTerm,
  DemoDate,
  MatchGuards,
  MatchedOpportunity,
  ProductionWindow,
  SearchOutcome,
  SupplierVisibleRequirement,
  Units,
} from './types'

/**
 * Strip the supplier's private terms before anything reaches the buyer side.
 * The return type has no `private` key, so a component cannot render supplier
 * tiers, the price floor or the anchor customer even by accident.
 */
export function toBuyerVisible(window: ProductionWindow): BuyerVisibleWindow {
  const { private: _private, ...visible } = window
  return visible
}

/**
 * Strip the buyer's price position before anything reaches the supplier side.
 * A supplier never learns what a buyer is willing to pay or what it pays today.
 */
export function toSupplierVisible(
  requirement: BuyerRequirement,
): SupplierVisibleRequirement {
  const { maxDelivered: _max, currentDelivered: _current, ...visible } = requirement
  return visible
}

export function remainingCapacity(window: ProductionWindow): Units {
  return Math.max(0, window.approvedIncremental - window.committed)
}

/** Fixture dates are ISO strings, so a string comparison is a date comparison. */
export function isCutoffPassed(today: DemoDate, cutoff: DemoDate): boolean {
  return today > cutoff
}

export function fillSatisfied(requirement: BuyerRequirement, remaining: Units): boolean {
  if (requirement.minFillPct >= 100) return requirement.quantity <= remaining
  const minUnits = Math.ceil((requirement.quantity * requirement.minFillPct) / 100)
  return Math.min(requirement.quantity, remaining) >= minUnits
}

function buildTerms(
  requirement: BuyerRequirement,
  window: ProductionWindow,
): CommitmentTerm[] {
  return [
    {
      id: 'timing',
      label: 'Timing',
      value: `Commit before the ${formatDate(window.cutoff)} production cutoff. Production runs ${formatDate(window.productionWindow.start)} to ${formatDate(window.productionWindow.end)}.`,
      assumption: false,
    },
    {
      id: 'quantity',
      label: 'Quantity',
      value:
        requirement.minFillPct >= 100
          ? `All ${requirement.quantity.toLocaleString('en-US')} units or none. No partial fill.`
          : `At least ${Math.ceil((requirement.quantity * requirement.minFillPct) / 100).toLocaleString('en-US')} units must fill.`,
      assumption: false,
    },
    {
      id: 'cancellation',
      label: 'Cancellation',
      value:
        'Free to cancel until the cutoff. After the cutoff the run is scheduled and the order stands.',
      assumption: true,
    },
    {
      id: 'quality',
      label: 'Quality',
      value: `Made to the same specification and quality checks as the rest of the run: ${window.qualityRequirements.join(', ')}.`,
      assumption: true,
    },
    {
      id: 'fallback',
      label: 'Your current supplier',
      value:
        'Unaffected. SupplyWeave is an additional channel for this order, not a replacement relationship.',
      assumption: false,
    },
  ]
}

function formatDate(iso: DemoDate): string {
  const [, month, day] = iso.split('-')
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${months[Number(month) - 1]} ${Number(day)}`
}

/**
 * Search the window for this requirement. This runs when the buyer saves a
 * standing requirement, before any commitment.
 */
export function evaluate(
  requirement: BuyerRequirement,
  window: ProductionWindow,
  today: DemoDate,
): SearchOutcome {
  const assessment = assess(requirement.product, window.compatibility)

  if (assessment.state === 'false') {
    return { kind: 'no_match', assessment }
  }

  if (isCutoffPassed(today, window.cutoff)) {
    return { kind: 'cutoff_expired', cutoff: window.cutoff }
  }

  const costs = breakdown(requirement, window)
  const remaining = remainingCapacity(window)

  const guards: MatchGuards = {
    supplierEconomics: costs.product >= window.private.floor,
    maxPrice: costs.delivered <= requirement.maxDelivered,
    capacity: fillSatisfied(requirement, remaining) && requirement.quantity >= window.minAdditional,
    cutoff: true,
  }

  const opportunity: MatchedOpportunity = {
    window: toBuyerVisible(window),
    assessment,
    breakdown: costs,
    remainingBefore: remaining,
    guards,
    terms: buildTerms(requirement, window),
  }

  if (assessment.state === 'partial') {
    return { kind: 'awaiting_supplier', opportunity }
  }

  return { kind: 'opportunity', opportunity }
}
