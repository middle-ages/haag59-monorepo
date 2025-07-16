import {it} from '@effect/vitest'
import {Effect, pipe} from 'effect'
import {testLogger} from 'utilities/Test'
import {suffix} from './String.js'
import {tapLog, tapLogWith} from './Tap.js'

const buildLogger = () => {
  const {messages, layer} = testLogger()
  return {
    testLog: (name: string, expected: string[]) => {
      test(name, () => {
        expect(messages).toEqual([expected])
      })
    },
    layer,
  }
}

describe('Tap', () => {
  describe('tapLog', () => {
    const {testLog, layer} = buildLogger()

    it.effect('program', () =>
      Effect.gen(function* () {
        const result = yield* pipe(Effect.succeed('foo'), tapLog('bar'))
        expect(result).toBe('foo')
      }).pipe(Effect.provide(layer)),
    )

    testLog('logging', ['bar'])
  })

  describe('tapLogWith', () => {
    const {testLog, layer} = buildLogger()

    it.effect('program', () =>
      Effect.gen(function* () {
        const result = yield* pipe(
          Effect.succeed('foo'),
          pipe('bar', suffix, tapLogWith),
        )
        expect(result).toBe('foo')
      }).pipe(Effect.provide(layer)),
    )

    testLog('logging', ['foobar'])
  })
})
