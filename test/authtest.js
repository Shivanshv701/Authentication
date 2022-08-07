const chai = require('chai');
const chaiHTTP = require('chai-http')
const express = require('express');
const server = require('../server');
const assert = chai.assert;
chai.use(chaiHTTP);


const user = {firstname: 'User1', lastname: 'user', email:'user5@xyz.com'  , password: '123456'}
const user1 = {firstname: 'User2', lastname: 'user', email: 'user1@xyz.com', password: '1234568'}


describe("Test about server file", () => {
    describe("Tests return type", () => {
        it("Tests return type of app created", () => {
            let result = express();
            assert.typeOf(result, 'function');
        }) 
    })
})  

describe("Signup", ()=>{
    it("Should create a new user if email is not found", () => {
        chai.request(server).post('/api/register').send(user)
        .end((err, res) => {
            chai.expect(res.status).to.equal(200);
            chai.expect(res.body).not.to.be.empty;
        });
    });
    it("Should not create a new user if email is found", () => {
        chai.request(server).post('/api/register').send(user1)
        .end((err, res) => {
            chai.expect(res.status).to.equal(409);
            chai.expect(res.body).not.to.be.empty;
        })
    });
});

describe("Login", () => {
    it("Should log in user if email and password are correct", () => {
        chai.request(server).post('/api/login').send({email: "shivanshv701@gmail.com", password: "123456"})
        .end((err, res) => {
            chai.expect(res.status).to.equal(200);
        })
    });
    it("Should not login user if email is not registered", () => {
        chai.request(server).post('/login').send(user)
        .end((err, res) => {
            chai.expect(res.status).to.equal(404);
        })
    });
});