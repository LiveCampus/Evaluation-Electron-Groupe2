class Task {
  constructor(db) {
    this.db = db.connect();
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT id, title, rank, idList FROM Task", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Task;
