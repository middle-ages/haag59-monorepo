import {flow, Effect, pipe} from 'effect'

/** Tap and log and a static message. */
export const tapLog =
  (message: string) =>
  <A, E, R>(self: Effect.Effect<A, E, R>): typeof self =>
    pipe(
      self,
      Effect.tap(() => Effect.log(message)),
    )

/**
 * Tap and log and the message returned by the given function when given the
 * tapped data.
 */
export const tapLogWith = <A>(
  buildMessage: (a: A) => string,
): (<E, R>(self: Effect.Effect<A, E, R>) => typeof self) =>
  Effect.tap(flow(buildMessage, Effect.log))
