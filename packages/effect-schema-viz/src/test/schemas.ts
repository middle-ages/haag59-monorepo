import {Schema} from 'effect'
import {Struct} from '#annotations'

export const Simple = Struct.styled('Simple', {label: 'Simple'})({
  name: Schema.String,
})

export const HasSimple = Struct.named('HasSimple')({
  name: Schema.String,
  simple: Simple,
})

export const Anonymous = Schema.Struct({
  foo: Schema.Literal('foo'),
})
