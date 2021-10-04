const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());
app.use(express.json())
const fetch = require('node-fetch');
const journals = require('./journals.json')
const fs = require('fs');
const { info } = require('console');
// CORS HEADERS::
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next()
});

app.get('/', (req, res) => {
    res.json(journals.articles[0])
})

app.get('/getall', (req, res) => {
    res.json(journals)
})
//get all articles

//put comment to certain article

//put emoji to certain article

//add new article
app.post('/article', (req, res) => {
    console.log(req);
    let info = req.body.data
    let articleId = journals.articles.length
    console.log(req.body);
    let today = new Date();
    let date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    let newArticle = { "articleID" : articleId,
        "title" : info.title,
        "body" : info.content,
        "date" : date,
        "comments" : [],
        "reactions" : []
    }
    console.log(newArticle);
    // data = fs.read('./journals.json')
    // let parseHelper = JSON.parse(data)
    journals.articles.push(newArticle);
    //dataToPush =  JSON.stringify(parseHelper)
    fs.writeFile('./journals.json', JSON.stringify(journals), (error)=> {
        if (error) throw error ; console.log("File saved")
    })
})

module.exports=(app);
