import TreePack from '~/index'

describe('Packing trees into path based id object', () => {
  it('can pack a simple tree starting from object', () => {
    const simpleObjectTree = {
      value: 42,
      children: [
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
    }

    const expectFlatTree = {
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
      }
    }

    const opts = { childrenKey: 'children' }
    const packedResult = TreePack.pack(simpleObjectTree, opts)

    expect(packedResult).toEqual([expectFlatTree, null, opts])
  })

  it('can pack a simple tree starting from an array', () => {
    const simpleArrayTree = [
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
    ]

    const expectFlatTree = {
      '0|': {
        value: 24
      },
      '1': {
        value: 77
      },
      '1-0|': {
        value: 99
      }
    }

    const opts = { childrenKey: 'children' }
    const packedResult = TreePack.pack(simpleArrayTree, opts)

    expect(packedResult).toEqual([expectFlatTree, null, opts])
  })
})

describe('Packing trees into id object and path object', () => {
  it('can pack a simple tree starting from object', () => {
    const simpleObjectTree = {
      id: 'tZaYl7DAdqIkt22yrIWf8',
      value: 42,
      children: [
        {
          id: '3K7hXum0FPv_dI0yHnz8',
          value: 24,
          children: []
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
      ]
    }

    const expectPathTree = {
      '0': 'tZaYl7DAdqIkt22yrIWf8',
      '0-0': '3K7hXum0FPv_dI0yHnz8',
      '0-1': 'Iv2wRvhavyAXkojZvMuP',
      '0-1-0|': 'F0FuBirspSoVWH-8u8uQ'
    }

    const expectObjectTree = {
      tZaYl7DAdqIkt22yrIWf8: {
        value: 42
      },
      '3K7hXum0FPv_dI0yHnz8': {
        value: 24
      },
      Iv2wRvhavyAXkojZvMuP: {
        value: 77
      },
      'F0FuBirspSoVWH-8u8uQ': {
        value: 99
      }
    }

    const opts = { childrenKey: 'children', idKey: 'id' }
    const packedResult = TreePack.pack(simpleObjectTree, opts)

    expect(packedResult).toEqual([expectPathTree, expectObjectTree, opts])
  })

  it('can pack a simple tree starting from an array', () => {
    const simpleArrayTree = [
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
    ]

    const expectPathTree = {
      '0|': '3K7hXum0FPv_dI0yHnz8',
      '1': 'Iv2wRvhavyAXkojZvMuP',
      '1-0|': 'F0FuBirspSoVWH-8u8uQ'
    }

    const expectObjectTree = {
      '3K7hXum0FPv_dI0yHnz8': {
        value: 24
      },
      Iv2wRvhavyAXkojZvMuP: {
        value: 77
      },
      'F0FuBirspSoVWH-8u8uQ': {
        value: 99
      }
    }

    const opts = { childrenKey: 'children', idKey: 'id' }
    const packedResult = TreePack.pack(simpleArrayTree, opts)

    expect(packedResult).toEqual([expectPathTree, expectObjectTree, opts])
  })
})

describe('pack errors', () => {
  it('rejects non arrays and non objects', () => {
    const opts = { childrenKey: 'children' }
    expect(() => TreePack.pack(1 as any, opts)).toThrowError(
      'Tree is not an object or array'
    )
  })

  it('rejects with no children key', () => {
    const opts = { childrenKey: undefined }
    expect(() => TreePack.pack(1 as any, opts as any)).toThrowError(
      'childrenKey has not been provided'
    )
  })

  it('rejects trees without ids in nodes', () => {
    const opts = { childrenKey: 'children', idKey: 'id' }
    expect(() => TreePack.pack({}, opts)).toThrowError(
      'Node at path 0| does not have an id, please use path based ids or provide an id to this node'
    )
  })
})
