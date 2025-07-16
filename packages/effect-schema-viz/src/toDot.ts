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
 */
export const addStructs =
  (graph: RootGraphModel) =>
  (structs: AnyStructs): RootGraphModel =>
    pipe(structs, Array.map(compileStruct), addNodes(graph))

/**
 * Compile the given Effect/Schema structs and render them on a new graph.
 * @param name - Graph name.
 * @param options - Optional Graphviz graph attributes.
 */
export const structsToGraph =
  (name: string, options: GraphAttributesObject = {}) =>
  (structs: AnyStructs): RootGraphModel =>
    addStructs(digraph(name, options))(structs)

/**
 * Compile the given Effect/Schema structs and render them to Graphviz dot
 * format.
 * @param name - Graph name.
 * @param options - Optional Graphviz graph attributes.
 */
export const structsToDot =
  (name: string, options: GraphAttributesObject = {}) =>
  (...structs: AnyStructs): string =>
    pipe(structs, structsToGraph(name, options), toDot)
