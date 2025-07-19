#!/usr/bin/env tsx

import {pipe, Array, Schema} from 'effect'
import {setNodeAttributes, schemasToDot} from 'effect-schema-viz'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.String,
}) {}

class Family extends Schema.Class<Person>('Family')({
  id: Schema.Number,
  people: Schema.Array(Person),
}) {}

const styled = pipe(
  [Person, Family],
  Array.map(
    setNodeAttributes({
      shape: 'box',
    }),
  ),
)

const dot = schemasToDot('basic class example')(Person, Family)

console.log(dot)
