import { useState, useEffect } from "react";
import type { UserData } from "../services/UserDataService";
import { userDataService } from "../services/UserDataService";
import "./AdminScreen.css";

// Lista completă de întrebări pentru referință
// Lista completă de întrebări pentru referință
const allQuestions = [
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
      { text: "Ies rar, în locuri calme sau cu prieteni apropiați", points: 3 },
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

interface AdminScreenProps {
  onExit: () => void;
}

interface QuestionStats {
  questionId: number;
  text: string;
  answerCounts: { [option: string]: number };
  totalResponses: number;
}

const AdminScreen = ({ onExit }: AdminScreenProps) => {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<QuestionStats[]>([]);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [instagramUsers, setInstagramUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obține datele utilizatorilor din Firebase
        const userData = await userDataService.getAllUserData();
        setUsersData(userData);

        // Filter users with Instagram usernames for the special section
        const usersWithInstagram = userData.filter(
          (user) =>
            user.instagramUsername && user.instagramUsername.trim() !== ""
        );
        setInstagramUsers(usersWithInstagram);

        // Calculează statisticile
        calculateStatistics(userData);

        console.log(
          "Date încărcate cu succes în AdminScreen:",
          userData.length,
          "utilizatori"
        );
        console.log("Utilizatori cu Instagram:", usersWithInstagram.length);
        setLoading(false);
      } catch (err) {
        console.error("Eroare la încărcarea datelor:", err);
        setError(
          "Nu s-au putut încărca datele. Vă rugăm încercați din nou mai târziu."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStatistics = (userData: UserData[]) => {
    // Calculate average score
    if (userData.length > 0) {
      const totalScore = userData.reduce((sum, user) => sum + user.score, 0);
      setAverageScore(Math.round(totalScore / userData.length));
    }

    setTotalUsers(userData.length);

    // Create a set of all question IDs that have answers
    const questionIdsWithAnswers = new Set<number>();
    userData.forEach((user) => {
      user.answers.forEach((answer) => {
        questionIdsWithAnswers.add(answer.questionId);
      });
    });

    // Ensure we include all questions from allQuestions
    // Ensure we include ALL questions from allQuestions, regardless of whether they have answers
    const allQuestionIds = Array.from(
      new Set([
        ...allQuestions.map((q) => q.id),
        ...Array.from(questionIdsWithAnswers),
      ])
    );

    // Calculate statistics for each question
    const stats: QuestionStats[] = allQuestionIds.map((questionId) => {
      // Find the question in allQuestions
      const question = allQuestions.find((q) => q.id === questionId);

      // Initialize answer counts
      const answerCounts: { [option: string]: number } = {};

      // If the question exists in allQuestions, initialize counts for all options
      if (question) {
        question.options.forEach((option) => {
          answerCounts[option.text] = 0;
        });
      }

      let totalResponses = 0;

      // Count answers for this question from all users
      userData.forEach((user) => {
        const answer = user.answers.find((a) => a.questionId === questionId);
        if (answer) {
          answerCounts[answer.answer] = (answerCounts[answer.answer] || 0) + 1;
          totalResponses++;
        }
      });

      return {
        questionId,
        text: question ? question.text : `Întrebarea ${questionId}`,
        answerCounts,
        totalResponses,
      };
    });

    // Sort stats by question ID to ensure they appear in order
    const sortedStats = stats.sort((a, b) => a.questionId - b.questionId);

    setStatistics(sortedStats);
  };

  // Funcție pentru a afișa detaliile utilizatorului selectat
  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  // Funcție pentru a închide detaliile utilizatorului
  const closeUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  // Obține răspunsul pentru o întrebare specifică
  const getUserAnswer = (questionId: number) => {
    if (!selectedUser) return "Nu a răspuns";

    const answer = selectedUser.answers.find(
      (a) => a.questionId === questionId
    );
    return answer ? answer.answer : "Nu a răspuns";
  };

  // Get the points for a specific answer
  const getUserAnswerPoints = (questionId: number) => {
    if (!selectedUser) return 0;

    const answer = selectedUser.answers.find(
      (a) => a.questionId === questionId
    );

    return answer?.points || 0;
  };

  // Calculează clasa pentru a afișa culoarea răspunsului în funcție de puncte
  const getAnswerClass = (questionId: number) => {
    const points = getUserAnswerPoints(questionId);

    if (points === 4) return "answer-excellent";
    if (points === 3) return "answer-good";
    if (points === 2) return "answer-average";
    return "answer-poor";
  };

  // Find the question text for a given question ID
  const getQuestionText = (questionId: number) => {
    const question = allQuestions.find((q) => q.id === questionId);
    return question ? question.text : `Întrebarea ${questionId}`;
  };

  // Check if a user answered a specific question
  const hasAnsweredQuestion = (questionId: number) => {
    if (!selectedUser) return false;
    return selectedUser.answers.some((a) => a.questionId === questionId);
  };

  // Get the list of questions this user answered
  const getUserAnsweredQuestions = () => {
    if (!selectedUser) return [];

    // If the user has questionsSelected field, use it
    if (
      selectedUser.questionsSelected &&
      selectedUser.questionsSelected.length > 0
    ) {
      return selectedUser.questionsSelected.map((id) => ({
        id,
        text: getQuestionText(id),
        answered: hasAnsweredQuestion(id),
      }));
    }

    // Otherwise, use the questions they answered
    return selectedUser.answers.map((answer) => ({
      id: answer.questionId,
      text: getQuestionText(answer.questionId),
      answered: true,
    }));
  };

  if (loading) {
    return <div className="admin-loading">Se încarcă datele...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <h1>Panoul de administrare</h1>
        <button className="exit-button" onClick={onExit}>
          Ieșire
        </button>
      </div>

      <div className="admin-summary">
        <div className="summary-card">
          <h2>Total utilizatori</h2>
          <div className="summary-value">{totalUsers}</div>
        </div>

        <div className="summary-card">
          <h2>Scor mediu</h2>
          <div className="summary-value">{averageScore}%</div>
        </div>

        <div className="summary-card">
          <h2>Instagram usernames</h2>
          <div className="summary-value">{instagramUsers.length}</div>
        </div>
      </div>

      {/* Instagram Users Section */}
      {instagramUsers.length > 0 && (
        <div className="instagram-users-section">
          <h2>👑 Femei de casă cu Instagram (60%+)</h2>
          <div className="instagram-users-grid">
            {instagramUsers.map((user, index) => (
              <div
                key={index}
                className="instagram-user-card"
                onClick={() => handleUserClick(user)}
              >
                <div className="instagram-user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-score">{user.score}%</div>
                  <div className="instagram-username">
                    @{user.instagramUsername}
                  </div>
                  <div className="user-date">
                    {user.timestamp.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal pentru detaliile utilizatorului */}
      {showUserDetails && selectedUser && (
        <div className="user-details-modal">
          <div className="user-details-content">
            <div className="user-details-header">
              <h2>Detalii pentru {selectedUser.name}</h2>
              <button className="close-button" onClick={closeUserDetails}>
                ×
              </button>
            </div>

            <div className="user-info">
              <p>
                <strong>Scor:</strong> {selectedUser.score}%
              </p>
              {selectedUser.totalPoints !== undefined &&
                selectedUser.maxPossiblePoints !== undefined && (
                  <p>
                    <strong>Puncte:</strong> {selectedUser.totalPoints}/
                    {selectedUser.maxPossiblePoints}(
                    {Math.round(
                      (selectedUser.totalPoints /
                        selectedUser.maxPossiblePoints) *
                        100
                    )}
                    %)
                  </p>
                )}
              {selectedUser.instagramUsername && (
                <p>
                  <strong>Instagram:</strong> @{selectedUser.instagramUsername}
                </p>
              )}
              <p>
                <strong>Data completării:</strong>{" "}
                {selectedUser.timestamp.toLocaleDateString()}{" "}
                {selectedUser.timestamp.toLocaleTimeString()}
              </p>
            </div>

            <h3>Întrebări și răspunsuri</h3>
            <div className="user-answers">
              {getUserAnsweredQuestions().map((question) => (
                <div
                  key={question.id}
                  className={`user-answer-item ${
                    question.answered ? "" : "question-not-answered"
                  }`}
                >
                  <div className="question-text">
                    <strong>Întrebarea {question.id}:</strong> {question.text}
                  </div>
                  {question.answered ? (
                    <div
                      className={`answer-text ${getAnswerClass(question.id)}`}
                    >
                      <strong>Răspuns:</strong> {getUserAnswer(question.id)}
                      {getUserAnswerPoints(question.id) > 0 && (
                        <span className="answer-points">
                          ({getUserAnswerPoints(question.id)} puncte)
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="answer-text answer-not-provided">
                      <strong>Răspuns:</strong> Nu a răspuns la această
                      întrebare
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="stats-container">
        <h2>Statistici pe întrebări</h2>

        {statistics.map((stat) => (
          <div key={stat.questionId} className="question-stat">
            <h3>
              Întrebarea {stat.questionId}: {stat.text}
            </h3>

            <div className="options-stats">
              {(() => {
                // Find the question in allQuestions
                const question = allQuestions.find(
                  (q) => q.id === stat.questionId
                );

                if (question) {
                  // If question exists in allQuestions, display options as before
                  return question.options.map((option, index) => {
                    const count = stat.answerCounts[option.text] || 0;
                    const percentage =
                      stat.totalResponses > 0
                        ? Math.round((count / stat.totalResponses) * 100)
                        : 0;

                    return (
                      <div key={index} className="option-stat">
                        <div className="option-label">
                          {option.text}{" "}
                          <span className="option-points">
                            ({option.points} puncte)
                          </span>
                        </div>
                        <div className="option-progress-container">
                          <div
                            className="option-progress"
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="option-percentage">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="option-count">{count} răspunsuri</div>
                      </div>
                    );
                  });
                } else {
                  // If question doesn't exist in allQuestions, display all answers that were given
                  return Object.entries(stat.answerCounts).map(
                    ([option, count], index) => {
                      const percentage =
                        stat.totalResponses > 0
                          ? Math.round((count / stat.totalResponses) * 100)
                          : 0;

                      return (
                        <div key={index} className="option-stat">
                          <div className="option-label">{option}</div>
                          <div className="option-progress-container">
                            <div
                              className="option-progress"
                              style={{ width: `${percentage}%` }}
                            >
                              <span className="option-percentage">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="option-count">{count} răspunsuri</div>
                        </div>
                      );
                    }
                  );
                }
              })()}
            </div>
          </div>
        ))}
      </div>

      <div className="users-list">
        <h2>Lista utilizatorilor recenți</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Nume</th>
              <th>Scor</th>
              <th>Puncte</th>
              <th>Instagram</th>
              <th>Data completării</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user, index) => (
              <tr
                key={index}
                className="user-row"
                onClick={() => handleUserClick(user)}
              >
                <td>{user.name}</td>
                <td>{user.score}%</td>
                <td>
                  {user.totalPoints !== undefined &&
                  user.maxPossiblePoints !== undefined
                    ? `${user.totalPoints}/${user.maxPossiblePoints}`
                    : "N/A"}
                </td>
                <td>
                  {user.instagramUsername ? (
                    <span className="instagram-cell">
                      @{user.instagramUsername}
                    </span>
                  ) : (
                    <span className="no-instagram">-</span>
                  )}
                </td>
                <td>
                  {user.timestamp.toLocaleDateString()}{" "}
                  {user.timestamp.toLocaleTimeString()}
                </td>
                <td>
                  <button
                    className="view-details-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      handleUserClick(user);
                    }}
                  >
                    Vezi detalii
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="back-button-container">
        <button className="back-button" onClick={onExit}>
          Revino înapoi
        </button>
      </div>
    </div>
  );
};

export default AdminScreen;
