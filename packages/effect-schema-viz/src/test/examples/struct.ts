#!/usr/bin/env tsx

import {Schema, pipe} from 'effect'
import {schemasToDot, setIdentifier} from 'effect-schema-viz'

// We must set an identifier on a schema before using it.
const Foo = pipe({foo: Schema.String}, Schema.Struct, setIdentifier('Foo'))

const Bar = pipe({bar: Foo}, Schema.Struct, setIdentifier('Bar'))

const dot = schemasToDot('basic struct example')([Foo, Bar])

console.log(dot)
