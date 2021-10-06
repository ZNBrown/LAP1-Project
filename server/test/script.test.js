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
const exp = require("constants");
const html = fs.readFileSync(path.resolve(__dirname, '..', '..', './client', './index.html'))



describe('tests form to add new posts', () => {

    beforeAll(() => {
        document.documentElement.innerHTML = html.toString();
    })

    // test('Check if blog form capable of adding new entry', ()=>{
    //     fetch = jest.fn(() => Promise.resolve({
    //         json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
    //       }));
    //     require('../../client/static/JS/index');
    //     const newJournalForm = document.getElementById('newJournalForm')
    //     const newJournalTitle = document.getElementById('newJournalTitle')
    //     const newJournalBody = document.getElementById('newJournalBody')
    //     const content = document.getElementById('dynamic')

    //     newJournalTitle.value = "newJournalTitle";
    //     newJournalBody.value = "newJournalBody";
    //     newJournalForm.dispatchEvent(new Event('submit'));
    //     console.log(newJournalTitle.value);
    //     console.log(newJournalBody.value);
    //     console.log(content.innerHTML)
        
    // })

    test('Check if page initialises with test database post', ()=>{
        fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve(backup),
        }));
        window.scroll = jest.fn();
        require('../../client/static/JS/index');
        expect(fetch.mock.calls.length).toBe(1)
        expect(fetch.mock.calls[0][0]).toBe('http://localhost:3000/getall')
        fetch()
        .then(res=>res.json()).then(() => {
            //spoofs the fetch
            //probably bad form but by the time this is loaded we know the actual page has loaded
            //console.log(`inside of fetch${document.documentElement.innerHTML}`)
            const content = document.getElementById('dynamic')
            //console.log(content.firstChild.innerHTML)
            expect(content.firstChild.innerHTML).toBe(`<h2 class="blogTitle">Stabby Dog</h2><img class="gifContainer" src="https://media3.giphy.com/media/iDJQRjTCenF7A4BRyU/giphy.gif?cid=ab93a719zj9j2p00dtl4wepbfm5y97p789n4ud2wetss4tri&amp;rid=giphy.gif&amp;ct=g"><p class="blogContent">Here is a stabby dog</p><div class="buttonParent"><form class="reactForm"><button id="thumbButtonUp" type="submit"></button><button id="thumbButtonDown" type="submit"></button><button id="eyesButton" type="submit"></button><input id="articleID2" type="hidden" class="articleID" value="0"></form><button class="commentButton">Add Comment</button><button></button></div><form class="commentForm"><input maxlength="256" type="text" class="commentBody"><input id="articleID" type="hidden" class="articleID" value="0"><input type="submit" value="Submit Comment" class="submitComment"></form><div class="commentDiv"><hr><p class="comment"></p></div>`)
        })
    })

})

/*
//dummy code to check i am still sane and testing can access index script and html
test('Check addTodo able add todo to todoList', () => {
    fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
    }));
    document.documentElement.innerHTML = html.toString();
    console.log(html.toString());
    require('../../client/static/JS/index.js');
  
    const newTodoInput = document.getElementById('newTodoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todolist = document.getElementById('todoList');
  
    newTodoInput.value = 'New todolist!';
    addTodoBtn.click();
  
    expect(todolist.innerHTML).toBe('<li>New todolist!</li>');
  });
//html below
    <section id="dynamic">
    </section>
    <input id="newTodoInput" />
    <button id="addTodoBtn">Add todo</button>
    <ol id="todoList"></ol>
//js below
    const addTodo = () => {
    const newTodoInput = document.getElementById('newTodoInput');
    let currentTodoList = document.getElementById('todoList').innerHTML;
    currentTodoList += `<li>${newTodoInput.value}</li>`;
    document.getElementById('todoList').innerHTML = currentTodoList;
    newTodoInput.value = '';
  }
  
  document.getElementById('addTodoBtn').addEventListener('click', addTodo);

  */