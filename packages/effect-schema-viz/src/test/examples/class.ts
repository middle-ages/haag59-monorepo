#!/usr/bin/env tsx

import {Schema} from 'effect'
import {schemasToDot} from 'effect-schema-viz'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.String,
}) {}

class Family extends Schema.Class<Person>('Family')({
  id: Schema.Number,
  people: Schema.Array(Person),
}) {}

const dot = schemasToDot('basic class example')(Person, Family)

console.log(dot)
