export const isDefined = <O>(value?: O): value is O => value !== undefined

export const isUndefined = <O>(value?: O): value is undefined =>
  value !== undefined
