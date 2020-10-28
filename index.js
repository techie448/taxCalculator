const express = require('express')
const axios = require('axios');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const app = express()

const getData = (document, row) => {
    const res = document?.querySelector(`#deduction_${row}`)?.textContent?.trim()?.split(" ")[1];
    return (!!res) ? res : undefined
}

app.get('/', async (req, res) => {
    const hours = 50;
    const wage = 20;
    const duration = 'biweek';
    const pay = hours * wage;
    const province = 'Ontario';
    const url = `https://neuvoo.ca/tax-calculator/?salary=${pay}&from=${duration}&region=${province}`;
    const request = await axios(url);
    const {document} = new JSDOM(request.data).window;
    let run = true;
    let rowCount = 0;
    const deductions = {};
    const results = [];
    while (run) {
        const res = getData(document, rowCount);
        if (!!res) {
            results.push(res);
            rowCount++;
        } else run = false;
    }
    if (results.length === 4) deductions.federal = results.shift();

    if (results.length === 3) deductions.provincial = results.shift();

    deductions.cpp = results.shift();
    deductions.ei = results.shift();

    res.json({hours, wage, duration, pay, province, deductions})
})

app.listen(3000)
