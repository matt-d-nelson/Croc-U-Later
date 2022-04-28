$(document).ready(onReady);

function onReady() {
    console.log('JQ');
    $('#inputOperators').on('click', '.operatorButtons', defineOperator);
}

let toCalculate = {
    numerator: "",
    operator: "",
    denominator: ""
}

function defineOperator() {
    console.log('in defineOperator');
    toCalculate.operator = $(this).data('op');
    console.log(toCalculate);
}