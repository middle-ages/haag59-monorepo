import {Schema} from 'effect'
import {compileClass, compileClassAst} from './class.js'

describe('class', () => {
  class Person extends Schema.Class<Person>('Person')({
    id: Schema.Number,
    name: Schema.String,
  }) {}

  console.log(Person.prototype)

  console.log(compileClassAst(Person.ast))

  test('basic', () => {
    expect(1 + 1).toBe(2)
  })
})
