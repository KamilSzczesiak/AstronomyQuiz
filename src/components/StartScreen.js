function StartScreen({ numQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to The Astronomy Quiz!!</h2>
      <h3>{numQuestions} questions to test your knowledge of the universe!</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Start The Quiz!
      </button>
    </div>
  );
}

export default StartScreen;
