const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const getData = (document, row) => {
    let res = undefined;
    try{
    res = document.querySelector(`#deduction_${row}`).textContent.trim().split(" ")[1];
    }catch(err){
        console.log(err);
    }
    return res;
}

module.exports  = async (req, res) => {
    const { duration, pay } = req.query;
    const province = "ontario";
    try {
        if(!duration || !pay || !province) return res.status(400).json({
            message: "Please enter Duration, Pay",
        })
        const url = `https://neuvoo.ca/tax-calculator/?salary=${pay}&from=${duration}&region=${province}`;
        const request = await axios(url);
        const {document} = new JSDOM(request.data).window;
        let run = true;
        let rowCount = 0;
        const result = {};
        const results = [];
        while (run) {
            const res = getData(document, rowCount);
            if (!!res) {
                results.push(res);
                rowCount++;
            } else run = false;
        }
        if (results.length === 4) result.federal = results.shift().substring(1);

        if (results.length === 3) result.provincial = results.shift().substring(1);

        result.pay = pay;
        result.cpp = results.shift().substring(1);
        result.ei = results.shift().substring(1);
        result.total =(pay - (parseFloat(result.cpp || 0)) - (parseFloat(result.ei || 0)) - (parseFloat(result.federal || 0)) - (parseFloat(result.provincial || 0))).toFixed(2);
        res.json(result);
    } catch (error) {
        console.log(error)
        return res.status(404).json({message: error.message});
    }
}
