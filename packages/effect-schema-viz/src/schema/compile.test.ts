import {Struct} from '#annotations'
import {Node, PropertySignature, Reference} from '#model'
import {Schema} from 'utilities'
import {compileStruct} from './compile.js'

const Foo = Struct.named('Foo')({foo: Schema.Literal('Foo')})

const Bar = Struct.named('Bar')({
  foo: Foo,
  bar: Schema.optionalWith(Schema.Literal('Bar'), {exact: true}),
})

describe('compile', () => {
  test('struct of literal', () => {
    expect(compileStruct(Foo)).toEqual(
      Node('Foo', [
        PropertySignature({
          name: 'foo',
          reference: Reference.Primitive('"Foo"'),
        }),
      ]),
    )
  })

  test('struct with dependencies', () => {
    expect(compileStruct(Bar)).toEqual(
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
    )
  })
})
