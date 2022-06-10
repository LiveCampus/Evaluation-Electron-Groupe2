const sqlite3 = require('sqlite3');

class Database {
    constructor(name) {
        this.name = name;
    }

    connect() {
        try {
            return new sqlite3.Database(this.name)
        } catch (e) {
            return e
        }
    }
}

module.exports = Database