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

    describe('POST /addTheater', () => {
        it('should add a new theater', (done) => {
            const newTheater = {
                Theater_Name: 'New Theater',
                Location: 'Some Location',
                City: 'Some City',
                EirCode: '12345',
                Mobile: 1234567890,
                Email: 'newtheater@example.com'
            };

            chai.request(app)                   
                .post('/addTheater')              
                .send(newTheater)                 
                .end((err, res) => {
                    res.should.have.status(201);             
                    res.body.should.have.property('message').eql('Theater added successfully');
                    done();
                });
        });
    });

});


