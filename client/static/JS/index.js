
//This is the user specific key required for the Giphy API
const APIkey = 'VUq7xxD1xM1rS9w2Typt9A6VC7soZwLY';

//This is unused in the operation of the client, was used to test that data was returned from the server
// function exampleFetch() {
//     fetch("http://localhost:3000/")
//     .then(res=>res.json()).then(data => (console.log(data)))
// }


//the refresh function tears down the main content of the page and re-builds it
function refresh(){
    //The users current scroll position is saved
    position = window.scrollY
    //This will sequentially remove all content inside the 'dynamic' container
    //'dynamic' is the container that stores the journals
    section = document.getElementById('dynamic')
    while(section.firstChild){
        section.firstChild.remove()
    }
    //when 'dynamic' has been cleared, getJournals is called to re-build with updated content
    //position is passed so the user can be restored to the same place on the page
    getJournals(position);
}


//The initialise function deals with the functionality of the nav bar and the new article form
//This is where the Giphy API is used
function initialise() {
    
    let newJournalButton = document.getElementById('newJournalButton');
    let newJournalForm = document.getElementById('newJournalForm');


    //The event listener below is used to toggle the display of the new journal form
    newJournalButton.addEventListener('click', ()=> {
        if(newJournalForm.style.display === 'grid'){
            newJournalForm.style.display = 'none'
        } else {
            newJournalForm.style.display = 'grid'
        }
        
    })


    newJournalForm.addEventListener('submit', async (e)=> {
        e.preventDefault();

        //the submitter ID is used to decide whether to poll the Giphy API or send data to the server
        submitterID = e.submitter.id;
        if (submitterID === "newJournal"){
            //the contents of the form are passed to the new article function in the server
            let title = e.target.newJournalTitle.value;
            let content = e.target.newJournalBody.value;
            let gifUrl = document.querySelector('#gifLink').value;
            let data = { "title": title, "content": content, "gifUrl": gifUrl};
            try {
                response = await fetch("http://localhost:3000/article", {method: "POST", 
                body: JSON.stringify({data}),
                headers : {"Content-Type" : "application/json" }
                })
            } catch(error) { console.warn(error) }
            // refresh is called so that the new article will be displayed without a manual refresh
            refresh();
            //the contents of the form are cleared ready for the next use
            document.querySelector('#newJournalTitle').value = "";
            document.querySelector('#newJournalBody').value = ""; 
            document.querySelector('#newJournalForm').style.display = 'none';
            document.querySelector('#gifDisplay').innerHTML = '';
            document.querySelector('#searchGif').value = "";
            document.querySelector('#gifLink').value = "";
        }   else if (submitterID === "gifButton"){
            try {
                //obtains the desired search term
                searchterm = e.target.searchGif.value;
                //fetches gifs based on search term from giphy
                //link is set to return 6 gifs
                let response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=VUq7xxD1xM1rS9w2Typt9A6VC7soZwLY&q=${searchterm}&limit=6&offset=0&rating=r&lang=en`)
                let data = await response.json()
                //loops through the 6 gifs returned from Giphy
                for(let a = 0; a<6;a++){
                    //obtaines the url of gif and creates an image 
                    let gifUrl = data.data[a]['images']['original']['url'];
                    let gif = document.createElement('img');
                    gif.src = `${gifUrl}`;
                    gif.setAttribute("class","gif");
                    //gif is added to the grided gifDisplay
                    document.querySelector('#gifDisplay').append(gif);
                    //when clicked the gif is highlighted briefly in gold
                    //the hidden form input gifLink is given the value of the chosen gif url
                    gif.addEventListener('click', () => {
                        document.querySelector('#gifLink').value = gifUrl;
                        gif.style.border = "2px solid gold";
                        setTimeout(() => { gif.style.border = "0px"}, 500)
                    })
                }
            
            } catch (err) {console.warn(err)}

        }
    })
}

async function handleEmoji(e) {
    e.preventDefault();
    //each of the react buttons has its own submitter id
    let articleID = e.target.articleID2.value;
    let submitterID = e.submitter.id;
    //the submitter id and article id is sent to the server in order to increment the required reaction and change the weighting
    let data = { articleID : articleID, submitterID : submitterID};
    try {
        const response = await fetch("http://localhost:3000/react", {method: "POST", 
        body: JSON.stringify({data}),
        headers : {"Content-Type" : "application/json" }})
        const uniqueReturn = await response.json();
    }
    catch(error){
        console.log(error)
    }
    //the page is rebuilt automatically to reflect updated values
    refresh();
}


async function handleComment(e){
    e.preventDefault();
    let articleID = e.target.articleID.value;
    let commentData = e.target.commentData.value;
    let data = { articleID : articleID, commentData : commentData};
    // comment data and article ID are sent to the server to be added to journals.json
    await fetch("http://localhost:3000/comment", {method: "POST", 
    body: JSON.stringify({data}),
    headers : {"Content-Type" : "application/json" }})
    .catch(error => console.warn(error))
    //refresh page to show newly added comments
    refresh();

}

function renderPosts(articleIDToPass, title, body, date, comments, reactions, position, gifUrl) {
    //create all elements needed for the display of each article
    let parentDiv = document.createElement('div');
    let blogTitle = document.createElement('h2');
    let blogContent = document.createElement('p');
    let buttonParent = document.createElement('div');
    let commentButton = document.createElement('button');
    let showComments = document.createElement('button');
    let commentDiv = document.createElement('div');
    let reactForm = document.createElement('form');
    let thumbButtonUp = document.createElement('button');
    let thumbButtonDown = document.createElement('button');
    let eyesButton = document.createElement('button');
    let commentForm = document.createElement('form');
    let commentBody = document.createElement('input');
    let articleID = document.createElement('input');
    let articleID2 = document.createElement('input');
    let submitComment = document.createElement('input');
    let gifContainer = document.createElement('img');
    let divider = document.createElement('hr');
    let dateTime = document.createElement("p");
    let reactShowButton = document.createElement('button');

    //adds functionality to the react button
    //hides the comment related buttons and shows the reaction buttons
    //only used when viewed on a device with a width of less than 700px
    reactShowButton.addEventListener('click', () => {
        if (commentButton.style.display === "none"){
            commentButton.style.display = "block";
            showComments.style.display = "block";
            reactForm.style.display = "none";
        } else {
            commentButton.style.display = "none";
            showComments.style.display = 'none';
            reactForm.style.display = "block";
        }
    })

    //adjusts the size of the post container to show the comments for each post
    //if comments are visible the opposite happens
    showComments.addEventListener('click', () => {
        if (commentDiv.style.display === "block"){
            parentDiv.style.gridTemplateRows = "50px 1fr 50px";
            commentDiv.style.display = "none";
            commentForm.style.display = "none";
            parentDiv.style.height = `500px`;
        } else {
            parentDiv.style.gridTemplateRows = `50px 3fr 50px 2fr `;
            parentDiv.style.height = `800px`;
            commentDiv.style.display = "block";
            commentForm.style.display = "none";
        }
    })

    //Button to show/hide new comment form
    commentButton.addEventListener('click', () => {
        if (commentForm.style.display === "block"){
            parentDiv.style.gridTemplateRows = "50px 1fr 50px";
            commentDiv.style.display = "none";
            commentForm.style.display = "none";
        } else {
            parentDiv.style.gridTemplateRows = "50px 4fr 50px 1fr ";
            commentDiv.style.display = "none";
            commentForm.style.display = "block";
        }
    })

    //submits reaction to server
    reactForm.addEventListener('submit', handleEmoji);

    //submits new comment to server
    commentForm.addEventListener('submit', handleComment);

    //Add inner text to buttons
    commentButton.textContent = "Add Comment";
    showComments.innerText = 'Show Comments';
    // Numbers representing the reactions are updated from the server
    thumbButtonUp.innerText = `👍 : ${reactions[0]['thumbsUp']}`;
    thumbButtonDown.innerText = `👎 : ${reactions[1]['thumbsDown']}`;
    eyesButton.innerText = `👀 : ${reactions[2]['eyes']}`;


    //add ID's 
    thumbButtonDown.setAttribute('id', "thumbButtonDown");
    thumbButtonUp.setAttribute('id', "thumbButtonUp");
    eyesButton.setAttribute('id' , "eyesButton");
    articleID.setAttribute('id',"articleID" );
    articleID2.setAttribute('id',"articleID2" );
    commentBody.setAttribute('maxlength', "256");
    
    //adds types to inputs
    thumbButtonDown.type = 'submit';
    thumbButtonUp.type = 'submit';
    eyesButton.type = 'submit';
    commentBody.type = "text";
    articleID.type = 'hidden';
    articleID2.type = 'hidden';
    submitComment.type = 'submit';
    submitComment.value = 'Submit Comment';
    reactShowButton.textContent = "React"

    //set classes to added elements for styling
    parentDiv.setAttribute("class", "parentDiv");
    blogContent.setAttribute("class", "blogContent");
    blogTitle.setAttribute("class", "blogTitle");
    buttonParent.setAttribute("class", "buttonParent");
    commentButton.setAttribute("class", "commentButton");
    reactForm.setAttribute("class", "reactForm");
    commentForm.setAttribute("class", "commentForm");
    commentBody.setAttribute("class", "commentBody");
    articleID.setAttribute("class", "articleID");
    articleID2.setAttribute("class", "articleID");
    submitComment.setAttribute("class", "submitComment");
    gifContainer.setAttribute("class", "gifContainer");
    commentDiv.setAttribute("class","commentDiv");
    dateTime.setAttribute("class", "dateTime");
    showComments.setAttribute("class","showComments");
    reactShowButton.setAttribute("class","reactShowButton");

    //add individual comments to commentDiv
    commentDiv.append(divider);
    for (const comment of comments) {
        let commentToWrite = document.createElement('p');
        commentToWrite.setAttribute("class","comment")
        commentToWrite.innerText = comment;
        commentDiv.append(commentToWrite);
    }

    //append elements into their required parents
    reactForm.append(thumbButtonUp, thumbButtonDown, eyesButton, articleID2);
    commentForm.append(commentBody, articleID, submitComment);
    buttonParent.append(reactShowButton, reactForm, commentButton, showComments);
    parentDiv.append(blogTitle, dateTime, gifContainer, blogContent, buttonParent, commentForm, commentDiv);
    document.querySelector('#dynamic').append(parentDiv);

    //set the data from the sever to corresponding elements
    blogTitle.textContent = title;
    blogContent.textContent = body;
    articleID.value = articleIDToPass;
    articleID2.value = articleIDToPass;

    //gets time since post was created
    dateTime.textContent = timeSince(date);

    //if no gif was set, the gif display box is hidden
    if (gifUrl === undefined || gifUrl === ''){
        gifUrl = '';
        gifContainer.style.display = 'none'
        parentDiv.style.gridTemplateColumns = "100%"
    }
    //set the image source to the url stored in journals.json
    gifContainer.src = gifUrl;

    //sets returns the user to their previous position on the page
    window.scroll(0, position);

}

//returns the age of posts in plain English
function timeSince(date){
    postDate = Date.parse(date);
    now = new Date();
    secondsSince = Math.floor((now-postDate)/1000);

    let years = secondsSince /(60*60*24*365);
    if (years > 1){
        return `${Math.floor(years)} years ago`;
    } else {
        let months = secondsSince/(60*60*24*30);
        if (months > 1){
            return `${Math.floor(months)} months ago`;
        } else {
            let days = secondsSince/(60*60*24);
            if (days > 1) {
                return `${Math.floor(days)} days ago`;
            } else {
                let hours = secondsSince/(60*60);
                if (hours >1){
                    return `${Math.floor(hours)} hours ago`;
                } else {
                    let minutes = secondsSince/(60);
                    if (minutes > 1) {
                        return `${Math.floor(minutes)} minutes ago`;
                    } else {
                        return `${Math.floor(secondsSince)} seconds ago`;
                    }
                }
            }
        }
    }
}

//obtains all of the current articles
function getJournals(position=0) {
    fetch("http://localhost:3000/getall")
    .then(res=>res.json()).then(data => {
        let journalNum = data.articles.length;
        let articles = data.articles;
        //used to sort the posts based on their weighting
        function compare(a,b){
            if (a.weighting < b.weighting){
                return 1;
            } else if (a.weighting > b.weighting){
                return -1;
            } else {
                return 0;
            }
        };
        articles.sort( compare );
        //obtains values and runs renderPosts function for each post
        for (let index = 0; index < journalNum; index++) {
            let title = articles[index]['title'];
            let body = articles[index]['body'];
            let comments = articles[index]['comments'];
            let reactions = articles[index]['reactions'];
            let date = articles[index]['date'];
            let articleIDToPass = articles[index]['articleID'];
            let gifLink = articles[index]['gifUrl']
            renderPosts(articleIDToPass, title, body, date, comments, reactions, position, gifLink);
        }
    })
}

//ensures that the posts are brought in and displayed on reload of the page
getJournals();

//initialises buttons in the nav
initialise();
