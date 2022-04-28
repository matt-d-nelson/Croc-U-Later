$(document).ready(onReady);

function onReady() {
    console.log('JQ');
    $('#inputOperators').on('click', '.operatorButtons', defineOperator);
    $('#clearButton').on('click', clearInputs);
    $('#calculateButton').on('click', calculateOperation);
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
    $('#numeratorIn').val('');
    $('#denominatorIn').val('');
    toCalculate.operator = "";
}

function calculateOperation() {
    console.log('in calculateOperation');
}