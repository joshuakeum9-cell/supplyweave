import { describe, expect, it } from 'vitest'
import { demoReducer, initialState, validate, type DemoState } from '../demoReducer'
import { formatTotal, formatUnitPrice } from '@/domain/money'

function run(state: DemoState, ...events: Parameters<typeof demoReducer>[1][]): DemoState {
  return events.reduce((current, event) => demoReducer(current, event), state)
}

/** Drive a scenario to its final state on the immediate path. */
function playThrough(scenarioId: string): DemoState {
  return run(
    initialState(),
    { type: 'SET_IMMEDIATE_RESULTS', value: true },
    { type: 'SELECT_SCENARIO', id: scenarioId },
    { type: 'SAVE_REQUIREMENT' },
    { type: 'COMMIT' },
  )
}

describe('initial state', () => {
  it('starts on the requirement step with matched volume at 35,000', () => {
    const state = initialState()
    expect(state.status).toBe('requirement')
    expect(state.matchedVolume).toBe(35_000)
    expect(state.scenarioId).toBe('success')
    expect(state.commitment).toBeNull()
  })
})

describe('validation', () => {
  it('rejects a blank quantity and a malformed ZIP', () => {
    const errors = validate({
      productId: 'base',
      quantity: '',
      destinationZip: '11',
      currentDelivered: '0.43',
      maxDelivered: '0.40',
      minFillPct: '100',
      allowEquivalents: true,
    })
    expect(errors.quantity).toContain('Enter a quantity')
    expect(errors.destinationZip).toContain('five digit ZIP')
  })

  it('keeps the demo on the requirement step and announces the problem', () => {
    const state = run(
      initialState(),
      { type: 'SELECT_SCENARIO', id: 'validation' },
      { type: 'SAVE_REQUIREMENT' },
    )
    expect(state.status).toBe('requirement')
    expect(state.errors.quantity).toBeDefined()
    expect(state.announcement).toContain('not saved')
  })

  it('clears a field error as soon as the field is edited', () => {
    const invalid = run(
      initialState(),
      { type: 'SELECT_SCENARIO', id: 'validation' },
      { type: 'SAVE_REQUIREMENT' },
    )
    const edited = demoReducer(invalid, { type: 'EDIT_FIELD', name: 'quantity', value: '20000' })
    expect(edited.errors.quantity).toBeUndefined()
  })
})

describe('search transitions', () => {
  it('goes through searching to an opportunity on the timed path', () => {
    const searching = run(initialState(), { type: 'SAVE_REQUIREMENT' })
    expect(searching.status).toBe('searching')
    expect(searching.announcement).toContain('Searching')

    const found = demoReducer(searching, { type: 'SEARCH_DONE' })
    expect(found.status).toBe('opportunity')
    expect(found.outcome?.kind).toBe('opportunity')
  })

  it('resolves in one dispatch on the immediate path', () => {
    const state = run(
      initialState(),
      { type: 'SET_IMMEDIATE_RESULTS', value: true },
      { type: 'SAVE_REQUIREMENT' },
    )
    expect(state.status).toBe('opportunity')
  })

  it('reaches the empty state for an incompatible requirement', () => {
    const state = run(
      initialState(),
      { type: 'SET_IMMEDIATE_RESULTS', value: true },
      { type: 'SELECT_SCENARIO', id: 'incompatible' },
      { type: 'SAVE_REQUIREMENT' },
    )
    expect(state.status).toBe('no_match')
  })

  it('waits for the supplier when compatibility is partial', () => {
    const state = run(
      initialState(),
      { type: 'SET_IMMEDIATE_RESULTS', value: true },
      { type: 'SELECT_SCENARIO', id: 'partial' },
      { type: 'SAVE_REQUIREMENT' },
    )
    expect(state.status).toBe('awaiting_supplier')
  })

  it('stops at the closed window when the cutoff has passed', () => {
    const state = run(
      initialState(),
      { type: 'SET_IMMEDIATE_RESULTS', value: true },
      { type: 'SELECT_SCENARIO', id: 'cutoff' },
      { type: 'SAVE_REQUIREMENT' },
    )
    expect(state.status).toBe('not_executed')
    expect(state.blockReason).toBe('cutoff_expired')
  })
})

