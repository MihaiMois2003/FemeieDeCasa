import { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import IntroScreen from "./components/IntroScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import AdminScreen from "./components/AdminScreen";
import { userDataService } from "./services/UserDataService";
import "./App.css";

// Definirea stărilor aplicației
type ScreenType = "WELCOME" | "INTRO" | "QUIZ" | "RESULT" | "ADMIN";

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("WELCOME");
  const [score, setScore] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Verifică dacă există o parolă admin în localStorage
  useEffect(() => {
    const adminPassword = localStorage.getItem("adminPassword");
    if (adminPassword) {
      setIsAdmin(true);
    }

    // Adaugă un event listener pentru combinația secretă de taste (Ctrl+Alt+A)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === "a") {
        const password = prompt("Introduceți parola de administrator:");
        if (password === "admin123") {
          // Parola simplă pentru exemplificare
          localStorage.setItem("adminPassword", "true");
          setIsAdmin(true);
          setCurrentScreen("ADMIN");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Funcție pentru a naviga la ecranul de introducere
  const handleStartWelcome = () => {
    console.log("Navigare la ecranul de introducere");
    setCurrentScreen("INTRO");
  };

  // Funcție pentru a procesa numele utilizatorului și a naviga la quiz
  const handleUserNameSubmit = (userName: string) => {
    console.log(`Nume utilizator introdus: ${userName}`);
    userDataService.createUser(userName);
    setCurrentScreen("QUIZ");
  };

  // Funcție pentru a naviga la ecranul de rezultate
  const handleFinishQuiz = async (quizScore: number) => {
    console.log(`Quiz finalizat cu scorul: ${quizScore}%`);

    try {
      setScore(quizScore);
      // Salvăm datele în Firebase
      await userDataService.finishQuiz(quizScore);
      console.log("Date salvate cu succes în Firebase");
      // Trecem la ecranul de rezultate
      setCurrentScreen("RESULT");
    } catch (error) {
      console.error("Eroare la finalizarea quiz-ului:", error);
      alert(
        "A apărut o eroare la salvarea rezultatelor. Rezultatul a fost calculat, dar s-ar putea să nu fie salvat corect."
      );
      // Trecem oricum la ecranul de rezultate pentru a vedea scorul
      setCurrentScreen("RESULT");
    }
  };

  // Funcție pentru a reincepe quiz-ul
  const handleRestart = () => {
    console.log("Restart aplicație");
    setCurrentScreen("WELCOME");
  };

  // Funcție pentru a ieși din Admin Screen
  const handleExitAdmin = () => {
    setCurrentScreen("WELCOME");
  };

  // Renderează ecranul corespunzător bazat pe starea curentă
  const renderScreen = () => {
    console.log(`Rendering screen: ${currentScreen}`);

    switch (currentScreen) {
      case "WELCOME":
        return <WelcomeScreen onStart={handleStartWelcome} />;
      case "INTRO":
        return <IntroScreen onContinue={handleUserNameSubmit} />;
      case "QUIZ":
        return <QuizScreen onFinish={handleFinishQuiz} />;
      case "RESULT":
        return <ResultScreen score={score} onRestart={handleRestart} />;
      case "ADMIN":
        return <AdminScreen onExit={handleExitAdmin} />;
      default:
        return <WelcomeScreen onStart={handleStartWelcome} />;
    }
  };

  return (
    <div className="app">
      {isAdmin && currentScreen !== "ADMIN" && (
        <button
          className="admin-button"
          onClick={() => setCurrentScreen("ADMIN")}
        >
          Admin
        </button>
      )}
      {renderScreen()}
    </div>
  );
}

export default App;
