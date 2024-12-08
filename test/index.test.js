const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index.js");

chai.should();
chai.use(chaiHttp);
const theaterId = 38;
describe('Task API', () => {
    describe("GET /theaters", () => {
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
                Theater_Name: 'Test New Theater',
                Location: 'Dublin 11',
                City: 'City',
                EirCode: 'D11FK64',
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

    describe('PUT /updateTheater/:Theater_Id', () => {
        it('should update an existing theater', (done) => {
            const updatedTheater = {
                Theater_Name: 'Test Updated Theater',
                Location: 'Dublin',
                City: 'City Center',
                EirCode: 'D01AX23',
                Mobile: 9876543210,
                Email: 'updatedtheater@example.com'
            };
            chai.request(app)
                .put(`/updateTheater/${theaterId}`)  
                .send(updatedTheater)              
                .end((err, res) => {
                    res.should.have.status(200);   
                    res.body.should.have.property('message').eql('Theater updated successfully'); 
                    done(); 
                });
        });
    });
    
    describe('DELETE /deleteTheater/:Theater_Id', () => {
        it('should delete an existing theater by ID', (done) => {
            chai.request(app)
                .delete(`/deleteTheater/${theaterId}`)
                .end((err, res) => {
                    res.should.have.status(200); 
                    res.body.should.have.property('message').eql('Theater deleted successfully'); 
                    done();
                });
        });
    });

});


