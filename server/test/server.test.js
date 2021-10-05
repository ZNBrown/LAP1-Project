const request = require("supertest")
const server = require("../server")
const journals = require('../journals.json')
const express = require('express');



describe("test", () => {
    let app;
    let testComment = { "data" : { "articleID": 0, "commentData" : "this is a test comment" } }
    let testReact =  { "data" : { "articleID": 0, "submitterID" : "thumbButtonUp" } }
    let testArticle =  { "data" : { "title": "This is my test blog title", "content" : "This is my test content" } }

    
    beforeAll(()=> {
        app = server.listen(3001, ()=> console.log("test serv started"))
    })

    afterAll(done =>{
        console.log("server stopped testing")
        app.close(done)
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

    it("adds a new article", done => {
        request(app)
        .post("/article")
        .send(testArticle)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json; charset=utf-8')
        .expect({"message" : "Article submitted"})
        .expect(201, done);
    })

})