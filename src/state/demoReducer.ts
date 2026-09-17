import { plan as planCommit, revealCount } from '@/domain/engine'
import { evaluate } from '@/domain/matching'
import { dollars, formatTotal, formatUnitPrice, formatUnits } from '@/domain/money'
import type {
  BlockReason,
  BuyerRequirement,
  CommitPlan,
  Commitment,
  DemoDate,
  ProductionWindow,
  SearchOutcome,
  Units,
} from '@/domain/types'
import { BUYER_REQUIREMENT } from '@/data/buyerRequirement'
import { BASE_PRODUCT, HEAVY_PRODUCT, PRINTED_PRODUCT } from '@/data/product'
import { PRODUCTION_WINDOW } from '@/data/productionWindow'
import {
  DEFAULT_SCENARIO_ID,
  scenarioById,
  type ProductChoice,
  type RequirementFormValues,
} from '@/data/scenarios'

export type BuyerStatus =
  | 'requirement'
  | 'searching'
  | 'no_match'
  | 'opportunity'
  | 'awaiting_supplier'
  | 'committing'
  | 'executed'
  | 'not_executed'
  | 'modified'

export type SupplierDecision = 'none' | 'approved' | 'declined' | 'modified'

export interface WindowFormValues {
  approvedIncremental: string
  minAdditional: string
  cutoff: string
  tierPrice: string
  floor: string
  serviceRegion: string
  deliveryTerms: string
  quality: string
}

export interface DemoState {
  scenarioId: string
  immediateResults: boolean
  form: RequirementFormValues
  errors: Partial<Record<keyof RequirementFormValues, string>>
  status: BuyerStatus
  today: DemoDate
  window: ProductionWindow
  savedRequirement: BuyerRequirement | null
  outcome: SearchOutcome | null
  plan: CommitPlan | null
  revealed: number
  blockReason: BlockReason | null
  commitment: Commitment | null
  matchedVolume: Units
  supplier: {
    form: WindowFormValues
    saved: boolean
    decision: SupplierDecision
  }
  changedTerms: string[]
  announcement: string
}

export type DemoEvent =
  | { type: 'SELECT_SCENARIO'; id: string }
  | { type: 'EDIT_FIELD'; name: keyof RequirementFormValues; value: string | boolean }
  | { type: 'SAVE_REQUIREMENT' }
  | { type: 'SEARCH_DONE' }
  | { type: 'COMMIT' }
  | { type: 'STAGE_ADVANCE' }
  | { type: 'RESET' }
  | { type: 'SET_IMMEDIATE_RESULTS'; value: boolean }
  | { type: 'EDIT_WINDOW_FIELD'; name: keyof WindowFormValues; value: string }
  | { type: 'SAVE_WINDOW' }
  | { type: 'SUPPLIER_APPROVE' }
  | { type: 'SUPPLIER_DECLINE' }
  | { type: 'SUPPLIER_MODIFY' }

const PRODUCTS: Record<ProductChoice, typeof BASE_PRODUCT> = {
  base: BASE_PRODUCT,
  printed: PRINTED_PRODUCT,
  heavy: HEAVY_PRODUCT,
}

function windowFormFrom(window: ProductionWindow): WindowFormValues {
  const tier = window.private.tiers.find((entry) => entry.minQty === 20_000)
  return {
    approvedIncremental: String(window.approvedIncremental),
    minAdditional: String(window.minAdditional),
    cutoff: window.cutoff,
    tierPrice: ((tier?.product ?? 0) / 10_000).toFixed(4),
    floor: (window.private.floor / 10_000).toFixed(4),
    serviceRegion: window.serviceRegions.join(', '),
    deliveryTerms: window.deliveryTerms,
    quality: window.qualityRequirements.join(', '),
  }
}

