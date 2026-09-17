import type { DemoDate } from '@/domain/types'
import { DEMO_TODAY, DEMO_TODAY_AFTER_CUTOFF } from './productionWindow'

/**
 * The eight demo states, each expressed as a change to the buyer's standing
 * requirement or the demo clock. Every scenario runs through the same engine, so
 * none of them is a special case in the interface.
 */

export type ProductChoice = 'base' | 'printed' | 'heavy'

export interface RequirementFormValues {
  productId: ProductChoice
  quantity: string
  destinationZip: string
  currentDelivered: string
  maxDelivered: string
  minFillPct: string
  allowEquivalents: boolean
}

export interface Scenario {
  id: string
  label: string
  summary: string
  form: RequirementFormValues
  today: DemoDate
  /** True when the visitor drives this scenario from the supplier view. */
  supplierDriven?: boolean
}

const DEFAULT_FORM: RequirementFormValues = {
  productId: 'base',
  quantity: '20000',
  destinationZip: '11373',
  currentDelivered: '0.4300',
  maxDelivered: '0.4000',
  minFillPct: '100',
  allowEquivalents: true,
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'success',
    label: 'Compatible match that executes',
    summary:
      'The standing requirement matches the run exactly and the delivered price lands under the buyer maximum.',
    form: DEFAULT_FORM,
    today: DEMO_TODAY,
  },
  {
    id: 'partial',
    label: 'Partial compatibility',
    summary:
      'The same box with a printed side. Board and die are shared, printing is not, so the supplier has to confirm.',
    form: { ...DEFAULT_FORM, productId: 'printed' },
    today: DEMO_TODAY,
  },
  {
    id: 'incompatible',
    label: 'Not compatible',
    summary:
      'A heavier double wall box. It looks similar and needs a different board and corrugator setup.',
    form: { ...DEFAULT_FORM, productId: 'heavy' },
    today: DEMO_TODAY,
  },
  {
    id: 'price-limit',
    label: 'Price above the buyer maximum',
    summary: 'The buyer will pay no more than $0.3600 delivered, so nothing is ordered.',
    form: { ...DEFAULT_FORM, maxDelivered: '0.3600' },
    today: DEMO_TODAY,
  },
  {
    id: 'full-fill',
    label: 'Full fill does not fit',
    summary:
      '30,000 units with a 100 percent fill rule against 25,000 units of remaining capacity.',
    form: { ...DEFAULT_FORM, quantity: '30000' },
    today: DEMO_TODAY,
  },
  {
    id: 'cutoff',
    label: 'Production cutoff has passed',
    summary: 'The same requirement two days after the run closed.',
    form: DEFAULT_FORM,
    today: DEMO_TODAY_AFTER_CUTOFF,
  },
  {
    id: 'supplier',
    label: 'Supplier modifies or declines',
    summary:
      'Start the match, then use the supplier view below to cut the capacity or close the window.',
    form: DEFAULT_FORM,
    today: DEMO_TODAY,
    supplierDriven: true,
  },
  {
    id: 'validation',
    label: 'Validation error',
    summary: 'A requirement saved with no quantity. Nothing is searched until it is fixed.',
    form: { ...DEFAULT_FORM, quantity: '' },
    today: DEMO_TODAY,
  },
]

export const DEFAULT_SCENARIO_ID = 'success'

export function scenarioById(id: string): Scenario {
  return SCENARIOS.find((scenario) => scenario.id === id) ?? SCENARIOS[0]
}
