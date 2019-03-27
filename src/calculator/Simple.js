const {Writable} = require("stream");


/*
    SimpleCalculator class computes paths in O(N * K^2) time and O(N) space.
    getPaths re-reads gates file and computes path for each row
    with O(K^2) window sum algorithm and store result into arary.

    Where N - number of rows from gates file
    and K - length of paths
*/
class SimpleCalculator extends Writable {
    constructor(getData) {
        super()

        this.setDataSource(getData);

        this.targetGate = 0;
        this.resultPath = [];
        this.line = 1;
    }

    getPaths(targetGate, cb) {
        this.reset();
        this.targetGate = targetGate;

        let source = this.getData()

        source.pipe(this);

        source.on('end', () => {
            cb(this.resultPath);
        })
    }

    setDataSource(getData) {
        if (typeof getData === "function") {
            this.getData = getData;
        } else {
            throw new Error("Date source must be a function.");
        }
    }

    reset() {
        this.line = 1;
        this.resultPath = [];
        this.targetGate = 0;
    }

    _write(chunck, encoding, done) {
        let gates = chunck.toString().split(" ").map(x => parseInt(x));

        this.resultPath.push(this._getPath(gates, this.targetGate, this.line++));

        done();
    }

    _windowSum(targetSum, path){
        let start = 0,
            end = 0,
            currentSum = path[0];

        while(end !== path.length) {

            if (currentSum === targetSum) {
                return path.slice(start, end + 1);
            }

            if (targetSum < currentSum) {
                currentSum -= path[start++];
            } else {
                currentSum += path[++end];
            }
        }

        return [];
    }

    _getPath(gates, target, level) {
        return {
            securityLevel: level,
            gates: this._windowSum(target, gates)
        }
    }
}

module.exports = SimpleCalculator;