import {Struct} from '#annotations'
import {Node, PropertySignature, Reference} from '#model'
import {Schema} from 'utilities'
import {compileStructAst} from './struct.js'
import {Either} from 'effect'

const Foo = Struct.named('Foo')({foo: Schema.Literal('Foo')})

const Bar = Struct.named('Bar')({
  foo: Foo,
  bar: Schema.optionalWith(Schema.Literal('Bar'), {exact: true}),
})

describe('compile', () => {
  test('struct of literal', () => {
    expect(compileStructAst(Foo.ast)).toEqual(
      Either.right(
        Node('Foo', [
          PropertySignature({
            name: 'foo',
            reference: Reference.Primitive('"Foo"'),
          }),
        ]),
      ),
    )
  })

  test('struct with dependencies', () => {
    expect(compileStructAst(Bar.ast)).toEqual(
      Either.right(
        Node('Bar', [
          PropertySignature({
            name: 'foo',
            reference: Reference.Node('Foo'),
          }),
          PropertySignature({
            name: 'bar',
            reference: Reference.Primitive('"Bar"?'),
          }),
        ]),
      ),
    )
  })
})
