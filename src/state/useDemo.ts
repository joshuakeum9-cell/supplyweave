import { useContext } from 'react'
import { DemoContext, type DemoContextValue } from './demoContext'

export function useDemo(): DemoContextValue {
  const value = useContext(DemoContext)
  if (!value) {
    throw new Error('useDemo must be used inside a DemoProvider.')
  }
  return value
}
