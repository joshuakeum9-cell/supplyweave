/**
 * Domain types for the SupplyWeave prototype.
 *
 * Every value here is illustrative demo data. Nothing in this module touches
 * React, the network, or the real clock.
 */

/** An integer count of ten-thousandths of a dollar. $0.3375 is 3375. */
export type Money4 = number

/** A whole number of units. */
export type Units = number

/** An ISO date string from the fixture clock. The real clock is never read. */
export type DemoDate = string

export type BoardGrade = '32 ECT' | '44 ECT'
export type Wall = 'single' | 'double'
export type PrintSpec = 'none' | '1-color flexo'
export type FinishingSpec = 'none' | 'glued'

export interface ProductSpec {
  id: string
  name: string
  boardGrade: BoardGrade
  wall: Wall
  flute: string
  style: string
  dimensionsIn: string
  print: PrintSpec
  finishing: FinishingSpec
  certifications: string[]
}

export interface BuyerRequirement {
  id: string
  buyerLabel: string
  product: ProductSpec
  quantity: Units
  destinationZip: string
  /** What the buyer pays today, delivered, per unit. */
  currentDelivered: Money4
  /** The most the buyer will pay, delivered, per unit. */
  maxDelivered: Money4
  /** 100 means the whole quantity must fill or nothing does. */
  minFillPct: number
  allowEquivalents: boolean
  deliveryWindow: DateRange
}

export interface DateRange {
  start: DemoDate
  end: DemoDate
}

export interface PriceTier {
  minQty: Units
  product: Money4
}

/** The supplier's private side of a production window. Never sent to a buyer. */
export interface PrivateWindowTerms {
  tiers: PriceTier[]
  floor: Money4
  anchorCustomer: 'hidden'
}

export interface CompatibilityRequirements {
  boardGrade: BoardGrade
  wall: Wall
  flute: string
  style: string
  dimensionsIn: string
  print: PrintSpec
  finishing: FinishingSpec
  certifications: string[]
}

export interface ProductionWindow {
  id: string
  facilityLabel: string
  productFamily: string
  compatibility: CompatibilityRequirements
  approvedIncremental: Units
  committed: Units
  minAdditional: Units
  cutoff: DemoDate
  productionWindow: DateRange
  deliveryWindow: DateRange
  private: PrivateWindowTerms
  serviceRegions: string[]
  deliveryTerms: string
  qualityRequirements: string[]
  freightHandlingByZip3: Record<string, Money4>
  /** The disclosed SupplyWeave fee per unit. */
  fee: Money4
}

/**
 * The window as a buyer may see it. The `private` block is removed at the type
 * level, so a component cannot render supplier tiers or the price floor even by
 * mistake.
 */
export type BuyerVisibleWindow = Omit<ProductionWindow, 'private'>

/**
 * A standing requirement as the supplier may see it. The buyer's maximum price
 * and current delivered price are removed, so no supplier can price against
 * what a buyer is willing to pay.
 */
export type SupplierVisibleRequirement = Omit<
  BuyerRequirement,
  'maxDelivered' | 'currentDelivered'
>

export type CompatibilityState = 'full' | 'partial' | 'false'

export interface CompatibilityAssessment {
  state: CompatibilityState
  sharedSteps: string[]
  separateSteps: string[]
  reasons: string[]
  /** Compatibility is supplier approved demo data, not a SupplyWeave judgement. */
  source: 'supplier_approved_demo_data'
}

export interface DeliveredCostBreakdown {
  product: Money4
  freightHandling: Money4
  fee: Money4
  delivered: Money4
}

export interface CommitmentTerm {
  id: string
  label: string
  value: string
  assumption: boolean
}

export interface MatchedOpportunity {
  window: BuyerVisibleWindow
  assessment: CompatibilityAssessment
  breakdown: DeliveredCostBreakdown
  remainingBefore: Units
  guards: MatchGuards
  terms: CommitmentTerm[]
}

export interface MatchGuards {
  supplierEconomics: boolean
  maxPrice: boolean
  capacity: boolean
  cutoff: boolean
}

export type SearchOutcome =
  | { kind: 'opportunity'; opportunity: MatchedOpportunity }
  | { kind: 'awaiting_supplier'; opportunity: MatchedOpportunity }
  | { kind: 'no_match'; assessment: CompatibilityAssessment }
  | { kind: 'cutoff_expired'; cutoff: DemoDate }

export interface Commitment {
  requirementId: string
  windowId: string
  quantity: Units
  delivered: Money4
  total: Money4
  baselineTotal: Money4
  savings: Money4
  /** Savings as a percentage of the baseline total, one decimal place. */
  savingsPct: number
}

export type FulfillmentState = 'scheduled' | 'in_production' | 'shipped' | 'delivered'

export type StageStatus = 'waiting' | 'running' | 'done' | 'blocked'

export interface ProcessingStage {
  id: string
  label: string
  status: StageStatus
  note?: string
}

export type BlockReason =
  | 'price_limit'
  | 'full_fill'
  | 'cutoff_expired'
  | 'supplier_declined'
  | 'floor'

/** The whole outcome of a commit, computed before any animation runs. */
export interface CommitPlan {
  stages: PlannedStage[]
  blockedAt: number | null
  reason: BlockReason | null
  commitment: Commitment | null
  fulfillment: FulfillmentState | null
  committedAfter: Units
  remainingAfter: Units
}

export interface PlannedStage {
  id: string
  label: string
  pass: boolean
  note?: string
}

/* Scope content. Each kind is a separate type with its own exported array, so
 * confirmed direction can never be rendered in the same list as an open
 * question. */

export interface RecommendedDirection {
  id: string
  text: string
}
export interface PilotHypothesis {
  id: string
  text: string
  figure?: string
}
export interface OpenQuestion {
  id: string
  text: string
}
export interface MvpBoundary {
  id: string
  text: string
}
export interface DemoAssumption {
  id: string
  text: string
}
export interface FutureIdea {
  id: string
  text: string
}
