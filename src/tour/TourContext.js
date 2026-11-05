import { createContext, useContext } from 'react'

export const TourContext = createContext(null)

// Any component can call useTour() to start the first-visit tour again,
// or to know whether it is running (isRunning).
export function useTour() {
  return useContext(TourContext)
}
