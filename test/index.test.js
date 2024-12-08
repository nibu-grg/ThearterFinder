const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index.js");

chai.should();
chai.use(chaiHttp);

describe('Task API', () => {
    describe("GET /api/theaters", () => {
        it("Should perform GET", (done) => {
            chai.request(app)
                .get("/theaters")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    done();
                });
        });
    });
});


