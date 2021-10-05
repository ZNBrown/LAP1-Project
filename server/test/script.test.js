const scriptFuncs = require("../../client/static/JS/index")
const request = require("supertest")
const server = require("../server")
const journals = require('../journals.json')
const testDB = require('../backup.json')
const express = require('express');
const fs = require('fs');
const path = require('path');