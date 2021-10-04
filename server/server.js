const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());
const fetch = require('node-fetch');

app.get('/', (req, res) => {
    res.json("hello world")
})

module.exports=(app);
