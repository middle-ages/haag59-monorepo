import {compileStruct, type AnyStructs} from '#compile'
import {addNodes} from '#render'
import {Array, pipe} from 'effect'
import {
  digraph,
  toDot,
  type GraphAttributesObject,
  type RootGraphModel,
} from 'ts-graphviz'

/**
 * Compile the given Effect/Schema structs and add them to the given graph.
 * @param graph - The [graphviz-ts graph object](https://ts-graphviz.github.io/ts-graphviz/interfaces/_ts_graphviz_common.RootGraphModel.html).
 * @returns The given graph but with the structs compiled and added as nodes.
 */
export const addStructs =
  (graph: RootGraphModel) =>
  /** Array of `Effect/Schema` struct to add to graph. */
  (structs: AnyStructs): RootGraphModel =>
    pipe(structs, Array.map(compileStruct), addNodes(graph))

/**
 * Compile the given Effect/Schema structs and add them to a new graph.
 * @param name - Graph name.
 * @param options - Optional [Graphviz graph attributes](https://graphviz.org/docs/graph).
 * @returns A new graph that includes the given structs.
 */
export const structsToGraph =
  (name: string, options: GraphAttributesObject = {}) =>
  /** Array of `Effect/Schema` struct to add to graph. */
  (structs: AnyStructs): RootGraphModel =>
    addStructs(digraph(name, options))(structs)

/**
 * Compile the given Effect/Schema structs and render them to Graphviz dot
 * format.
 * @param name - Graph name.
 * @param options - Optional [Graphviz graph attributes](https://graphviz.org/docs/graph).
 * @returns The contents of a `.dot` file suitable for processing by `Graphviz` in a string.
 */
export const structsToDot =
  (name: string, options: GraphAttributesObject = {}) =>
  /** List of `Effect/Schema` struct to add to graph. */
  (...structs: AnyStructs): string =>
    pipe(structs, structsToGraph(name, options), toDot)
