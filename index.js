const sqlite = require("sqlite3").verbose();
const { removeGenresFromName, extractGenres } = require("./utils");

let db = new sqlite.Database("./library.db", (err) => {
  if (err) {
    console.error(err.message);
  }

  console.log("Connected to the library db");
});

const upsertGenre = (genre, itemId, callback) => {
  db.get(
    `SELECT * FROM ItemValues WHERE CleanValue = ? AND ItemId = ?`,
    [genre.toLowerCase(), itemId],
    (err, row) => {
      if (err) {
        callback(err);
      }
      if (!row) {
        db.run(
          `INSERT INTO ItemValues VALUES (?, 2,?, ?)`,
          [itemId, genre, genre.toLowerCase()],
          (err) => {
            if (err) {
              callback(err);
            }

            callback(null);
          }
        );
      } else {
        console.log("Nothing to insert record exists", genre);
        callback(null);
      }
    }
  );
};

const createGenres = (genres, guid) =>
  genres.forEach((genre) =>
    upsertGenre(genre, guid, (err) => {
      if (err) {
        console.error(err);
      }

      console.log("Upserted ", genre);
    })
  );

const updateVideos = (genres, name, guid) =>
  db.run(
    `UPDATE TypedBaseItems SET Genres = ?, Name = ? WHERE guid = ?`,
    [genres.join("|"), name, guid],
    (err) => {
      if (err) {
        console.error(err);
      }

      console.log("Updated record", name);
    }
  );

db.each(
  `SELECT Name, guid FROM TypedBaseItems WHERE Type LIKE '%movie' AND Name LIKE '%(%)'`,
  [],
  (err, row) => {
    if (err) {
      console.error(err.message);
    }

    const genres = extractGenres(row.Name);
    createGenres(genres, row.guid);
    const newName = removeGenresFromName(row.Name);
    console.log("New Name ", newName);
    updateVideos(genres, removeGenresFromName(row.Name), row.guid);
  }
);

db.close((err) => {
  if (err) {
    console.error(err.message);
  }

  console.log("Closed the database connection");
});
