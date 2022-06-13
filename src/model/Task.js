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

  getOne(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT id, title, description, rank, idList FROM Task WHERE id = ?",
        id,
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  add(data) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO Task(id, title, rank, idList, description) VALUES (NULL, ?, IFNULL((SELECT MAX(rank) + 1 FROM Task WHERE idList = ?), 0), ?, ?)",
        [data.title, data.idList, data.idList, data.description],
        (err, _) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  deleteTask(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM Task WHERE id = ?", id, (err, _) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

module.exports = Task;
