/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = <Params extends any[]>(func: (...args: Params) => any, timeout: number) => {
  let timer: number

  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}
