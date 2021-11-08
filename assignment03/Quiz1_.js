
let totalSeconds = 0;
let userName = "";

const appState = {
    current_view : "#intro_view",
    current_question : -1,
    current_model : {},
    quiz_Name: "",
    current_correct:0,
    current_incorrect:0,
    questions_total:19,
}


async function get_quiz_data(quiz_Name, current_question) {
    var api_url = 'http://my-json-server.typicode.com/iskingcomet/CUS1172_Quiz/'
    var endpoint = `${api_url}/${quiz_Name}/${current_question}`

    const data = await fetch(endpoint)
    var model = await data.json()

    appState.current_model = model;
    console.log(data)
    setQuestionView(appState);
    update_view(appState);
    document.getElementById("correctCount").innerHTML = appState.current_correct + appState.current_incorrect;
    if (current_question == 0) {
      document.getElementById("incorrectCount").innerHTML = 0;
    }
    else {
      document.getElementById("incorrectCount").innerHTML = +(((appState.current_correct / (appState.current_correct + appState.current_incorrect)) * 100).toFixed(2));
    }
    return (data);
  }

  document.addEventListener('DOMContentLoaded', () => {
    appState.current_view =  "#intro_view";
    appState.current_model = {
      action : "start_app"
    }
    update_view(appState);



    document.querySelector("#widget_view").onclick = (e) => {
        handle_widget_event(e)
    }
  });

  let minutesLabel = "";
  let secondsLabel = "";
  let timer = 0;
  
  function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  }
  
  function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

  function handle_widget_event(e) {

    if (appState.current_view == "#intro_view"){
        userName = document.getElementById("userName").value;
        if (userName == "") {
          userName = "User";
        }
    
      if (e.target.dataset.action == "start_app") {
        timer = setInterval(setTime, 1000);
        minutesLabel = document.getElementById("minutes");
        secondsLabel = document.getElementById("seconds");
        appState.current_question = 0
        appState.quiz_Name = document.querySelector('input[name="quiz_Name"]:checked').value;
          var current_question_data = get_quiz_data(appState.quiz_Name, appState.current_question)
          console.log(appState)
      }
    }

    if (appState.current_view == "#question_view_true_false") {

      if (e.target.dataset.action == "answer") {
         isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
         if (isCorrect) {
            appState.current_correct++;
          }
          else {
            appState.current_incorrect++;
          }
         console.log("DEBUG: UPDATE QUESTION_VIEW_TRUE_FALSE")
         console.log(appState);
        updateQuestion(appState)
        setFeedbackView(isCorrect);
        update_view(appState);
         var current_question_data = get_quiz_data(appState.quiz_Name, appState.current_question)

       }
     }
     if (appState.current_view == "#question_view_text_input") {
         if (e.target.dataset.action == "submit") {

             user_response = document.querySelector(`#${appState.current_model.answerFieldId}`).value;
             isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
             
             isCorrect = check_user_response(user_response, appState.current_model);
             if (isCorrect) {
               appState.current_correct++;
             }
             else {
               appState.current_incorrect++;
             }
             
             
             
             console.log("DEBUG: UPDATE QUESTION_VIEW_TEXT_INPUT")
             console.log(appState);

             updateQuestion(appState)
             setFeedbackView(isCorrect);
             update_view(appState);

             var current_question_data = get_quiz_data(appState.quiz_Name, appState.current_question)
         }
      }

      if (appState.current_view == "#question_view_multiple_choice") {
        if (e.target.dataset.action == "answer") {
            let choices = document.getElementsByName("choice");
            let user_response;
      
            for (let i = 0; i < choices.length; i++) {
              if (choices[i].checked) {
                user_response = choices[i].value;
              }
            }
            isCorrect = check_user_response(e.target.dataset.answer, appState.current_model);
            if (isCorrect) {
              appState.current_correct++;
            }
            else {
              appState.current_incorrect++;
            }
           console.log("DEBUG: UPDATE QUESTION_VIEW_MULTIPLE_CHOICE")
           console.log(appState)
         updateQuestion(appState);
         setFeedbackView(isCorrect);
         update_view(appState);
         var current_question_data = get_quiz_data(appState.quiz_Name, appState.current_question)
         }
       }

      if (appState.current_view == "#end_view") {
        clearInterval(timer);
 
        let finalScore = +(((appState.current_correct / (appState.current_incorrect + appState.current_correct)) * 100).toFixed(2));
        if (finalScore >= 65) {
          document.getElementById("endMessage").innerHTML = "Final Score: " + finalScore + "% Congratulations " + userName + " you have passed!" + "<br>To Restart Quiz Refresh Page";
        }
        else {
          document.getElementById("endMessage").innerHTML = "Final Score: " + finalScore + "%, " + userName + " has failed." + "<br>To Restart Quiz Refresh Page " ;
        }
        if (e.target.dataset.action == "{{this.action}}") {
          appState.current_view = "#intro_view";
          appState.current_question = -1,
            appState.quiz_Name = "",
            appState.current_model = {},
            appState.current_correct = 0,
            appState.current_incorrect = 0
            appState.current_model = {
                 action: "start_app"
            }
          update_view(appState);
        }
   }
  }
  function check_user_response(user_answer, model) {
    if (JSON.stringify(user_answer) === JSON.stringify(model.correctAnswer)) {
        return true;
    }
    else {
      if (user_answer == model.correctAnswer) {
        return true;
      }
    }
    return false;
    }

  function updateQuestion(appState) {
    if (appState.current_question < appState.questions_total) {

        appState.current_question =  appState.current_question + 1;
      }
      else {
        appState.current_question = -2;
        appState.current_model = {};
      }
  }

  function setQuestionView(appState) {
      console.log(appState.current_model.questionType)
    if (appState.current_question == -2) {
      appState.current_view  = "#end_view";
      return
    }
  console.log(appState.current_model.questionType)
    if (appState.current_model.questionType == "true_false")
      appState.current_view = "#question_view_true_false";
    else if (appState.current_model.questionType == "text_input") {
      appState.current_view = "#question_view_text_input";
    }
    else if(appState.current_model.questionType == "multiple_Choice") {
        appState.current_view = "#question_view_multiple_choice";
      }
  }
  function setFeedbackView(isCorrect) {
    if (isCorrect == true) {
      appState.current_view = "#feedback_view_positive";
    } else {
      appState.current_view = "#feedback_view_negative";
    }
  }

  function update_view(appState) {

    const html_element = render_widget(appState.current_model, appState.current_view)
    document.querySelector("#widget_view").innerHTML = html_element;
  }

  const render_widget = (model,view) => {
    template_source = document.querySelector(view).innerHTML
    var template = Handlebars.compile(template_source);
    var html_widget_element = template({...model,...appState})
    return html_widget_element
  }
