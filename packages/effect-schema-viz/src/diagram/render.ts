import {Array, flow, pipe} from 'effect'
import {
  digraph,
  toDot,
  type GraphAttributesObject,
  type RootGraphModel,
} from 'ts-graphviz'
import {Node, type Signature} from './model.js'
import {surround, unlines} from 'utilities/String'

/** Add the given nodes and their edges to the given graph. */
export const addNodes =
  /** Graph that will get the new nodes and edges. */
  (graph: RootGraphModel) =>
    /** Nodes to add. */
    (nodes: Node[]): RootGraphModel => {
      // Add nodes.
      for (const node of nodes) {
        const {name, nodeOptions = {}} = node
        const {label, ...rest} = nodeOptions

        graph.node(name, {
          label: label ?? pipe(node, buildLabel, surround.angledBrackets),
          ...rest,
        })
      }

      // Add edges.
      for (const node of nodes) {
        const targets = Node.collectTargets(node)
        const {edgeOptions = {}} = node
        if (Array.isNonEmptyArray(targets)) {
          for (const target of targets) {
            graph.edge([node.name, target], edgeOptions)
          }
        }
      }

      return graph
    }

/** Create a new graph made up of the given nodes. */
export const graphNodes = (
  /** Graph name. */
  name: string,

  /** Graphviz graph attributes. */
  graphAttributes?: GraphAttributesObject,
): ((nodes: Node[]) => RootGraphModel) =>
  pipe(digraph(name, graphAttributes), addNodes)

/** Create a new graph from the given nodes and render it to `dot` format. */
export const renderNodes = (
  /** Graph name. */
  name: string,

  /** Graphviz graph attributes. */
  graphAttributes?: GraphAttributesObject,
): ((nodes: Node[]) => string) => flow(graphNodes(name, graphAttributes), toDot)

const buildLabel = ({
  name,
  signatures,
}: Node): string => `<table border="0" cellborder="0" cellspacing="4">
<tr><td colspan="2" border="1" sides="b">${name}</td></tr>
${pipe(signatures, Array.map(buildSignatureRow), unlines)}
</table>`

const buildSignatureRow = ({name, reference}: Signature) => `<tr>
<td border="0" cellpadding="1" align="left">${name.toString()}:</td>
<td border="0" cellpadding="1" align="left">${reference.display}</td>
</tr>`
