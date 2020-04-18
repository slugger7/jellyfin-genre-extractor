const removeGenresFromName = (name) => name.substring(0, name.indexOf(' ('));

const extractGenres = (name) => {
  const regex = /(?=\().*(?=)/g;
  const results = name.match(regex);
  if (results) {
    const result = results.pop();
    const genres = result
      .substring(1, result.length - 1)
      .split(",")
      .map((thing) => thing.trim());
    return genres;
  }
  return [];
};

module.exports = {
  removeGenresFromName,
  extractGenres
}