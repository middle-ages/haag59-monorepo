import {NodeContext} from '@effect/platform-node'
import {Effect, Logger, type Layer} from 'effect'

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