export function initialState(scenarioId = DEFAULT_SCENARIO_ID): DemoState {
  const scenario = scenarioById(scenarioId)
  return {
    scenarioId: scenario.id,
    immediateResults: false,
    form: scenario.form,
    errors: {},
    status: 'requirement',
    today: scenario.today,
    window: PRODUCTION_WINDOW,
    savedRequirement: null,
    outcome: null,
    plan: null,
    revealed: 0,
    blockReason: null,
    commitment: null,
    matchedVolume: PRODUCTION_WINDOW.committed,
    supplier: {
      form: windowFormFrom(PRODUCTION_WINDOW),
      saved: false,
      decision: 'none',
    },
    changedTerms: [],
    announcement: '',
  }
}

/** Turn the form's strings into a typed requirement. */
export function toRequirement(form: RequirementFormValues): BuyerRequirement {
  return {
    ...BUYER_REQUIREMENT,
    product: PRODUCTS[form.productId],
    quantity: Number.parseInt(form.quantity, 10) || 0,
    destinationZip: form.destinationZip,
    currentDelivered: dollars(Number.parseFloat(form.currentDelivered) || 0),
    maxDelivered: dollars(Number.parseFloat(form.maxDelivered) || 0),
    minFillPct: Number.parseInt(form.minFillPct, 10) || 100,
    allowEquivalents: form.allowEquivalents,
  }
}

export function validate(
  form: RequirementFormValues,
): Partial<Record<keyof RequirementFormValues, string>> {
  const errors: Partial<Record<keyof RequirementFormValues, string>> = {}

  const quantity = Number.parseInt(form.quantity, 10)
  if (!form.quantity.trim()) {
    errors.quantity = 'Enter a quantity. This is the number of units you need.'
  } else if (Number.isNaN(quantity) || quantity <= 0) {
    errors.quantity = 'Quantity must be a whole number above zero.'
  }

  if (!/^\d{5}$/.test(form.destinationZip)) {
    errors.destinationZip = 'Enter a five digit ZIP code, for example 11373.'
  }

  const current = Number.parseFloat(form.currentDelivered)
  if (Number.isNaN(current) || current <= 0) {
    errors.currentDelivered = 'Enter what you pay today, delivered, per unit.'
  }

  const max = Number.parseFloat(form.maxDelivered)
  if (Number.isNaN(max) || max <= 0) {
    errors.maxDelivered = 'Enter the most you will pay, delivered, per unit.'
  }

  const fill = Number.parseInt(form.minFillPct, 10)
  if (Number.isNaN(fill) || fill < 1 || fill > 100) {
    errors.minFillPct = 'Minimum fill is a percentage between 1 and 100.'
  }

  return errors
}

function announceOutcome(outcome: SearchOutcome): string {
  switch (outcome.kind) {
    case 'opportunity':
      return `A compatible production opportunity was found. Delivered price ${formatUnitPrice(outcome.opportunity.breakdown.delivered)} per unit, illustrative.`
    case 'awaiting_supplier':
      return 'A partly compatible production opportunity was found. The supplier has to confirm before pricing is final.'
    case 'no_match':
      return 'No compatible production window was found for this requirement.'
    case 'cutoff_expired':
      return 'This production window has closed. The requirement stays saved for the next compatible run.'
  }
}

function announceResult(plan: CommitPlan): string {
  if (plan.commitment) {
    return `Order executed at ${formatUnitPrice(plan.commitment.delivered)} per unit. Total ${formatTotal(plan.commitment.total)}, saving ${formatTotal(plan.commitment.savings)} against the current price. Matched volume is now ${formatUnits(plan.committedAfter)} units. Illustrative demo data.`
  }
  const blocked = plan.blockedAt !== null ? plan.stages[plan.blockedAt] : null
  return `Nothing was ordered. ${blocked?.note ?? ''}`
}

function resolveSearch(state: DemoState): DemoState {
  const requirement = state.savedRequirement
  if (!requirement) return state

  const outcome = evaluate(requirement, state.window, state.today)
  const status: BuyerStatus =
    outcome.kind === 'opportunity'
      ? 'opportunity'
      : outcome.kind === 'awaiting_supplier'
        ? 'awaiting_supplier'
        : outcome.kind === 'no_match'
          ? 'no_match'
          : 'not_executed'

  return {
    ...state,
    status,
    outcome,
    blockReason: outcome.kind === 'cutoff_expired' ? 'cutoff_expired' : null,
    announcement: announceOutcome(outcome),
  }
}

