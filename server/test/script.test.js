let scriptFuncs;
const request = require("supertest")
const server = require("../server")
const journals = require('../journals.json')
const testDB = require('../backup.json')
const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');



describe('tests form to add new posts', () => {

    beforeAll(() => {
        app = server.listen(3002, ()=> console.log("test serv for client started"))
        document.documentElement.innerHTML = `<body><form id="newJournalForm">
            <input id="newJournalTitle" type='text' placeholder="Post Title">
            <textarea name="" rows="10" id='newJournalBody' type='text' maxlength="256" placeholder="Type your post in here"></textarea>
            <input id="newJournalSend" type='submit' value='SEND'>            
            </form>
            <section id="dynamic">
            </section></body>`;
        body = document.querySelector('body')
        scriptFuncs = require("../../client/static/JS/index");
    })

    test('Check if blog form capable of adding new entry', ()=>{
        const newJournalForm = document.getElementById('newJournalForm')
        const newJournalTitle = document.getElementById('newJournalTitle')
        const newJournalBody = document.getElementById('newJournalBody')
        const newJournalSend = document.getElementById('newJournalSend')

        newJournalTitle.value = "newJournalTitle";
        newJournalBody.value = "newJournalBody";
        newJournalSend.click();
        
    })


})
