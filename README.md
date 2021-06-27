# TreePack

Get the package at [https://www.npmjs.com/package/@theguardianwolf/treepack](https://www.npmjs.com/package/@theguardianwolf/treepack)

This project uses [pnpm](https://pnpm.io/)!

## What is it?

This package provides a `TreePack` class to convert hierarchical, tree-like structures to a flattened form by using the node paths as ids. We can also reverse this flattening to restore the original tree-like structure!

## Limitations

- It is assumed that you have children of each node in a single array object
- Self referencing objects at any point in the tree are not supported
- An id field is required to perform better change detection. If you are just serialising and deserialising, then this shouldn't affect you

## Usage

This package is meant to be either used in NodeJS or bundled as part of a larger app. The files included have only been Typescript transpiled.

Simply `pack` or `unpack` a tree by providing the object and the key that contains the children array in the structure.

You can also compare two packed trees with `comparePacked` to perform change detection. Changes are detected via `lodash.isEqual` and thus will look deeply into each object.

The original use case is to allow path based trees (such as the one used by [Slate](https://www.slatejs.org/)) to be stored in NoSQL based storage and be able to update them partially without sending the full tree.

## Limitations of ^1.0.0

- Changing the index of an object causes a lot of adding and deleting. This is a limitation of the path based scheme. I will fix this in V2 somehow but I may need to start adding constraints.
