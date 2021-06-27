import TreePack, { PackedTreeCompareResult } from '~/index'

describe('Compare packed trees with a path based id scheme', () => {
  it('can find removed keys', () => {
    const a = {
      '0': {
        value: 42
      },
      '0-0': {
        value: 24
      },
      '0-1': {
        value: 77
      },
      '0-1-0|': {
        value: 99
      },
      '1|': {
        value: 1
      }
    }

    const b = {
      '0': {
        value: 42
      },
      '0-0': {
        value: 24
      }
    }

    const result = TreePack.comparePacked(a, b)

    expect(result).toEqual({
      addedKeys: [],
      changedKeys: [],
      removedKeys: ['0-1', '0-1-0|', '1|']
    } as PackedTreeCompareResult)
  })

  it('can find added keys', () => {
    const a = {
      '0': {
        value: 42
      },
      '0-0': {
        value: 24
      },
      '0-1': {
        value: 77
      },
      '0-1-0|': {
        value: 99
      },
      '1|': {
        value: 1
      }
    }

    const b = {
      '0': {
        value: 42
      },
      '0-0': {
        value: 24
      }
    }

    const result = TreePack.comparePacked(b, a)

    expect(result).toEqual({
      addedKeys: ['0-1', '0-1-0|', '1|'],
      changedKeys: [],
      removedKeys: []
    } as PackedTreeCompareResult)
  })

  it('can find changed keys', () => {
    const a = {
      '0': {
        value: 42
      },
      '0-0': {
        value: 24
      },
      '0-1': {
        value: 77
      },
      '0-1-0|': {
        value: 99
      },
      '1|': {
        value: 1
      }
    }

    const b = {
      '0': {
        value: 42
      },
      '0-0': {
        value: 24
      },
      '0-1': {
        value: 74
      },
      '0-1-0|': {
        value: 99
      },
      '1|': {
        value: 1
      }
    }

    const result = TreePack.comparePacked(b, a)

    expect(result).toEqual({
      addedKeys: [],
      changedKeys: ['0-1'],
      removedKeys: []
    } as PackedTreeCompareResult)
  })

  it('can find all key changes', () => {
    const a = {
      '0': {
        value: 42
      },
      '0-0': {
        value: 24
      },
      '0-1': {
        value: 77
      },
      '0-1-0|': {
        value: 99
      },
      '1|': {
        value: 1
      }
    }

    const b = {
      '0': {
        value: 42
      },
      '0-0': {
        value: 24
      },
      '0-1': {
        value: 74
      },
      '0-1-0|': {
        value: 99
      },
      '1': {
        value: 1
      }
    }

    const result = TreePack.comparePacked(a, b)

    expect(result).toEqual({
      addedKeys: ['1'],
      changedKeys: ['0-1'],
      removedKeys: ['1|']
    } as PackedTreeCompareResult)
  })

  it('can handle path changes', () => {
    const a = {
      '0': {
        value: 42
      },
      '0-0': {
        value: 24
      },
      '0-1': {
        value: 77
      },
      '0-1-0|': {
        value: 99
      },
      '1|': {
        value: 1
      }
    }

    const b = {
      '0': {
        value: 42
      },
      '0-0': {
        value: 77
      },
      '0-0-0|': {
        value: 99
      },
      '1|': {
        value: 1
      }
    }

    const result = TreePack.comparePacked(a, b)

    expect(result).toEqual({
      addedKeys: ['0-0-0|'],
      changedKeys: ['0-0'],
      removedKeys: ['0-1', '0-1-0|']
    } as PackedTreeCompareResult)
  })
})

