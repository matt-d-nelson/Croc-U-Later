//Import modules
const express = require('express');
//Constants
const router = express.Router();
//"Database" array to push operations to
let previousOperations = [];

//Router configuration

    //calculate
router.get('/calculate', (req, res) => {
    console.log('calculate GET');
    res.send(previousOperations);
})

router.post('/calculate', (req, res) => {
    console.log('calculate POST', req.body);
    performCalculation(req.body)
    res.sendStatus(200);
})

router.delete('/calculate', (req, res) => {
    console.log('calculate DELETE');
    previousOperations = [];
    res.sendStatus(200);
})

    //recalculate
router.post('/recalculate', (req, res) => {
    console.log('recalculate GET',req.body);
    //send the result property of the requested index of the previousOperations array
    res.send(previousOperations[req.body.index].result);
})

//Functions
function performCalculation(calculation) {
    //declare variable to store result
    let returnResult = -1;
    //switch operation based on what the operator property is
    switch (calculation.operator) {
        case "+":
            returnResult = Number(calculation.numerator) + Number(calculation.denominator);
            break;
        case "-":
            returnResult = Number(calculation.numerator) - Number(calculation.denominator);
            break;
        case "*":
            returnResult = Number(calculation.numerator) * Number(calculation.denominator);
            break;
        case "/":
            returnResult = Number(calculation.numerator) / Number(calculation.denominator);
            break;
        default:
            break;
    }
    //store the result in the given object 
    calculation.result = returnResult.toString();
    //add the object to the previousOperations array
    previousOperations.unshift(calculation);
}

//Exports
module.exports = router;