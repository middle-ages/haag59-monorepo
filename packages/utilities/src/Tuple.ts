import {type UnionToIntersection} from 'effect/Types'

export * from 'effect/Tuple'

/** A tuple of arity-3 of type `A`. */
export type Tuple3<A> = readonly [A, A, A]

/**
 * Drop the last element of a tuple.
 *
 * ```ts
 * const myTuple = [1, 'a', true] as const
 * type NumberString = DropLast<typeof myTuple>
 * // NumberString ≡ readonly [1, 'a']
 * ```
 */
export type Init<Tuple extends readonly [unknown, ...(readonly unknown[])]> =
  Tuple extends readonly [...infer Init extends readonly unknown[], unknown]
    ? Readonly<Init>
    : never

/**
 * ```ts
 * type Foo = [string, number, RegExp[]];
 * type Res = Tail<Foo>; // [number, RegExp[]]
 * ```
 */
export type Tail<A extends readonly unknown[]> = A['length'] extends 0
  ? never
  : A extends readonly [unknown, ...infer Tail extends readonly unknown[]]
    ? Readonly<Tail>
    : never

/**
 * For example:
 *
 * ```ts
 * UnionToTuple<true | 42 | 'hello'> ≡ [true, 42, 'hello']
 * ```
 */
export type UnionToTuple<Union, Tuple extends readonly unknown[] = []> = [
  Union,
] extends [UnionToIntersection<Union>]
  ? readonly [Union, ...Tuple]
  : UnionToTuple<
      Exclude<Union, PopUnion<Union>>,
      readonly [PopUnion<Union>, ...Tuple]
    >

type PopUnion<U> =
  UnionToIntersection<U extends unknown ? (f: U) => void : never> extends (
    a: infer A,
  ) => void
    ? A
    : never
