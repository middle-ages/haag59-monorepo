import {
  dedupeWith,
  append as _append,
  appendAll as _appendAll,
  prepend as _prepend,
  prependAll as _prependAll,
} from 'effect/Array'
import {String} from 'effect'
import type {EndoOf} from './Function.js'

export * from 'effect/Array'
export {transpose, type NonEmptyArray2} from './Array/transpose.js'

export const append = Object.assign(_append, {
  flipped:
    <A>(self: A[]): ((last: A) => A[]) =>
    last =>
      _append(self, last),
})

export const prepend = Object.assign(_prepend, {
  flipped:
    <A>(self: A[]): ((last: A) => A[]) =>
    head =>
      _prepend(self, head),
})

export const appendAll = Object.assign(_appendAll, {
  flipped:
    <A>(self: A[]): ((tail: A[]) => A[]) =>
    tail =>
      _appendAll(self, tail),
})

export const prependAll = Object.assign(_prependAll, {
  flipped:
    <A>(self: A[]): ((head: A[]) => A[]) =>
    init =>
      _prependAll(self, init),
})

/** `dedupeWith` string equivalence. */
export const dedupeStrings: EndoOf<string[]> = dedupeWith(String.Equivalence)
