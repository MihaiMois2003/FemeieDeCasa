import { useState, useEffect } from "react";
import type { UserData } from "../services/UserDataService";
import { userDataService } from "../services/UserDataService";
import "./AdminScreen.css";

// Lista completă de întrebări pentru referință
const allQuestions = [
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
      { text: "Spăl regulat, o dată sau de două ori pe săptămână", points: 3 },
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
      { text: "Planific riguros toate cheltuielile și economisesc", points: 4 },
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
      { text: "Încerc să repar eu sau chem imediat un specialist", points: 4 },
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obține datele utilizatorilor din Firebase
        const userData = await userDataService.getAllUserData();
        setUsersData(userData);

        // Calculează statisticile
        calculateStatistics(userData);

        console.log(
          "Date încărcate cu succes în AdminScreen:",
          userData.length,
          "utilizatori"
        );
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
      </div>

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
