import difference from 'lodash/difference'
import intersection from 'lodash/intersection'
import isEqual from 'lodash/isequal'
import isObject from 'lodash/isobject'
import omit from 'lodash/omit'
import set from 'lodash/set'

export type PathKey = string
export type ObjectKey = string | number
export type GenericTree = GenericObjectTree | GenericArrayTree
export type GenericObjectTree = Record<ObjectKey, unknown>
export type GenericArrayTree = Record<ObjectKey, unknown>[]
export type PackedPathTree = Record<PathKey, ObjectKey>
export type PackedTree = Record<PathKey, Record<ObjectKey, unknown>>
export type PackedTreeCompareResult = {
  addedKeys: ObjectKey[]
  removedKeys: ObjectKey[]
  changedKeys: ObjectKey[]
}

export type TreePackOptions = {
  childrenKey: ObjectKey
  idKey?: ObjectKey
}

export const TREE_PATH_SEPERATOR = '-'
export const TREE_LEAF_TERMINATOR = '|'

class TreePack {
  static pack = (
    tree: GenericTree,
    opts: TreePackOptions
  ): [PackedTree | PackedPathTree, PackedTree | null, TreePackOptions] => {
    if (!opts.childrenKey) {
      throw 'childrenKey has not been provided'
    }

    let arrayTree: GenericArrayTree = []
    if (Array.isArray(tree)) {
      arrayTree = tree as GenericArrayTree
    } else if (isObject(tree)) {
      arrayTree = [tree] as GenericArrayTree
    } else {
      throw 'Tree is not an object or array'
    }

    const packedPathIdTree = TreePack.packWithPathIds(arrayTree, opts)

    // Pack with old scheme with path based ids
    if (!opts.idKey) {
      return [packedPathIdTree, null, opts]
    }

    const idKey = opts.idKey as string

    // Pack with new scheme with path flattree and object flattree
    return [...TreePack.convertPackedPathIdTree(packedPathIdTree, idKey), opts]
  }

  static convertPackedPathIdTree = (
    packedPathIdTree: PackedTree,
    idKey: string
  ): [PackedPathTree, PackedTree] => {
    const [packedPathTree, packedObjectTree] = Object.entries(
      packedPathIdTree
    ).reduce(
      ([packedPathTree, packedTree], [path, node]) => {
        const strippedNode = omit(node, idKey)

        const nodeId = node[idKey] as string | undefined
        if (!nodeId) {
          throw `Node at path ${path} does not have an id, please use path based ids or provide an id to this node`
        }

        packedPathTree[path] = nodeId
        packedTree[nodeId] = strippedNode
        return [packedPathTree, packedTree] as [PackedPathTree, PackedTree]
      },
      [{}, {}] as [PackedPathTree, PackedTree]
    )

    // Pack with new scheme with path flattree and object flattree
    return [packedPathTree, packedObjectTree]
  }

  private static packWithPathIds = (
    arrayTree: GenericArrayTree,
    opts: TreePackOptions
  ) => {
    const { childrenKey } = opts

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

  static unpack = (
    packedPathTree: PackedPathTree | PackedTree,
    packedTree: PackedTree | null,
    opts: TreePackOptions
  ) => {
    if (!opts.idKey) {
      // Assume it is PackedTree
      return TreePack.unpackPackedPathIdTree(packedPathTree as PackedTree, opts)
    }

    if (packedTree == null) {
      throw 'An idKey was provided but the tree data was not provided as second argument'
    }

    return TreePack.unpackPackedIdTree(
      packedPathTree as PackedPathTree,
      packedTree,
      opts
    )
  }

  private static unpackPackedIdTree = (
    packedPathTree: PackedPathTree,
    packedTree: PackedTree,
    opts: TreePackOptions
  ) => {
    const childrenKey = opts.childrenKey as string
    const idKey = opts.idKey as string

    const arrayTree = [] as GenericArrayTree

    Object.entries(packedPathTree).forEach(([key, nodeId]) => {
      const isLeaf = key.slice(-1) === TREE_LEAF_TERMINATOR
      const node = packedTree[nodeId]

      if (!node) {
        throw `Node with id ${nodeId} was not found, please check if the data is valid`
      }

      const modifiedNode = isLeaf
        ? {
            [idKey]: nodeId,
            ...node
          }
        : {
            [idKey]: nodeId,
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

  private static unpackPackedPathIdTree = (
    packedTree: PackedTree,
    opts: TreePackOptions
  ) => {
    const childrenKey = opts.childrenKey as string
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
    originalObject: Record<string, unknown>,
    newObject: Record<string, unknown>
  ): PackedTreeCompareResult => {
    if (!originalObject || !newObject) {
      return {
        addedKeys: [],
        changedKeys: [],
        removedKeys: []
      }
    }

    const originalKeys = Object.keys(originalObject)
    const newKeys = Object.keys(newObject)
    const addedKeys = difference(newKeys, originalKeys)
    const removedKeys = difference(originalKeys, newKeys)
    const sameKeys = intersection(originalKeys, newKeys)

    const changedKeys = sameKeys.filter((key) => {
      const a = originalObject[key]
      const b = newObject[key]

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
    childrenKey: ObjectKey,
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
      const item = queue.shift()!

      const [curr, path] = item
      callbackFn(...item)

      const children = curr[childrenKey] as GenericArrayTree | undefined

      children?.forEach((child, i, arr) => {
        queue.push([child, path.concat(i), arr])
      })
    }
  }

  static compare = TreePack.comparePacked
}

export default TreePack
