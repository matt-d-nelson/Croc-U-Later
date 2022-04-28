const express = require('express');
const router = express.Router();

let previousOperations = [
    {
        numerator: "12",
        operator: "+",
        denominator: "4",
        result: "16"
    }
];

router.get('/calculate', (req, res) => {
    console.log('calculate GET');
    res.send(previousOperations);
})

module.exports = router;