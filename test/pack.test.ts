import TreePack from '~/index'

describe('Packing trees', () => {
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

    expect(TreePack.pack(simpleObjectTree, 'children')).toEqual(expectFlatTree)
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

    expect(TreePack.pack(simpleArrayTree, 'children')).toEqual(expectFlatTree)
  })

  it('rejects non arrays and non objects', () => {
    expect(() => TreePack.pack(1 as any, 'children')).toThrowError(
      'Tree is not an object or array'
    )
  })
})
