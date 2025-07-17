import type {Semigroup} from '@effect/typeclass/Semigroup'
import {Array, Either, flow, Function, identity, pipe} from 'effect'
import {fanout} from 'effect-ts-folds'
import {isSome, none, some, type Option, type Some} from 'effect/Option'
import {
  Both,
  isBoth,
  isLeft,
  isRight,
  Left,
  match,
  Right,
  type These,
} from './index.js'
import {mapLeft, mapRight} from './instances.js'

export const [leftOption, rightOption, onlyLeft, onlyRight]: [
  <A, B>(self: These<A, B>) => Option<A>,
  <A, B>(self: These<A, B>) => Option<B>,
  <A, B>(self: These<A, B>) => Option<A>,
  <A, B>(self: These<A, B>) => Option<B>,
] = [
  self => (isLeft(self) || isBoth(self) ? some(self.left) : none()),
  self => (isRight(self) || isBoth(self) ? some(self.right) : none()),
  self => (isLeft(self) ? some(self.left) : none()),
  self => (isRight(self) ? some(self.right) : none()),
]

export const [onlyOne, onlyBoth]: [
  <A, B>(self: These<A, B>) => Option<Either.Either<B, A>>,
  <A, B>(self: These<A, B>) => Option<[A, B]>,
] = [
  self =>
    isBoth(self)
      ? none()
      : some(isLeft(self) ? Either.left(self.left) : Either.right(self.right)),
  self => (isBoth(self) ? some([self.left, self.right]) : none()),
]

export const pad = <A, B>(self: These<A, B>): [Option<A>, Option<B>] =>
  pipe(
    self,
    match({
      Left: ({left}) => [some(left), none()],
      Right: ({right}) => [none(), some(right)],
      Both: ({left, right}) => [some(left), some(right)],
    }),
  )

export const addLeft = <A>(
    F: Semigroup<A>,
  ): {
    <B>(self: These<A, B>, child: A): These<A, B>
    (child: A): <B>(self: These<A, B>) => These<A, B>
  } =>
    Function.dual(
      2,
      <B>(self: These<A, B>, child: A): These<A, B> =>
        isRight(self)
          ? Both.from(child, self.right)
          : mapRight(self, self => F.combine(self, child)),
    ),
  addRight = <B>(
    F: Semigroup<B>,
  ): {
    <A>(self: These<A, B>, child: B): These<A, B>
    (child: B): <A>(self: These<A, B>) => These<A, B>
  } =>
    Function.dual(
      2,
      <A>(self: These<A, B>, child: B): These<A, B> =>
        isLeft(self)
          ? Both.from(self.left, child)
          : mapLeft(self, self => F.combine(self, child)),
    )

export const swap = <A, B>(self: These<A, B>): These<B, A> =>
  pipe(
    self,
    match<A, B, These<B, A>>({
      Left: ({left: right}) => Right.from(right),
      Right: ({right: left}) => Left.from(left),
      Both: ({left: right, right: left}) => Both.from(left, right),
    }),
  )

export const zipArraysWith = <A, B, R>(
  left: A[],
  right: B[],
  f: (ab: These<A, B>) => R,
): R[] => {
  const cropped: R[] = Array.zipWith(left, right, flow(Both.from, f)),
    delta = left.length - right.length

  return [
    ...cropped,
    ...(delta === 0
      ? []
      : delta > 0
        ? pipe(
            left,
            Array.takeRight(delta),
            Array.map(flow(Left.from<A, B>, f)),
          )
        : pipe(
            right,
            Array.takeRight(-1 * delta),
            Array.map(flow(Right.from<A, B>, f)),
          )),
  ]
}

/**
 * Zip a pair of arrays. In case of arrays that are not of equal size, we do not
 * _crop_ as the default `Array.zip` does. Instead we wrap the results in a
 * {@link These}, which gives us an operation that is pleasantly associative, as
 * well as reversible with no loss of information via `unzipArray`.
 *
 * If the _left_ array is longer, the result will end in one or more `Left<A,B>`.
 *
 * If the _right_ array is longer, the result will end in one or more `Right<A,B>`.
 *
 * If they are both of equal size, all elements will be of type `Both<A,B>`.
 */
export const zipArrays: {
  <A, B>(left: A[], right: B[]): These<A, B>[]
  <B>(right: B[]): <A>(left: A[]) => These<A, B>[]
} = Function.dual(2, <A, B>(left: A[], right: B[]): These<A, B>[] =>
  zipArraysWith(left, right, identity),
)

/**
 * Unzip a list of `These` into two arrays of possibly different size.
 * The inverse of {@link zipArrays} in the sense that
 * `flow(zipArrays, unzipArray)` is identity.
 */
export const unzipArray = <A, B>(
  self: These<A, B>[],
): [left: A[], right: B[]] =>
  pipe(
    self,
    Array.map(pad),
    fanout(
      flow(
        Array.filter(([leftOption]) => isSome(leftOption)),
        Array.map(([left]) => (left as Some<A>).value),
      ),

      flow(
        Array.filter(([, rightOption]) => isSome(rightOption)),
        Array.map(([, right]) => (right as Some<B>).value),
      ),
    ),
  )

/**
 * Use the given `Semigroup` instance to join the part/parts of the datatype
 * into a single* value.
 */
export const join = <A>(S: Semigroup<A>) =>
  match<A, A, A>({
    Left: ({left}) => left,
    Right: ({right}) => right,
    Both: ({left, right}) => S.combine(left, right),
  })
