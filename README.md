# TreePack

Get the package at [https://www.npmjs.com/package/@theguardianwolf/treepack](https://www.npmjs.com/package/@theguardianwolf/treepack)

This project uses [pnpm](https://pnpm.io/)!

## What is it?

This package provides a `TreePack` class to convert hierarchical, tree-like structures to a flattened form by using the node paths as ids. We can also reverse this flattening to restore the original tree-like structure!

## Changes from `^1.0.0`

- An options object is now requred as a parameter on `pack` and `unpack`
- Packing using `idKey` option now seperates result into a path based packed tree and a id based packed tree

## Limitations

- It is assumed that you have children of each node in a single array object
- Self referencing objects at any point in the tree are not supported
- An id field is required to perform better change detection (using `idKey` option).

### Limitations of ^1.0.0 serialisation (without `idKey`)

- Changing the index of an object causes a lot of adding and deleting. This is a limitation of the path based scheme. I will fix this in V2 somehow but I may need to start adding constraints.

## Usage

This package is meant to be either used in NodeJS or bundled as part of a larger app. The files included have only been Typescript transpiled.

Simply `pack` or `unpack` a tree by providing the object and the key that contains the children array in the structure.

You can also compare two packed trees with `comparePacked` to perform change detection. Changes are detected via `lodash.isEqual` and thus will look deeply into each object.

The original use case is to allow path based trees (such as the one used by [Slate](https://www.slatejs.org/)) to be stored in NoSQL based storage and be able to update them partially without sending the full tree.

### Package with Path Ids

The `pack` method allows two options, `idKey` and `childrenKey`. By not entering `idKey`, the default is to pack into the previous packing scheme from `^1.0.0`. This means the following will be the result

```ts
import TreePack from '@theguardianwolf/treepack'

TreePack.pack(
  [
    {
      value: 24
    },
    {
      value: 77,
      children: [
        {
          value: 99
        }
      ]
    }
  ],
  {
    childrenKey: 'children'
  }
)
```

And unpacking would be like

```ts
import TreePack from '@theguardianwolf/treepack'

TreePack.unpack(
  {
    '0|': {
      value: 24
    },
    '1': {
      value: 77
    },
    '1-0|': {
      value: 99
    }
  },
  {
    childrenKey: 'children'
  }
)
```

### Package with path tree and id tree

With both `idKey` and `childrenKey` provided, the tree will be packed into two seperate objects, for storage seperately. This makes updates more efficient if it is required, as the path tree is bad at handling object moves, insertions, and deletions that causes the paths to change. The id tree will be updated minimally on change, as only data removals, additions and changes would affect it.

```ts
import TreePack from '@theguardianwolf/treepack'

TreePack.pack(
  [
    {
      id: '3K7hXum0FPv_dI0yHnz8',
      value: 24
    },
    {
      id: 'Iv2wRvhavyAXkojZvMuP',
      value: 77,
      children: [
        {
          id: 'F0FuBirspSoVWH-8u8uQ',
          value: 99
        }
      ]
    }
  ],
  {
    childrenKey: 'children',
    idKey: 'id'
  }
)
```

Unpacking like so

```ts
import TreePack from '@theguardianwolf/treepack'

TreePack.unpack(
  {
    '0': 'MBoB8eQssp03xe8W6HHI',
    '0-0': 'Fg_T1mTKhsigJdijrvUY',
    '0-1': 'vJoQZ_OKhD6q1-840JAh',
    '0-1-0|': 'A-Bd6KpQZ0_y08u8dLzP',
    '1|': 'b9oOeg4WYCFLByDiobSy'
  },
  {
    MBoB8eQssp03xe8W6HHI: {
      value: 42
    },
    Fg_T1mTKhsigJdijrvUY: {
      value: 24
    },
    'vJoQZ_OKhD6q1-840JAh': {
      value: 77
    },
    'A-Bd6KpQZ0_y08u8dLzP': {
      value: 99
    },
    b9oOeg4WYCFLByDiobSy: {
      value: 1
    }
  },
  {
    childrenKey: 'children',
    idKey: 'id'
  }
)
```

### Convert from path based id tree to path and id tree

A method `convertPackedPathIdTree` is available to convert from the old packing scheme to the current one if desired. This may help in transitioning.

```ts
import TreePack from '@theguardianwolf/treepack'

TreePack.convertPackedPathIdTree(
  {
    '0|': {
      id: 'FWMTK48MD9SRgWlCro6D',
      value: 24
    },
    '1': {
      id: 'rTblArj84mGqmMFLD-iE',
      value: 77
    },
    '1-0|': {
      id: 'f0CNlhP4TOryWkdkNnnu',
      value: 99
    }
  },
  'id'
)
```
