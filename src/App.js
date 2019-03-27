const Store = require("./Store");
const Calculator = require("./calculator/PreCalc");
const CommandCenter = require("./CommandCenter");

const { Transform } = require("stream");

const fs = require("fs");
const readline = require("readline");
const path = require("path");

let calculator = new Calculator(() => {
    console.log(process.env.GATES_FILE)
    let fileStream = fs.createReadStream(path.resolve(process.env.GATES_FILE), "utf-8");

    let output = new Transform({
        transform(chunck, enconding, callback) {
            callback(null, chunck);
        }
    })

    let read = readline.createInterface({
        input: fileStream,
        output: output,
        terminal: false
    })

    read.on("line", function(line) {
        this.output.write(line);
    })

    read.on("close", function() {
        this.output.end();
    })

    return output;
});

const cc = new CommandCenter(new Store, calculator);

module.exports = cc;
