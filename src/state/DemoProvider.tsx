import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { DemoContext } from './demoContext'
import { demoReducer, initialState } from './demoReducer'

const SEARCH_MS = 700
const STAGE_MS = 520

/**
 * Holds the demo state and drives the two timed transitions: the search and the
 * staged reveal of the commit plan.
 *
 * The plan itself is computed in the reducer before either timer starts, so the
 * outcome the visitor sees never depends on timing. The timers only decide how
 * quickly an already decided result is revealed.
 */
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, () => initialState())
  const systemReducedMotion = useReducedMotion()
  const immediate = systemReducedMotion || state.immediateResults

  // Keep the reducer's own flag in step with the system setting, so a reduced
  // motion visitor gets the immediate path even without touching the checkbox.
  useEffect(() => {
    if (systemReducedMotion && !state.immediateResults) {
      dispatch({ type: 'SET_IMMEDIATE_RESULTS', value: true })
    }
  }, [systemReducedMotion, state.immediateResults])

  // A zero delay when motion is reduced, so a state that was entered just before
  // the setting was noticed still resolves at once instead of stalling.
  useEffect(() => {
    if (state.status !== 'searching') return
    const timer = window.setTimeout(
      () => dispatch({ type: 'SEARCH_DONE' }),
      immediate ? 0 : SEARCH_MS,
    )
    return () => window.clearTimeout(timer)
  }, [state.status, immediate])

  useEffect(() => {
    if (state.status !== 'committing') return
    const timer = window.setTimeout(
      () => dispatch({ type: 'STAGE_ADVANCE' }),
      immediate ? 0 : STAGE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [state.status, state.revealed, immediate])

  const value = useMemo(() => ({ state, dispatch, immediate }), [state, immediate])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}
