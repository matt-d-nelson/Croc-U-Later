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

//Client side functions

function defineOperator() {
    console.log('in defineOperator');
    //set the operator in the toCalculate object
    toCalculate.operator = $(this).data('op');
    //concatinate operation string
    operationString += $(this).data('op');
    updateInput();
}

function defineNumber() {
    console.log('in defineNumber');
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
    //potentially clear the result element//may make more sense to not
    //$('#resultOut').empty(); 
    //clear operator in toCalculate
    toCalculate.operator = "";
    //clear operation string
    operationString = "";
}

function parseOperationString() {
    //split the operationString on the operator
    let splitOp = operationString.split(toCalculate.operator);
    //ensure that there are only two values and that they are numbers
    if (splitOp.length != 2 || isNaN(splitOp[0]) || isNaN(splitOp[0])) {
        alert('Invalid entry. Please enter two digits separated by one operator.');
        clearInputs();
        return;
    }
    //set split values in toCalculate object
    toCalculate.numerator = splitOp[0];
    toCalculate.denominator = splitOp[1];

    //make server request
    calculateOperation();
}

//Server request functions

function calculateOperation() {
    console.log('in calculateOperation');
    console.log('adding', toCalculate);
    //make post request
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
        console.log(response);
        //target output list element
        let el = $('#previousCalculations');
        //empty that element
        el.empty();
        //loop through response array
        for(let i = 0; i < response.length; i++) {
            //append el for each previous operation
            el.append(`<li class="calcHistory" data-id=${i}>
                ${response[i].numerator} 
                ${response[i].operator} 
                ${response[i].denominator}
            </li>`); //= ${response[i].result} //removed for stretch goals
        }
        if (response.length > 0) {
            //target h2 element to display most recent result
            el = $('#resultOut');
            el.empty();
            el.append(response[0].result);
        }
    }).catch(function(err) {
        console.log(err);
        alert('error getting previous operations');
    });
}

function clearHistory() {
    console.log('in clear history');
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
    //send a post request to the server with the index object
    $.ajax({
        method: 'POST',
        url: '/recalculate',
        data: indexToCalculate
    }).then(function(response) {
        console.log('back from GET', response);
        //append the server's response to the resultOut element
        el = $('#resultOut');
        el.empty();
        el.append(response);
    }).catch(function(err) {
        console.log(err);
        alert('error sending recalculation request');
    })
}