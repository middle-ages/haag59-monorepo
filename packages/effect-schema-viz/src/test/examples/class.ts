#!/usr/bin/env tsx

import {Array, Schema, pipe} from 'effect'
import {
  type AnyClassOf,
  type AnyObjectType,
  type AnyObjectTypes,
  type ObjectType,
  objectTypesToDot,
  setIdentifier,
} from 'effect-schema-viz'
import type {an} from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js'
import type {AnyClass} from '../../schema/compile.js'
import type {Simplify} from 'effect/Types'
import type {M} from 'vitest/dist/chunks/environment.d.cL3nLXbE.js'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.String,
}) {}

const xs: Array.NonEmptyReadonlyArray<typeof Person> = [Person] as const
const aa: AnyClassOf<
  AnyClass,
  {
    id: typeof Schema.Number
    name: typeof Schema.String
  }
> = Person
type X = Simplify<typeof Person>
const ys: Array.NonEmptyReadonlyArray<
  AnyClassOf<
    typeof Person,
    {
      id: typeof Schema.Number
      name: typeof Schema.String
    }
  >
> = [Person]

type tttt = typeof Person.Type
type ttttv = typeof Person.Encoded
type ad = typeof Person.Encoded

const zzz: AnyClassOf<any, > = Person

const zz2z: ObjectType<
  {new (arg: any): any},
  {
    id: typeof Schema.Number
    name: typeof Schema.String
  }
> = Person

const dota = Person as AnyClassOf<
  typeof Person,
  {
    id: typeof Schema.Number
    name: typeof Schema.String
  }
>

console.log(dot)

const dot = objectTypesToDot('basic example')([Person] as AnyClassOf<
  typeof Person,
  {
    id: typeof Schema.Number
    name: typeof Schema.String
  }
>[])
