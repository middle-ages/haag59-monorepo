import {Option, Schema} from 'effect'
import {getAnnotation, type AST} from 'effect/SchemaAST'
import type {NodeAttributesObject} from 'ts-graphviz'

/** Annotates nodes with their Graphviz options. */
export const NodeOptions = Symbol.for('effect-schema-viz/node-options')

declare module 'effect/Schema' {
  namespace Annotations {
    interface GenericSchema<A> extends Schema<A> {
      [NodeOptions]?: NodeAttributesObject
    }
  }
}

/**
 * Set Graphviz [node options](https://graphviz.org/docs/nodes/) for the node
 * annotated.
 */
export const setNodeOptions =
  (options: NodeAttributesObject) =>
  <const Fields extends Schema.Struct.Fields>(
    schema: Schema.Struct<Fields>,
  ): typeof schema =>
    schema.annotations({[NodeOptions]: options})

/**
 * Set Graphviz [node options](https://graphviz.org/docs/nodes/) used for the
 * node annotated.
 */
export const getNodeOptions: (ast: AST) => Option.Option<NodeAttributesObject> =
  getAnnotation<NodeAttributesObject>(NodeOptions)
