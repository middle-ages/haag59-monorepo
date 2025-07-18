#!/usr/bin/env tsx

import {Schema} from 'effect'
import {Struct, structsToDot} from 'effect-schema-viz'

const uniqueSymbolName = 'effect-schema-viz/test/schema'
const uniqueSymbol = Symbol.for(uniqueSymbolName)

enum Fruits {
  Apple,
  Banana,
  Mango,
}

export const KitchenSink = Struct.styled('KitchenSink', {
  shape: 'plain',
  style: 'filled',
  fillcolor: 'white',
  fontname: 'CMU Typewriter Text',
})({
  string: Schema.String,
  number: Schema.Number,
  boolean: Schema.Boolean,
  object: Schema.Object,
  undefined: Schema.Undefined,
  void: Schema.Void,
  any: Schema.Any,
  unknown: Schema.Unknown,
  never: Schema.Never,
  bigint: Schema.BigIntFromSelf,
  literalNumber: Schema.Literal(42),
  literalString: Schema.Literal('foo'),
  templateLiteral: Schema.TemplateLiteral('http://', Schema.String),
  uniqueSymbol: Schema.UniqueSymbolFromSelf(uniqueSymbol),
  enums: Schema.Enums(Fruits),
  literalUnion: Schema.Literal('bar', 123, 'baz'),
  pair: Schema.Tuple(Schema.String, Schema.Number),
  array: Schema.Array(Schema.Boolean),
  restTuple: Schema.Tuple([Schema.String], Schema.Number),
  tupleOptional: Schema.Tuple(
    Schema.Literal('foo'),
    Schema.optionalElement(Schema.Literal('bar')),
  ),
})

const dot = structsToDot('Kitchen Sink', {bgcolor: 'grey75'})(KitchenSink)

console.log(dot)
