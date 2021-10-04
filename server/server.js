const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());
const fetch = require('node-fetch');
const journals = require('./journals.json')

app.get('/', (req, res) => {
    res.json("hello world")
})

module.exports=(app);
