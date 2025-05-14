import { useState, useEffect } from "react";
import "./IntroScreen.css";

interface IntroScreenProps {
  onContinue: (userName: string) => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onContinue }) => {
  const [message1Visible, setMessage1Visible] = useState(false);
  const [message2Visible, setMessage2Visible] = useState(false);
  const [message3Visible, setMessage3Visible] = useState(false);
  const [finalMessageVisible, setFinalMessageVisible] = useState(false);
  const [nameInputVisible, setNameInputVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [nameError, setNameError] = useState("");
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    // Secvența animațiilor pentru mesaje
    setTimeout(() => {
      console.log("Mesajul 1 devine vizibil");
      setMessage1Visible(true);
    }, 800);

    setTimeout(() => {
      console.log("Mesajul 2 devine vizibil");
      setMessage2Visible(true);
    }, 2500);

    setTimeout(() => {
      console.log("Mesajul 3 devine vizibil");
      setMessage3Visible(true);
    }, 4200);

    setTimeout(() => {
      console.log("Mesajul final devine vizibil");
      setFinalMessageVisible(true);
    }, 5900);

    setTimeout(() => {
      console.log("Input pentru nume devine vizibil");
      setNameInputVisible(true);
    }, 7000);
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

  const handleSubmit = () => {
    if (userName.trim().length < 2) {
      setNameError("Te rugăm să introduci un nume valid (minim 2 caractere)");
      return;
    }

    console.log("Numele introdus:", userName);
    onContinue(userName);
  };

  return (
    <div className="intro-screen">
      <div className="intro-background"></div>

      <div className="intro-content">
        {/* Mesajele animaționale */}
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

        {/* Input pentru nume */}
        <div
          className={`name-input-container ${
            nameInputVisible ? "visible" : ""
          }`}
        >
          <div className="input-wrapper">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Numele tău..."
              className="name-input"
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
