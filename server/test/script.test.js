/**
 * @jest-environment jsdom
 */

let scriptFuncs;
const request = require("supertest")
const server = require("../server")
const journals = require('../journals.json')
const express = require('express');
const fs = require('fs');
const path = require('path');


describe('tests form to add new posts', () => {

    beforeAll(() => {
        //<head><script src="../../client/static/JS/index" defer></script></head>
        //app = server.listen(3002, ()=> console.log("test serv for client started"))
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
        body = document.querySelector('body')


    })

    test('Check if blog form capable of adding new entry', ()=>{
        fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
          }));
        require('../../client/static/JS/index');
        const newJournalForm = document.getElementById('newJournalForm')
        const newJournalTitle = document.getElementById('newJournalTitle')
        const newJournalBody = document.getElementById('newJournalBody')
        const content = document.getElementById('dynamic')

        newJournalTitle.value = "newJournalTitle";
        newJournalBody.value = "newJournalBody";
        newJournalForm.dispatchEvent(new Event('submit'));
        console.log(newJournalTitle.value);
        console.log(newJournalBody.value);
        console.log(content.innerHTML)
        
    })


})
