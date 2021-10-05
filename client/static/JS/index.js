const APIkey = 'VUq7xxD1xM1rS9w2Typt9A6VC7soZwLY';

function exampleFetch() {
    fetch("http://localhost:3000/")
    .then(res=>res.json()).then(data => (console.log(data)))
}

function refresh(){

    position = window.scrollY
    section = document.getElementById('dynamic')
    while(section.firstChild){
        section.firstChild.remove()
    }
    getJournals(position);
}

function initialise() {
    let newJournalButton = document.getElementById('newJournal');
    let newJournalForm = document.getElementById('newJournalForm');
    let gifButton = document.getElementById('gifButton');
    newJournalButton.addEventListener('click', ()=> {
        newJournalForm.style.display = 'block'
    })
    newJournalForm.addEventListener('submit', async (e)=> {
        e.preventDefault();
        submitterID = e.submitter.id;
        if (submitterID === "newJournal"){
            let title = e.target.newJournalTitle.value;
            let content = e.target.newJournalBody.value;
            let gifUrl = document.querySelector('#gifLink').value;
            let data = { "title": title, "content": content, "gifUrl": gifUrl};
            console.log(data);
            try {
                response = await fetch("http://localhost:3000/article", {method: "POST", 
                body: JSON.stringify({data}),
                headers : {"Content-Type" : "application/json" }
                })
            } catch(error) { console.warn(error) }
            refresh();
            document.querySelector('#newJournalTitle').value = "";
            document.querySelector('#newJournalBody').value = ""; 
            document.querySelector('#newJournalForm').style.display = 'none';
            document.querySelector('#gifDisplay').innerHTML = '';
            document.querySelector('#searchGif').value = "";
        }   else if (submitterID === "gifButton"){
            try {
                searchterm = e.target.searchGif.value;
                console.log(searchterm);
                let response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=VUq7xxD1xM1rS9w2Typt9A6VC7soZwLY&q=${searchterm}&limit=1&offset=0&rating=r&lang=en`)
                let data = await response.json()
                console.log(data.data[0])
                let gifUrl = data.data[0]['images']['original']['url'];
                document.querySelector('#gifDisplay').innerHTML = `<img src="${gifUrl}"></img>`
                document.querySelector('#gifLink').value = gifUrl;
            
            } catch (err) {console.warn(err)}

        }
    })
}

async function handleEmoji(e) {
    e.preventDefault();
    let articleID = e.target.articleID2.value;
    let submitterID = e.submitter.id;
    let data = { articleID : articleID, submitterID : submitterID};
    try{
    response = await fetch("http://localhost:3000/react", {method: "POST", 
    body: JSON.stringify({data}),
    headers : {"Content-Type" : "application/json" }})


    }
    catch(error) { console.warn(error) }
    refresh();
}

async function handleComment(e){
    e.preventDefault();
    console.log(e);
    let articleID = e.target.articleID.value;
    let commentData = e.target[0].value;
    let data = { articleID : articleID, commentData : commentData};
    console.log(data)
    console.log(JSON.stringify(data))
    await fetch("http://localhost:3000/comment", {method: "POST", 
    body: JSON.stringify({data}),
    headers : {"Content-Type" : "application/json" }})
    .catch(error => console.warn(error))
    refresh();

}

function renderPosts(articleIDToPass, title, body, date, comments, reactions, position, gifUrl) {
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
    reactForm.addEventListener('submit', handleEmoji);
    commentForm.addEventListener('submit', handleComment);

    commentButton.textContent = "Add Comment";
    showComments.innerText = 'Show Comments';
    thumbButtonUp.innerText = `👍 : ${reactions[0]['thumbsUp']}`;
    thumbButtonDown.innerText = `👎 : ${reactions[1]['thumbsDown']}`;
    eyesButton.innerText = `👀 : ${reactions[2]['eyes']}`;
    thumbButtonDown.setAttribute('id', "thumbButtonDown");
    thumbButtonUp.setAttribute('id', "thumbButtonUp");
    eyesButton.setAttribute('id' , "eyesButton");
    articleID.setAttribute('id',"articleID" );
    articleID2.setAttribute('id',"articleID2" );
    commentBody.setAttribute('maxlength', "256");


    thumbButtonDown.type = 'submit';
    thumbButtonUp.type = 'submit';
    eyesButton.type = 'submit';
    commentBody.type = "text";
    articleID.type = 'hidden';
    articleID2.type = 'hidden';
    submitComment.type = 'submit';
    submitComment.value = 'Submit Comment';
   

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
    

    commentDiv.append(divider);
    for (const comment of comments) {
        let commentToWrite = document.createElement('p');
        commentToWrite.setAttribute("class","comment")
        commentToWrite.innerText = comment;
        commentDiv.append(commentToWrite);
    }


    reactForm.append(thumbButtonUp, thumbButtonDown, eyesButton, articleID2);
    commentForm.append(commentBody, articleID, submitComment);
    buttonParent.append(reactForm, commentButton, showComments);
    parentDiv.append(blogTitle, gifContainer, blogContent, buttonParent, commentForm, commentDiv);
    document.querySelector('#dynamic').prepend(parentDiv);

    blogTitle.textContent = title;
    blogContent.textContent = body;
    articleID.value = articleIDToPass;
    articleID2.value = articleIDToPass;
  
    if (gifUrl === undefined || gifUrl === ''){
        gifUrl = '';
        gifContainer.style.display = 'none'
        parentDiv.style.gridTemplateColumns = "100%"
    }
    gifContainer.src = gifUrl;
    window.scroll(0, position);

}

function getJournals(position=0) {
    fetch("http://localhost:3000/getall")
    .then(res=>res.json()).then(data => {
        let journalNum = data.articles.length;
        for (let index = 0; index < journalNum; index++) {
            let title = data.articles[index]['title'];
            let body = data.articles[index]['body'];
            let comments = data.articles[index]['comments'];
            let reactions = data.articles[index]['reactions'];
            let date = data.articles[index]['date'];
            let articleIDToPass = data.articles[index]['articleID'];
            let gifLink = data.articles[index]['gifUrl']
            renderPosts(articleIDToPass, title, body, date, comments, reactions, position, gifLink);
        }
    })
}

getJournals();
initialise();
