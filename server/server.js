const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());
app.use(express.json())
const fetch = require('node-fetch');
const journals = require('./journals.json')
const fs = require('fs');

const { info, count } = require('console');
const { request } = require('express');


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
    res.json(journals).status(200);
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
    res.status(201).json({"message": "Comment appended successfully"});
})
//put emoji to certain article
app.post('/react', (req, res)=> {
    console.log("reached server")
    articleID = req.body.data.articleID;
    journalToReact = journals.articles[articleID]
    submitterID = req.body.data.submitterID;
    let counter;
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
    let weight = calcWeighting(articleID);
    journalToReact.weighting = weight;
    fs.writeFile('./journals.json', JSON.stringify(journals), (error)=> {
        if (error) throw error ; console.log("File saved")
    })
    res.status(201).json({"message": "all good! : )"});
})

//add new article
app.post('/article', (req, res) => {
    let info = req.body.data
    let articleId = journals.articles.length
    let today = new Date();
    console.log(today);
    console.log(`reached here and happy ${articleId}`);

    let weight = calcWeighting(articleId)
    console.log("reached here and happy1");

    // let date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() + " - " + today.getHours() + ":" + today.getMinutes() +":"+ today.getSeconds();
    let newArticle = { "articleID" : articleId,
        "title" : info.title,
        "body" : info.content,
        "date" : today,
        "comments" : [],
        "reactions" : [{"thumbsUp" : 0}, {"thumbsDown" : 0}, {"eyes" : 0}],
        "gifUrl" : info.gifUrl,
        "weighting":weight
    }
    console.log("reached here and happy2");

    journals.articles.push(newArticle);
    console.log("reached here and happy3");

    fs.writeFile('./journals.json', JSON.stringify(journals), (error)=> {
        if (error) throw error ; console.log("File saved")
    })
    res.status(201).json({"message": "Article submitted"});


})

function calcWeighting(articleID){
    let reactStats = journals.articles[articleID]['reactions'];
    console.log(`reactst ${reactStats}`)
    let thumbsUp = reactStats[0]["thumbsUp"];
    let thumbsDown = reactStats[1]["thumbsDown"];
    let eyes = reactStats[2]['eyes'];
    if (thumbsUp === 0 && thumbsDown === 0 && eyes === 0){
        weighting = 5;
        console.log(`this is weighting if ${weighting}`);
        return weighting
    } else {
        weighting = thumbsUp + 2*eyes - thumbsDown;
        console.log(`this is weighting else ${weighting}`);
    }   return weighting;
    

}

module.exports=(app);
