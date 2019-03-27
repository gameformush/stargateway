const { Writable } = require("stream");


/*
    Precalculator class computes paths in O(N) time and O(N * K^2) space
    by building N hash tables and precomputing all posiable sums.
    getPaths travers arary of hash tabels in O(n) and
    lookup path in O(1) time.

    Where N - number of rows from gates file
    and K - length of paths
*/
class PreCalculator extends Writable {
    constructor(getData) {
        super();

        this.hashTables = [];
        this.setDataSource(getData);
    }

    _makePaths(targetGate) {
        return this.hashTables.map((table, level) => {
            return {
                securityLevel: level + 1,
                gates: table.get(targetGate)
            }
        });
    }

    getPaths(targetGate, cb) {
        if (this.hashTables.length === 0) {
            this.source.pipe(this);

            this.source.on("end", () => {
                cb(this._makePaths(targetGate));
            })
        } else {
            cb(this._makePaths(targetGate));
        }
    }

    reset() {
        this.hashTables = [];
    }

    setDataSource(getData) {
        if (typeof getData === "function") {
            this.getData = getData;
            this.source = getData();
        } else {
            throw new Error("Date source must be a function.");
        }
    }

    _write(chunck, encoding, done) {
        let gates = chunck.toString().split(" ").map(x => parseInt(x));

        this.hashTables.push(this.allSums(gates));

        done();
    }

    allSums(path) {
        let hashTable = new Map();

        for (let window = path.length; window > 0; window--) {
            let sum = 0;
            for (let i = 0; i < window; i++) {
                sum += path[i];
            }

            if (!hashTable.has(sum)) {
                hashTable.set(sum, path.slice(0, window));
            }

            for (let i = 0; i + window < path.length; i++) {
                sum -= path[i];
                sum += path[i + window];
                if (!hashTable.has(sum)) {
                    hashTable.set(sum, path.slice(i + 1, i + window + 1));
                }
            }
        }
        return hashTable;
    }
}

module.exports = PreCalculator;
