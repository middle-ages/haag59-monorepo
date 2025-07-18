#!/usr/bin/env tsx

import {Schema, pipe} from 'effect'
import {objectTypesToDot, setIdentifier} from 'effect-schema-viz'

// We must set an identifier on a schema before using it.
const Foo = pipe({foo: Schema.String}, Schema.Struct, setIdentifier('Foo'))

const Bar = pipe({bar: Foo}, Schema.Struct, setIdentifier('Bar'))

const dot = objectTypesToDot('basic example')([Foo, Bar])

console.log(dot)
