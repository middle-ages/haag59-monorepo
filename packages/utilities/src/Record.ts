import {Record, pipe} from 'effect'
import {isDefined} from './Any.js'

export * from 'effect/Record'

/**
 * The object with the keys `keys` and all its values set to `value`
 */
export const monoRecord =
  <const V>(value: V) =>
  <const KS extends readonly [string, ...string[]]>(
    ...keys: KS
  ): Record<KS[number], V> => {
    const result = {} as Record<KS[number], V>
    for (const key of keys) {
      result[key as KS[number]] = value
    }
    return result
  }

/** A curried version of `Record.singleton` */
export const withKey =
  <const K extends string>(k: K) =>
  <V>(v: V) =>
    ({[k]: v}) as Record<K, V>

/** Pluck the value associated with a key from a record. */
export const pluck =
  <const K extends string>(key: K) =>
  <T extends {[L in K]: T[L]}>(o: T): T[K] =>
    o[key]

/**
 * Just like `pluck` but takes the object type as type parameter on an empty
 * first argument list.
 */
export const pluckOf =
  <T>() =>
  <const K extends keyof T>(key: K) =>
  (o: T): T[K] =>
    o[key]

/** Filter record entries so that only defined entries remain. */
export const filterDefined = <const Key extends PropertyKey, Value extends {}>(
  record: Partial<Record<Key, Value | undefined>>,
) => pipe(record, Record.filter(isDefined)) as Partial<Record<Key, Value>>
