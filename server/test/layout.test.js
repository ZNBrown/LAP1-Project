/**
 * @jest-environment jsdom
 */

let helpers;
const { expect} = require('@jest/globals');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', '..', '/client/index.html'))

describe('testing default index.html', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        //before each test, we will have access to html as a string
    })

    test('it has a title', () => {
        let title = document.querySelector('title');
        expect(title.textContent).toContain('Large');
    })
    test('it has a form', () => {
        let title = document.querySelector('title');
        expect(title.textContent).toContain('Large');
    })
})