describe('Compare packed id objects', () => {
  it('can find removed keys', () => {
    const a = {
      'XsU_B2Ck3rU3pHFoZUB-': {
        value: 42
      },
      Vu99mi4fYhIky0Vrs7Cs: {
        value: 24
      },
      L9XZnmwdo4uTSpEKKoR0: {
        value: 77
      },
      MU6NH70ty4w4nQmy5M72: {
        value: 99
      },
      '89iLZjgyKhOAmIaJphjs': {
        value: 1
      }
    }

    const b = {
      'XsU_B2Ck3rU3pHFoZUB-': {
        value: 42
      },
      Vu99mi4fYhIky0Vrs7Cs: {
        value: 24
      }
    }

    const result = TreePack.comparePacked(a, b)

    expect(result).toEqual({
      addedKeys: [],
      changedKeys: [],
      removedKeys: [
        'L9XZnmwdo4uTSpEKKoR0',
        'MU6NH70ty4w4nQmy5M72',
        '89iLZjgyKhOAmIaJphjs'
      ]
    } as PackedTreeCompareResult)
  })

  it('can find added keys', () => {
    const a = {
      'XsU_B2Ck3rU3pHFoZUB-': {
        value: 42
      },
      Vu99mi4fYhIky0Vrs7Cs: {
        value: 24
      },
      L9XZnmwdo4uTSpEKKoR0: {
        value: 77
      },
      MU6NH70ty4w4nQmy5M72: {
        value: 99
      },
      '89iLZjgyKhOAmIaJphjs': {
        value: 1
      }
    }

    const b = {
      'XsU_B2Ck3rU3pHFoZUB-': {
        value: 42
      },
      Vu99mi4fYhIky0Vrs7Cs: {
        value: 24
      }
    }

    const result = TreePack.comparePacked(b, a)

    expect(result).toEqual({
      addedKeys: [
        'L9XZnmwdo4uTSpEKKoR0',
        'MU6NH70ty4w4nQmy5M72',
        '89iLZjgyKhOAmIaJphjs'
      ],
      changedKeys: [],
      removedKeys: []
    } as PackedTreeCompareResult)
  })

  it('can find changed keys', () => {
    const a = {
      'XsU_B2Ck3rU3pHFoZUB-': {
        value: 42
      },
      Vu99mi4fYhIky0Vrs7Cs: {
        value: 24
      },
      L9XZnmwdo4uTSpEKKoR0: {
        value: 77
      },
      MU6NH70ty4w4nQmy5M72: {
        value: 99
      },
      '89iLZjgyKhOAmIaJphjs': {
        value: 1
      }
    }

    const b = {
      'XsU_B2Ck3rU3pHFoZUB-': {
        value: 42
      },
      Vu99mi4fYhIky0Vrs7Cs: {
        value: 24
      },
      L9XZnmwdo4uTSpEKKoR0: {
        value: 74
      },
      MU6NH70ty4w4nQmy5M72: {
        value: 99
      },
      '89iLZjgyKhOAmIaJphjs': {
        value: 1
      }
    }

    const result = TreePack.comparePacked(b, a)

    expect(result).toEqual({
      addedKeys: [],
      changedKeys: ['L9XZnmwdo4uTSpEKKoR0'],
      removedKeys: []
    } as PackedTreeCompareResult)
  })

  it('can find all key changes', () => {
    const a = {
      'XsU_B2Ck3rU3pHFoZUB-': {
        value: 42
      },
      Vu99mi4fYhIky0Vrs7Cs: {
        value: 24
      },
      L9XZnmwdo4uTSpEKKoR0: {
        value: 77
      },
      MU6NH70ty4w4nQmy5M72: {
        value: 99
      },
      '89iLZjgyKhOAmIaJphjs': {
        value: 1
      }
    }

    const b = {
      Vu99mi4fYhIky0Vrs7Cs: {
        value: 24
      },
      L9XZnmwdo4uTSpEKKoR0: {
        value: 74
      },
      MU6NH70ty4w4nQmy5M72: {
        value: 99
      },
      '89iLZjgyKhOAmIaJphjs': {
        value: 1
      },
      '-DrtN2uKtKwjwUD4pcA1': {
        value: 4
      }
    }

    const result = TreePack.comparePacked(a, b)

    expect(result).toEqual({
      addedKeys: ['-DrtN2uKtKwjwUD4pcA1'],
      changedKeys: ['L9XZnmwdo4uTSpEKKoR0'],
      removedKeys: ['XsU_B2Ck3rU3pHFoZUB-']
    } as PackedTreeCompareResult)
  })
})

describe('compare packed errors', () => {
  it('rejects without arguments', () => {
    const expected = {
      addedKeys: [],
      changedKeys: [],
      removedKeys: []
    }

    expect(TreePack.comparePacked(undefined as any, undefined as any)).toEqual(
      expected
    )
  })
})
