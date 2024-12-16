import React, { useState, useEffect } from "react";
import "./WordRainGame.css";

const WordRainGame = () => {
  const [words, setWords] = useState([]);
  const [inputWord, setInputWord] = useState("");

  // Generar palabras aleatorias
  useEffect(() => {
    const interval = setInterval(() => {
      setWords((prevWords) => [
        ...prevWords,
        { text: randomWord(), id: Math.random(), left: Math.random() * 90 },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const randomWord = () => {
    const wordList = ["React", "CSS", "JavaScript", "HTML", "Node"];
    return wordList[Math.floor(Math.random() * wordList.length)];
  };

  const handleInputChange = (e) => {
    setInputWord(e.target.value);
  };

  return (
    <div className="word-rain-page">
      <h1>¡Lluvia de Palabras!</h1>
      <div className="game-container">
        {words.map((word) => (
          <div
            key={word.id}
            className="falling-word"
            style={{ left: `${word.left}%` }}
          >
            {word.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputWord}
        onChange={handleInputChange}
        className="word-input"
        placeholder="Escribe la palabra..."
      />
    </div>
  );
};

export default WordRainGame;
