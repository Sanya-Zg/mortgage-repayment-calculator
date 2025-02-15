const clear = document.getElementById('clear');
const amount = document.getElementById('amount');
const term = document.getElementById('term');
const rate = document.getElementById('rate');
const repay = document.getElementById('repay');
const interest = document.getElementById('interest');
const typeBody = document.querySelectorAll('.type-body');
const calculate = document.getElementById('calculate');
const month = document.getElementById('month');
const total = document.getElementById('total');

const resIntro = document.querySelector('.result_intro');
const resContent = document.querySelector('.result_content');

const amountErr = document.getElementById('amount_err');
const termErr = document.getElementById('term_err');
const rateErr = document.getElementById('rate_err');
const radioErr = document.getElementById('radio_err'); 

const numBlock = document.querySelector('.num_input');
const termBlock = document.querySelector('.term_outer');
const rateBlock = document.querySelector('.rate_outer');

// Change style of radio button's block
typeBody.forEach(div => {
    div.addEventListener("click", () => {
        typeBody.forEach(d => {
            d.style.backgroundColor = "";
            d.style.border = "";
        });
        div.style.backgroundColor = "#F9FAE0";
        div.style.border = "2px solid #D8DB2F";
        div.querySelector("input").checked = true;
    });
});
// Num of months
function totalNumMonths(t) {
    return t * 12;
}
// Monthly repayment
function monthRepayment(sum, term, rate) {
    const monthPercentRate = rate / 12 / 100;
    const months = totalNumMonths(term);
    if (monthPercentRate === 0) return sum / month;
    const numerator = monthPercentRate * (1 + monthPercentRate) ** months;
    const denominator = (1 + monthPercentRate) ** months - 1;
    return sum * numerator / denominator;
}
// Total repay over the term
function totalRepayment(sum, term, rate) {
    const months = totalNumMonths(term);
    return monthRepayment(sum, term, rate) * months;
}
// Monthly Interest Only
function monthInterest(sum, rate){
    const monthRate = rate / 12 / 100;
    return sum * monthRate;
}
// Total Interest Only payment
function totalInterestPaymant(sum, rate, term){
    return monthInterest(sum, rate) * totalNumMonths(term);
}
// Check if input is valid
function inputValidation(input, errMsg){

    let valueWithoutCommas = input.value.replace(/,/g, '');
    
    if (!valueWithoutCommas.trim()){
        input.classList.add('red_border');
        resIntro.style.display = 'block';
        resContent.style.display = 'none';
        errMsg.textContent = 'This field is required';
        return false;
    }
    if (!/^\d+(\.\d+)?$/.test(valueWithoutCommas)) {
        input.classList.add('red_border');
        resIntro.style.display = 'block';
        resContent.style.display = 'none';
        errMsg.textContent = 'Enter a number';
        return false;
    }
    return true;
}
    // Puts a comma after three numbers
    amount.addEventListener('input', function () {
        let filterValue = this.value.replace(/\D/g, '');
        this.value = filterValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
    })
    
    const arrErr = [amountErr, termErr, rateErr, radioErr];
    const arrInputs = [amount, term, rate];
    const arrBlocks = [numBlock, termBlock, rateBlock];

calculate.addEventListener('click', () => {

    let sum = parseFloat(amount.value.replace(/,/g, ''));
    let termValue = parseFloat(term.value);
    let rateValue = parseFloat(rate.value);

    // Clean all error fields
    arrBlocks.forEach(block => block.classList.remove('empty'));

    arrInputs.forEach(input => {
        input.classList.remove('red_border');
    })
    
    arrErr.forEach(err => {
        err.style.display = 'none';
        err.textContent = '';
    })

    month.textContent = '';
    total.textContent = '';

    let isValid = true;
       // Validate input
       if (!inputValidation(amount, amountErr)){
           numBlock.classList.add('empty');
           amountErr.style.display = 'block';
           isValid = false;
       }
       // Validate input
       if (!inputValidation(term, termErr)){
            termBlock.classList.add('empty');
            termErr.style.display = 'block';
            isValid = false;
       }
       // Validate input
       if (!inputValidation(rate, rateErr)){
            rateBlock.classList.add('empty');
            rateErr.style.display = 'block';
            isValid = false;
       }
    // Check if any checkbox is selected
    if (repay.checked){
        month.textContent = '£' + Number(monthRepayment(sum, termValue, rateValue).toFixed(2)).toLocaleString('es-US');
        total.textContent = '£' + Number(totalRepayment(sum, termValue, rateValue).toFixed(2)).toLocaleString('es-US');
    } else if(interest.checked){
        month.textContent = '£' + Number(monthInterest(sum, termValue, rateValue).toFixed(2)).toLocaleString('es-US');
        total.textContent = '£' + Number(totalInterestPaymant(sum, termValue, rateValue).toFixed(2)).toLocaleString('es-US');
    } else {
        radioErr.style.display = 'block';
        radioErr.textContent = 'This field is required';
        return;
    }

    if (!isValid){
        return;
    }

    resIntro.style.display = 'none';
    resContent.style.display = 'block';
})
// Clear all fields and error messages
clear.addEventListener('click', () => {

    resIntro.style.display = 'block';
    resContent.style.display = 'none';
    repay.checked = false;
    interest.checked = false;

    typeBody.forEach(item => {
        item.style.backgroundColor = '';
        item.style.border = '';
    })

    arrBlocks.forEach(block => block.classList.remove('empty'));

        arrErr.forEach(err => {
            err.style.display = 'none';
            err.textContent = '';
        })
        arrInputs.forEach(input => {
            input.value = '';
            input.classList.remove('red_border');
        })
        month.textContent = '';
        total.textContent = '';
})