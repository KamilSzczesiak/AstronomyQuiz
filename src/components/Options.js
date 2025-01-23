function Options({ question, dispatch, answer }) {
  const hasAnswered = answer !== null;

  return (
    <div>
      {question.options.map((option, index) => {
        const isSelected = index === answer; // Check if this option is selected
        const isCorrect = index === question.correctOption; // Check if this option is the correct one

        let classNames = "btn btn-option";
        if (isSelected) classNames += " selected"; // Add a class for the selected option
        if (hasAnswered) {
          if (isCorrect) classNames += " correct"; // Add a class for the correct answer
          else if (isSelected) classNames += " wrong"; // Add a class for the wrong selected answer
        }

        return (
          <button
            className={classNames}
            key={index}
            disabled={hasAnswered}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default Options;
