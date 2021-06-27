import TreePack from '~/index'

describe('convert packed path id trees to id and path tree', () => {
  it('can convert between trees', () => {
    expect(
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
    ).toEqual([
      {
        '0|': 'FWMTK48MD9SRgWlCro6D',
        '1': 'rTblArj84mGqmMFLD-iE',
        '1-0|': 'f0CNlhP4TOryWkdkNnnu'
      },
      {
        FWMTK48MD9SRgWlCro6D: {
          value: 24
        },
        'rTblArj84mGqmMFLD-iE': {
          value: 77
        },
        f0CNlhP4TOryWkdkNnnu: {
          value: 99
        }
      }
    ])
  })
})
