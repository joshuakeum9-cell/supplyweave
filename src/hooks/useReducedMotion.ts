import { useEffect, useState } from 'react'

/**
 * True when the visitor has asked their system to reduce motion. The demo then
 * takes the immediate path: no count-up, no staged reveal, the result appears at
 * once.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
