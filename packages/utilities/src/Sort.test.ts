import {topologicalSort} from './Sort.js'

describe('topological sort', () => {
  test('A→B, B→C', () => {
    expect(
      topologicalSort([
        ['A', ['B']],
        ['B', ['C']],
        ['C', []],
      ]),
    ).toEqual(['C', 'B', 'A'])
  })

  test('A→B, A→C, C→D', () => {
    expect(
      topologicalSort([
        ['A', ['B', 'C']],
        ['B', []],
        ['C', ['D']],
        ['D', []],
      ]),
    ).toEqual(['D', 'C', 'B', 'A'])
  })
})
