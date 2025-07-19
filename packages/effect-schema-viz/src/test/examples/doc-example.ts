#!/usr/bin/env tsx

import {Schema, pipe} from 'effect'
import {setIdentifier, schemasToDot} from 'effect-schema-viz'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.String,
}) {}

const Family = pipe(
  {name: Schema.String, people: Schema.Array(Person)},
  Schema.Struct,
  // Unlike classes, anonymous structs must be identified
  setIdentifier('Family'),
)

const dot = schemasToDot('example')(Person, Family)

console.log(dot)
