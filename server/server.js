const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());
app.use(express.json())
const fetch = require('node-fetch');
const journals = require('./journals.json')
const fs = require('fs');
const APIkey = 'VUq7xxD1xM1rS9w2Typt9A6VC7soZwLY';


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

//get all articles
app.get('/getall', (req, res) => {
    res.json(journals)
})

//put comment to certain article
app.post('/comment', (req, res)=>{
    articleID = req.body.data.articleID;
    journalToComment = journals.articles[articleID];
    commentData = req.body.data.commentData;
    journalToComment.comments.push(commentData);
    fs.writeFile('./journals.json', JSON.stringify(journals), (error)=> {
        if (error) throw error ; console.log("File saved")
    })
    res.json({"message": "even better ! : )"}).status(200);
})
//put emoji to certain article
app.post('/react', (req, res)=> {
    articleID = req.body.data.articleID;
    journalToReact = journals.articles[articleID]
    submitterID = req.body.data.submitterID;
    let counter;
    console.log(articleID);
    console.log(submitterID);
    switch(submitterID){
        case 'thumbButtonUp':
            counter = parseInt(journalToReact.reactions[0].thumbsUp)
            counter++;
            journalToReact.reactions[0].thumbsUp = counter;
            break;
        case 'thumbButtonDown':
            counter = parseInt(journalToReact.reactions[1].thumbsDown)
            counter++;
            journalToReact.reactions[1].thumbsDown = counter;
            break;
        case 'eyesButton':
            counter = parseInt(journalToReact.reactions[2].eyes)
            counter++;
            journalToReact.reactions[2].eyes = counter;
            break;
    }
    fs.writeFile('./journals.json', JSON.stringify(journals), (error)=> {
        if (error) throw error ; console.log("File saved")
    })
    res.json({"message": "all good! : )"}).status(200);
})

//add new article
app.post('/article', (req, res) => {
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
        "reactions" : [{"thumbsUp" : 0}, {"thumbsDown" : 0}, {"eyes" : 0}],
        "gifUrl" : info.gifUrl
    }
    journals.articles.push(newArticle);
    fs.writeFile('./journals.json', JSON.stringify(journals), (error)=> {
        if (error) throw error ; console.log("File saved")
    })
    res.json({"message": "all Asasdbsa! : )"}).status(200);

})

module.exports=(app);
