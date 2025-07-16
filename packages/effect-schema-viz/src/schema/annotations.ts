import {Option, Schema} from 'effect'
import {constant, flow, pipe} from 'effect/Function'
import {
  getIdentifierAnnotation,
  type AST,
  type TypeLiteral,
} from 'effect/SchemaAST'
import type {EdgeAttributesObject, NodeAttributesObject} from 'ts-graphviz'
import {fanout} from 'utilities/Pair'
import {getEdgeOptions, setEdgeOptions} from './annotations/edge.js'
import {getNodeOptions, setNodeOptions} from './annotations/node.js'

export * from './annotations/edge.js'
export * from './annotations/node.js'

/**
 * Extract a display and a target from the annotations of a type literal.
 *
 * If it is has an identifier annotation, we deduce this is a named type and
 * return its name as both the display name and the target.
 *
 * If not, we return the serialized AST as a display and no target.
 */
export const getIdentifierOrSerialize: (
  ast: TypeLiteral,
) => [display: string, targets: readonly string[]] = ast =>
  pipe(
    ast,
    getIdentifierAnnotation,
    Option.map<string, [string, string[]]>(id => [id, [id]]),
    Option.getOrElse<[string, string[]]>(() => [ast.toString(), []]),
  )

export const getIdentifierOrAnonymous: (ast: TypeLiteral) => string = flow(
  getIdentifierAnnotation,
  Option.getOrElse(constant('Anonymous')),
)

/**
 * Annotate the given `Schema.Struct` with the given identifier.
 * @param identifier - unique string ID.
 * @returns same schema as given, except now annotated.
 */
export const setIdentifier =
  (identifier: string) =>
  <Fields extends Schema.Struct.Fields>(
    /** The schema to annotate. */
    schema: Schema.Struct<Fields>,
  ): typeof schema =>
    schema.annotations({identifier})

/** Extract the `effect-schema-viz` options from given AST annotations. */
export const getOptions: (
  ast: AST,
) => readonly [NodeAttributesObject, EdgeAttributesObject] = fanout(
  flow(
    getNodeOptions,
    Option.getOrElse(() => ({}) as NodeAttributesObject),
  ),
  flow(
    getEdgeOptions,
    Option.getOrElse(() => ({}) as EdgeAttributesObject),
  ),
)

/**
 * Just like [Effect/Schema/Struct](https://effect.website/docs/schema/basic-usage/#structs)
 * except has two extra functions under the `named` and `styled` keys. These are
 * syntax sugar for creating a struct and adding the identifier and Graphviz
 * options manually.
 *
 * 1. `named` - takes as an extra 1st parameter the name of the object type.
 * 1. `styles` - takes as an extra 1st parameter the name of the object type, and optional parameters for node and edge GraphViz attributes.
 */
export const Struct = Object.assign(Schema.Struct, {
  named:
    (identifier: string) =>
    <Fields extends Schema.Struct.Fields>(
      fields: Fields,
    ): Schema.Struct<Fields> =>
      setIdentifier(identifier)(Schema.Struct(fields)),

  styled:
    (
      identifier: string,
      nodeOptions: NodeAttributesObject,
      edgeOptions: EdgeAttributesObject = {},
    ) =>
    <Fields extends Schema.Struct.Fields>(
      fields: Fields,
    ): Schema.Struct<Fields> =>
      pipe(
        Schema.Struct(fields),
        setIdentifier(identifier),
        setNodeOptions(nodeOptions),
        setEdgeOptions(edgeOptions),
      ),
})
