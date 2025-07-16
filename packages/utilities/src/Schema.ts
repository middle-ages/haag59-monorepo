import {type Annotable, Literal, transform} from 'effect/Schema'
import {invert, typedKeys} from './Object.js'

export * from 'effect/Schema'

/**
 * A type constraint for generic functions accepting schemas. All schemas extend
 * `AllSchema`.
 */
export type AllSchema = Annotable.All

/**
 * A literal union schema, that is built from the values of the given object.
 * It encodes into a literal union schema built from its keys.
 */
export const mappedLiteralUnion = <
  const Key extends string,
  const Value extends string,
>(
  map: Record<Key, Value>,
) => {
  const inverted = invert(map)

  const [invertedKeys, originalKeys] = [
    typedKeys.nonEmpty(inverted),
    typedKeys.nonEmpty(map),
  ]

  return transform(Literal(...invertedKeys), Literal(...originalKeys), {
    strict: true,
    decode: (code: Value): Key => inverted[code] as Key,
    encode: (name: Key): Value => map[name],
  })
}
