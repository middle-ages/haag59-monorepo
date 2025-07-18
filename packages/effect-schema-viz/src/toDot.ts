import {
  compileObjectType,
  compileObjectTypes,
  CompileResult,
  type AnyClass,
  type AnyClassOf,
  type AnyObjectType,
  type AnyObjectTypes,
  type ObjectType,
} from '#compile'
import {addNode, addNodes} from '#render'
import {Array, Either, pipe, Tuple, type Schema, type SchemaAST} from 'effect'
import {
  digraph,
  toDot,
  type GraphAttributesObject,
  type RootGraphModel,
} from 'ts-graphviz'
import type {AllSchema} from 'utilities/Schema'

/**
 * These.Compile the given Effect/Schema object type, struct or class, and add
 * it to the given graph.
 * @param graph - The [graphviz-ts graph object](https://ts-graphviz.github.io/ts-graphviz/interfaces/_ts_graphviz_common.RootGraphModel.html).
 * @returns the updated graph or else an error message describing what went wrong.
 */
export const addObjectType =
  (graph: RootGraphModel) =>
  /** Schema `Struct` or `Class` to add to the graph. */
  <Self, Fields extends Schema.Struct.Fields>(
    objectType: ObjectType<Self, Fields>,
  ): Either.Either<RootGraphModel, CompileResult.Error> =>
    pipe(objectType, compileObjectType, Either.map(addNode(graph)))

/**
 * Compile the given Effect/Schema object types and add them to the given graph.
 * @param graph - The [graphviz-ts graph object](https://ts-graphviz.github.io/ts-graphviz/interfaces/_ts_graphviz_common.RootGraphModel.html).
 * @returns The given graph but with the structs compiled and added as nodes.
 * For every node that was _not_ added, the cause should appear in the returned
 * list of errors.
 */
export const addObjectTypes =
  (graph: RootGraphModel) =>
  /**
   * Array of `Effect/Schema` object types, structs or classes, that will be
   * added to the graph.
   */
  <ObjectTypes extends AnyObjectTypes>(
    schemas: ObjectTypes,
  ): [graph: RootGraphModel, errors: readonly CompileResult.Error[]] =>
    pipe(
      schemas,
      compileObjectTypes,
      CompileResult.partition,
      Tuple.mapFirst(addNodes(graph)),
    )

/**
 * Compile the given Effect/Schema object types and add them to a new graph.
 * @param name - Graph name.
 * @param options - Optional [Graphviz graph attributes](https://graphviz.org/docs/graph).
 * @returns A new graph that includes the given structs. For every node that was
 * _not_ added, the cause should appear in the returned list of errors.
 */
export const graphObjectTypes =
  (name: string, options: GraphAttributesObject = {}) =>
  /** Array of `Effect/Schema` struct to add to graph. */
  <ObjectTypes extends AnyObjectTypes>(
    schemas: ObjectTypes,
  ): [graph: RootGraphModel, errors: readonly CompileResult.Error[]] =>
    addObjectTypes(digraph(name, options))(schemas)

/**
 * Compile the given Effect/Schema object types and render them to Graphviz dot
 * format. Every object type that failed to compile will be rendered as an error
 * box.
 * @param name - Graph name.
 * @param options - Optional [Graphviz graph attributes](https://graphviz.org/docs/graph).
 * @returns The contents of a `.dot` file suitable for processing by `Graphviz` in a string.
 */
export const objectTypesToDot =
  /** List of `Effect/Schema` object types, structs or classes, to add to graph. */
  (name: string, options: GraphAttributesObject = {}) =>
    <ObjectTypes extends AnyObjectTypes>(schemas: ObjectTypes): string => {
      const [graph, errorNodes] = pipe(
        schemas,
        graphObjectTypes(name, options),
        Tuple.mapSecond(Array.map(CompileResult.asNode)),
      )
      return pipe(errorNodes, addNodes(graph), toDot)
    }
