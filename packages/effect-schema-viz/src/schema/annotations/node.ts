import type {AnyClass, ObjectType} from '#compile'
import {Option, Schema} from 'effect'
import {getAnnotation, type AST} from 'effect/SchemaAST'
import type {NodeAttributesObject} from 'ts-graphviz'

/** Annotates nodes with their Graphviz node attributes. */
export const NodeAttributes = Symbol.for('effect-schema-viz/node-attributes')

declare module 'effect/Schema' {
  namespace Annotations {
    interface GenericSchema<A> extends Schema<A> {
      [NodeAttributes]?: NodeAttributesObject
    }
  }
}

/**
 * Set Graphviz [node attributes](https://graphviz.org/docs/nodes/) for the node
 * annotated.
 */
export const setNodeAttributes =
  (attributes: NodeAttributesObject) =>
  <Self extends AnyClass, Fields extends Schema.Struct.Fields>(
    schema: ObjectType<Self, Fields>,
  ) =>
    schema.annotations({[NodeAttributes]: attributes})

/**
 * Set Graphviz [node attributes](https://graphviz.org/docs/nodes/) used for the
 * node annotated.
 */
export const getNodeAttributes: (
  ast: AST,
) => Option.Option<NodeAttributesObject> =
  getAnnotation<NodeAttributesObject>(NodeAttributes)
