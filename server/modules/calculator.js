//Import modules
const express = require('express');
//Constants
const router = express.Router();
//"Database"
let previousOperations = [
    {
        numerator: "12",
        operator: "+",
        denominator: "4",
        result: "16"
    }
];

//Router configuration
router.get('/calculate', (req, res) => {
    console.log('calculate GET');
    res.send(previousOperations);
})

router.post('/calculate', (req, res) => {
    console.log('calculate POST', req.body);
    res.sendStatus(200);
})

module.exports = router;