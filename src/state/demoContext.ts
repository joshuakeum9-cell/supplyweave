import { createContext } from 'react'
import type { DemoEvent, DemoState } from './demoReducer'

export interface DemoContextValue {
  state: DemoState
  dispatch: (event: DemoEvent) => void
  /** True when motion is reduced, either by system setting or by the checkbox. */
  immediate: boolean
}

export const DemoContext = createContext<DemoContextValue | null>(null)
