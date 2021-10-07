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

describe('tests interactive elements', () => {
    jest.setTimeout(100000);

    beforeAll(() => {
        document.documentElement.innerHTML = html.toString();
    })

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
      });

      test('Check if we can react to the first post', async ()=>{
        fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve(backup),
        }));
        window.scroll = jest.fn();

        require('../../client/static/JS/index');
        await new Promise((r) => setTimeout(r, 1000));
        
        const content = document.getElementById('dynamic');
        const parent = content.firstChild;
        const form = parent.querySelector('.reactForm');
        const articleID2 = document.getElementById('articleID2');
        // button.click(); bad idea: event information not sent
        // have the form send an event that mirrors the click instead
        //sending button as submitter just sends innerText and not the whole object
        //have to spoof attributes of the button we want instead
        let submitEvent = new Event('submit', {});
        submitEvent.submitter = {"id" : "thumbButtonUp"};
        Object.defineProperty(submitEvent, 'target', {writable: false, value: {"articleID2" : {"value" : articleID2.value}}});
        form.dispatchEvent(submitEvent);
        expect(fetch.mock.calls.length).toBe(2)
        expect(fetch.mock.calls[1][0]).toBe('http://localhost:3000/react')
        expect(fetch.mock.calls[1][1].body).toBe(`{"data":{"articleID":"0","submitterID":"thumbButtonUp"}}`)
        //render test post
        expect(content.firstChild.innerHTML).toBe(`<h2 class=\"blogTitle\">Stabby Dog</h2><p class=\"dateTime\">5 months ago</p><img class=\"gifContainer\" src=\"https://media3.giphy.com/media/iDJQRjTCenF7A4BRyU/giphy.gif?cid=ab93a719zj9j2p00dtl4wepbfm5y97p789n4ud2wetss4tri&amp;rid=giphy.gif&amp;ct=g\"><p class=\"blogContent\">Here is a stabby dog</p><div class=\"buttonParent\"><form class=\"reactForm\"><button id=\"thumbButtonUp\" type=\"submit\"></button><button id=\"thumbButtonDown\" type=\"submit\"></button><button id=\"eyesButton\" type=\"submit\"></button><input id=\"articleID2\" type=\"hidden\" class=\"articleID\" value=\"0\"></form><button class=\"commentButton\">Add Comment</button><button></button></div><form class=\"commentForm\"><input maxlength=\"256\" type=\"text\" class=\"commentBody\"><input id=\"articleID\" type=\"hidden\" class=\"articleID\" value=\"0\"><input type=\"submit\" value=\"Submit Comment\" class=\"submitComment\"></form><div class=\"commentDiv\"><hr><p class=\"comment\"></p></div>`)
        //render post form 
        const newJournalForm = document.getElementById('newJournalForm')
        const newJournalTitle = document.getElementById('newJournalTitle')
        const newJournalBody = document.getElementById('newJournalBody')

        // newJournalTitle.value = "newJournalTitle";
        // newJournalBody.value = "newJournalBody";
        // submitEvent.submitter = {"id" : "thumbButtonUp"};
        // Object.defineProperty(submitEvent, 'target', {writable: false, value: {"articleID2" : {"value" : articleID2.value}}});
        })   

    // test('Check if page calls correct fetches', async()=>{
    //     fetch = jest.fn(() => Promise.resolve({
    //         json: () => Promise.resolve(backup),
    //     }));
    //     window.scroll = jest.fn();
    //     require('../../client/static/JS/index');
    //     await new Promise((r) => setTimeout(r, 500));

    //     expect(fetch.mock.calls.length).toBe(1)
    //     expect(fetch.mock.calls[0][0]).toContain('http://localhost:3000/getall')
    // })
    
    // test('Check if page renders test post correctly', async ()=>{
    //     const content = document.getElementById('dynamic')

    //     fetch = jest.fn(() => Promise.resolve({
    //         json: () => Promise.resolve(backup),
    //     }));
    //     window.scroll = jest.fn();
    //     require('../../client/static/JS/index');
    //     await new Promise((r) => setTimeout(r, 2000));
    //     expect(content.firstChild.innerHTML).toBe(`<h2 class=\"blogTitle\">Stabby Dog</h2><p class=\"dateTime\">5 months ago</p><img class=\"gifContainer\" src=\"https://media3.giphy.com/media/iDJQRjTCenF7A4BRyU/giphy.gif?cid=ab93a719zj9j2p00dtl4wepbfm5y97p789n4ud2wetss4tri&amp;rid=giphy.gif&amp;ct=g\"><p class=\"blogContent\">Here is a stabby dog</p><div class=\"buttonParent\"><form class=\"reactForm\"><button id=\"thumbButtonUp\" type=\"submit\"></button><button id=\"thumbButtonDown\" type=\"submit\"></button><button id=\"eyesButton\" type=\"submit\"></button><input id=\"articleID2\" type=\"hidden\" class=\"articleID\" value=\"0\"></form><button class=\"commentButton\">Add Comment</button><button></button></div><form class=\"commentForm\"><input maxlength=\"256\" type=\"text\" class=\"commentBody\"><input id=\"articleID\" type=\"hidden\" class=\"articleID\" value=\"0\"><input type=\"submit\" value=\"Submit Comment\" class=\"submitComment\"></form><div class=\"commentDiv\"><hr><p class=\"comment\"></p></div>`)

    // })

    // test('Check if blog form capable of adding new entry', async()=>{
    //     fetch = jest.fn(() => Promise.resolve({
    //         json: () => Promise.resolve(backup),
    //     }));
    //     window.scroll = jest.fn();

    //     require('../../client/static/JS/index');
    //     jest.setTimeout(50000);
    //     await new Promise((r) => setTimeout(r, 1000));
    //     const newJournalForm = document.getElementById('newJournalForm')
    //     const newJournalTitle = document.getElementById('newJournalTitle')
    //     const newJournalBody = document.getElementById('newJournalBody')
    //     const content = document.getElementById('dynamic')

    //     newJournalTitle.value = "newJournalTitle";
    //     newJournalBody.value = "newJournalBody";
    //     newJournalForm.dispatchEvent(new Event('submit'));
        
    // })

    
 

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