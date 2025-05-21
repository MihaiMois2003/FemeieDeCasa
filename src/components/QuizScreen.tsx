import { useState, useEffect } from "react";
import { userDataService } from "../services/UserDataService";
import "./QuizScreen.css";

// Definirea tipurilor pentru întrebări și răspunsuri
interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    points: number;
  }[];
}

interface Answer {
  questionId: number;
  selectedOption: string;
  points: number;
}

// Props pentru componenta QuizScreen
interface QuizScreenProps {
  onFinish: (score: number, points: number, maxPoints: number) => void;
}

const QuizScreen = ({ onFinish }: QuizScreenProps) => {
  // Lista completă de întrebări pentru quiz
  const allQuestions: Question[] = [
    {
      id: 1,
      text: "Cât de des gătești acasă?",
      options: [
        { text: "Zilnic", points: 4 },
        { text: "De câteva ori pe săptămână", points: 3 },
        { text: "Rar", points: 2 },
        { text: "Niciodată", points: 1 },
      ],
    },
    {
      id: 2,
      text: "Ce preferi să faci când ai timp liber?",
      options: [
        { text: "Să fac curat în casă", points: 4 },
        { text: "Să mă relaxez uitându-mă la TV", points: 3 },
        { text: "Să ies în oraș cu prietenii", points: 2 },
        { text: "Să stau pe telefon/social media", points: 1 },
      ],
    },
    {
      id: 3,
      text: "Cum te simți când casa este dezordonată?",
      options: [
        { text: "Nu pot să mă relaxez deloc", points: 4 },
        { text: "Mă deranjează puțin", points: 3 },
        { text: "Îmi pasă doar când vin musafiri", points: 2 },
        { text: "Nu mă afectează deloc", points: 1 },
      ],
    },
    {
      id: 4,
      text: "Cât de des faci curățenie generală?",
      options: [
        { text: "Săptămânal", points: 4 },
        { text: "Lunar", points: 3 },
        { text: "Doar când este necesar", points: 2 },
        { text: "Rar sau niciodată", points: 1 },
      ],
    },
    {
      id: 5,
      text: "Ce faci când trebuie să găzduiești musafiri?",
      options: [
        { text: "Pregătesc totul de la zero cu grijă", points: 4 },
        { text: "Fac cumpărături și ceva simplu", points: 3 },
        { text: "Comand mâncare de afară", points: 2 },
        { text: "Îi trimit la restaurant", points: 1 },
      ],
    },
    {
      id: 6,
      text: "Cât de importantă este pentru tine organizarea locuinței?",
      options: [
        {
          text: "Extrem de importantă, totul trebuie să fie perfect ordonat",
          points: 4,
        },
        {
          text: "Destul de importantă, prefer să fie lucrurile la locul lor",
          points: 3,
        },
        {
          text: "Moderat importantă, câtă vreme pot găsi ce-mi trebuie",
          points: 2,
        },
        { text: "Nu prea importantă, pot trăi și în dezordine", points: 1 },
      ],
    },
    {
      id: 7,
      text: "Cât de des speli vasele?",
      options: [
        { text: "Imediat după fiecare masă", points: 4 },
        { text: "La finalul zilei", points: 3 },
        { text: "Când se adună mai multe", points: 2 },
        { text: "Când nu mai am vase curate", points: 1 },
      ],
    },
    {
      id: 8,
      text: "Cum procedezi cu hainele murdare?",
      options: [
        { text: "Le spăl imediat cum se adună un coș", points: 4 },
        {
          text: "Spăl regulat, o dată sau de două ori pe săptămână",
          points: 3,
        },
        { text: "Spăl când nu mai am haine curate", points: 2 },
        {
          text: "De obicei aștept până când nu mai am loc în coșul de rufe",
          points: 1,
        },
      ],
    },
    {
      id: 9,
      text: "Care este atitudinea ta față de gătit?",
      options: [
        {
          text: "Îmi place să gătesc mâncăruri complexe și să experimentez",
          points: 4,
        },
        { text: "Gătesc regulat rețete simple", points: 3 },
        { text: "Gătesc doar când trebuie, prefer lucruri simple", points: 2 },
        { text: "Evit să gătesc ori de câte ori pot", points: 1 },
      ],
    },
    {
      id: 10,
      text: "Cum te descurci cu bugetul gospodăriei?",
      options: [
        {
          text: "Planific riguros toate cheltuielile și economisesc",
          points: 4,
        },
        { text: "Țin evidența cheltuielilor importante", points: 3 },
        { text: "Mă descurc cum pot, fără un plan strict", points: 2 },
        { text: "Nu mă preocupă prea mult bugetul", points: 1 },
      ],
    },
    {
      id: 11,
      text: "Cât de des faci cumpărături pentru casă?",
      options: [
        { text: "Planific săptămânal și fac cumpărături organizat", points: 4 },
        { text: "De câteva ori pe săptămână, după necesități", points: 3 },
        { text: "Cumpăr când îmi amintesc că lipsește ceva", points: 2 },
        { text: "De obicei când nu mai am nimic în frigider", points: 1 },
      ],
    },
    {
      id: 12,
      text: "Ce faci când se strică ceva prin casă?",
      options: [
        {
          text: "Încerc să repar eu sau chem imediat un specialist",
          points: 4,
        },
        { text: "Programez o reparație cât de curând posibil", points: 3 },
        { text: "Aștept până devine o problemă serioasă", points: 2 },
        { text: "Ignor problema cât timp se poate", points: 1 },
      ],
    },
    {
      id: 13,
      text: "Cum te raportezi la decorarea casei?",
      options: [
        {
          text: "Îmi place să decorez și să schimb frecvent aspectul locuinței",
          points: 4,
        },
        { text: "Acord atenție detaliilor și aspectului plăcut", points: 3 },
        { text: "Decorez minimal, doar ce e necesar", points: 2 },
        { text: "Nu mă interesează prea mult aspectul estetic", points: 1 },
      ],
    },
    {
      id: 14,
      text: "Cum te descurci cu plantele din casă?",
      options: [
        { text: "Am multe plante și le îngrijesc cu atenție", points: 4 },
        { text: "Am câteva plante pe care le îngrijesc decent", points: 3 },
        { text: "Am plante care necesită puțină îngrijire", points: 2 },
        { text: "Evit să am plante pentru că nu le pot îngriji", points: 1 },
      ],
    },
    {
      id: 15,
      text: "Cât de des schimbi așternuturile de pat?",
      options: [
        { text: "Săptămânal, fără excepție", points: 4 },
        { text: "La 1-2 săptămâni", points: 3 },
        { text: "La 3-4 săptămâni", points: 2 },
        { text: "Când îmi amintesc sau când par murdare", points: 1 },
      ],
    },
  ];

  // State pentru întrebările alese aleatoriu pentru acest quiz
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);

  // State pentru a ține evidența răspunsurilor și a întrebării curente
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [quizReady, setQuizReady] = useState(false);

  // Numărul de întrebări care vor fi afișate în quiz
  const NUM_QUESTIONS_IN_QUIZ = 10;

  // State pentru a ține evidența opțiunilor ordonate aleatoriu pentru fiecare întrebare
  const [shuffledOptions, setShuffledOptions] = useState<{
    [questionId: number]: { text: string; points: number }[];
  }>({});

  // Selectarea aleatorie a întrebărilor la încărcarea componentei
  useEffect(() => {
    // Funcție pentru a amesteca un array (algoritmul Fisher-Yates)
    const shuffleArray = (array: any[]) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    // Selectăm întrebările aleatoriu
    const shuffledQuestions = shuffleArray(allQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, NUM_QUESTIONS_IN_QUIZ);

    // Amestecă opțiunile pentru fiecare întrebare
    const initialShuffledOptions: {
      [questionId: number]: { text: string; points: number }[];
    } = {};

    selectedQuestions.forEach((question) => {
      // Creează o copie a opțiunilor și le amestecă
      initialShuffledOptions[question.id] = shuffleArray([...question.options]);
    });

    // Setează întrebările și opțiunile amestecate
    setQuizQuestions(selectedQuestions);
    setShuffledOptions(initialShuffledOptions);

    // Store the selected question IDs in the userDataService
    const selectedQuestionIds = selectedQuestions.map((q) => q.id);
    userDataService.setQuestionsSelected(selectedQuestionIds);

    setQuizReady(true);

    console.log(
      `S-au selectat aleatoriu ${NUM_QUESTIONS_IN_QUIZ} întrebări din totalul de ${allQuestions.length}`
    );
    console.log("Selected question IDs:", selectedQuestionIds);
  }, []);

  // Funcție pentru a trece la următoarea întrebare
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
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
  const selectAnswer = (
    questionId: number,
    selectedOption: string,
    points: number
  ) => {
    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.questionId === questionId
    );

    let newAnswers = [...answers];

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionId, selectedOption, points };
    } else {
      newAnswers = [...newAnswers, { questionId, selectedOption, points }];
    }

    setAnswers(newAnswers);

    // Salvăm răspunsul în serviciul de date utilizator
    // Folosim ID-ul original al întrebării pentru salvare - nu reindexat
    userDataService.addAnswer(questionId, selectedOption, points);

    console.log(
      `Răspuns selectat pentru întrebarea ${questionId}: ${selectedOption} (${points} puncte)`
    );
  };

  // Funcție pentru a calcula scorul final
  const calculateScore = () => {
    let totalPoints = 0;
    const maxPossiblePoints = quizQuestions.length * 4; // Maxim 4 puncte per întrebare

    answers.forEach((answer) => {
      totalPoints += answer.points;
    });

    // Convertim scorul în procent
    const percentage = Math.round((totalPoints / maxPossiblePoints) * 100);

    console.log(
      `Calculare scor: ${totalPoints}/${maxPossiblePoints} = ${percentage}%`
    );

    // Adăugăm o secvență try-catch pentru a detecta eventuale erori
    try {
      // Trimitem scorul înapoi prin callback
      onFinish(percentage, totalPoints, maxPossiblePoints);
    } catch (error) {
      console.error("Eroare la finalizarea quiz-ului:", error);
      alert(
        "A apărut o eroare la calcularea scorului. Te rugăm să încerci din nou."
      );
    }
  };

  // Verificăm dacă quiz-ul e pregătit și avem întrebări
  if (!quizReady || quizQuestions.length === 0) {
    return (
      <div className="quiz-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Se încarcă întrebările...</p>
        </div>
      </div>
    );
  }

  // Verificăm dacă întrebarea curentă are un răspuns selectat
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion.id
  );
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  return (
    <div className="quiz-screen">
      {/* Bara de progres */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quizQuestions.length) * 100
              }%`,
            }}
          ></div>
        </div>
        <div className="progress-text">
          Întrebarea {currentQuestionIndex + 1} din {quizQuestions.length}
        </div>
      </div>

      {/* Containerul întrebării cu animație */}
      <div
        className={`question-container ${isAnimating ? "fade-out" : "fade-in"}`}
      >
        <h2 className="question-text">{currentQuestion.text}</h2>

        {/* Opțiunile de răspuns - Acum folosim opțiunile amestecate */}
        <div className="options-container">
          {shuffledOptions[currentQuestion.id]?.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                currentAnswer?.selectedOption === option.text ? "selected" : ""
              }`}
              onClick={() =>
                selectAnswer(currentQuestion.id, option.text, option.points)
              }
            >
              {option.text}
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
