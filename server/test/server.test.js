const express = require('express');
const request = require("supertest")
const server = require("../server")
const journals = require('../journals.json')
const testDB = require('../backup.json')
const fs = require('fs');
const path = require('path');
const journalBackup = journals;


async function cleanDatabase(){
    await fs.writeFile(path.join(__dirname, '..', 'journals.json'), JSON.stringify(testDB), (error)=> {
        if (error) throw error ; console.log("DB changed to testDB")
    })
}

async function restoreDB(done){
    await fs.writeFile(path.resolve('../', 'journals.json') , JSON.stringify(journalBackup), (error)=> {
        if (error) throw error ; console.log("DB changed back to live")
    })
}

describe("Naive tests for api response", () => {
    let app;
    let testComment = { "data" : { "articleID": 0, "commentData" : "this is a test comment" } }
    let testReact =  { "data" : { "articleID": 0, "submitterID" : "thumbButtonUp" } }
    let testArticle =  { "data" : { "title": "This is my test blog title", "content" : "This is my test content", "gifUrl" : "example" } }

    
    beforeAll(()=> {
        app = server.listen(3001, ()=> console.log("test serv started"))
    })

    afterAll( (done)=>{
        restoreDB(done)
        app.close(done)
    })

    beforeEach(()=>{
        cleanDatabase();
    })

    afterEach(()=>{
        cleanDatabase();
    })

    it("adds a new article", done => {
        request(app)
        .post("/article")
        .send(testArticle)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json; charset=utf-8')
        .expect({"message" : "Article submitted"})
        .expect(201, done);
    })

    it("reaches / ", done => {
        request(app)
        .get("/")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200, done)
    })

    it("returns the correct database on /getall", done => {
        request(app)
        .get("/getall")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(journals)
        .expect(200, done)
    })


    it("comments on an article", done => {

        request(app)
        .post("/comment")
        .send(testComment)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json; charset=utf-8')
        .expect({"message":"Comment appended successfully"})
        .expect(201, done);

    })

    it("reacts to article", done => {
        request(app)
        .post("/react")
        .send(testReact)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json; charset=utf-8')
        .expect({message : "all good! : )"})
        .expect(201, done);
    })


})