//Select Elements
let countSpan = document.querySelector('.quiz-info .count span');
let bulletsElement = document.querySelector('.bullets');
let BulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answers-area');
let submitBtn = document.querySelector('.submit-btn');
let resultContainer = document.querySelector('.result');
let countdownElement = document.querySelector('.countdown')

//Set Option 
let currentindex = 0;
let rightAnswers = 0;
let countDownIntereval;


function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;

            //Create Bullets + Set Questions Count
            createBullets(questionsCount);

            //Add Questions Data
            addQuestionData(questionsObject[currentindex], questionsCount);

            //Start Countdown
            countDown(100, questionsCount);

            //Click On Submit
            submitBtn.onclick = () => {
                //Get Right Answer
                let theRigthAnswer = questionsObject[currentindex]['right_answer'];

                //Increase Index
                currentindex++;

                //Check the Answer
                checkAnswer(theRigthAnswer, questionsCount);

                //Remove Previous Question
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";

                //Add Questions Data
                addQuestionData(questionsObject[currentindex], questionsCount);

                //Handle Bullets Class
                handleBullets();

                //Start Countdown
                clearInterval(countDownIntereval);
                countDown(100, questionsCount);

                //Show Result
                showResults(questionsCount);
            };
        }
    }

    myRequest.open("GET", "Quiz.json", true);
    myRequest.send();
}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    //Create Spans
    for (let i = 0; i < num; i++) {
        //Create Bullet
        let theBullet = document.createElement("span");

        //Check if Its First Span
        if (i === 0) {
            theBullet.className = 'on';
        }

        //Append Bullets To Main Bullets Container
        BulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {
    if (currentindex < count) {

        //Create H2 Question Title
        let questionTitle = document.createElement("h2");

        //Create Question Text 
        let questionText = document.createTextNode(obj['title']);

        //Append Text To H2
        questionTitle.appendChild(questionText);

        //Append The H2 To The Quiz Area
        quizArea.appendChild(questionTitle);

        //Create The Answers
        for (let i = 1; i <= 4; i++) {
            //Create Main Answer Div
            let mainDiv = document.createElement("div");

            //Add Class TO Main Div 
            mainDiv.className = 'answer';

            //Create Radio Input
            let radioInput = document.createElement("input");

            //Add Type + Name + Id + Data-Attribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_ ${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            //Create Label 
            let theLabel = document.createElement("label");

            //Add For Attribute
            theLabel.htmlFor = `answer_ ${i}`;

            //Create Label Text 
            let ma = obj[`answer_${i}`];
            let theLabelText = document.createTextNode(ma);

            //Add The Text To Label 
            theLabel.appendChild(theLabelText);

            //Append Input + Label To Main Div 
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            //Append All Div To Answers Area
            answerArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }


    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentindex === index) {
            span.className = "on";
        }
    })
}

function showResults(count) {
    let theResults;
    if (currentindex === count) {
        quizArea.remove();
        answerArea.remove();
        submitBtn.remove();
        bulletsElement.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class = "good">Good</span>, ${rightAnswers} From ${count} .`;
        }
        else if (rightAnswers === count) {
            theResults = `<span class = "perfect">Perfect</span>, All Answers Is Perfect.`;
        } else {
            theResults = `<span class = "bad">bad</span>, ${rightAnswers} From ${count}`;
        }

        resultContainer.innerHTML = theResults;
        resultContainer.style.padding = '10px';
        resultContainer.style.backgroundColor = 'white';
    }
}

function countDown(duration, count) {
    if (currentindex < count) {
        let minutes, seconds;

        countDownIntereval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownIntereval);
                submitBtn.click();
            }
        }, 1000)

    }
}