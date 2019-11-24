function startQuiz(quizId){
    console.log(quizId);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200){
            let remTime = parseInt(JSON.parse(this.responseText).remTime);
            document.querySelector("#btn-" + quizId).style.display = "none";
            let timer = document.querySelector("#timer-"+quizId);
            timer.style.display = "block";
            timer.innerHTML = Math.floor(remTime / 60) + " : " + (remTime % 60);
            let timerId = setInterval(() => {
                remTime--;
                if (remTime <= 0) {
                    timer.style.display = "none";
                    document.querySelector("#img-"+quizId).style.display = "block";
                    clearInterval(timerId);
                }
                document.querySelector("#timer-"+quizId).innerHTML = Math.floor(remTime / 60) + " : " + (remTime % 60);
            }, 1000);
        }
    }
    xhttp.open("POST","/teacher/startQuiz/" + quizId,true);
    xhttp.setRequestHeader('Csrf-Token', csrfToken);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("quizId="+quizId);
}