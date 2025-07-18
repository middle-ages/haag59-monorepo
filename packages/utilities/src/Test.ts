import {NodeContext} from '@effect/platform-node'
import {Effect, Logger, type Layer} from 'effect'
import {tinyArray} from 'effect-ts-laws'
import fc from 'fast-check'
import * as These from './These.js'

export const inNodeContext = Effect.provide(NodeContext.layer)

export const testLogger = <Message = string>(): {
  messages: Message[]
  layer: Layer.Layer<never>
} => {
  const messages: Message[] = []

  return {
    messages,

    layer: Logger.replace(
      Logger.defaultLogger,
      Logger.make(({message}) => {
        messages.push(message as Message)
      }),
    ),
  }
}

export const getTheseArbitrary =
  <E>(e: fc.Arbitrary<E>) =>
  <R>(r: fc.Arbitrary<R>): fc.Arbitrary<These.These<R, E>> =>
    fc.oneof(
      r.map(right => These.Right<R, E>({right})),
      e.map(left => These.Left<R, E>({left})),
      r.chain(right => e.map(left => These.Both<R, E>({left, right}))),
    )

/**
 * A valid array of zip result `These` will always begin with a possibly empty
 * list of `Both`, followed by a possibly empty list of either `Left` or
 * `Right`,
 * but never a mix.
 */
export const getZipResultsArbitrary =
  <E>(e: fc.Arbitrary<E>) =>
  <R>(r: fc.Arbitrary<R>) => {
    const init: fc.Arbitrary<These.Both<R, E>[]> = tinyArray(
      r.chain(right =>
        e.map<These.Both<R, E>>(left => These.Both<R, E>({left, right})),
      ),
    )

    const tail: fc.Arbitrary<These.These<R, E>[]> = fc.oneof(
      // left is longer
      tinyArray(r.map<These.These<R, E>>(These.Right.from)),
      // right is longer
      tinyArray(e.map<These.These<R, E>>(These.Left.from)),
      // left.length = right.length
      fc.constant([] as These.These<R, E>[]),
    )

    return init.chain(init =>
      tail.map(tail => [...init, ...tail] as These.These<R, E>[]),
    )
  }
