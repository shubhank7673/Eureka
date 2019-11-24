// Hiding options
let totalOptions = document.querySelectorAll(".custom-control");
let totalHr = document.getElementsByTagName("hr");

for(let i = +actualOptions; i < totalOptions.length; i++){
    totalOptions[i].style.display = "none";
}

for(let i = +actualOptions - 1; i < totalHr.length; i++){
    totalHr[i].style.display = "none";
}

if (currProblemNo + 1 == totalProblems) {
    document.querySelector("#submit-btn").style.display = "block";
}

function fetchNext(ele) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let newProblem = JSON.parse(this.responseText);
            let labels = document.querySelectorAll(".labels");
            let options = document.querySelectorAll(".options");
            currProblemNo = +newProblem.currProblemNo;
            document.querySelector(".questionNo").textContent = "Question " + (currProblemNo + 1);
            if (+currProblemNo + 1 == +totalProblems) {
                document.querySelector("#submit-btn").style.display = "block";
            } else {
                document.querySelector("#submit-btn").style.display = "none";
            }
            savedAns = new Map();
            newProblem.savedAns.forEach(ele => {
                savedAns.set(ele, 1);
            });
            for(let i = 0; i < totalOptions.length; i++){
                totalOptions[i].style.display = "block";
                
            }
            for(let i = 0; i < totalHr.length; i++){
                totalHr[i].style.display = "block";   
            }
            for (let i = 0; i < options.length; i++) {
                labels[i].textContent = newProblem.options[i];
                options[i].value = newProblem.options[i];
                if (savedAns.get(options[i].value)) {
                    options[i].checked = true;
                }
            }
            for(let i = newProblem.options.length; i < totalOptions.length; i++){
                totalOptions[i].style.display = "none";
            }
            for(let i = newProblem.options.length - 1; i < totalHr.length; i++){
                totalHr[i].style.display = "none";   
            }
            document.querySelector("#statement").innerHTML = newProblem.statement;
        }
    }
    let nextProblemNo;
    if(ele == undefined){
        nextProblemNo = totalProblems;
    }else{
        nextProblemNo = (+ele.textContent - 1) ;    
    }
    let options = document.querySelectorAll(".options");
    xhttp.open("POST", "/student/quiz/" + quizId + "/" + nextProblemNo, true);
    xhttp.setRequestHeader('Csrf-Token', csrfToken);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let ans = [];
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked == true) {
            ans.push(options[i].value);
            options[i].checked = false;
        }
    }
    xhttp.send("ans=" + ans.toString() + "&currProblemNo=" + currProblemNo);
}

function goBack() {
    window.history.back();
}

var submitQuiz = function(){
    let ans = [];
    console.log(this);
    let options = document.querySelectorAll(".options");
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            ans.push(options[i].value);
        }
    }
    document.querySelector("#ans").value = ans.toString();
    document.querySelector("#quizForm").submit();
}