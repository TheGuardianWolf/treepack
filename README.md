# TreePack

This project uses [pnpm](https://pnpm.io/)!

## What is it?

This package provides a `TreePack` class to convert hierarchical, tree-like structures to a flattened form by using the node paths as ids. We can also reverse this flattening to restore the original tree-like structure!

## Limitations

- It is assumed that you have children of each node in a single array object
- Self referencing objects at any point in the tree are not supported
- Changing the index of an object causes a lot of adding and deleting. This is a limitation of the path based scheme. I will fix this in V2 somehow but I may need to start adding constraints.

## Usage

Simply `pack` or `unpack` a tree by providing the object and the key that contains the children array in the structure.

You can also compare two packed trees with `comparePacked` to perform change detection. Changes are detected via `lodash.isEqual` and thus will look deeply into each object.

The original use case is to allow path based trees (such as the one used by [Slate](https://www.slatejs.org/)) to be stored in NoSQL based storage and be able to update them partially without sending the full Slate document.
