import { useEffect, useState } from "react";
import { userDataService } from "../services/UserDataService";
import "./ResultScreen.css";

interface ResultScreenProps {
  score: number;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, onRestart }) => {
  const [showResult, setShowResult] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [userName, setUserName] = useState("");

  // Obținem numele utilizatorului curent
  useEffect(() => {
    const currentUser = userDataService.getCurrentUser();
    if (currentUser) {
      setUserName(currentUser.name);
      console.log("Afișare rezultate pentru utilizatorul:", currentUser.name);
    }
  }, []);

  // Determinăm mesajul de feedback bazat pe scor
  const getFeedbackMessage = () => {
    if (score >= 80) {
      return {
        title: "Ești o femeie de casă desăvârșită!",
        message: `${userName}, felicitări! Ai toate calitățile unei gospodine perfecte. Cu siguranță casa ta strălucește și toți te apreciază pentru talentele tale domestice. Continui să fii o sursă de inspirație!`,
      };
    } else if (score >= 60) {
      return {
        title: "Ai calități excelente de gospodină!",
        message: `${userName}, ești aproape perfectă în rolul de femeie de casă! Cu puțină practică în plus, vei ajunge la nivelul maxim. Continuă să îți perfecționezi abilitățile și vei impresiona pe toată lumea!`,
      };
    } else if (score >= 40) {
      return {
        title: "Ai potențial, dar mai ai de învățat",
        message: `${userName}, ai unele abilități domestice, dar mai ai loc de îmbunătățire. Cu puțină dedicare și exercițiu, poți deveni o adevărată femeie de casă. Nu renunța și continuă să exersezi!`,
      };
    } else {
      return {
        title: "Gospodăria nu este punctul tău forte",
        message: `${userName}, se pare că talentele tale sunt în alte domenii decât cel domestic. Nu-ți face griji, fiecare persoană are propriile calități și puncte forte. Poate ești mai creativă sau mai orientată spre carieră!`,
      };
    }
  };

  const feedback = getFeedbackMessage();

  // Obținem statistici despre utilizatori
  const getStatistics = () => {
    try {
      // Nu mai folosim allUsers, deci nu mai declarăm variabila

      // Calculăm media scorurilor - folosim doar scorul curent dacă nu avem date din backend încă
      const averageScore = score;

      return {
        totalUsers: 1, // Arătăm doar 1 deocamdată
        averageScore,
        maxScoreUser: { name: userName || "Tine", score: score },
        position: 1,
      };
    } catch (error) {
      console.error("Eroare la obținerea statisticilor:", error);

      // Returnăm date implicite în caz de eroare
      return {
        totalUsers: 1,
        averageScore: score,
        maxScoreUser: { name: userName || "Tine", score: score },
        position: 1,
      };
    }
  };

  const statistics = getStatistics();

  // Efectul de animație secvențială pentru afișarea rezultatelor
  useEffect(() => {
    // Afișăm rezultatul după o scurtă întârziere
    const resultTimer = setTimeout(() => {
      console.log("Rezultatul devine vizibil");
      setShowResult(true);
    }, 500);

    // Afișăm mesajul după ce scorul a fost afișat
    const messageTimer = setTimeout(() => {
      console.log("Mesajul de feedback devine vizibil");
      setShowMessage(true);
    }, 2000);

    // Afișăm statisticile după mesajul de feedback
    const statsTimer = setTimeout(() => {
      console.log("Statisticile devin vizibile");
      setShowStats(true);
    }, 3500);

    // Afișăm butoanele după ce statisticile au fost afișate
    const buttonsTimer = setTimeout(() => {
      console.log("Butoanele devin vizibile");
      setShowButtons(true);
    }, 4500);

    // Curățăm timerele la demontarea componentei
    return () => {
      clearTimeout(resultTimer);
      clearTimeout(messageTimer);
      clearTimeout(statsTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);

  // Calculăm clase CSS bazate pe scor pentru cercul de progres
  const getScoreClass = () => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "average";
    return "poor";
  };

  return (
    <div className="result-screen">
      {/* Removed result-background div since background is in App.tsx */}

      <div className="result-container">
        <h1 className="result-title">Rezultatul tău</h1>

        {/* Scorul cu animație circulară */}
        <div
          className={`score-circle-container ${showResult ? "visible" : ""}`}
        >
          <div className={`score-circle ${getScoreClass()}`}>
            <div className="score-value">{score}%</div>
          </div>
        </div>

        {/* Mesajul de feedback */}
        <div className={`feedback-container ${showMessage ? "visible" : ""}`}>
          <h2 className="feedback-title">{feedback.title}</h2>
          <p className="feedback-message">{feedback.message}</p>
        </div>

        {/* Statistici */}
        <div className={`statistics-container ${showStats ? "visible" : ""}`}>
          <h3 className="statistics-title">Statistici</h3>

          <div className="statistics-grid">
            <div className="statistic-item">
              <div className="statistic-value">{statistics.totalUsers}</div>
              <div className="statistic-label">Participanți</div>
            </div>

            <div className="statistic-item">
              <div className="statistic-value">{statistics.averageScore}%</div>
              <div className="statistic-label">Scor mediu</div>
            </div>

            <div className="statistic-item">
              <div className="statistic-value">{statistics.position}</div>
              <div className="statistic-label">Poziția ta</div>
            </div>

            <div className="statistic-item">
              <div className="statistic-value">
                {statistics.maxScoreUser.name}
              </div>
              <div className="statistic-label">Cel mai bun scor</div>
            </div>
          </div>
        </div>

        {/* Butoanele de acțiune */}
        <div className={`action-buttons ${showButtons ? "visible" : ""}`}>
          <button className="restart-button" onClick={onRestart}>
            Încearcă din nou
          </button>
          <button className="share-button">Distribuie rezultatul</button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
