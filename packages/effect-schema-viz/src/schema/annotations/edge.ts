import {Option, Schema} from 'effect'
import {getAnnotation, type AST} from 'effect/SchemaAST'
import type {EdgeAttributesObject} from 'ts-graphviz'

/** Annotates nodes with edge options for their _outgoing_ edges. */
export const EdgeOptions = Symbol.for('effect-schema-viz/edge-options')

declare module 'effect/Schema' {
  namespace Annotations {
    interface GenericSchema<A> extends Schema<A> {
      [EdgeOptions]?: EdgeAttributesObject
    }
  }
}

/**
 * Set Graphviz [edge options](https://graphviz.org/docs/edges/) for all edges
 * _outgoing_ from the node annotated.
 */
export const setEdgeOptions =
  (options: EdgeAttributesObject) =>
  <const Fields extends Schema.Struct.Fields>(
    schema: Schema.Struct<Fields>,
  ): typeof schema =>
    schema.annotations({[EdgeOptions]: options})

/**
 * Get Graphviz [edge options](https://graphviz.org/docs/edges/) used for all
 * edges _outgoing_ from the node annotated.
 */
export const getEdgeOptions: (ast: AST) => Option.Option<EdgeAttributesObject> =
  getAnnotation<EdgeAttributesObject>(EdgeOptions)
