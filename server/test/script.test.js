/**
 * @jest-environment jsdom
 */

let scriptFuncs;
const request = require("supertest")
const server = require("../server")
const journals = require('../journals.json')
const express = require('express');
const { expect} = require('@jest/globals');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '..', '..', './client', './index.html'))



describe('tests form to add new posts', () => {

    beforeAll(() => {
        //<head><script src="../../client/static/JS/index" defer></script></head>
        //app = server.listen(3002, ()=> console.log("test serv for client started"))
        /*
        document.documentElement.innerHTML = `<body>
        <header>
            <div id="header">
                 
        
    
                <button id="newJournal">Add<br> New<br> Post
                </button>
    
                <h1>BLOG</h1>
            </div>
        </header>
    
        <button id="newJournal">New Journal</button>
        <form id="newJournalForm">
            <input id="newJournalTitle" type='text'>
            <textarea name="" rows="10" id='newJournalBody' type='text' maxlength="256" placeholder="Type your post in here"></textarea>
            <input type='submit' id="newJournal" value='Submit'>
            <input type="text" id="searchGif" placeholder="Search for GIF">
            <input type="submit"  id="gifButton" value="Search GIF">
            <input type="hidden" id="gifLink">
            <div id="gifDisplay">
    
            </div>
        </form>
        <section id="dynamic">
        </section>
    </body>`;
        body = document.querySelector('body')*/

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

    test('Check if page initialises with content', ()=>{
        fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve(journals),
        }));
        console.log(journals)
        window.scroll = jest.fn();
        require('../../client/static/JS/index');
        expect(fetch.mock.calls.length).toBe(1)
        expect(fetch.mock.calls[0][0]).toBe('http://localhost:3000/getall')
        console.log(document.documentElement.innerHTML)
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