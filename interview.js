// ======================================
// CareerBuild AI Interview
// ======================================

// -------------------------------
// Chat Elements
// -------------------------------

const chatBox = document.getElementById("chatBox");

const answerBox = document.getElementById("answer");

const submitBtn = document.getElementById("submitAnswer");

const nextBtn = document.getElementById("nextQuestion");

const timer = document.getElementById("timer");

const interviewTitle = document.getElementById("interviewTitle");

const questionCount = document.getElementById("questionCount");

const progressFill = document.getElementById("progressFill");

// -------------------------------
// Result Elements
// -------------------------------

const finalScore = document.getElementById("finalScore");

const communicationBar =
document.getElementById("communicationBar");

const technicalBar =
document.getElementById("technicalBar");

const confidenceBar =
document.getElementById("confidenceBar");

const problemBar =
document.getElementById("problemBar");

const recommendationText =
document.getElementById("recommendationText");

// -------------------------------
// Variables
// -------------------------------

let interviewType = "";

let currentQuestion = 0;

let totalQuestions = 10;

let seconds = 0;

let timerInterval = null;

let currentQuestionText = "";

// -------------------------------
// Timer
// -------------------------------

function startTimer(){

    clearInterval(timerInterval);

    seconds = 0;

    timerInterval = setInterval(()=>{

        seconds++;

        let mins = Math.floor(seconds / 60);

        let secs = seconds % 60;

        timer.innerHTML =
        String(mins).padStart(2,"0")
        + ":"
        + String(secs).padStart(2,"0");

    },1000);

}

// -------------------------------
// AI Message
// -------------------------------

function addAIMessage(message){

    chatBox.innerHTML += `

    <div class="ai-message">

        <div class="avatar">
            🤖
        </div>

        <div class="message">

            <h4>CareerBuild AI</h4>

            <p>${message.replace(/\n/g,"<br>")}</p>

        </div>

    </div>

    `;

    chatBox.scrollTop = chatBox.scrollHeight;

}

// -------------------------------
// User Message
// -------------------------------

function addUserMessage(message){

    chatBox.innerHTML += `

    <div class="user-message">

        <div class="message">

            <p>${message}</p>

        </div>

        <div class="avatar">

            👤

        </div>

    </div>

    `;

    chatBox.scrollTop = chatBox.scrollHeight;

}
// ======================================
// Start Interview
// ======================================

function startInterview(type){

    interviewType = type;

    currentQuestion = 1;

    questionCount.innerHTML = "1 / " + totalQuestions;

    progressFill.style.width = "10%";

    interviewTitle.innerHTML = type + " Interview";

    chatBox.innerHTML = "";

    answerBox.value = "";

    startTimer();

    addAIMessage("Welcome 👋");

    addAIMessage("Starting your " + type + " Interview.");

    loadQuestion();

}

// ======================================
// Load Interview Question
// ======================================

async function loadQuestion(){

    addAIMessage("⏳ AI is preparing your interview question...");

    try{

        const response = await fetch("/ask_interview",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                type: interviewType,

                question: "",

                answer: ""

            })

        });

        const data = await response.json();

        // Remove Loading Message

        const aiMessages =
        document.querySelectorAll(".ai-message");

        aiMessages[aiMessages.length-1].remove();

        currentQuestionText = data.answer;

        addAIMessage(currentQuestionText);

    }

    catch(error){

        console.log(error);

        addAIMessage("❌ Unable to connect to AI.");

    }

}
// ======================================
// Submit Answer
// ======================================

submitBtn.addEventListener("click", async () => {

    const answer = answerBox.value.trim();

    if(answer === ""){

        alert("Please enter your answer.");

        return;

    }

    addUserMessage(answer);

    answerBox.value = "";

    await evaluateAnswer(answer);

});

// ======================================
// Evaluate Answer
// ======================================

async function evaluateAnswer(userAnswer){

    addAIMessage("🔍 Evaluating your answer...");

    try{

        const response = await fetch("/ask_interview",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

                type: interviewType,

                question: currentQuestionText,

                answer: userAnswer

            })

        });

        const data = await response.json();

        // Remove Loading Message

        const aiMessages =
        document.querySelectorAll(".ai-message");

        aiMessages.forEach(msg=>{

            if(msg.innerText.includes("Evaluating")){

                msg.remove();

            }

        });

        addAIMessage(data.answer);

    }

    catch(error){

        console.log(error);

        addAIMessage("❌ Evaluation failed.");

    }

}
// ======================================
// Next Question
// ======================================

nextBtn.addEventListener("click", () => {

    if(currentQuestion >= totalQuestions){

        finishInterview();

        return;

    }

    currentQuestion++;

    questionCount.innerHTML =
    currentQuestion + " / " + totalQuestions;

    progressFill.style.width =
    (currentQuestion / totalQuestions) * 100 + "%";

    answerBox.value = "";

    loadQuestion();

});

// ======================================
// Finish Interview
// ======================================

function finishInterview(){

    clearInterval(timerInterval);

    addAIMessage("🏆 Interview Completed!");

    generateResult();

}

// ======================================
// Generate Result
// ======================================

function generateResult(){

    // Random Demo Scores
    // Later you can replace these with AI scores

    let overall = Math.floor(Math.random()*16)+85;

    let communication =
    Math.floor(Math.random()*20)+80;

    let technical =
    Math.floor(Math.random()*20)+80;

    let confidence =
    Math.floor(Math.random()*20)+82;

    let problem =
    Math.floor(Math.random()*20)+78;

    finalScore.innerHTML = overall + "%";

    communicationBar.style.width =
    communication + "%";

    technicalBar.style.width =
    technical + "%";

    confidenceBar.style.width =
    confidence + "%";

    problemBar.style.width =
    problem + "%";

    recommendationText.innerHTML = `

    🎯 <b>Excellent Performance!</b>

    <br><br>

    ✅ Communication Skills are Good.

    <br>

    ✅ Technical Knowledge is Improving.

    <br>

    ✅ Keep practicing Coding Problems.

    <br>

    ✅ Continue Mock Interviews.

    <br><br>

    <b>Overall Recommendation:</b>

    Placement Ready 🚀

    `;

}

// ======================================
// Restart Interview
// ======================================

document.getElementById("restartInterview")

.addEventListener("click",()=>{

    location.reload();

});

// ======================================
// Download Report
// ======================================

document.getElementById("downloadReport")

.addEventListener("click",()=>{

    window.print();

});