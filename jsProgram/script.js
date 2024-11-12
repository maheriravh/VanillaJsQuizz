

let apiUrl = "https://opentdb.com/api.php?amount=5&difficulty=";
// https://opentdb.com/api.php?amount=5&difficulty=easy
// https://opentdb.com/api.php?amount=5&difficulty=medium
// https://opentdb.com/api.php?amount=5&difficulty=hard

let dataQuestions = [];
let dataAnswers = [];
let correctAnswer = "";
let indexQuestion = 0;
let countdownTime;
let timeLeft = 10;
let countdownElement = document.getElementById('id_count_down');

let questionContent = document.getElementById('id_question');
let answerContent = document.getElementById('id_answer');

let nextButton = document.getElementById('id_next_button');
let countdown = document.getElementById('id_count_down');

let msgBoxAlert = document.getElementById('id_div_parent_alert');
let msgTextAlert = document.getElementById('id_message_alert');
let msgBoxSuccess = document.getElementById('id_div_parent_success');
let msgTextSuccess = document.getElementById('id_message_success');




function fetchData(){
    let niveau = document.getElementById("id_choix_difficulte").value;
    fetch(apiUrl + niveau)
        .then(response => response.json()) // Resolve the JSON response
    .then(data => {
        if(data){
            dataQuestions = data.results;
            startQuestion();
            document.getElementById('id_question_container').style.display = 'block';
        }
    });
}

function startQuestion(){
    msgBoxAlert.style.display = 'none';
    msgBoxSuccess.style.display = 'none';

    nextButton.addEventListener('click', () => {
        if(indexQuestion<4){
            indexQuestion++;
            loadCurrentQuestion();
        }else{
            msgBoxAlert.style.display = 'block';
            msgTextAlert.innerText = "Fin des questions";
        }
        return;
    });
    loadCurrentQuestion();
    return;
}

function loadCurrentQuestion(){
    let currentData = dataQuestions[indexQuestion];
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
        dataAnswers.push(CreateRadioElement(element));
    });

    while (dataAnswers.length !== 0) {
        random = Math.floor(Math.random() * dataAnswers.length);
        var element = dataAnswers.splice(random, 1)[0];

        answerContent.appendChild(element.label);
        answerContent.appendChild(element.input);
        if (dataAnswers.length > 0) answerContent.appendChild(createSeparator())
    }
}

function CreateRadioElement(value){
    let radioLabel = document.createElement('label');
    radioLabel.innerHTML = value;
    let radioInput = document.createElement('input');
    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('name', 'answer');
    radioInput.setAttribute('value', value);
    radioInput.addEventListener('click', () => {
        if(value === correctAnswer){
            msgBoxSuccess.style.display = 'block';
            msgTextSuccess.innerText = "Bonne réponse";

            clearInterval(countdownTime);
            timeLeft = 10;
            countdownElement.innerText = timeLeft;
        }else{
            msgBoxAlert.style.display = 'block';
            msgTextAlert.innerText = "Mauvaise réponse";
        }
    });
    return {
        label: radioLabel,
        input: radioInput
    };
}

function createSeparator() {
    var spanSeparator = document.createElement('span');
    spanSeparator.style.padding = "10px 15px 10px 15px";
    return spanSeparator;
}

function startCountDownTime(){
    console.log("startCountDownTime Fired!!!!!");

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
    msgTextAlert.innerText = "Le temps est écoulé, vous avez perdu!!";
    countdownElement.style.display = 'none';
    document.getElementById('id_question_container').style.display = 'none';
}

function onCloseSuccessMessage(){
    msgBoxSuccess.style.display = 'none';
    if(indexQuestion<4){
        indexQuestion++;
        loadCurrentQuestion();
    }
}