'use strict';
const app = require('../app.js');
const chai = require('chai');
const mocha = require('mocha');
const request = require('supertest');
const stations = require('../stations.js');

const expect = chai.expect;

describe('App Integration Tests', () => {
    describe('GET /stat', () => {
        for (let i = 0; i < 10; i++) {
            let station = stations[i];
            it('should get wmata outage html', () =>  {
                request(app).get('/stat?name=' + station.stationInfo.Name + '&stationId=' + station.stationInfo.StationId)
                .end( (err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.text).to.be.a('string');
                    expect(res.body).to.be.empty;
                });
                request(app).get('/stat')
                .end( (err, res ) => {
                    expect(res.status).to.equal(404);
                    expect(res.body).to.be.an('object');
                    expect(res.body.status).to.equal('error');
                    expect(res.body.message).to.equal('bad query');
                })
            });
        }
    });
    describe('GET /station-list', () => {
        it('should return full list of station names', () => {
            request(app).get('/station-list')
            .end( (err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(95);
                for (let i in res.body) {
                    expect(res.body[i]).to.be.an('object');
                    expect(res.body[i]).to.haveOwnProperty('stationInfo');
                }
            });
        });
    });
});