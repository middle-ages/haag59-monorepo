import {Array, HashMap, pipe} from 'effect'
import {Graph, Node} from 'fast-graph'
import {pluck} from './Record.js'

/**
 * Sort a list of `[string, string[]]` pairs so that every name appears _after_
 * its dependencies.
 */
export const topologicalSort = (
  reverseDependencies: (readonly [string, string[]])[],
): string[] => {
  const nameToNode: HashMap.HashMap<string, Node<undefined>> = pipe(
    reverseDependencies,
    Array.map(([name]) => [name, new Node(name, undefined)] as const),
    HashMap.fromIterable,
  )

  const graph = new Graph()
  for (const [name] of reverseDependencies) {
    graph.addNode(HashMap.unsafeGet(nameToNode, name))
  }

  for (const [name, dependents] of reverseDependencies) {
    const node = HashMap.unsafeGet(nameToNode, name)
    for (const dependent of dependents) {
      graph.addEdge(node, HashMap.unsafeGet(nameToNode, dependent))
    }
  }

  return pipe(
    graph.kahnTopologicalSort(),
    Array.map(pluck('id')),
    Array.reverse,
  )
}
