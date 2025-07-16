#!/usr/bin/env tsx

import {structsToDot} from 'effect-schema-viz'
import {KitchenSink} from '../schemas.js'

const dot = structsToDot('Kitchen Sink', {bgcolor: 'grey75'})(KitchenSink)

console.log(dot)
