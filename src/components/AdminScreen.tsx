import { useState, useEffect } from "react";
import type { UserData } from "../services/UserDataService";
import { userDataService } from "../services/UserDataService";
import "./AdminScreen.css";

// Lista de întrebări pentru comparare
const questions = [
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
    // Calculează scorul mediu
    if (userData.length > 0) {
      const totalScore = userData.reduce((sum, user) => sum + user.score, 0);
      setAverageScore(Math.round(totalScore / userData.length));
    }

    setTotalUsers(userData.length);

    // Calculează statisticile pentru fiecare întrebare
    const stats: QuestionStats[] = questions.map((question) => {
      const answerCounts: { [option: string]: number } = {};
      question.options.forEach((option) => {
        answerCounts[option] = 0;
      });

      let totalResponses = 0;

      // Numără răspunsurile pentru această întrebare
      userData.forEach((user) => {
        const answer = user.answers.find((a) => a.questionId === question.id);
        if (answer) {
          answerCounts[answer.answer] = (answerCounts[answer.answer] || 0) + 1;
          totalResponses++;
        }
      });

      return {
        questionId: question.id,
        text: question.text,
        answerCounts,
        totalResponses,
      };
    });

    setStatistics(stats);
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

      <div className="stats-container">
        <h2>Statistici pe întrebări</h2>

        {statistics.map((stat) => (
          <div key={stat.questionId} className="question-stat">
            <h3>
              Întrebarea {stat.questionId}: {stat.text}
            </h3>

            <div className="options-stats">
              {questions
                .find((q) => q.id === stat.questionId)
                ?.options.map((option, index) => {
                  const count = stat.answerCounts[option] || 0;
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
                })}
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
              <th>Data completării</th>
            </tr>
          </thead>
          <tbody>
            {usersData.slice(0, 10).map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.score}%</td>
                <td>
                  {user.timestamp.toLocaleDateString()}{" "}
                  {user.timestamp.toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminScreen;
