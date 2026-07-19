const askButton = document.getElementById("askAI");
const careerInput = document.getElementById("careerInput");
const responseDiv = document.getElementById("response");

askButton.addEventListener("click", async () => {

    const question = careerInput.value.trim();

    if(question===""){
        alert("Please enter your career goal!");
        return;
    }

    responseDiv.innerHTML=`
    <div class="loading">
        <div class="loader"></div>
        <h3>CareerBuild AI is Thinking...</h3>
    </div>
    `;

    const res=await fetch("/ask_ai",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            question:question
        })
    });

    const data=await res.json();

    let answer=data.answer;

    answer=answer.replace(/🎯/g,"<h2>🎯 ");
    answer=answer.replace(/📚/g,"</h2><h2>📚 ");
    answer=answer.replace(/🛣️/g,"</h2><h2>🛣️ ");
    answer=answer.replace(/💻/g,"</h2><h2>💻 ");
    answer=answer.replace(/💼/g,"</h2><h2>💼 ");
    answer=answer.replace(/💰/g,"</h2><h2>💰 ");
    answer=answer.replace(/🎤/g,"</h2><h2>🎤 ");
    answer=answer.replace(/📖/g,"</h2><h2>📖 ");
    answer=answer.replace(/✨/g,"</h2><h2>✨ ");

    answer=answer.replace(/\n/g,"<br>");

    responseDiv.innerHTML=`
    <div class="ai-card">
        ${answer}
    </div>
    `;
});