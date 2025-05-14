import { useState } from "react";
import { userDataService } from "../services/UserDataService";
import "./QuizScreen.css";

// Definirea tipurilor pentru întrebări și răspunsuri
interface Question {
  id: number;
  text: string;
  options: string[];
}

interface Answer {
  questionId: number;
  selectedOption: string;
}

// Props pentru componenta QuizScreen
interface QuizScreenProps {
  onFinish: (score: number) => void;
}

const QuizScreen = ({ onFinish }: QuizScreenProps) => {
  // Lista de întrebări pentru quiz
  const questions: Question[] = [
    {
      id: 1,
      text: "Cât de des gătești acasă?",
      options: ["Zilnic", "De câteva ori pe săptămână", "Rar", "Niciodată"],
    },
    {
      id: 2,
      text: "Ce preferi să faci când ai timp liber?",
      options: [
        "Să fac curat în casă",
        "Să mă relaxez uitându-mă la TV",
        "Să ies în oraș cu prietenii",
        "Să stau pe telefon/social media",
      ],
    },
    {
      id: 3,
      text: "Cum te simți când casa este dezordonată?",
      options: [
        "Nu pot să mă relaxez deloc",
        "Mă deranjează puțin",
        "Îmi pasă doar când vin musafiri",
        "Nu mă afectează deloc",
      ],
    },
    {
      id: 4,
      text: "Cât de des faci curățenie generală?",
      options: [
        "Săptămânal",
        "Lunar",
        "Doar când este necesar",
        "Rar sau niciodată",
      ],
    },
    {
      id: 5,
      text: "Ce faci când trebuie să găzduiești musafiri?",
      options: [
        "Pregătesc totul de la zero cu grijă",
        "Fac cumpărături și ceva simplu",
        "Comand mâncare de afară",
        "Îi trimit la restaurant",
      ],
    },
  ];

  // State pentru a ține evidența răspunsurilor și a întrebării curente
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Funcție pentru a trece la următoarea întrebare
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnimating(false);
      }, 500);
    } else {
      // Calculează scorul când s-a ajuns la ultima întrebare
      calculateScore();
    }
  };

  // Funcție pentru a merge la întrebarea anterioară
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setIsAnimating(false);
      }, 500);
    }
  };

  // Funcție pentru a selecta un răspuns
  const selectAnswer = (questionId: number, selectedOption: string) => {
    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.questionId === questionId
    );

    let newAnswers = [...answers];

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionId, selectedOption };
    } else {
      newAnswers = [...newAnswers, { questionId, selectedOption }];
    }

    setAnswers(newAnswers);

    // Salvăm răspunsul în serviciul de date utilizator
    userDataService.addAnswer(questionId, selectedOption);

    console.log(
      `Răspuns selectat pentru întrebarea ${questionId}: ${selectedOption}`
    );
  };

  // Funcție pentru a calcula scorul final
  const calculateScore = () => {
    let score = 0;

    answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question) {
        // Calculăm scorul invers în funcție de indexul opțiunii
        // Prima opțiune (index 0) primește 3 puncte, a doua 2, a treia 1, a patra 0
        const optionIndex = question.options.indexOf(answer.selectedOption);
        const points = 3 - optionIndex;
        score += points;
      }
    });

    // Convertim scorul în procent
    const maxPossibleScore = questions.length * 3; // Maxim 3 puncte per întrebare
    const percentage = Math.round((score / maxPossibleScore) * 100);

    console.log(
      `Calculare scor: ${score}/${maxPossibleScore} = ${percentage}%`
    );

    // Trimitem scorul înapoi prin callback
    onFinish(percentage);
  };

  // Verificăm dacă întrebarea curentă are un răspuns selectat
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion.id
  );
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="quiz-screen">
      {/* Bara de progres */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
        <div className="progress-text">
          Întrebarea {currentQuestionIndex + 1} din {questions.length}
        </div>
      </div>

      {/* Containerul întrebării cu animație */}
      <div
        className={`question-container ${isAnimating ? "fade-out" : "fade-in"}`}
      >
        <h2 className="question-text">{currentQuestion.text}</h2>

        {/* Opțiunile de răspuns */}
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                currentAnswer?.selectedOption === option ? "selected" : ""
              }`}
              onClick={() => selectAnswer(currentQuestion.id, option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Butoanele de navigare */}
        <div className="navigation-buttons">
          {currentQuestionIndex > 0 && (
            <button className="nav-button back" onClick={goToPreviousQuestion}>
              Înapoi
            </button>
          )}

          <button
            className={`nav-button ${isLastQuestion ? "finish" : "next"}`}
            onClick={goToNextQuestion}
            disabled={!currentAnswer}
          >
            {isLastQuestion ? "Finalizează" : "Următoarea"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
