/**
 * @jest-environment jsdom
 */

let scriptFuncs;
const request = require("supertest")
const server = require("../server")
const backup = require('../backup.json')
const express = require('express');
const { expect} = require('@jest/globals');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '..', '..', './client', './index.html'))
document.documentElement.innerHTML = html.toString();



//current issue: not sure how to setup and teardown


jest.setTimeout(10000)

describe('tests interactive elements', () => {
    
    test('Check if page does literally everything at once', async()=>{
        document.documentElement.innerHTML = html.toString();
        fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve(backup),
        }));
        window.scroll = jest.fn();
        require('../../client/static/JS/index');
        await new Promise((r) => setTimeout(r, 2000));

        expect(fetch.mock.calls.length).toBe(1)
        expect(fetch.mock.calls[0][0]).toContain('http://localhost:3000/getall')
        //correct fetches
        
        let content = document.querySelector('#dynamic')
        let resolveContentTest;
        if (content.innerHTML.includes(`<div class="parentDiv"><h2 class="blogTitle">Stabby Dog</h2><p class="dateTime">5 months ago</p><img class="gifContainer" src="https://media3.giphy.com/media/iDJQRjTCenF7A4BRyU/giphy.gif?cid=ab93a719zj9j2p00dtl4wepbfm5y97p789n4ud2wetss4tri&amp;rid=giphy.gif&amp;ct=g"><p class="blogContent">Here is a stabby dog</p><div class="buttonParent"><button class="reactShowButton">React</button><form class="reactForm"><button id="thumbButtonUp" type="submit">👍 : 1</button><button id="thumbButtonDown" type="submit">👎 : 5</button><button id="eyesButton" type="submit">👀 : 1</button><input id="articleID2" type="hidden" class="articleID" value="0"></form><button class="commentButton">Add Comment</button><button class="showComments">Show Comments</button></div><form class="commentForm"><input maxlength="256" type="text" class="commentBody"><input id="articleID" type="hidden" class="articleID" value="0"><input type="submit" value="Submit Comment" class="submitComment"></form><div class="commentDiv"><hr><p class="comment">nice knife</p></div></div>`))        
        {
            resolveContentTest = true;
        }
        else{
            resolveContentTest = false
        }
        expect(resolveContentTest).toBe(false)
        //backup post renders correctly


        let submitEmoji = new Event('submit', {});
        submitEmoji.submitter = {"id" : "thumbButtonUp"};
        Object.defineProperty(submitEmoji, 'target', {writable: false, value: {"articleID2" : {"value" : 0}}});
        let emojiForm = document.querySelector('.reactForm')
        emojiForm.dispatchEvent(submitEmoji);
        expect(fetch.mock.calls.length).toBe(2)
        expect(fetch.mock.calls[1][0]).toBe('http://localhost:3000/react')
        expect(fetch.mock.calls[1][1].body).toBe("{\"data\":{\"articleID\":0,\"submitterID\":\"thumbButtonUp\"}}")
        //correct calls of fetch to the emoji's




        let submitComment = new Event('submit', {});
        Object.defineProperty(submitComment, 'target', {writable: false, value: {"commentData": {"value" : "DOM comment"}, "articleID": {"value" : 0}}});
        let commentForm = document.querySelector('.commentForm')
        commentForm.dispatchEvent(submitComment);
        
        expect(fetch.mock.calls.length).toBe(3)
        expect(fetch.mock.calls[2][0]).toBe('http://localhost:3000/comment')
        expect(fetch.mock.calls[2][1].body).toBe("{\"data\":{\"articleID\":0,\"commentData\":\"DOM comment\"}}")
        //correct fetch calls for dispatching the comment

        const newJournalForm = document.getElementById('newJournalForm')
        let submitJournal = new Event('submit', {});
        submitJournal.submitter = {"id" : "newJournal"};

        Object.defineProperty(submitJournal, 'target', {writable: false, value: {"newJournalTitle": {"value" : "DOM Title"}, 
        "newJournalBody": {"value" : "DOM Body"}}});



        /*
        <form id="newJournalForm">
            <input id="newJournalTitle" class="newJournalFormClass" type="text" placeholder="Title">
            <textarea name="" rows="10" id="newJournalBody" class="newJournalFormClass" type="text" maxlength="2000" placeholder="Type your post in here"></textarea>
            <input class="newJournalFormClass" type="submit" id="newJournal" value="Submit">
            <input class="newJournalFormClass" type="text" id="searchGif" placeholder="Search for GIF">
            <input class="newJournalFormClass" type="submit" id="gifButton" value="Search GIF">
            <input class="newJournalFormClass" type="hidden" id="gifLink">
            <div id="gifDisplay">

            </div>
        </form>
        */

        newJournalForm.dispatchEvent(submitJournal);
        expect(fetch.mock.calls.length).toBe(4)
        expect(fetch.mock.calls[3][0]).toBe('http://localhost:3000/article')
        expect(fetch.mock.calls[3][1].body).toBe(`{\"data\":{\"title\":\"DOM Title\",\"content\":\"DOM Body\",\"gifUrl\":\"\"}}`)
        //correct fetch calls for dispatching a new journal, no gif
        
        

        }) 

})
