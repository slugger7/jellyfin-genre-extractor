const { removeGenresFromName, extractGenres } = require('./utils');

const name = 'Movie Name - actor, actor (genre1, genre2, genre 3)';

describe('Extract Genre Test', () => {
  it('should return something', () => {
    const actual = extractGenres(name);
    expect(actual).toBeDefined
  });

  it('should return a blank array if it cant find anything', () => {
    const actual = extractGenres('');
    expect(actual).toEqual([]);
  });

  it('shoud return a list of genres if it finds them', () => {
    const expected = ['genre1', 'genre2', 'genre 3'];
    const actual = extractGenres(name);

    expect(actual).toEqual(expected);
  })
});

describe('Remove Genres From Name', () => {
  it('should return something', () => {
    const actual = removeGenresFromName(name);

    expect(actual).toBeDefined();
  });

  it('should return a name without the genres array', () => {
    const expected = "Movie Name - actor, actor"
    const actual = removeGenresFromName(name);

    expect(actual).toBe(expected);
  });
});