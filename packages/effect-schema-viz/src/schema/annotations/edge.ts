import type {AnyClass, ObjectType} from '#compile'
import {Option, Schema} from 'effect'
import {getAnnotation, type AST} from 'effect/SchemaAST'
import type {EdgeAttributesObject} from 'ts-graphviz'

/** Annotates nodes with edge attributes for their _outgoing_ edges. */
export const EdgeAttributes = Symbol.for('effect-schema-viz/edge-attributes')

declare module 'effect/Schema' {
  namespace Annotations {
    interface GenericSchema<A> extends Schema<A> {
      [EdgeAttributes]?: EdgeAttributesObject
    }
  }
}

/**
 * Set Graphviz [edge attributes](https://graphviz.org/docs/edges/) for all
 * edges _outgoing_ from the node annotated.
 */
export const setEdgeAttributes =
  (attributes: EdgeAttributesObject) =>
  <Self extends AnyClass, Fields extends Schema.Struct.Fields>(
    schema: ObjectType<Self, Fields>,
  ) =>
    schema.annotations({[EdgeAttributes]: attributes})

/**
 * Get Graphviz [edge attributes](https://graphviz.org/docs/edges/) used for all
 * edges _outgoing_ from the node annotated.
 */
export const getEdgeAttributes: (
  ast: AST,
) => Option.Option<EdgeAttributesObject> =
  getAnnotation<EdgeAttributesObject>(EdgeAttributes)
