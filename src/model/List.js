class List {
  constructor(db) {
    this.db = db.connect(); //.connect();
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT List.id, List.title, COUNT(Task.title) as count FROM List LEFT JOIN Task ON List.id = Task.idList GROUP BY List.id",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

module.exports = List;
