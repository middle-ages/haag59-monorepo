import {Bicovariant as BI, Semigroup} from '@effect/typeclass'
import {Equivalence, Function, Order, pipe} from 'effect'
import {tinyArray} from 'effect-ts-laws'
import fc from 'fast-check'
import type {These, TheseTypeLambda} from './index.js'
import {Both, Left, match, Right} from './index.js'

export const bimap: BI.Bicovariant<TheseTypeLambda>['bimap'] = Function.dual(
  3,
  <E1, E2, A, B>(
    fa: These<A, E1>,
    f: (e: E1) => E2,
    g: (a: A) => B,
  ): These<B, E2> =>
    pipe(
      fa,
      match<A, E1, These<B, E2>>({
        Left: ({left}) => pipe(left, g, Left.from<B, E2>),
        Right: ({right}) => pipe(right, f, Right.from<B, E2>),
        Both: ({left, right}) => Both({left: g(left), right: f(right)}),
      }),
    ),
)

export const Bicovariant: BI.Bicovariant<TheseTypeLambda> = {bimap}

export const [mapLeft, mapRight] = [
  BI.mapLeft(Bicovariant),
  BI.map(Bicovariant),
]

export const getEquivalence =
  <B>(equalsB: Equivalence.Equivalence<B>) =>
  <A>(
    equalsA: Equivalence.Equivalence<A>,
  ): Equivalence.Equivalence<These<A, B>> =>
  (a, b) =>
    a._tag === b._tag &&
    pipe(
      a,
      match<A, B, boolean>({
        Left: ({left}) => equalsA(left, (b as Left<A, B>).left),
        Right: ({right}) => equalsB(right, (b as Right<A, B>).right),
        Both: ({left, right}) =>
          equalsA(left, (b as Left<A, B>).left) &&
          equalsB(right, (b as Right<A, B>).right),
      }),
    )

export const getOrder =
  <B>(orderB: Order.Order<B>) =>
  <A>(orderA: Order.Order<A>): Order.Order<These<A, B>> =>
  (a, b) => {
    const tagCompare = a._tag.localeCompare(b._tag)
    return (
      tagCompare === 0
        ? pipe(
            a,
            match<A, B, -1 | 0 | 1>({
              Left: ({left}) => orderA(left, (b as Left<A, B>).left),
              Right: ({right}) => orderB(right, (b as Right<A, B>).right),
              Both: ({left, right}) => {
                const [leftCompare, rightCompare] = [
                  orderA(left, (b as Left<A, B>).left),
                  orderB(right, (b as Right<A, B>).right),
                ]
                return leftCompare === 0 ? rightCompare : leftCompare
              },
            }),
          )
        : tagCompare
    ) as -1 | 0 | 1
  }

export const getArbitrary =
  <B>(b: fc.Arbitrary<B>) =>
  <A>(a: fc.Arbitrary<A>) =>
    fc.oneof(
      a.map(left => Left<A, B>({left})),
      b.map(right => Right<A, B>({right})),
      a.chain(left => b.map(right => Both<A, B>({left, right}))),
    )

/**
 * A valid array of `These` will always begin with a possibly empty list of
 * `Both`, followed by a possibly empty list of either `Left` or `Right`,
 * but never a mix.
 */
export const getArrayArbitrary =
  <B>(b: fc.Arbitrary<B>) =>
  <A>(a: fc.Arbitrary<A>) => {
    const init: fc.Arbitrary<Both<A, B>[]> = tinyArray(
      a.chain(left => b.map<Both<A, B>>(right => Both<A, B>({left, right}))),
    )
    const tail: fc.Arbitrary<These<A, B>[]> = fc.oneof(
      // left is longer
      //      pipe(Left.from, a.map<These<A, B>>, tinyArray),
      tinyArray(a.map<These<A, B>>(Left.from)),
      // right is longer
      tinyArray(b.map<These<A, B>>(Right.from)),
      // left.length = right.length
      fc.constant([] as These<A, B>[]),
    )

    return init.chain(init =>
      tail.map(tail => [...init, ...tail] as These<A, B>[]),
    )
  }

export const combine =
  <B>(rightSemigroup: Semigroup.Semigroup<B>) =>
  <A>(leftSemigroup: Semigroup.Semigroup<A>) =>
  (self: These<A, B>, that: These<A, B>): These<A, B> => {
    const by = match<A, B, These<A, B>>,
      [addLeft, addRight] = [leftSemigroup.combine, rightSemigroup.combine]

    return pipe(
      self,
      by({
        Left: ({left: selfLeft}) =>
          pipe(
            that,
            by({
              Left: ({left}) => Left.from(addLeft(selfLeft, left)),
              Right: ({right}) => Both.from(selfLeft, right),
              Both: ({left, right}) =>
                Both.from(addLeft(selfLeft, left), right),
            }),
          ),
        Right: ({right: selfRight}) =>
          pipe(
            that,
            by({
              Left: ({left}) => Both.from(left, selfRight),
              Right: ({right}) => Right.from(addRight(selfRight, right)),
              Both: ({left, right}) =>
                Both.from(left, addRight(selfRight, right)),
            }),
          ),
        Both: ({left: selfLeft, right: selfRight}) =>
          pipe(
            that,
            by({
              Left: ({left}) => Both.from(addLeft(selfLeft, left), selfRight),
              Right: ({right}) =>
                Both.from(selfLeft, addRight(selfRight, right)),
              Both: ({left, right}) =>
                Both.from(addLeft(selfLeft, left), addRight(selfRight, right)),
            }),
          ),
      }),
    )
  }

export const getSemigroup =
  <B>(semigroupB: Semigroup.Semigroup<B>) =>
  <A>(semigroupA: Semigroup.Semigroup<A>): Semigroup.Semigroup<These<A, B>> =>
    Semigroup.make(combine(semigroupB)(semigroupA))