describe('commit transitions', () => {
  it('reveals one stage per advance and finishes executed', () => {
    let state = run(initialState(), { type: 'SAVE_REQUIREMENT' }, { type: 'SEARCH_DONE' }, {
      type: 'COMMIT',
    })
    expect(state.status).toBe('committing')
    expect(state.revealed).toBe(0)

    const total = state.plan ? state.plan.stages.length : 0
    for (let i = 0; i < total; i += 1) {
      state = demoReducer(state, { type: 'STAGE_ADVANCE' })
    }

    expect(state.status).toBe('executed')
    expect(state.matchedVolume).toBe(55_000)
  })

  it('produces the documented result', () => {
    const state = playThrough('success')
    expect(state.status).toBe('executed')
    const commitment = state.commitment
    expect(commitment).not.toBeNull()
    if (!commitment) return
    expect(formatUnitPrice(commitment.delivered)).toBe('$0.3740')
    expect(formatTotal(commitment.total)).toBe('$7,480.00')
    expect(formatTotal(commitment.savings)).toBe('$1,120.00')
    expect(state.announcement).toContain('$7,480.00')
  })

  it('blocks above the buyer maximum without moving matched volume', () => {
    const state = playThrough('price-limit')
    expect(state.status).toBe('not_executed')
    expect(state.blockReason).toBe('price_limit')
    expect(state.matchedVolume).toBe(35_000)
  })

  it('blocks when a full fill does not fit', () => {
    const state = playThrough('full-fill')
    expect(state.status).toBe('not_executed')
    expect(state.blockReason).toBe('full_fill')
  })
})

describe('supplier actions', () => {
  it('confirms a partly compatible opportunity when the supplier approves', () => {
    const waiting = run(
      initialState(),
      { type: 'SET_IMMEDIATE_RESULTS', value: true },
      { type: 'SELECT_SCENARIO', id: 'partial' },
      { type: 'SAVE_REQUIREMENT' },
    )
    const approved = demoReducer(waiting, { type: 'SUPPLIER_APPROVE' })
    expect(approved.status).toBe('opportunity')
    expect(approved.supplier.decision).toBe('approved')
  })

  it('closes the opportunity when the supplier declines', () => {
    const offered = run(
      initialState(),
      { type: 'SET_IMMEDIATE_RESULTS', value: true },
      { type: 'SAVE_REQUIREMENT' },
    )
    const declined = demoReducer(offered, { type: 'SUPPLIER_DECLINE' })
    expect(declined.status).toBe('not_executed')
    expect(declined.blockReason).toBe('supplier_declined')
    expect(declined.matchedVolume).toBe(35_000)
  })

  it('sends the buyer back to review when the supplier cuts capacity', () => {
    const offered = run(
      initialState(),
      { type: 'SET_IMMEDIATE_RESULTS', value: true },
      { type: 'SAVE_REQUIREMENT' },
    )
    const modified = demoReducer(offered, { type: 'SUPPLIER_MODIFY' })
    expect(modified.status).toBe('modified')
    expect(modified.window.approvedIncremental).toBe(50_000)
    expect(modified.changedTerms.join(' ')).toContain('15,000')

    // Committing against the reduced window now fails the fill rule.
    const committed = demoReducer(modified, { type: 'COMMIT' })
    expect(committed.status).toBe('not_executed')
    expect(committed.blockReason).toBe('full_fill')
  })

  it('applies edits to the window when the supplier saves it', () => {
    const state = run(
      initialState(),
      { type: 'EDIT_WINDOW_FIELD', name: 'approvedIncremental', value: '80000' },
      { type: 'SAVE_WINDOW' },
    )
    expect(state.window.approvedIncremental).toBe(80_000)
    expect(state.supplier.saved).toBe(true)
  })
})

describe('reset', () => {
  it('returns to the start from an executed order', () => {
    const executed = playThrough('success')
    const reset = demoReducer(executed, { type: 'RESET' })
    expect(reset.status).toBe('requirement')
    expect(reset.matchedVolume).toBe(35_000)
    expect(reset.commitment).toBeNull()
    expect(reset.window.approvedIncremental).toBe(60_000)
    expect(reset.announcement).toContain('reset')
  })

  it('returns to the start from every other state', () => {
    const states = ['partial', 'incompatible', 'price-limit', 'full-fill', 'cutoff'].map(
      playThrough,
    )
    for (const state of states) {
      const reset = demoReducer(state, { type: 'RESET' })
      expect(reset.status).toBe('requirement')
      expect(reset.plan).toBeNull()
    }
  })

  it('keeps the immediate results preference across a reset', () => {
    const executed = playThrough('success')
    expect(demoReducer(executed, { type: 'RESET' }).immediateResults).toBe(true)
  })
})
