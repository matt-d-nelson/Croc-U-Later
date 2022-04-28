$(document).ready(onReady);

function onReady() {
    console.log('JQ');
    $('#inputOperators').on('click', '.operatorButtons', defineOperator);
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
    //clear numerator input
    $('#numeratorIn').val('');
    //clear denominator input
    $('#denominatorIn').val('');
    //clear operator property in toCalculate
    toCalculate.operator = "";
}

function calculateOperation() {
    console.log('in calculateOperation');

}

function getPreviousCalculations() {
    $.ajax({
        method: 'GET',
        url: '/calculate'
    }).then(function( response ) {
        console.log(response);
        //target output list element
        const el = $('#previousCalculations');
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
    }).catch(function(err) {
        console.log(err);
        alert('error getting previous operations');
    });
}