/**
 * Static explanatory content: the roadmap, the business model, the compatibility
 * examples and the two lane flow. Kept out of components so the wording can be
 * reviewed in one place against the vocabulary rules.
 */

export interface RoadmapPhase {
  id: string
  number: string
  title: string
  body: string
  status: 'Shown in this prototype' | 'Future, not in this prototype'
}

export const ROADMAP: RoadmapPhase[] = [
  {
    id: 'phase-1',
    number: 'Phase 1',
    title: 'Supplier production coordination software',
    body: 'A manufacturer creates a private production window for a run it has already scheduled, then coordinates compatible demand from the customers it already serves. Nothing is public and no new buyer is involved yet.',
    status: 'Shown in this prototype',
  },
  {
    id: 'phase-2',
    number: 'Phase 2',
    title: 'External demand network',
    body: 'When a window still has approved incremental capacity, SupplyWeave privately searches standing requirements from buyers the manufacturer does not yet serve, and brings back one consolidated supplemental order.',
    status: 'Shown in this prototype',
  },
  {
    id: 'phase-3',
    number: 'Phase 3',
    title: 'Cross manufacturer routing',
    body: 'After repeated transactions are proven, a requirement could be compared across several qualified manufacturers on compatibility, delivered cost, timing, capacity and reliability. This is a direction, not a built feature.',
    status: 'Future, not in this prototype',
  },
]

export interface RevenueLine {
  id: string
  title: string
  detail: string
  figure: string
}

export const REVENUE_LINES: RevenueLine[] = [
  {
    id: 'rev-1',
    title: 'Success fee on new network sourced business',
    detail:
      'Charged on product value only, excluding freight and tax, and only when the order came from the network rather than from a relationship the supplier already had.',
    figure: '4 to 6 percent',
  },
  {
    id: 'rev-2',
    title: 'Supplier software subscription',
    detail:
      'For coordinating production windows across a facility and its existing customers, which is Phase 1 and does not depend on the network existing.',
    figure: '$500 to $2,000 per facility per month',
  },
  {
    id: 'rev-3',
    title: 'Optional services later',
    detail:
      'Payment handling, protection, financing, freight and integrations, each only if buyers and suppliers ask for it.',
    figure: 'Not priced',
  },
]

export interface CompatibilityExample {
  id: string
  state: 'Full' | 'Partial' | 'Not compatible'
  heading: string
  example: string
  shared: string
  separate: string
}

export const COMPATIBILITY_EXAMPLES: CompatibilityExample[] = [
  {
    id: 'compat-full',
    state: 'Full',
    heading: 'Everything relevant is the same',
    example: 'The same 12 x 12 x 12 RSC box, 32 ECT kraft, unprinted, same flute and die.',
    shared: 'Board, corrugation, die cutting, printing, finishing, quality checks.',
    separate: 'Nothing. The extra units are simply more of the same run.',
  },
  {
    id: 'compat-partial',
    state: 'Partial',
    heading: 'Upstream steps are shared, later steps are not',
    example: 'The same box with one colour printed on it.',
    shared: 'Board, corrugation and die cutting.',
    separate: 'Printing needs its own plate and pass, so the supplier has to confirm it is worth doing.',
  },
  {
    id: 'compat-false',
    state: 'Not compatible',
    heading: 'It looks similar and is not',
    example: 'The same outside dimensions in 44 ECT double wall board.',
    shared: 'Nothing.',
    separate:
      'Different board, different corrugator setup, different tooling. Sharing the run is not possible.',
  },
]

export interface FlowStep {
  id: string
  buyer: string
  system: string
}

export const FLOW_STEPS: FlowStep[] = [
  {
    id: 'flow-1',
    buyer: 'Save a standing requirement: what you buy, how much, where it goes, and the most you will pay delivered.',
    system: 'Store the requirement privately and keep it available for future runs.',
  },
  {
    id: 'flow-2',
    buyer: 'Wait. Nothing is public and no supplier can see what you are willing to pay.',
    system: 'Search production windows whose supplier has approved this specification as compatible.',
  },
  {
    id: 'flow-3',
    buyer: 'Review the private opportunity and compare it with what you pay today.',
    system: 'Compute delivered cost: the supplier tier for your quantity, freight and handling, and the disclosed fee.',
  },
  {
    id: 'flow-4',
    buyer: 'Commit, or let it pass. Your current supplier is unaffected either way.',
    system: 'Check the supplier economics, your maximum price, the capacity against your fill rule, and the cutoff.',
  },
  {
    id: 'flow-5',
    buyer: 'Track the order to production and delivery.',
    system: 'Add the units to the run, return the result, and follow the production state.',
  },
]

export const PROBLEM_COLUMNS = [
  {
    id: 'problem-supplier',
    heading: 'A manufacturer has a run that could take more',
    body: 'The setup is paid for, the material is configured and the schedule is fixed. There is approved capacity left over, but only until the cutoff, and only for work that is genuinely compatible.',
  },
  {
    id: 'problem-buyer',
    heading: 'A buyer has an order too small to earn the best economics',
    body: 'The requirement repeats every few weeks, but on its own it never reaches the quantity where production pricing improves. So it is bought at a higher delivered price, every time.',
  },
]
