import { date, modified } from 'field/date';

describe('Test schema type field definition', () => {
  test('Test date fields', () => {
    expect(date.date.type.name).toMatchSnapshot();
    expect(date.date_gmt.type.name).toMatchSnapshot();
  });

  test('Test modified fields', () => {
    expect(modified.modified.type.name).toMatchSnapshot();
    expect(modified.modified_gmt.type.name).toMatchSnapshot();
  });
});
