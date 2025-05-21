import { useState, useEffect, useRef } from "react";
import "./IntroScreen.css";

interface IntroScreenProps {
  onContinue: (userName: string) => void;
  onAdminAccess?: () => void; // New optional prop for admin access
}

const IntroScreen: React.FC<IntroScreenProps> = ({
  onContinue,
  onAdminAccess,
}) => {
  const [message1Visible, setMessage1Visible] = useState(false);
  const [message2Visible, setMessage2Visible] = useState(false);
  const [message3Visible, setMessage3Visible] = useState(false);
  const [finalMessageVisible, setFinalMessageVisible] = useState(false);
  const [nameInputVisible, setNameInputVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [nameError, setNameError] = useState("");
  const [buttonEnabled, setButtonEnabled] = useState(false);
  // Adaugă state pentru a urmări dacă tastatura este vizibilă
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  // Referință către containerul de intrare pentru a putea face focus/blur
  const inputRef = useRef<HTMLInputElement>(null);

  const ADMIN_USERNAME = "SotoMitzy69"; // The secret admin username

  useEffect(() => {
    // Secvența animațiilor pentru mesaje - cu timpi ajustați pentru o experiență mai bună pe mobil
    setTimeout(() => {
      console.log("Mesajul 1 devine vizibil");
      setMessage1Visible(true);
    }, 600);

    setTimeout(() => {
      console.log("Mesajul 2 devine vizibil");
      setMessage2Visible(true);
    }, 1800);

    setTimeout(() => {
      console.log("Mesajul 3 devine vizibil");
      setMessage3Visible(true);
    }, 3000);

    setTimeout(() => {
      console.log("Mesajul final devine vizibil");
      setFinalMessageVisible(true);
    }, 4200);

    setTimeout(() => {
      console.log("Input pentru nume devine vizibil");
      setNameInputVisible(true);
    }, 5400);
  }, []);

  // Validarea numelui și activarea butonului
  useEffect(() => {
    if (userName.trim().length >= 2) {
      setNameError("");
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [userName]);

  // Adăugăm detectarea evenimentelor tastaturii
  useEffect(() => {
    // Functii pentru a detecta când tastatura apare/dispare
    const handleKeyboardShow = () => {
      console.log("Tastatura s-a deschis");
      setIsKeyboardVisible(true);
    };

    const handleKeyboardHide = () => {
      console.log("Tastatura s-a închis");
      setIsKeyboardVisible(false);
    };

    // Pentru iOS
    window.addEventListener("focusin", handleKeyboardShow);
    window.addEventListener("focusout", handleKeyboardHide);

    // Pentru Android - adăugăm verificări pentru visualViewport
    if (typeof window !== "undefined" && window.visualViewport) {
      const viewportHandler = () => {
        // Verificăm din nou că visualViewport există
        if (window.visualViewport) {
          const currentHeight = window.visualViewport.height;
          const windowHeight = window.innerHeight;

          // Dacă viewport-ul e mai mic decât înălțimea ferestrei, probabil tastatura e deschisă
          if (currentHeight < windowHeight * 0.8) {
            handleKeyboardShow();
          } else {
            handleKeyboardHide();
          }
        }
      };

      window.visualViewport.addEventListener("resize", viewportHandler);

      // Cleanup pentru acest event listener
      return () => {
        // Verificăm din nou că visualViewport există înainte de a elimina listener-ul
        if (window.visualViewport) {
          window.visualViewport.removeEventListener("resize", viewportHandler);
        }

        // De asemenea, eliminăm și celelalte event listeners
        window.removeEventListener("focusin", handleKeyboardShow);
        window.removeEventListener("focusout", handleKeyboardHide);
      };
    } else {
      // Dacă visualViewport nu există, curățăm doar listeners pentru iOS
      return () => {
        window.removeEventListener("focusin", handleKeyboardShow);
        window.removeEventListener("focusout", handleKeyboardHide);
      };
    }
  }, []);

  const handleSubmit = () => {
    if (userName.trim().length < 2) {
      setNameError("Te rugăm să introduci un nume valid (minim 2 caractere)");
      return;
    }

    console.log("Numele introdus:", userName);

    // Check if the entered name is the admin username
    if (userName === ADMIN_USERNAME) {
      // It's the admin username, store in localStorage and redirect to admin screen
      localStorage.setItem("adminPassword", "true");

      // If onAdminAccess is provided, call it to navigate to admin screen
      if (onAdminAccess) {
        onAdminAccess();
      } else {
        // Fallback to regular continue if onAdminAccess is not provided
        onContinue(userName);
      }
    } else {
      // Not the admin username, proceed as normal
      onContinue(userName);
    }
  };

  // Handler pentru focus pe input
  const handleInputFocus = () => {
    setIsKeyboardVisible(true);
  };

  // Handler pentru blur pe input
  const handleInputBlur = () => {
    setIsKeyboardVisible(false);
  };

  return (
    <div
      className={`intro-screen ${isKeyboardVisible ? "keyboard-visible" : ""}`}
    >
      <div className="intro-content">
        {/* Mesajele - neschimbate */}
        <div
          className={`message-box message-1 ${
            message1Visible ? "visible" : ""
          }`}
        >
          <p>Te-ai săturat să îți spună lumea că nu ești femeie de casă?</p>
        </div>

        <div
          className={`message-box message-2 ${
            message2Visible ? "visible" : ""
          }`}
        >
          <p>Că nu vei găsi niciodată pe nimeni care să te aprecieze?</p>
        </div>

        <div
          className={`message-box message-3 ${
            message3Visible ? "visible" : ""
          }`}
        >
          <p>Că talentele tale sunt în alte domenii decât cel domestic?</p>
        </div>

        <div
          className={`final-message ${finalMessageVisible ? "visible" : ""}`}
        >
          <h2>E timpul să afli adevărul!</h2>
          <p>
            Completează acest test pentru a descoperi cât de mult te apropii de
            idealul unei femei de casă desăvârșite.
          </p>
        </div>

        {/* Input pentru nume - cu adăugarea evenimentelor pentru focus/blur */}
        <div
          className={`name-input-container ${
            nameInputVisible ? "visible" : ""
          }`}
        >
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Numele tău..."
              className="name-input"
              autoComplete="off"
            />
            <div className="input-highlight"></div>
          </div>

          {nameError && <p className="name-error">{nameError}</p>}

          <button
            className={`continue-button ${buttonEnabled ? "enabled" : ""}`}
            onClick={handleSubmit}
            disabled={!buttonEnabled}
          >
            Începe testul
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
