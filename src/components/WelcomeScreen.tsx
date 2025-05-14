import React, { useEffect, useState } from "react";
import "./WelcomeScreen.css";

// Componentă pentru primul screen - Pagina de bun venit
const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [titleVisible, setTitleVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    // Animație pentru titlu - apare după 500ms
    const titleTimer = setTimeout(() => {
      console.log("Titlul devine vizibil");
      setTitleVisible(true);
    }, 500);

    // Animație pentru imagine - apare după titlu, la 1000ms
    const imageTimer = setTimeout(() => {
      console.log("Imaginea devine vizibilă");
      setImageVisible(true);
    }, 1000);

    // Animație pentru buton - apare după imagine, la 2000ms
    const buttonTimer = setTimeout(() => {
      console.log("Butonul devine vizibil");
      setButtonVisible(true);
    }, 2000);

    // Curățare timere la demontarea componentei
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(imageTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className="welcome-screen">
      {/* Fundal cu imagine */}
      <div className="background-image"></div>

      {/* Conținut principal */}
      <div className="content">
        <h1 className={`title ${titleVisible ? "visible" : ""}`}>
          Află dacă ești <span className="highlight">femeie de casă</span>
        </h1>

        {/* Container pentru imaginea circulară */}
        <div className={`image-container ${imageVisible ? "visible" : ""}`}>
          <div className="circle-image-wrapper">
            <div className="image-effects"></div>
            <div className="profile-image"></div>
          </div>
          <div className="image-caption">Talentul României</div>
        </div>

        <button
          className={`start-button ${buttonVisible ? "visible" : ""}`}
          onClick={() => {
            console.log("Buton 'Să începem' apăsat");
            onStart();
          }}
        >
          Să începem
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
