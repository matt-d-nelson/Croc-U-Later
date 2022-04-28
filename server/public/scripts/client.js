$(document).ready(onReady);

function onReady() {
    console.log('JQ');
    $('#inputButtons').on('click', '.operatorButtons', defineOperator);
    $('#clearButton').on('click', clearInputs);
    $('#calculateButton').on('click', calculateOperation);
    getPreviousCalculations();
}

let toCalculate = {
    numerator: "",
    operator: "",
    denominator: ""
}

function defineOperator() {
    console.log('in defineOperator');
    toCalculate.operator = $(this).data('op');
}

function clearInputs() {
    console.log('in clearInputs');
    //clear numerator input //to change for stretch goals-------//
    $('#numeratorIn').val('');
    //clear denominator input 
    $('#denominatorIn').val('');
    //clear properties in toCalculate
    toCalculate.numerator = "";
    toCalculate.operator = "";
    toCalculate.denominator = "";
}

function calculateOperation() {
    console.log('in calculateOperation');
    //get input values //to change for stretch goals-----------//
    toCalculate.numerator = $('#numeratorIn').val();
    toCalculate.denominator = $('#denominatorIn').val();
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
        //clear inputs, innitialize toCalculate
        clearInputs();
    }).catch(function(err) {
        console.log(err);
        alert('error sending calculation');
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
            el.append(`<li>
                ${response[i].numerator} 
                ${response[i].operator} 
                ${response[i].denominator} = 
                ${response[i].result}
            </li>`);
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