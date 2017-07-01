import Category from 'data/Category';

describe('Test Category data access', () => {
  test('Get endpoint', () => {
    expect(Category.getEndpoint()).toMatchSnapshot();
  });

  test('Load a category', async () => {
    const cat = await Category.load(13);
    expect(cat.getID()).toMatchSnapshot();
    expect(cat).toMatchSnapshot();
  });

  test('Load a category by slug', async () => {
    const cat = await Category.loadBySlug('watch-this');
    expect(cat).toMatchSnapshot();
  });

  test('Load categories', async () => {
    const cat = await Category.loadMany([13, 17]);
    expect(cat).toMatchSnapshot();
  });
});
