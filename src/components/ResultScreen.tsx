import { useEffect, useState, useRef } from "react";
import { userDataService } from "../services/UserDataService";
import html2canvas from "html2canvas";
import "./ResultScreen.css";

// Import result images
import image0to20 from "../assets/images/result-0-20.jpg";
import image20to40 from "../assets/images/result-20-40.jpg";
import image40to60 from "../assets/images/result-40-60.jpg";
import image60to80 from "../assets/images/result-60-80.jpg";
import image80to100 from "../assets/images/result-80-100.jpg";

interface ResultScreenProps {
  score: number; // Percentage result
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, onRestart }) => {
  const [showResult, setShowResult] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [userName, setUserName] = useState("");
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    averageScore: 0,
    maxScoreUser: { name: "", score: 0 },
    position: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  //state for share modal
  const [showShareModal, setShowShareModal] = useState(false);

  //ref to content we want to capture
  const resultContentRef = useRef<HTMLDivElement>(null);

  const captureAndDownloadScreenshot = async () => {
    if (!resultContentRef.current) return;

    try {
      // First hide the action buttons during capture
      const actionButtons =
        resultContentRef.current.querySelector(".action-buttons");
      if (actionButtons) {
        (actionButtons as HTMLElement).style.display = "none";
      }

      // Capture the content as canvas
      const canvas = await html2canvas(resultContentRef.current, {
        scale: 2, // Higher scale for better quality
        backgroundColor: null, // Maintain transparency
        logging: false,
      });

      // Show the buttons again
      if (actionButtons) {
        (actionButtons as HTMLElement).style.display = "flex";
      }

      // Convert canvas to image and download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `rezultat-femeie-de-casa-${score}%.png`;
      link.click();

      setShowShareModal(false);

      // Show instructions after download
      setTimeout(() => {
        alert(
          "Imaginea a fost descărcată! Acum poți să o partajezi pe Instagram Stories."
        );
      }, 500);
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      alert("A apărut o eroare la crearea imaginii. Încearcă din nou.");
    }
  };

  // Obținem numele utilizatorului curent
  useEffect(() => {
    const currentUser = userDataService.getCurrentUser();
    if (currentUser) {
      setUserName(currentUser.name);
      console.log("Afișare rezultate pentru utilizatorul:", currentUser.name);
    }
  }, []);

  // Obținem statistici reale din Firebase
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoadingStats(true);
        const allUsers = await userDataService.getAllUserData();

        if (allUsers.length > 0) {
          // Calculăm media scorurilor
          const totalScore = allUsers.reduce(
            (sum, user) => sum + user.score,
            0
          );
          const averageScore = Math.round(totalScore / allUsers.length);

          // Găsim utilizatorul cu scorul maxim
          const maxScoreUser = allUsers.reduce(
            (max, user) =>
              user.score > max.score
                ? { name: user.name, score: user.score }
                : max,
            { name: "", score: 0 }
          );

          // Sortăm utilizatorii după scor pentru a determina poziția
          const sortedUsers = [...allUsers].sort((a, b) => b.score - a.score);
          const currentUserPosition =
            sortedUsers.findIndex((user) => user.name === userName) + 1;

          setStatistics({
            totalUsers: allUsers.length,
            averageScore,
            maxScoreUser,
            position:
              currentUserPosition > 0
                ? currentUserPosition
                : sortedUsers.length,
          });
        } else {
          // Dacă nu avem date, folosim scorul curent
          setStatistics({
            totalUsers: 1,
            averageScore: score,
            maxScoreUser: { name: userName || "Tine", score },
            position: 1,
          });
        }

        setLoadingStats(false);
      } catch (error) {
        console.error("Eroare la obținerea statisticilor:", error);

        // Folosim valorile implicite în caz de eroare
        setStatistics({
          totalUsers: 1,
          averageScore: score,
          maxScoreUser: { name: userName || "Tine", score },
          position: 1,
        });

        setLoadingStats(false);
      }
    };

    fetchStatistics();
  }, [score, userName]);

  // Handle share button click
  const handleShareClick = () => {
    setShowShareModal(true);
  };

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
    } else if (score >= 20) {
      return {
        title: "Gospodăria nu este punctul tău forte",
        message: `${userName}, se pare că talentele tale sunt în alte domenii decât cel domestic. Nu-ți face griji, fiecare persoană are propriile calități și puncte forte. Poate ești mai creativă sau mai orientată spre carieră!`,
      };
    } else {
      return {
        title: "Talentele tale sunt definitiv în alte domenii",
        message: `${userName}, e clar că spiritul de gospodină nu este punctul tău forte, dar nu-ți face griji! Sunt multe alte lucruri pe care probabil le faci excelent. Fiecare persoană are propriile talente unice!`,
      };
    }
  };

  const feedback = getFeedbackMessage();

  // Funcție pentru a obține imaginea potrivită pentru scorul actual
  const getResultImage = () => {
    if (score >= 80) return image80to100;
    if (score >= 60) return image60to80;
    if (score >= 40) return image40to60;
    if (score >= 20) return image20to40;
    return image0to20;
  };

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
    if (score >= 20) return "poor";
    return "very-poor";
  };

  return (
    <div className="result-screen">
      <div className="result-container" ref={resultContentRef}>
        <h1 className="result-title">Rezultatul tău</h1>

        {/* Rezultatul cu imagine corespunzătoare categoriei de scor */}
        <div className={`result-display ${showResult ? "visible" : ""}`}>
          {/* Imaginea rezultatului în funcție de scor */}
          <div className="result-image-container">
            <img
              src={getResultImage()}
              alt={`Rezultat ${score}%`}
              className="result-image"
            />
          </div>

          {/* Categoria scorului - utilizatorul nu vede scorul exact */}
          <div className={`score-category ${getScoreClass()}`}>
            <div className="category-label">{feedback.title}</div>
          </div>
        </div>

        {/* Mesajul de feedback */}
        <div className={`feedback-container ${showMessage ? "visible" : ""}`}>
          <p className="feedback-message">{feedback.message}</p>
        </div>

        {/* Statistici */}
        <div className={`statistics-container ${showStats ? "visible" : ""}`}>
          <h3 className="statistics-title">Statistici</h3>

          {loadingStats ? (
            <div className="statistics-loading">Se încarcă statisticile...</div>
          ) : (
            <div className="statistics-grid">
              <div className="statistic-item">
                <div className="statistic-value">{statistics.totalUsers}</div>
                <div className="statistic-label">Participanți</div>
              </div>

              <div className="statistic-item">
                <div className="statistic-value">
                  {statistics.averageScore}%
                </div>
                <div className="statistic-label">Scor mediu</div>
              </div>

              <div className="statistic-item">
                <div className="statistic-value">{statistics.position}</div>
                <div className="statistic-label">Poziția ta</div>
              </div>

              <div className="statistic-item">
                <div className="statistic-value">{score}%</div>
                <div className="statistic-label">Scorul tău</div>
              </div>
            </div>
          )}
        </div>

        {/* Butoanele de acțiune */}
        <div className={`action-buttons ${showButtons ? "visible" : ""}`}>
          <button className="restart-button" onClick={onRestart}>
            Încearcă din nou
          </button>
          <button className="share-button" onClick={handleShareClick}>
            Distribuie rezultatul
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal">
          <div className="share-modal-content">
            <h3>Distribuie rezultatul tău</h3>
            <div className="share-options">
              <button
                className="share-option-button instagram"
                onClick={captureAndDownloadScreenshot}
              >
                <span className="icon">📸</span>
                Instagram Stories
              </button>
              <button
                className="share-option-button any"
                onClick={() => {
                  // Default sharing logic
                  const text = `Am obținut "${
                    getFeedbackMessage().title
                  }" în testul Femeie de Casă! Scorul meu: ${score}%!`;
                  navigator.clipboard.writeText(
                    text + " " + window.location.origin
                  );
                  alert(
                    "Text copiat în clipboard! Poți să îl lipești oriunde dorești să distribui."
                  );
                  setShowShareModal(false);
                }}
              >
                <span className="icon">📱</span>
                Alte aplicații
              </button>
            </div>
            <button
              className="close-share-button"
              onClick={() => setShowShareModal(false)}
            >
              Anulează
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultScreen;
