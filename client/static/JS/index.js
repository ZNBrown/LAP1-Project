function exampleFetch() {
    fetch("http://localhost:3000/")
    .then(res=>res.json()).then(data => (console.log(data)))
}

function renderPosts(articleIDToPass, title, body, date, comments, reactions) {
    let parentDiv = document.createElement('div')
    let blogTitle = document.createElement('h2')
    let blogContent = document.createElement('p')
    let buttonParent = document.createElement('div')
    let commentButton = document.createElement('button')
    let reactButton = document.createElement('button')
    let commentForm = document.createElement('form')
    let commentBody = document.createElement('input')
    let articleID = document.createElement('input')
    let submitComment = document.createElement('input')
    commentBody.type = "text";
    articleID.type = 'hidden';
    submitComment.type = 'submit';
    parentDiv.setAttribute("class", "parentDiv")
    blogContent.setAttribute("class", "blogContent")
    blogTitle.setAttribute("class", "blogTitle")
    buttonParent.setAttribute("class", "buttonParent")
    commentButton.setAttribute("class", "commentButton")
    reactButton.setAttribute("class", "reactButton")
    commentForm.setAttribute("class", "commentForm")
    commentBody.setAttribute("class", "commentBody")
    articleID.setAttribute("class", "articleID")
    submitComment.setAttribute("class", "submitComment")

    reactButton.textContent = "react"
    commentButton.textContent = "comment"

    commentForm.append(commentBody, articleID, submitComment)
    buttonParent.append(reactButton, commentButton)
    parentDiv.append(blogTitle, blogContent, buttonParent, commentForm)
    document.querySelector('body').append(parentDiv);

    blogTitle.textContent = title;
    blogContent.textContent = body;
    articleID.value = articleIDToPass;
}

function getJournals() {
    fetch("http://localhost:3000/getall")
    .then(res=>res.json()).then(data => {
        let journalNum = data.articles.length;
        for (let index = 0; index < journalNum; index++) {
            let title = data.articles[index]['title']
            let body = data.articles[index]['body']
            let comments = data.articles[index]['comments']
            let reactions = data.articles[index]['reactions']
            let date = data.articles[index]['date']
            let articleIDToPass = data.articles[index]['articleID']
            renderPosts(articleIDToPass, title, body, date, comments, reactions)
        }
    })
}

getJournals();