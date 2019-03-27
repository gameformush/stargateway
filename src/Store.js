const mysql = require("mysql");
const util = require("util");
const logger = require("./utility/logger");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const query = util.promisify(pool.query).bind(pool);

class Store {
    insertRequest(starship, destSector, path) {
        (async () => {
            try {
                await query(`INSERT INTO Starship (starship_name)
                            SELECT * FROM (SELECT ${starship}) AS tmp
                            WHERE NOT EXISTS (
                                SELECT starship_name FROM Starship WHERE starship_name = ${starship}
                            ) LIMIT 1;`);

                await query(`UPDATE Starship SET currentSector= ${destSector} 
                            WHERE starship_name = ${starship};`);

                await query(`INSERT INTO History(date, paths, sector, starship_name)
                            VALUES (NOW(), ?,${destSector}, ${starship});`, JSON.stringify(path));
            } catch (err) {
                logger.log("error", JSON.stringify(err));
            }
        })();
    }

    getStarshipsLastPosition() {
        return query("SELECT * FROM last_position;");
    }

    getStarshipRequestHistory(starship) {
        return new Promise(async (resolve, reject) => {
            try {
                let history = await query(`SELECT date, paths, sector 
                                            FROM request_chrono WHERE starship_name = ${starship}`);
                history.forEach(row => row.paths = JSON.parse(row.paths));
                resolve(history);
            } catch (err) {
                reject(err);
            }
        })
    }
}

module.exports = Store;
