import {ClassNode, PropertySignature, Reference} from '#model'
import {Either, Schema} from 'effect'
import {compileClassAst} from './class.js'

describe('class', () => {
  class Person extends Schema.Class<Person>('Person')({
    id: Schema.Number,
    name: Schema.String,
  }) {}

  test('basic', () => {
    expect(compileClassAst(Person.ast)).toEqual(
      Either.right(
        ClassNode('Person', [
          PropertySignature({
            name: 'id',
            reference: Reference.Primitive('number'),
          }),
          PropertySignature({
            name: 'name',
            reference: Reference.Primitive('string'),
          }),
        ]),
      ),
    )
  })
})
