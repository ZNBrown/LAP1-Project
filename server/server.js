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


// CORS HEADERS:
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next()
});


//get all articles
//returns the entire contents journals.json file for sorting and display by the client
app.get('/getall', (req, res) => {
    res.json(journals).status(200);
})

// Saves user comments against the corresponding journal
app.post('/comment', (req, res)=>{
    articleID = req.body.data.articleID;
    //Obtains the specific journal based on the article id and pushes the new comment to the comment array
    journalToComment = journals.articles[articleID];
    commentData = req.body.data.commentData;
    journalToComment.comments.push(commentData);

    // the updated journals object is then saved back in journals.json, overwriting the original content
    fs.writeFile('./journals.json', JSON.stringify(journals), (error)=> {
        if (error) throw error ; console.log("File saved")
    })
    res.status(201).json({"message": "Comment appended successfully"});
})

//Save user reactions to journals.json
app.post('/react', (req, res)=> {
    articleID = req.body.data.articleID;
    journalToReact = journals.articles[articleID]
    submitterID = req.body.data.submitterID;
    let counter;
    switch(submitterID){
        case 'thumbButtonUp':
            //counter is given the current value for the given reaction
            // counter is then incremented and the new value returned to the journals object
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
    // each article is given a weighting based on the number of reactions against it
    // after each new reaction, the weighting is re-calculated and its value saved to journals.
    let weight = calcWeighting(articleID);
    journalToReact.weighting = weight;

    //the ammended journals object is saved into journal.json, overwriting the previous values.
    fs.writeFile('./journals.json', JSON.stringify(journals), (error)=> {
        if (error) throw error ; console.log("File saved")
    })
    res.status(201).json({"message": "all good! : )"}).status(201);
})

//add new article
app.post('/article', (req, res) => {
    let info = req.body.data
    //the article ID is equal to the position in the articles array inside journal.json
    let articleId = journals.articles.length
    // the current date and time is saved to enable an age to be displayed in the client
    let today = new Date();
    
    reactions = [{"thumbsUp" : 0}, {"thumbsDown" : 0}, {"eyes" : 0}]
    
    //newArticle matches the format of journals.json
    let newArticle = { "articleID" : articleId,
        "title" : info.title,
        "body" : info.content,
        "date" : today,
        "comments" : [],
        "reactions" : [{"thumbsUp" : 0}, {"thumbsDown" : 0}, {"eyes" : 0}],
        "gifUrl" : info.gifUrl
    }
    
    //the new article is appended to the article array and saved into journals.json
    journals.articles.push(newArticle); 
    
    // all articles must have a weighting, as a new article has no reactions it is artificially moved up the rankings
    let weight = calcWeighting(articleId);
    newArticle['weighting'] = weight;

    
    fs.writeFile('./journals.json', JSON.stringify(journals), (error)=> {
        if (error) throw error ; console.log("File saved")
    })
    res.status(201).json({"message": "Article submitted"});

})

function calcWeighting(articleID){
    //obtains the number of reactions for each emoji based on the article ID passed to the function
    let reactStats = journals.articles[articleID]['reactions'];
    let thumbsUp = reactStats[0]["thumbsUp"];
    let thumbsDown = reactStats[1]["thumbsDown"];
    let eyes = reactStats[2]['eyes'];

    //if the article has no reactions it is likely new and so is given a base weighting of 5 so that it is seen
    if (thumbsUp === 0 && thumbsDown === 0 && eyes === 0){
        weighting = 5;
        console.log(weighting);
        return weighting
    } else {
        //points are assigned based on the type of reaction
        //thumbsUp is worth 1
        //thumbsDown is worth -1
        //eyes is worth 2
        weighting = thumbsUp + 2*eyes - thumbsDown;
        console.log(weighting);
    }   return weighting;
    

}

module.exports=(app);
