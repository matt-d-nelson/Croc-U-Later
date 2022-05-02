$(document).ready(onReady);

function onReady() {
    console.log('JQ');
    //input buttons
    $('#inputButtons').on('click', '.operatorButtons', defineOperator);
    $('#inputButtons').on('click', '.valueButtons', defineNumber);

    //execution buttons
    $('#clearButton').on('click', clearInputs);
    $('#clearHistoryButton').on('click', clearHistory);
    $('#calculateButton').on('click', parseOperationString);
    $('#previousCalculations').on('click', '.calcHistory', recalculate);

    getPreviousCalculations();
}

//Global data
let toCalculate = {
    numerator: "",
    operator: "",
    denominator: ""
}
let operationString = "";

//----------------------Client side functions-----------------------//

function defineOperator() {
    console.log('in defineOperator');
    //store op value from operator button that was selected
    let currentOperator = $(this).data('op');
    //set the operator in the toCalculate object
    toCalculate.operator = currentOperator;
    //concatinate operationString with selected operator
    operationString += currentOperator;
    updateInput();
}

function defineNumber() {
    console.log('in defineNumber');
    //concatinate operationString with the val of the selected button
    operationString += $(this).data('val');
    updateInput();
}

function updateInput() {
    $('#inputDisplay').val(operationString);
}

function clearInputs() {
    console.log('in clearInputs');
    //clear input value
    $('#inputDisplay').val('');
    //clear operator in toCalculate
    toCalculate.operator = "";
    //clear operation string
    operationString = "";
}

function parseOperationString() {
    //split the operationString on the operator
    let splitOp = operationString.split(toCalculate.operator);
    //ensure that there are only two values and that they are numbers 
    //isNan('') returns true, so splitOp.includes('') is used to ensure there are no empty values
    if (splitOp.length != 2 || splitOp.includes('') || isNaN(splitOp[0]) || isNaN(splitOp[0])) {
        //alert the user that the entry couldn't be processed and clear inputs
        alert('Invalid entry. Please enter two digits separated by one operator.');
        clearInputs();
        return;
    }
    //define toCalculate values as the splitOp array indices
    toCalculate.numerator = splitOp[0];
    toCalculate.denominator = splitOp[1];
    console.log('in parse', toCalculate);

    //make server request
    calculateOperation();
}

function displayResult(result) {
    //shorten number after decimal place to two characters
    result = Number(result).toFixed(2);
    //target resultOut element, empty it, and fill it with the result
    el = $('#resultOut');
    el.empty();
    el.append(`Result: <span class="resultNum_animate">${result}</span>`);

    //play audio clip
    new Audio('../sounds/kritter.mp3').play();

    //change crocodile to animate for one animation cycle before changing back to still
    el.css('background-image', 'var(--crocAnimate');
    setTimeout(function() {
        el.css('background-image', 'var(--crocStill');
    }, 400);
}

//----------------------Server request functions-----------------------//

function calculateOperation() {
    console.log('in calculateOperation', toCalculate);
    //make post request with the toCalculate object
    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: toCalculate
    }).then(function(response) {
        console.log('back from POST', response);
        //update DOM
        getPreviousCalculations();
        //clear inputs
        clearInputs();
    }).catch(function(err) {
        console.log(err);
        alert('error sending calculation request');
    })
}

function getPreviousCalculations() {
    $.ajax({
        method: 'GET',
        url: '/calculate'
    }).then(function(response) {
        console.log('back from GET', response);
        //target output list element
        let el = $('#previousCalculations');
        //empty that element
        el.empty();
        //loop through response array
        for(let i = 0; i < response.length; i++) {
            //append el for each previous operation
            el.append(`<tr class="calcHistory" data-id=${i}><td>
                ${response[i].numerator} 
                ${response[i].operator} 
                ${response[i].denominator}
            </td></tr>`); //= ${response[i].result} //removed for stretch goals
        }
        //if there are any responses
        if (response.length > 0) {
            //display most recent result
            displayResult((response[0].result));
        }
    }).catch(function(err) {
        console.log(err);
        alert('error getting previous operations');
    });
}

function clearHistory() {
    console.log('in clear history');
    //send a delete request
    $.ajax({
        method: 'DELETE',
        url: '/calculate'
    }).then(function(response) {
        console.log('back from DELETE', response);
        getPreviousCalculations();
        clearInputs();
    }).catch(function(err) {
        console.log(err);
        alert('error sending delete request');
    })
}

function recalculate() {
    //create new object to send that stores the index of the previous calculation
    let indexToCalculate = {
        index: Number($(this).data('id'))
    }
    console.log('index to recalculate:', indexToCalculate);
    //send a post request to the server with the index of the object to recalculate
    $.ajax({
        method: 'POST',
        url: '/recalculate',
        data: indexToCalculate
    }).then(function(response) {
        console.log('back from GET', response);
        //display the result of the recalculation
        displayResult(response);
    }).catch(function(err) {
        console.log(err);
        alert('error sending recalculation request');
    })
}