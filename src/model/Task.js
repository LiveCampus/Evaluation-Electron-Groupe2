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

  updateTask(id, data) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE Task SET ${Object.keys(data)
          .map((key) => `${key} = "${data[key].replace('"', "'")}"`)
          .join(`, `)} WHERE id = ${id}`,
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  }

  updateRank({ taskId, listId, rank }) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT rank FROM Task WHERE id = ?",
        taskId,
        (err, { rank: previousRank }) => {
          if (err) {
            reject(err);
          } else {
            this.db.run(
              `UPDATE Task SET idList = ${listId}, rank = ${rank} WHERE id = ${taskId}`,
              (err, _) => {
                if (err) {
                  reject(err);
                } else {
                  if (previousRank > rank) {
                    this.db.run(
                      `UPDATE Task SET rank = rank + 1 WHERE idList = ${listId} AND rank >= ${rank} AND rank < ${previousRank} AND id != ${taskId}`,
                      (err, data) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve(data);
                        }
                      }
                    );
                  } else {
                    this.db.run(
                      `UPDATE Task SET rank = rank - 1 WHERE idList = ${listId} AND rank <= ${rank} AND rank > ${previousRank} AND id != ${taskId}`,
                      (err, data) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve(data);
                        }
                      }
                    );
                  }
                }
              }
            );
          }
        }
      );
    });
  }
}

module.exports = Task;
