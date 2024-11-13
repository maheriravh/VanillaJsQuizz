

let apiUrl = "https://opentdb.com/api.php?amount=5&difficulty=";

let dataQuestions = [];
let dataAnswers = [];
let correctAnswer = "";
let indexQuestion = 0;
let countdownTime;
let timeLeft = 10;
let userReponse = [];

const countdownElement = document.getElementById('id_count_down');
const questionContent = document.getElementById('id_question');
const answerContent = document.getElementById('id_answer');
const nextButton = document.getElementById('id_next_button');
const msgBoxAlert = document.getElementById('id_div_parent_alert');
const msgTextAlert = document.getElementById('id_message_alert');
const msgBoxSuccess = document.getElementById('id_div_parent_success');
const msgTextSuccess = document.getElementById('id_message_success');

function fetchData(){
    let level = document.getElementById("id_choice_level").value;
    fetch(apiUrl + level)
        .then(response => response.json())
        .then(data => {
            if(!data) 
                return;
            indexQuestion = 0;
            userReponse = [];
            dataQuestions = data.results;
            startQuestion();
            document.getElementById('id_question_container').style.display = 'block';
            document.getElementById('id_result_question').style.display = 'none';
        });
}

function startQuestion(){
    loadCurrentQuestion(dataQuestions, indexQuestion);
    return;
}

function onClickNextButton(){
    if(indexQuestion < 4){
        indexQuestion++;
        loadCurrentQuestion(dataQuestions, indexQuestion);
        return;
    }else{
        msgBoxAlert.style.display = 'block';
        msgTextAlert.innerText = "Fin des questions";
        autoHideAlert();

        showResultQuestion(dataQuestions, userReponse);
        return;
    }
}
function loadCurrentQuestion(dataQuestions, index){
    msgBoxAlert.style.display = 'none';
    msgBoxSuccess.style.display = 'none';

    let currentData = dataQuestions[index];
    correctAnswer = currentData.correct_answer;
    let answer = [... currentData.incorrect_answers, currentData.correct_answer];

    clearInterval(countdownTime);
    timeLeft = 10;
    countdownElement.innerText = timeLeft;

    questionContent.innerHTML = loadSingleQuestion(currentData.question);
    loadAnswerList(answer);
    startCountDownTime();
}

function loadSingleQuestion(value){
    const txt = document.createElement("textarea");
    txt.innerHTML = value;
    return txt.value;
}

function loadAnswerList(answerList){
    answerContent.innerHTML = '';
    answerList.forEach(element => {
        const { label, input } = CreateRadioElement(element);
        const optionContainer = document.createElement('div');
        optionContainer.appendChild(input);
        optionContainer.appendChild(label);
        answerContent.appendChild(optionContainer);
        dataAnswers.push({ label, input });
    });
}

function CreateRadioElement(value){
    let radioLabel = document.createElement('label');
    radioLabel.innerHTML = value;
    radioLabel.style.marginLeft = "8px";
    let radioInput = document.createElement('input');
    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('name', 'answer');
    radioInput.setAttribute('value', value);
    radioInput.addEventListener('click', () => {
        userReponse.push(value);
        clearInterval(countdownTime);
        timeLeft = 10;
        countdownElement.innerText = timeLeft;

        const radioButtons = document.querySelectorAll('input[name="answer"]');
        radioButtons.forEach(btn => btn.disabled = true);

        if(value === correctAnswer){
            msgBoxSuccess.style.display = 'block';
            msgTextSuccess.innerText = "Bonne réponse";
            autoHideSuccess();
        }else{
            msgBoxAlert.style.display = 'block';
            msgTextAlert.innerText = "Mauvaise réponse";
            autoHideAlert();
        }
    });
    return {
        label: radioLabel,
        input: radioInput
    };
}

function startCountDownTime(){
    countdownTime = setInterval(() => {
        timeLeft--;
        countdownElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdownTime);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    msgBoxAlert.style.display = 'block';
    msgTextAlert.innerText = "Le temps est écoulé, vous n'avez choisi aucune réponse";
    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach(btn => btn.disabled = true);
    autoHideAlert();
}

function autoHideAlert(){
    setTimeout(function() {
        msgBoxAlert.style.display = 'none';
    }, 2000);
}

function autoHideSuccess(){
    setTimeout(function() {
        msgBoxSuccess.style.display = 'none';
    }, 2000);
}

function showResultQuestion(data, response){
    clearInterval(countdownTime);
    timeLeft = 10;

    document.getElementById('id_question_container').style.display = 'none';
    document.getElementById('id_result_question').innerHTML = '';

    if(!data)
        return;
    let i = 0;
    data.forEach((item) =>{
        const resultContainer = document.createElement('div');
        const txtQuestion = document.createElement("p");
        txtQuestion.innerHTML = item.question;
        const txtUserAnswer = document.createElement("p");
        txtUserAnswer.innerHTML = (response[i] === undefined || response[i] === '' || response[i] === null) ? "" : response[i];

        const txtNoteAnswer = document.createElement("p");
        if(response[i] === undefined || response[i] === '' || response[i] === null){
            txtNoteAnswer.innerHTML = "Aucune réponse";
            txtNoteAnswer.classList.add("not_answered");
        } else {
            if(response[i] === item.correct_answer){
                txtNoteAnswer.innerHTML = "Bonne réponse";
                txtNoteAnswer.classList.add("correct");
            } else {
                txtNoteAnswer.innerHTML = "Mauvaise réponse";
                txtNoteAnswer.classList.add("incorrect");
            }
        }

        resultContainer.appendChild(txtQuestion);
        resultContainer.appendChild(txtUserAnswer);
        resultContainer.appendChild(txtNoteAnswer);
        document.getElementById('id_result_question').appendChild(resultContainer);
        i++;
    });
    document.getElementById('id_result_question').style.display = 'block';
}
