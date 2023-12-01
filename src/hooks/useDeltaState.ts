/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"

export const useDeltaState = <T extends object>(initialValue: T | (() => T)) => {
  const [state, setState] = useState(initialValue)

  const setDelta = (v: Partial<T> | ((v: T) => Partial<T>)) =>
    setState((prev) => ({ ...prev, ...(typeof v === "function" ? v(prev) : v) }))

  const getSetState =
    <K extends keyof T>(key: K) =>
    (v: T[K] | ((prev: T[K]) => T[K])) => {
      if (typeof v === "function") {
        setState((prev) => ({ ...prev, [key]: (v as any)(prev[key]) }))
      } else {
        setDelta({ [key]: v } as any)
      }
    }

  return { state, setDelta, getSetState }
}
