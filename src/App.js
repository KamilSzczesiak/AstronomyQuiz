import React, { useState, useEffect } from 'react';
import './App.css';

const quizData = [
  // True/False Questions
  { question: "Is the Sun a star?", type: "true-false", correct: "true" },
  { question: "Does Mercury have an atmosphere?", type: "true-false", correct: "false" },
  { question: "Is Venus the hottest planet in the solar system?", type: "true-false", correct: "true" },
  { question: "Is the Moon bigger than Pluto?", type: "true-false", correct: "true" },
  { question: "Does Neptune have rings?", type: "true-false", correct: "true" },

  // Multiple-Choice Questions
  { question: "What is the largest planet in our solar system?", type: "multiple-choice", options: ["Mars", "Earth", "Jupiter", "Venus"], correct: "Jupiter" },
  { question: "Which planet is closest to the Sun?", type: "multiple-choice", options: ["Mercury", "Venus", "Mars", "Neptune"], correct: "Mercury" },
  { question: "What is the name of the first satellite launched into space?", type: "multiple-choice", options: ["Voyager 1", "Hubble", "Sputnik 1", "Apollo 11"], correct: "Sputnik 1" },
  { question: "What is the main gas in Earth’s atmosphere?", type: "multiple-choice", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], correct: "Nitrogen" },
  { question: "Who was the first person to walk on the Moon?", type: "multiple-choice", options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"], correct: "Neil Armstrong" },
  { question: "What color is Mars’ sky during the day?", type: "multiple-choice", options: ["Blue", "Reddish", "Yellow", "Green"], correct: "Reddish" },
  { question: "Which planet is known for its large, beautiful rings?", type: "multiple-choice", options: ["Saturn", "Jupiter", "Uranus", "Neptune"], correct: "Saturn" },
  { question: "What galaxy is Earth located in?", type: "multiple-choice", options: ["Andromeda", "Whirlpool", "Milky Way", "Triangulum"], correct: "Milky Way" },
  { question: "Which is the smallest planet in the solar system?", type: "multiple-choice", options: ["Mercury", "Mars", "Pluto", "Venus"], correct: "Mercury" },
  { question: "What is the name of the largest volcano in the solar system?", type: "multiple-choice", options: ["Mauna Loa", "Olympus Mons", "Mount Everest", "Mount Etna"], correct: "Olympus Mons" },

  // Multiple-Answer Questions
  { question: "Which planets have rings?", type: "multiple-answer", options: ["Saturn", "Jupiter", "Neptune", "Mars"], correct: ["Saturn", "Jupiter", "Neptune"] },
  { question: "Which objects are classified as dwarf planets?", type: "multiple-answer", options: ["Pluto", "Ceres", "Eris", "Io"], correct: ["Pluto", "Ceres", "Eris"] },
  { question: "Which of these moons orbit Jupiter?", type: "multiple-answer", options: ["Io", "Titan", "Europa", "Ganymede"], correct: ["Io", "Europa", "Ganymede"] },
  { question: "Which elements are found in the Sun?", type: "multiple-answer", options: ["Hydrogen", "Helium", "Carbon", "Oxygen"], correct: ["Hydrogen", "Helium"] },
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState("");  
  const [showNextButton, setShowNextButton] = useState(false);
  const [buttonStyles, setButtonStyles] = useState({}); 
  const [disableButtons, setDisableButtons] = useState(false); 
  const [selectedAnswers, setSelectedAnswers] = useState([]); 
  const [isChecked, setIsChecked] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const maxScore = shuffledQuestions.length;

  useEffect(() => {
    document.title = "Astronomy Quiz";
    if (quizFinished) return;

    const shuffle = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    setShuffledQuestions(shuffle(quizData)); 
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredQuestions([]); 
    setUserAnswers([]); 
    setFeedback("");  
    setShowNextButton(false);  
    setButtonStyles({});  
    setDisableButtons(false); 
    setSelectedAnswers([]); 
    setIsChecked(false); 
  }, [quizFinished]);

  const progress = (score / maxScore) * 100;
  const percentageScore = Math.round(progress);  // This gives you the percentage score

  const handleAnswer = (answer) => {
    if (currentQuestion.type !== "multiple-answer") {
      setSelectedAnswers([answer]);
    } else {
      const updatedSelectedAnswers = [...selectedAnswers];
      if (updatedSelectedAnswers.includes(answer)) {
        const index = updatedSelectedAnswers.indexOf(answer);
        updatedSelectedAnswers.splice(index, 1);
      } else if (updatedSelectedAnswers.length < currentQuestion.correct.length) {
        updatedSelectedAnswers.push(answer);
      }
      setSelectedAnswers(updatedSelectedAnswers);
    }
  };

  const handleCheck = () => {
    const question = shuffledQuestions[currentQuestionIndex];
    let newScore = score;
    let newFeedback = "";
    let newButtonStyles = {}; 

    setDisableButtons(true);
    setIsChecked(true);

    const correctAnswers = question.correct;
    const isMultipleChoice = Array.isArray(correctAnswers);

    if (isMultipleChoice) {
      const correctCount = selectedAnswers.filter(answer => correctAnswers.includes(answer)).length;
      if (correctCount === correctAnswers.length && selectedAnswers.length === correctAnswers.length) {
        newScore++;
        newFeedback = "Correct!";
      } else {
        newFeedback = `Incorrect! You selected: "${selectedAnswers.join(", ")}". The correct answers are: "${correctAnswers.join(", ")}".`;
      }

      correctAnswers.forEach(answer => {
        newButtonStyles[answer] = { backgroundColor: "green" };
      });

      selectedAnswers.forEach(answer => {
        if (!correctAnswers.includes(answer)) {
          newButtonStyles[answer] = { backgroundColor: "red" };
        }
      });
    } else {
      const correctAnswer = correctAnswers;
      if (selectedAnswers[0] === correctAnswer) {
        newScore++;
        newFeedback = "Correct!";
        newButtonStyles[selectedAnswers[0]] = { backgroundColor: "green" };
      } else {
        newFeedback = `Incorrect! You selected: "${selectedAnswers[0]}". The correct answer is: "${correctAnswer}".`;
        newButtonStyles[selectedAnswers[0]] = { backgroundColor: "red" };
      }
    }

    setScore(newScore);
    setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);
    setUserAnswers([...userAnswers, selectedAnswers]);
    setFeedback(newFeedback);
    setButtonStyles(newButtonStyles);
    setShowNextButton(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback("");
      setShowNextButton(false);
      setButtonStyles({});
      setDisableButtons(false);
      setSelectedAnswers([]);
      setIsChecked(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleStartQuiz = () => {
    setShowStartScreen(false);
    setQuizFinished(false);
  };

  const handleResetQuiz = () => {
    setShowStartScreen(true);
    setQuizFinished(false);
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const displayAnswerCount = () => {
    if (currentQuestion.type === "multiple-answer") {
      return <p>You need to select {currentQuestion.correct.length} answers.</p>;
    }
    return null;
  };

  if (showStartScreen) {
    return (
      <div className="start-screen">
        <h1 className="start-title">Welcome to the Astronomy Quiz!</h1>
        <button className="start-button" onClick={handleStartQuiz}>Start Quiz</button>
      </div>
    );
  };

  return (
    <div className="quiz-container">
      {/* Conditionally render the score circle only if the quiz is finished */}
      {quizFinished && (
  <div className="score-moon">
    <div className="score">
    <svg
  width="200"
  height="200"
  viewBox="0 0 200 200"
  xmlns="http://www.w3.org/2000/svg"
  className="circle-progress"
>
  <circle
    cx="100"
    cy="100"
    r="90"
    stroke="lightgray"
    strokeWidth="15"
    fill="none"
  />
  <circle
    cx="100"
    cy="100"
    r="90"
    stroke="#00b3b3"
    strokeWidth="15"
    fill="none"
    strokeDasharray="565.48"
    strokeDashoffset={565.48 - (progress / 100) * 565.48}
    transform="rotate(-90 100 100)"
  />
  <text
    x="50%"
    y="50%"
    textAnchor="middle"
    dy="-0.3em"
    fontSize="30"
    fill="white"
  >
    {percentageScore}%
  </text>
  <text
    x="50%"
    y="50%"
    textAnchor="middle"
    dy="0.5em"
    fontSize="20"
    fill="white"
  >
    {score} / {maxScore}
  </text>
</svg>

    </div>
    </div>
)}

      {!quizFinished ? (
        <>
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{currentQuestion.question}</p>
          {displayAnswerCount()}
  
          {currentQuestion.type === "true-false" && (
            <>
              <button
                className={selectedAnswers.includes("true") ? "selected" : ""}
                style={buttonStyles["true"]}
                onClick={() => handleAnswer("true")}
                disabled={disableButtons}
              >
                True
              </button>
              <button
                className={selectedAnswers.includes("false") ? "selected" : ""}
                style={buttonStyles["false"]}
                onClick={() => handleAnswer("false")}
                disabled={disableButtons}
              >
                False
              </button>
            </>
          )}
  
          {currentQuestion.type === "multiple-choice" && (
            <>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={selectedAnswers.includes(option) ? "selected" : ""}
                  style={buttonStyles[option]}
                  onClick={() => handleAnswer(option)}
                  disabled={disableButtons}
                >
                  {option}
                </button>
              ))}
            </>
          )}
  
          {currentQuestion.type === "multiple-answer" && (
            <>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={selectedAnswers.includes(option) ? "selected" : ""}
                  style={buttonStyles[option]}
                  onClick={() => handleAnswer(option)}
                  disabled={disableButtons}
                >
                  {option}
                </button>
              ))}
            </>
          )}
  
          {isChecked && <p className="feedback">{feedback}</p>}
  
          {!isChecked && selectedAnswers.length > 0 && (
            <button className="check-button" onClick={handleCheck}>
              Check
            </button>
          )}
  
  {showNextButton && (
  <button className="next-button" onClick={handleNext}>
    {currentQuestionIndex === shuffledQuestions.length - 1 ? "Finish" : "Next"}
  </button>
)}

        </>
      ) : (
        <div className="end-screen">
          <div className="score-moon">
            <div className="score">
              <svg
                width="300"
                height="300"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="circle-progress"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="lightgray"
                  strokeWidth="15"
                  fill="none"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="#00b3b3"
                  strokeWidth="15"
                  fill="none"
                  strokeDasharray="565.48"
                  strokeDashoffset={565.48 - (percentageScore / 100) * 565.48}
                  transform="rotate(-90 100 100)"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".3em"
                  fontSize="30"
                  fill="white"
                >
                  {percentageScore}%
                </text>
              </svg>
            </div>
          </div>
          <button className="reset-button" onClick={handleResetQuiz}>
            Go Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
