const expect = require('expect.js');
const fs = require('fs');
const path = require('path');
const {
	Transform
} = require('stream');
const readline = require('readline');
const PreCalc = require('../src/calculator/PreCalc');


describe('pre-calculator', () => {
	let calculator;
	calculator = new PreCalc(() => {
		let fileStream = fs.createReadStream(path.resolve(path.join(__dirname, './testData/gates.txt')), 'utf-8');

		let output = new Transform({
			transform(chunck, enconding, callback) {
				callback(null, chunck);
			}
		});

		let read = readline.createInterface({
			input: fileStream,
			output: output,
			terminal: false
		})
		read.on('line', function (line) {
			this.output.write(line);
		})

		read.on('close', function () {
			this.output.end();
		})

		return output;
	});

	describe('test allSums method', () => {
		let testData = [1, 2, 3];
		it('should return map', (done) => {
			expect(calculator.allSums(testData) instanceof Map).to.be.ok;
			done();
		});

		it('should return map of Number => Array', (done) => {
			let result = calculator.allSums(testData);

			for (let key of result.keys()) {
				expect(key).to.be.an('number');
			}

			for (let val of result.values()) {
				expect(val).to.be.an('array');
			}
			done();
		});

		it('getPaths should return [2, 3] for 5 as argument', (done) => {
			calculator.getPaths(8, (path) => {
				expect(path[0].gates).to.be.eql([1, 7]);
				done();
			});
		})

		it('result should contain all posiable window sums', (done) => {
			let result = Array.from(calculator.allSums(testData).keys());
			expect(result).to.contain(1);
			expect(result).to.contain(2);
			expect(result).to.contain(3);
			expect(result).to.contain(5);
			expect(result).to.contain(6);
			done();
		});
	})
})
