import TreePack from '~/index'

describe('Unpacking trees', () => {
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

    expect(TreePack.unpack(simpleFlatTree, 'children')).toEqual(expectArrayTree)
  })
})
