import {Array, Schema} from 'effect'
import {schemasToDot} from './toDot.js'
import {Struct} from '#annotations'

const testToDot = <
  Schemas extends Array.NonEmptyReadonlyArray<Schema.Annotable.Any>,
>(
  name: string,
  schemas: Schemas,
  expected: string,
) => {
  test(name, () => {
    expect(schemasToDot(name)(...schemas)).toBe(expected)
  })
}

const NamedStruct = Struct.styled('NamedStruct', {label: 'NamedStruct'})({
  name: Schema.String,
})

describe('structToDot', () => {
  testToDot(
    'NamedStruct',
    [NamedStruct],
    `digraph "NamedStruct" {\n  "NamedStruct" [\n    label = "NamedStruct";\n  ];\n}`,
  )
})
/*
export const HasSimple = Struct.named('HasSimple')({
  name: Schema.String,
  simple: Simple,
})

export const Anonymous = Schema.Struct({
  foo: Schema.Literal('foo'),
})


*/
