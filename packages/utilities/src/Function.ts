import type {HKT} from 'effect'
import type {FunctionN} from 'effect/Function'

export * from 'effect/Function'

/** A function from a type `A` to itself. */
export interface EndoOf<A> {
  (a: A): A
}

/** Just like {@link EndoOf} except the type `A` is open. */
export interface Endo {
  <A>(a: A): A
}

/**
 * ```
 * Unary<P, Q> ≡ (p: P) => R
 * ```
 */
export type Unary<Q = never, R = unknown> = FunctionN<[Q], R>

/**
 * The inverse of a unary function.
 *
 * ```ts
 * Dual<Unary<number,boolean>> ≡ Unary<boolean, number>
 * ```
 */
export interface Dual<F extends Unary> {
  (args: ReturnType<F>): Parameters<F>[0]
}

/** Apply a nullary function. */
export const apply0 = <R>(f: () => R): R => f()

/** Curry a binary function: `((a,b)→c) → (a→b→c)` */
export const curry =
  <A, B, C>(f: (a: A, b: B) => C) =>
  (a: A) =>
  (b: B) =>
    f(a, b)

/** Uncurry a curried binary function: `a→b→c → ((a,b)→c)`. */
export const uncurry =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  (a: A, b: B) =>
    f(a)(b)

/** Flip argument order of a curried binary function: `a→b→c → (b→a→c)`. */
export const flip =
  <A, B, C>(f: (a: A) => (b: B) => C): ((b: B) => (a: A) => C) =>
  b =>
  a =>
    f(a)(b)

/**
 * ```
 * KindEndo<F extends TypeLambda> ≡ <A>(t: Kind1<F, A>) => Kind1<F, A>
 * ```
 */
export type KindEndo<F extends HKT.Semigroup> = <
  A,
  E = unknown,
  R = unknown,
  I = never,
>(
  _: HKT.Kind<F, I, R, E, A>,
) => typeof _