function finishCommit(state: DemoState, commitPlan: CommitPlan): DemoState {
  return {
    ...state,
    status: commitPlan.commitment ? 'executed' : 'not_executed',
    plan: commitPlan,
    revealed: revealCount(commitPlan),
    blockReason: commitPlan.reason,
    commitment: commitPlan.commitment,
    matchedVolume: commitPlan.committedAfter,
    announcement: announceResult(commitPlan),
  }
}

function withWindow(state: DemoState, window: ProductionWindow): DemoState {
  return { ...state, window, matchedVolume: window.committed }
}

export function demoReducer(state: DemoState, event: DemoEvent): DemoState {
  switch (event.type) {
    case 'SELECT_SCENARIO': {
      const next = initialState(event.id)
      return { ...next, immediateResults: state.immediateResults }
    }

    case 'RESET': {
      const next = initialState(state.scenarioId)
      return {
        ...next,
        immediateResults: state.immediateResults,
        announcement: 'The demo was reset to its starting state.',
      }
    }

    case 'SET_IMMEDIATE_RESULTS':
      return { ...state, immediateResults: event.value }

    case 'EDIT_FIELD': {
      const form = { ...state.form, [event.name]: event.value }
      const errors = { ...state.errors }
      delete errors[event.name]
      return { ...state, form, errors, status: 'requirement', outcome: null, plan: null }
    }

    case 'SAVE_REQUIREMENT': {
      const errors = validate(state.form)
      if (Object.keys(errors).length > 0) {
        return {
          ...state,
          errors,
          status: 'requirement',
          announcement: `The requirement was not saved. ${Object.values(errors).join(' ')}`,
        }
      }

      const saved = {
        ...state,
        errors: {},
        savedRequirement: toRequirement(state.form),
        plan: null,
        revealed: 0,
        commitment: null,
        blockReason: null,
        status: 'searching' as BuyerStatus,
        announcement: 'Searching compatible production windows.',
      }

      return state.immediateResults ? resolveSearch(saved) : saved
    }

    case 'SEARCH_DONE':
      return state.status === 'searching' ? resolveSearch(state) : state

    case 'COMMIT': {
      if (!state.savedRequirement) return state
      const commitPlan = planCommit(
        state.savedRequirement,
        state.window,
        state.today,
        state.supplier.decision === 'declined',
      )

      if (state.immediateResults) return finishCommit(state, commitPlan)

      return {
        ...state,
        status: 'committing',
        plan: commitPlan,
        revealed: 0,
        announcement: 'Committing the order. Running the checks.',
      }
    }

    case 'STAGE_ADVANCE': {
      if (state.status !== 'committing' || !state.plan) return state
      const revealed = state.revealed + 1
      const total = revealCount(state.plan)

      if (revealed >= total) return finishCommit(state, state.plan)

      const stage = state.plan.stages[state.revealed]
      return {
        ...state,
        revealed,
        announcement: `${stage.label}: done.`,
      }
    }

    case 'EDIT_WINDOW_FIELD':
      return {
        ...state,
        supplier: {
          ...state.supplier,
          form: { ...state.supplier.form, [event.name]: event.value },
          saved: false,
        },
      }

    case 'SAVE_WINDOW': {
      const form = state.supplier.form
      const approved = Number.parseInt(form.approvedIncremental, 10)
      const minAdditional = Number.parseInt(form.minAdditional, 10)
      const tierPrice = dollars(Number.parseFloat(form.tierPrice) || 0)
      const floor = dollars(Number.parseFloat(form.floor) || 0)

      const window: ProductionWindow = {
        ...state.window,
        approvedIncremental: Number.isNaN(approved) ? state.window.approvedIncremental : approved,
        minAdditional: Number.isNaN(minAdditional) ? state.window.minAdditional : minAdditional,
        cutoff: form.cutoff || state.window.cutoff,
        serviceRegions: form.serviceRegion.split(',').map((region) => region.trim()),
        deliveryTerms: form.deliveryTerms,
        qualityRequirements: form.quality.split(',').map((item) => item.trim()),
        private: {
          ...state.window.private,
          floor,
          tiers: state.window.private.tiers.map((tier) =>
            tier.minQty === 20_000 ? { ...tier, product: tierPrice } : tier,
          ),
        },
      }

      // If the buyer is mid flow, re-price against the edited window rather than
      // leaving a stale opportunity on screen.
      const outcome = state.savedRequirement
        ? evaluate(state.savedRequirement, window, state.today)
        : state.outcome

      const base = withWindow(
        { ...state, supplier: { ...state.supplier, saved: true, decision: 'none' }, outcome },
        window,
      )

      const buyerWasOffered =
        state.status === 'opportunity' ||
        state.status === 'awaiting_supplier' ||
        state.status === 'executed'

      return {
        ...base,
        status: buyerWasOffered ? 'modified' : base.status,
        plan: buyerWasOffered ? null : base.plan,
        commitment: buyerWasOffered ? null : base.commitment,
        changedTerms: buyerWasOffered ? ['The production window was edited by the supplier'] : [],
        announcement: 'The production window was saved. Compatible standing demand was searched.',
      }
    }

    case 'SUPPLIER_APPROVE': {
      const supplier = { ...state.supplier, decision: 'approved' as SupplierDecision }
      if (state.status === 'awaiting_supplier' && state.outcome?.kind === 'awaiting_supplier') {
        return {
          ...state,
          supplier,
          status: 'opportunity',
          outcome: { kind: 'opportunity', opportunity: state.outcome.opportunity },
          announcement:
            'The supplier confirmed the partly compatible order. The opportunity is now ready to commit.',
        }
      }
      return {
        ...state,
        supplier,
        announcement: 'The supplier approved the opportunity.',
      }
    }

    case 'SUPPLIER_DECLINE': {
      const supplier = { ...state.supplier, decision: 'declined' as SupplierDecision }
      const buyerWasOffered =
        state.status === 'opportunity' ||
        state.status === 'awaiting_supplier' ||
        state.status === 'executed' ||
        state.status === 'modified'

      if (!buyerWasOffered) {
        return {
          ...state,
          supplier,
          announcement: 'The supplier closed the production window.',
        }
      }

      return {
        ...state,
        supplier,
        status: 'not_executed',
        blockReason: 'supplier_declined',
        plan: null,
        commitment: null,
        matchedVolume: state.window.committed,
        announcement:
          'The supplier closed this production window. Nothing was ordered and the requirement stays saved.',
      }
    }

    case 'SUPPLIER_MODIFY': {
      // The supplier keeps the run but releases less incremental capacity.
      const reduced: ProductionWindow = {
        ...state.window,
        approvedIncremental: 50_000,
      }
      const supplier = {
        ...state.supplier,
        decision: 'modified' as SupplierDecision,
        form: { ...state.supplier.form, approvedIncremental: '50000' },
        saved: true,
      }

      const changedTerms = [
        'Approved incremental capacity cut from 60,000 to 50,000 units',
        'Remaining capacity is now 15,000 units',
      ]

      const buyerWasOffered =
        state.status === 'opportunity' ||
        state.status === 'awaiting_supplier' ||
        state.status === 'executed'

      // Re-price against the reduced window so the buyer never reviews a stale
      // opportunity.
      const outcome = state.savedRequirement
        ? evaluate(state.savedRequirement, reduced, state.today)
        : state.outcome

      const base = withWindow({ ...state, supplier, changedTerms, outcome }, reduced)

      if (!buyerWasOffered) {
        return {
          ...base,
          announcement: 'The supplier reduced the approved incremental capacity to 15,000 units.',
        }
      }

      return {
        ...base,
        status: 'modified',
        plan: null,
        commitment: null,
        blockReason: null,
        announcement:
          'The supplier changed the terms. Remaining capacity is now 15,000 units. Review the opportunity again before committing.',
      }
    }

    default:
      return state
  }
}

