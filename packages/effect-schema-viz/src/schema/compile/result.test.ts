import {Node} from '#model'
import {Array, Option, Either, Schema, pipe} from 'effect'
import {notAClassTransform} from './class.js'
import {combine} from './result.js'
import {unexpectedAst} from './struct.js'
import {These} from 'utilities'
import {pluck} from 'utilities/Record'

describe('result', () => {
  describe('combine', () => {
    const ast = Schema.Number.ast

    const nodes = [Node('Foo', []), Node('Bar', [])] as const
    const errors = [unexpectedAst(ast), notAClassTransform(ast)] as const

    const [foo, bar] = nodes
    const [error1, error2] = errors

    const actual = combine([
      error1,
      Either.right(foo),
      error2,
      Either.right(bar),
    ])

    test('nodes', () => {
      expect(These.rightOption(actual)).toEqual(Option.some(nodes))
    })

    test('nodes', () => {
      const actualTags = pipe(
        actual,
        These.leftOption,
        Option.map(Array.map(pluck('_tag'))),
        Option.toArray,
        Array.flatten,
      )

      expect(actualTags).toEqual(['UnexpectedAst', 'NotAClassTransform'])
    })
  })
})
