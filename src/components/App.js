import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import "../index.css";

// Initial state for the quiz app
const initialState = {
  questions: [],
  status: "loading", // status: 'loading', 'error', 'ready', 'active', 'finished'
  index: 0,
  answer: null,
  points: 0,
  correctAnswers: 0, // Track correct answers
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      // Check if the answer is correct
      const isCorrect = action.payload === question.correctOption;
      return {
        ...state,
        answer: action.payload,
        points: isCorrect ? state.points + question.points : state.points,
        correctAnswers: isCorrect
          ? state.correctAnswers + 1
          : state.correctAnswers,
      };
    case "nextQuestion":
      if (state.index + 1 >= state.questions.length) {
        return { ...state, status: "finished" }; // Finish the quiz if last question is reached
      }
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        index: state.questions.length - 1, // Ensure the last index is used when finished
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, correctAnswers },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  // Fetch questions when the component mounts// Shuffle function to randomize the order of questions
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const res = await fetch("/Questions.json");  // Ensure the correct path
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
  
      // Check if the expected data structure is correct
      if (!data || !data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid data structure");
      }
  
      // Shuffle the questions array
      const shuffledQuestions = shuffleArray(data.questions);
  
      dispatch({
        type: "dataReceived",
        payload: shuffledQuestions,
      });
    } catch (err) {
      console.error("Error fetching questions:", err);
      dispatch({ type: "dataFailed" });
    }
  };

  fetchQuestions();
}, []); // Empty dependency array ensures this runs once when the component mounts


  return (
    <div className="wrapper">
      <div className="app">
        <div className="headerWrapper">
          <Header />

          <Main>
            {status === "loading" && <Loader />}
            {status === "error" && <Error />}
            {status === "ready" && (
              <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
            )}
            {status === "active" && (
              <>
                {index < numQuestions && (
                  <Progress
                    index={index}
                    numQuestions={numQuestions}
                    points={points}
                    maxPossiblePoints={maxPossiblePoints}
                    answer={answer}
                  />
                )}
                {index < numQuestions && (
                  <Question
                    question={questions[index]}
                    dispatch={dispatch}
                    answer={answer}
                  />
                )}
                <Footer>
                  <NextButton
                    dispatch={dispatch}
                    answer={answer}
                    numQuestions={numQuestions}
                    index={index}
                  />
                </Footer>
              </>
            )}
            {status === "finished" && (
              <FinishScreen
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                correctAnswers={correctAnswers}
                numQuestions={numQuestions}
                dispatch={dispatch}
                questions={questions}
              />
            )}
          </Main>
        </div>
      </div>
    </div>
  );
}
