import TreePack, { GenericArrayTree, GenericObjectTree } from '~/index'

describe('ForEach through tree', () => {
  it('can traverse through a tree', () => {
    const simpleArrayTree = [
      {
        value: 24,
        children: []
      },
      {
        value: 77,
        children: [
          {
            value: 99
          }
        ]
      }
    ]

    const treeItems: [GenericObjectTree, number[], GenericArrayTree][] = []

    TreePack.forEach(simpleArrayTree, 'children', (node, path, arr) =>
      treeItems.push([node, path, arr])
    )

    expect(treeItems).toEqual([
      [simpleArrayTree[0], [0], simpleArrayTree],
      [simpleArrayTree[1], [1], simpleArrayTree],
      [simpleArrayTree[1].children[0], [1, 0], simpleArrayTree[1].children]
    ])
  })
})
