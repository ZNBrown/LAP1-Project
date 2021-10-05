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
    let newJournalButton = document.getElementById('newJournal')
    let newJournalForm = document.getElementById('newJournalForm')
    newJournalButton.addEventListener('click', ()=> {
        newJournalForm.style.display = 'block'
    })
    newJournalForm.addEventListener('submit', async (e)=> {
        e.preventDefault();
        console.log(e);
        let title = e.target.newJournalTitle.value;
        let content = e.target.newJournalBody.value;
        let data = { "title": title, "content": content};
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
    await fetch("http://localhost:3000/comment", {method: "POST", 
    body: JSON.stringify({data}),
    headers : {"Content-Type" : "application/json" }})
    .catch(error => console.warn(error))
    refresh();

}

function renderPosts(articleIDToPass, title, body, date, comments, reactions, position) {
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


    showComments.addEventListener('click', () => {
        commentDiv.style.display = "block";
    })
    commentButton.addEventListener('click', () => {
        commentForm.style.display = "block";
    })
    reactForm.addEventListener('submit', handleEmoji);
    commentForm.addEventListener('submit', handleComment);


    thumbButtonUp.innerText = `👍: ${reactions[0]['thumbsUp']}`;
    thumbButtonDown.innerText = `👎: ${reactions[1]['thumbsDown']}`;
    eyesButton.innerText = `👀: ${reactions[2]['eyes']}`;
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
    submitComment.value = 'Submit Comment'

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


    commentButton.textContent = "Comment";

    for (const comment of comments) {
        let commentToWrite = document.createElement('p');
        commentToWrite.innerText = comment;
        commentDiv.append(commentToWrite);
    }

    reactForm.append(thumbButtonUp, thumbButtonDown, eyesButton, articleID2);
    commentForm.append(commentBody, articleID, submitComment);
    buttonParent.append(reactForm, commentButton);
    parentDiv.append(blogTitle, blogContent, buttonParent, commentForm, commentDiv);
    document.querySelector('#dynamic').prepend(parentDiv);

    blogTitle.textContent = title;
    blogContent.textContent = body;
    articleID.value = articleIDToPass;
    articleID2.value = articleIDToPass;
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
            renderPosts(articleIDToPass, title, body, date, comments, reactions, position);
        }
    })
}

getJournals();
initialise();