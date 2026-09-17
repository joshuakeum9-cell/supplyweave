import {
  fillSatisfied,
  isCutoffPassed,
  remainingCapacity,
} from './matching'
import { breakdown } from './pricing'
import {
  formatUnitPrice,
  formatUnits,
  percentOf,
  subtractMoney,
  timesUnits,
} from './money'
import type {
  BlockReason,
  BuyerRequirement,
  Commitment,
  CommitPlan,
  DemoDate,
  PlannedStage,
  ProcessingStage,
  ProductionWindow,
} from './types'

/**
 * The whole result of a commit is computed here, in one pass, before any
 * animation starts. The processing steps in the interface only reveal a plan
 * that already exists, so what the visitor sees can never depend on timing.
 */
export function plan(
  requirement: BuyerRequirement,
  window: ProductionWindow,
  today: DemoDate,
  supplierDeclined = false,
): CommitPlan {
  const stages: PlannedStage[] = []
  const costs = breakdown(requirement, window)
  const remaining = remainingCapacity(window)

  const validQuantity = requirement.quantity > 0
  stages.push({
    id: 'validate',
    label: 'Validate the standing requirement',
    pass: validQuantity,
    note: validQuantity
      ? `${formatUnits(requirement.quantity)} units to ZIP ${requirement.destinationZip}, ${requirement.minFillPct}% fill.`
      : 'Quantity is missing.',
  })

  stages.push({
    id: 'compatibility',
    label: 'Confirm supplier approved compatibility',
    pass: true,
    note: 'Same board, flute, die, print and finishing as the scheduled run.',
  })

  stages.push({
    id: 'capacity-load',
    label: 'Load the private production window',
    pass: !supplierDeclined,
    note: supplierDeclined
      ? 'The supplier closed this window.'
      : `${formatUnits(remaining)} units of approved incremental capacity remain.`,
  })

  stages.push({
    id: 'cost',
    label: 'Compute delivered cost',
    pass: true,
    note: `Product ${formatUnitPrice(costs.product)}, freight and handling ${formatUnitPrice(costs.freightHandling)}, disclosed fee ${formatUnitPrice(costs.fee)}.`,
  })

  const floorOk = costs.product >= window.private.floor
  const maxPriceOk = costs.delivered <= requirement.maxDelivered
  stages.push({
    id: 'price-guards',
    label: 'Check supplier economics and your maximum price',
    pass: floorOk && maxPriceOk,
    note: maxPriceOk
      ? `Delivered ${formatUnitPrice(costs.delivered)} is at or below your maximum of ${formatUnitPrice(requirement.maxDelivered)}.`
      : `Delivered ${formatUnitPrice(costs.delivered)} is above your maximum of ${formatUnitPrice(requirement.maxDelivered)}. Nothing is ordered.`,
  })

  const capacityOk =
    fillSatisfied(requirement, remaining) && requirement.quantity >= window.minAdditional
  stages.push({
    id: 'capacity-check',
    label: 'Check capacity against your fill rule',
    pass: capacityOk,
    note: capacityOk
      ? `${formatUnits(requirement.quantity)} units fit inside the ${formatUnits(remaining)} units remaining.`
      : requirement.quantity > remaining
        ? `You require a full fill of ${formatUnits(requirement.quantity)} units and only ${formatUnits(remaining)} remain. A partial fill is not allowed by your rule.`
        : `The run needs at least ${formatUnits(window.minAdditional)} additional units.`,
  })

  const cutoffOk = !isCutoffPassed(today, window.cutoff)
  stages.push({
    id: 'cutoff',
    label: 'Check the production cutoff',
    pass: cutoffOk,
    note: cutoffOk ? 'The window is still open.' : 'This window has closed.',
  })

  stages.push({
    id: 'record',
    label: 'Record the commitment and update matched volume',
    pass: true,
    note: `Matched volume moves to ${formatUnits(window.committed + requirement.quantity)} units.`,
  })

  const failedIndex = stages.findIndex((stage) => !stage.pass)

  if (failedIndex >= 0) {
    return {
      stages,
      blockedAt: failedIndex,
      reason: reasonFor(stages[failedIndex].id, supplierDeclined),
      commitment: null,
      fulfillment: null,
      committedAfter: window.committed,
      remainingAfter: remaining,
    }
  }

  const total = timesUnits(costs.delivered, requirement.quantity)
  const baselineTotal = timesUnits(requirement.currentDelivered, requirement.quantity)
  const savings = subtractMoney(baselineTotal, total)

  const commitment: Commitment = {
    requirementId: requirement.id,
    windowId: window.id,
    quantity: requirement.quantity,
    delivered: costs.delivered,
    total,
    baselineTotal,
    savings,
    savingsPct: percentOf(savings, baselineTotal),
  }

  return {
    stages,
    blockedAt: null,
    reason: null,
    commitment,
    fulfillment: 'scheduled',
    committedAfter: window.committed + requirement.quantity,
    remainingAfter: remaining - requirement.quantity,
  }
}

function reasonFor(stageId: string, supplierDeclined: boolean): BlockReason {
  if (supplierDeclined) return 'supplier_declined'
  switch (stageId) {
    case 'price-guards':
      return 'price_limit'
    case 'capacity-check':
      return 'full_fill'
    case 'cutoff':
      return 'cutoff_expired'
    default:
      return 'full_fill'
  }
}

/**
 * Turn the plan into the stage list the interface shows, revealing `revealed`
 * stages. With `revealed` at the stage count the whole plan is visible, which is
 * the path taken under reduced motion.
 */
export function stagesAt(plan: CommitPlan, revealed: number): ProcessingStage[] {
  return plan.stages.map((stage, index) => {
    if (plan.blockedAt !== null && index > plan.blockedAt) {
      return { id: stage.id, label: stage.label, status: 'waiting' as const }
    }
    if (index < revealed) {
      const blocked = plan.blockedAt === index
      return {
        id: stage.id,
        label: stage.label,
        status: blocked ? ('blocked' as const) : ('done' as const),
        note: stage.note,
      }
    }
    if (index === revealed) {
      return { id: stage.id, label: stage.label, status: 'running' as const }
    }
    return { id: stage.id, label: stage.label, status: 'waiting' as const }
  })
}

/** How many reveal steps a plan has before it is finished. */
export function revealCount(plan: CommitPlan): number {
  return plan.blockedAt !== null ? plan.blockedAt + 1 : plan.stages.length
}
