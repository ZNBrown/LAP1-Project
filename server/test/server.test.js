const request = require("supertest")
const server = require("../server")

describe("test", () => {
    let app;
    
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
})