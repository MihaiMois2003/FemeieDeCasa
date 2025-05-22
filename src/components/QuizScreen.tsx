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
      text: "Cum îți petreci o zi liberă ideală?",
      options: [
        { text: "Gătesc ceva nou, citesc, mă relaxez acasă", points: 4 },
        { text: "Ies cu prietenii în oraș", points: 2 },
        { text: "Merg la shopping sau la un brunch drăguț", points: 2 },
        { text: "Dorm până târziu și stau pe telefon", points: 1 },
      ],
    },
    {
      id: 2,
      text: "Care dintre următoarele este un hobby care te definește?",
      options: [
        { text: "Îmi place să citesc și să învăț lucruri noi", points: 4 },
        { text: "Îmi place să călătoresc cât mai des", points: 1 },
        { text: "Îmi place să ies și să socializez", points: 2 },
        { text: "Îmi place să am grijă de mine și de cei dragi", points: 3 },
      ],
    },
    {
      id: 3,
      text: "Ai fost vreodată într-o relație doar pentru beneficii? (ex: cadouri, vacanțe, confort)",
      options: [
        { text: "Niciodată, mi se pare imoral", points: 4 },
        { text: "Poate am acceptat ceva, dar n-am profitat", points: 3 },
        { text: "Da, dar doar când relația nu era serioasă", points: 2 },
        { text: "Da, dacă tot oferă, de ce nu?", points: 1 },
      ],
    },
    {
      id: 4,
      text: "Cât de des postezi selfie-uri sau poze provocatoare pe social media?",
      options: [
        { text: "Aproape niciodată", points: 4 },
        { text: "Foarte rar, doar la ocazii", points: 3 },
        { text: "Destul de des, îmi place să mă exprim", points: 2 },
        { text: "Mereu, trebuie să-mi țin engagement-ul sus", points: 1 },
      ],
    },
    {
      id: 5,
      text: "Cum reacționezi când primești DM-uri de la bărbați necunoscuți?",
      options: [
        { text: "Nu răspund deloc", points: 4 },
        { text: "Dacă e respectuos, poate răspund scurt", points: 3 },
        { text: "Depinde ce fel de DM e", points: 2 },
        { text: "Îmi place atenția, de ce nu?", points: 1 },
      ],
    },
    {
      id: 6,
      text: "Ce înseamnă respectul într-o relație pentru tine?",
      options: [
        { text: "Fidelitate, sprijin și limite clare", points: 4 },
        { text: "Să nu ne controlăm prea mult", points: 2 },
        { text: "Fiecare face ce simte, fără stres", points: 1 },
        { text: "Respectul vine doar dacă e reciproc", points: 3 },
      ],
    },
    {
      id: 7,
      text: "Cum reacționezi când cineva nu e de acord cu tine?",
      options: [
        { text: "Încerc să înțeleg perspectiva lor", points: 4 },
        { text: "Mă simt ofensată, dar încerc să nu arăt", points: 3 },
        { text: "Mă enervez și reacționez", points: 2 },
        { text: "Le arăt că nu au dreptate", points: 1 },
      ],
    },
    {
      id: 8,
      text: "Cum vezi rolul femeii într-o familie?",
      options: [
        { text: "Sprijin, echilibru, grijă, feminitate", points: 4 },
        { text: "Trebuie să fie independentă total", points: 2 },
        { text: "Să-și urmeze visurile, cu sau fără familie", points: 2 },
        { text: "Nu cred în roluri, toți fac tot", points: 3 },
      ],
    },
    {
      id: 9,
      text: "Ce înseamnă frumusețea pentru tine?",
      options: [
        { text: "Un amestec de suflet, eleganță și îngrijire", points: 4 },
        { text: "Să arăți bine și să atragi", points: 2 },
        { text: "Să fii apreciată de ceilalți", points: 1 },
        { text: "Să te simți bine în pielea ta", points: 3 },
      ],
    },
    {
      id: 10,
      text: "Ai accepta bani de la un bărbat fără să fie o relație serioasă?",
      options: [
        { text: "Niciodată, mi se pare umilitor", points: 4 },
        { text: "Poate, dacă e un cadou sincer", points: 3 },
        { text: "Dacă-mi oferă, de ce nu?", points: 2 },
        { text: "Da, bărbații trebuie să ofere mereu", points: 1 },
      ],
    },
    {
      id: 11,
      text: "Ce apreciezi cel mai mult la un bărbat?",
      options: [
        { text: "Respect, calm, loialitate", points: 4 },
        { text: "Siguranță financiară și putere", points: 2 },
        { text: "Să mă facă să râd și să mă distrez", points: 2 },
        { text: "Să fie romantic și atent non-stop", points: 3 },
      ],
    },
    {
      id: 12,
      text: "Ce stil vestimentar preferi?",
      options: [
        { text: "Elegant, feminin și decent", points: 4 },
        { text: "Casual și îngrijit", points: 3 },
        { text: "Modern, provocator", points: 2 },
        { text: "Orice, nu contează cum arăt", points: 1 },
      ],
    },
    {
      id: 13,
      text: "Ce părere ai despre aventurile de-o noapte?",
      options: [
        { text: "Total împotrivă", points: 4 },
        { text: "Nu mă reprezintă, dar nu judec", points: 3 },
        { text: "Am avut, dar nu le mai caut", points: 2 },
        { text: "Sunt ok, fac parte din viață", points: 1 },
      ],
    },
    {
      id: 14,
      text: "Câte relații serioase ai avut până acum?",
      options: [
        { text: "Una sau două, lungi și serioase", points: 4 },
        { text: "Câteva, dar toate au fost serioase", points: 3 },
        { text: "Multe, dar fără stabilitate", points: 2 },
        { text: "N-am avut relații serioase", points: 1 },
      ],
    },
    {
      id: 15,
      text: "Fumezi?",
      options: [
        { text: "Nu am fumat niciodată", points: 4 },
        { text: "Am fumat, dar m-am lăsat", points: 3 },
        { text: "Fumez ocazional", points: 2 },
        { text: "Fumez zilnic", points: 1 },
      ],
    },
    {
      id: 16,
      text: "Cât de des bei alcool?",
      options: [
        { text: "Niciodată", points: 4 },
        { text: "Ocazional la evenimente speciale", points: 3 },
        { text: "De câteva ori pe lună", points: 2 },
        { text: "Săptămânal sau mai des", points: 1 },
      ],
    },
    {
      id: 17,
      text: "Cum alegi să-ți petreci o seară de weekend, în mod ideal?",
      options: [
        {
          text: "Petrec timp acasă, liniștit(ă), cu persoana iubită sau cu familia",
          points: 4,
        },
        {
          text: "Ies rar, în locuri calme sau cu prieteni apropiați",
          points: 3,
        },
        {
          text: "Îmi place să ies des, viața e făcută pentru distracție",
          points: 2,
        },
        {
          text: "Mă energizează cluburile, petrecerile și socializarea cu oameni noi",
          points: 1,
        },
      ],
    },
    {
      id: 18,
      text: "Cât de importantă este discreția în relațiile personale?",
      options: [
        {
          text: "Foarte importantă: nu expun detalii intime, prefer intimitatea și respectul reciproc",
          points: 4,
        },
        {
          text: "Împărtășesc doar cu o persoană de maximă încredere, când simt nevoia",
          points: 3,
        },
        { text: "Vorbesc deschis cu prietenele, cred că e normal", points: 2 },
        {
          text: "Îmi place să împărtășesc totul online, oamenii trebuie să știe ce trăiesc",
          points: 1,
        },
      ],
    },
    {
      id: 19,
      text: "Cum reacționezi când primești flori de la cineva drag?",
      options: [
        {
          text: "Le apreciez sincer, le pun într-o vază și le îngrijesc cu drag",
          points: 4,
        },
        {
          text: "Le accept, zâmbesc, dar nu sunt foarte pasionată de flori",
          points: 3,
        },
        { text: "Îmi plac, dar doar dacă sunt scumpe sau speciale", points: 2 },
        {
          text: "Mă plictisesc florile, prefer ceva practic în schimb",
          points: 1,
        },
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
  const NUM_QUESTIONS_IN_QUIZ = 13;

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
