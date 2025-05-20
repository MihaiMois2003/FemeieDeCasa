import { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import IntroScreen from "./components/IntroScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import AdminScreen from "./components/AdminScreen";
import { userDataService } from "./services/UserDataService";
import "./App.css";
// Import background image directly (this helps with Netlify builds)
import backgroundImage from "./assets/images/BuchetTrandafiri.jpg";

// Definirea stărilor aplicației
type ScreenType = "WELCOME" | "INTRO" | "QUIZ" | "RESULT" | "ADMIN";

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("WELCOME");
  const [score, setScore] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [maxPossiblePoints, setMaxPossiblePoints] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Aici practic "utilizăm" variabilele, dar nu facem nimic cu ele
    console.log(`Puncte curente: ${totalPoints}/${maxPossiblePoints}`);
  }, [totalPoints, maxPossiblePoints]);

  useEffect(() => {
    if (isAdmin) {
      document.title = "Admin - Femeie de Casă";
    } else {
      document.title = "Femeie de Casă";
    }
  }, [isAdmin]);

  // Verificăm dacă background-ul s-a încărcat
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setIsLoaded(true);
    };

    // Fallback timer in case image loading fails
    const timer = setTimeout(() => {
      if (!isLoaded) {
        console.log("Folosim timer-ul de rezervă pentru încărcare");
        setIsLoaded(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoaded]);

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
        if (password === "SotoMitzy69") {
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

  // Funcție pentru a accesa direct ecranul de admin
  const handleAdminAccess = () => {
    console.log("Acces direct la panoul de administrare");
    setIsAdmin(true);
    setCurrentScreen("ADMIN");
  };

  // Funcție pentru a naviga la ecranul de introducere
  const handleStartWelcome = () => {
    console.log("Navigare la ecranul de introducere");
    setCurrentScreen("INTRO");
  };

  // Funcție pentru a procesa numele utilizatorului și a naviga la quiz
  const handleUserNameSubmit = (userName: string) => {
    console.log(`Nume utilizator introdus: ${userName}`);

    // Verificăm dacă numele este numele secret pentru admin
    if (userName === "SotoMitzy69") {
      localStorage.setItem("adminPassword", "true");
      setIsAdmin(true);
      setCurrentScreen("ADMIN");
    } else {
      userDataService.createUser(userName);
      setCurrentScreen("QUIZ");
    }
  };

  // Funcție pentru a naviga la ecranul de rezultate

  // Update handleFinishQuiz function in App.tsx to use the declared variables
  // Funcție pentru a naviga la ecranul de rezultate
  const handleFinishQuiz = async (
    percentage: number,
    points: number,
    maxPoints: number
  ) => {
    console.log(
      `Quiz finalizat cu scorul: ${percentage}% (${points}/${maxPoints} puncte)`
    );

    try {
      setScore(percentage);
      setTotalPoints(points);
      setMaxPossiblePoints(maxPoints);

      // Salvăm datele în Firebase inclusiv punctele
      await userDataService.finishQuiz(percentage, points, maxPoints);
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
        return (
          <IntroScreen
            onContinue={handleUserNameSubmit}
            onAdminAccess={handleAdminAccess}
          />
        );
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

  // Aplicăm o clasă pentru a afișa conținutul doar după ce background-ul s-a încărcat
  const appClasses = `app ${isLoaded ? "loaded" : ""}`;

  return (
    <div className="app-container">
      <div className={appClasses}>
        {/* Common background for all screens except admin - Updated for better visibility */}
        {currentScreen !== "ADMIN" && (
          <div className="app-background">
            <div
              className="app-background-image"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>
          </div>
        )}

        {/* {isAdmin && currentScreen !== "ADMIN" && (
          <button
            className="admin-button"
            onClick={() => setCurrentScreen("ADMIN")}
          >
            Admin
          </button>
        )} */}

        <div className="screen-wrapper">{renderScreen()}</div>
      </div>
    </div>
  );
}

export default App;
