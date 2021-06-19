import difference from 'lodash.difference'
import intersection from 'lodash.intersection'
import isEqual from 'lodash.isequal'
import isObject from 'lodash.isobject'
import omit from 'lodash.omit'
import set from 'lodash.set'

export type PathId = string
export type ObjectId = string | number
export type GenericTree = GenericObjectTree | GenericArrayTree
export type GenericObjectTree = Record<ObjectId, unknown>
export type GenericArrayTree = Record<ObjectId, unknown>[]
export type PackedTree = Record<PathId, Record<ObjectId, unknown>>
export type PackedTreeCompareResult = {
  addedKeys: ObjectId[]
  removedKeys: ObjectId[]
  changedKeys: ObjectId[]
}

export const TREE_PATH_SEPERATOR = '-'
export const TREE_LEAF_TERMINATOR = '|'

class TreePack {
  static pack = (tree: GenericTree, childrenKey: ObjectId) => {
    let arrayTree: GenericArrayTree = []
    if (Array.isArray(tree)) {
      arrayTree = tree as GenericArrayTree
    } else if (isObject(tree)) {
      arrayTree = [tree] as GenericArrayTree
    } else {
      throw 'Tree is not an object or array'
    }

    // Process tree
    const flatTree = {} as PackedTree

    TreePack.forEach(arrayTree, childrenKey, (node, path) => {
      const hasChildren = node[childrenKey] != null
      const childlessNode = omit(node, childrenKey)
      let pathId = path.map(String).join(TREE_PATH_SEPERATOR)

      if (!hasChildren) {
        pathId += TREE_LEAF_TERMINATOR
      }

      flatTree[pathId] = childlessNode
    })

    return flatTree
  }

  static unpack = (packedTree: PackedTree, childrenKey: ObjectId) => {
    const arrayTree = [] as GenericArrayTree

    Object.entries(packedTree).forEach(([key, node]) => {
      const isLeaf = key.slice(-1) === TREE_LEAF_TERMINATOR

      const modifiedNode = isLeaf
        ? {
            ...node
          }
        : {
            ...node,
            [childrenKey]: []
          }

      const path = (isLeaf ? key.slice(0, -1) : key)
        .split('-')
        .flatMap((x) => [x, childrenKey])
        .slice(0, -1)

      set(arrayTree, path, modifiedNode)
    })

    return arrayTree
  }

  static comparePacked = (
    originalPackedTree: PackedTree,
    newPackedTree: PackedTree
  ): PackedTreeCompareResult => {
    if (!originalPackedTree || !newPackedTree) {
      return {
        addedKeys: [],
        changedKeys: [],
        removedKeys: []
      }
    }

    const originalKeys = Object.keys(originalPackedTree)
    const newKeys = Object.keys(newPackedTree)
    const addedKeys = difference(newKeys, originalKeys)
    const removedKeys = difference(originalKeys, newKeys)
    const sameKeys = intersection(originalKeys, newKeys)

    const changedKeys = sameKeys.filter((key) => {
      const a = originalPackedTree[key]
      const b = newPackedTree[key]

      return !isEqual(a, b)
    })

    return {
      addedKeys,
      changedKeys,
      removedKeys
    }
  }

  static forEach = (
    arrayTree: GenericArrayTree,
    childrenKey: ObjectId,
    callbackFn: (
      node: GenericObjectTree,
      path: number[],
      arr: GenericArrayTree
    ) => void
  ) => {
    // BFS
    const queue = arrayTree.map(
      (curr, i, arr) =>
        [curr, [i], arr] as [typeof curr, typeof i[], typeof arr]
    )

    while (queue.length) {
      const item = queue.shift()

      if (item) {
        const [curr, path] = item
        callbackFn(...item)

        const children = curr[childrenKey] as GenericArrayTree | undefined

        children?.forEach((child, i, arr) => {
          queue.push([child, path.concat(i), arr])
        })
      }
    }
  }
}

export default TreePack
