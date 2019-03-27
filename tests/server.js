const init = require('../src/server').init;
const stop = require('../src/server').stop;
const port = require('../src/server').port;
const superagent = require('superagent');
const expect = require('expect.js');
const logger = require('../src/utility/logger');

logger.transports[0].silent = true

describe('server', () => {
    let starship = 12,
        sector = 56;

    before(() => {
        init();
    })

    describe('API: get path to sector', () => {
        const API_URL = `http://localhost:${port}/api/starship/path/${starship}/${sector}`;
        it('should respond to GET', (done) => {
            superagent
                .get(API_URL)
                .end((error, res) => {
                    expect(error).to.be(null);
                    expect(res.status).to.equal(200);
                    done();
                })
        })
        it('should contain array of paths', (done) => {
            superagent
                .get(API_URL)
                .end((error, res) => {
                    expect(error).to.be(null);
                    expect(res.text).to.be.ok;

                    let data = JSON.parse(res.text);
                    expect(data).to.be.an('array');
                    done();
                })
        })

        it('paths gates sum must be equal 56', (done) => {
            superagent
                .get(API_URL)
                .end((error, res) => {
                    expect(error).to.be(null);
                    expect(res.text).to.be.ok;

                    let data = JSON.parse(res.text);
                    data.forEach(path => {
                        let sum = path.gates.reduce((acc, x) => acc + x, 0);
                        expect(sum).to.be.equal(56);
                    })
                    done();
                })
        })

        it('paths must be sorted by security level in asc order', (done) => {
            superagent
                .get(API_URL)
                .end((error, res) => {
                    expect(error).to.be(null);
                    expect(res.text).to.be.ok;

                    let data = JSON.parse(res.text);
                    let isAscOrder = data.every((path, index, array) => {
                        return path.securityLevel <=
                            array[index + 1 < array.length ? index + 1 : index].securityLevel;
                    })
                    expect(isAscOrder).to.be.ok;
                    done();
                })
        })

        it('should be saved to store', (done) => {
            done();
        })
    })

    after(() => {
        stop();
    })
})
