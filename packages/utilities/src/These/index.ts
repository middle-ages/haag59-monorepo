import {Function, HKT, pipe} from 'effect'
import {taggedEnum, type TaggedEnum} from 'effect/Data'

export type LeftOrRight<ST extends 'left' | 'right', A> = Record<ST, A>

export type These<A, B> = TaggedEnum<{
  Left: LeftOrRight<'left', A>
  Right: LeftOrRight<'right', B>
  Both: LeftOrRight<'left', A> & LeftOrRight<'right', B>
}>

export type Left<A, B> = TaggedEnum.Value<These<A, B>, 'Left'>
export type Right<A, B> = TaggedEnum.Value<These<A, B>, 'Right'>
export type Both<A, B> = TaggedEnum.Value<These<A, B>, 'Both'>

export interface TheseDefinition extends TaggedEnum.WithGenerics<2> {
  readonly taggedEnum: These<this['A'], this['B']>
}

/** `Kind<TheseTypeLambda, never, unknown, B, A> = These<A, B>` */
export interface TheseTypeLambda extends HKT.TypeLambda {
  readonly type: These<this['Target'], this['Out1']>
}

export const {
  $is: isTheseOf,
  $match,
  Left: _Left,
  Right: _Right,
  Both: _Both,
} = taggedEnum<TheseDefinition>()

export const match =
  <A, B, R>({
    Left: onLeft,
    Right: onRight,
    Both: onBoth,
  }: {
    Left: (left: Left<A, B>) => R
    Right: (right: Right<A, B>) => R
    Both: (both: Both<A, B>) => R
  }) =>
  (self: These<A, B>) =>
    pipe(
      self,
      $match({
        Left: (left: Left<A, B>): R => onLeft(left),
        Right: (right: Right<A, B>): R => onRight(right),
        Both: (both: Both<A, B>): R => onBoth(both),
      }),
    )

export const [Left, Right, Both] = [
  Object.assign(_Left, {
    from: <A, B>(left: A): These<A, B> => Left({left}),
  }),
  Object.assign(_Right, {
    from: <A, B>(right: B): These<A, B> => Right({right}),
  }),
  Object.assign(_Both, {
    from: <A, B>(left: A, right: B): These<A, B> => Both({left, right}),
  }),
]

export const [isLeft, isRight, isBoth] = [
  isTheseOf('Left'),
  isTheseOf('Right'),
  isTheseOf('Both'),
]

export const setLeft: {
    <A, B, C>(self: These<A, B>, c: C): These<C, B>
    <C>(c: C): <A, B>(self: These<A, B>) => These<C, B>
  } = Function.dual(
    2,
    <A, B, C>(self: These<A, B>, c: C): These<C, B> =>
      pipe(
        self,
        match<A, B, These<C, B>>({
          Left: () => Left.from(c),
          Right: ({right}) => Both.from(c, right),
          Both: ({right}) => Both.from(c, right),
        }),
      ),
  ),
  setRight: {
    <A, B, C>(self: These<A, B>, c: C): These<A, C>
    <C>(c: C): <A, B>(self: These<A, B>) => These<A, C>
  } = Function.dual(
    2,
    <A, B, C>(self: These<A, B>, c: C): These<A, C> =>
      pipe(
        self,
        match<A, B, These<A, C>>({
          Left: ({left}) => Both.from(left, c),
          Right: () => Right.from(c),
          Both: ({left}) => Both.from(left, c),
        }),
      ),
  )
