import TreePack, { PackedTreeCompareResult } from '~/index'

describe('Compare packed trees', () => {
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
})
