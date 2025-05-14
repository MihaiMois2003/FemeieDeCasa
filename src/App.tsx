import { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import IntroScreen from "./components/IntroScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import { userDataService } from "./services/UserDataService";
import "./App.css";

// Definirea stărilor aplicației
type ScreenType = "WELCOME" | "INTRO" | "QUIZ" | "RESULT";

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("WELCOME");
  const [score, setScore] = useState<number>(0);

  // Funcție pentru a naviga la ecranul de introducere
  const handleStartWelcome = () => {
    console.log("Navigare la ecranul de introducere");
    setCurrentScreen("INTRO");
  };

  // Funcție pentru a procesa numele utilizatorului și a naviga la quiz
  const handleUserNameSubmit = (userName: string) => {
    console.log(`Nume utilizator introdus: ${userName}`);
    // Creăm utilizatorul dar nu mai stocăm ID-ul în state
    userDataService.createUser(userName);
    setCurrentScreen("QUIZ");
  };

  // Funcție pentru a naviga la ecranul de rezultate
  const handleFinishQuiz = (quizScore: number) => {
    console.log(`Quiz finalizat cu scorul: ${quizScore}%`);
    setScore(quizScore);
    userDataService.finishQuiz(quizScore);
    setCurrentScreen("RESULT");
  };

  // Funcție pentru a reincepe quiz-ul
  const handleRestart = () => {
    console.log("Restart aplicație");
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
      default:
        return <WelcomeScreen onStart={handleStartWelcome} />;
    }
  };

  return <div className="app">{renderScreen()}</div>;
}

export default App;
