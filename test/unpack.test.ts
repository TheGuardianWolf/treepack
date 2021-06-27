import TreePack from '~/index'

describe('Unpacking trees with a path based id scheme', () => {
  it('can unpack a simple tree', () => {
    const simpleFlatTree = {
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

    const expectArrayTree = [
      {
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
      },
      {
        value: 1
      }
    ]

    const opts = {
      childrenKey: 'children'
    }

    expect(TreePack.unpack(simpleFlatTree, null, opts)).toEqual(expectArrayTree)
  })
})

describe('Unpacking trees from id object and path object', () => {
  it('can unpack a simple tree', () => {
    const simplePathTree = {
      '0': 'MBoB8eQssp03xe8W6HHI',
      '0-0': 'Fg_T1mTKhsigJdijrvUY',
      '0-1': 'vJoQZ_OKhD6q1-840JAh',
      '0-1-0|': 'A-Bd6KpQZ0_y08u8dLzP',
      '1|': 'b9oOeg4WYCFLByDiobSy'
    }

    const simpleTree = {
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
    }

    const expectArrayTree = [
      {
        id: 'MBoB8eQssp03xe8W6HHI',
        value: 42,
        children: [
          {
            id: 'Fg_T1mTKhsigJdijrvUY',
            value: 24,
            children: []
          },
          {
            id: 'vJoQZ_OKhD6q1-840JAh',
            value: 77,
            children: [
              {
                id: 'A-Bd6KpQZ0_y08u8dLzP',
                value: 99
              }
            ]
          }
        ]
      },
      {
        id: 'b9oOeg4WYCFLByDiobSy',
        value: 1
      }
    ]

    const opts = {
      childrenKey: 'children',
      idKey: 'id'
    }

    expect(TreePack.unpack(simplePathTree, simpleTree, opts)).toEqual(
      expectArrayTree
    )
  })
})

describe('unpack errors', () => {
  it('rejects trees without ids in nodes', () => {
    const opts = { childrenKey: 'children', idKey: 'id' }
    expect(() =>
      TreePack.unpack(
        {
          '0': '_SAt1xvfofwvnxGv2jFh'
        },
        {},
        opts
      )
    ).toThrowError(
      'Node with id _SAt1xvfofwvnxGv2jFh was not found, please check if the data is valid'
    )
  })

  it('rejects trees without node data', () => {
    const opts = { childrenKey: 'children', idKey: 'id' }
    expect(() => TreePack.unpack({}, null, opts)).toThrowError(
      'An idKey was provided but the tree data was not provided as second argument'
    )
  })
})
