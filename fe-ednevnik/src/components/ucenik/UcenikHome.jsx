import React, { useEffect, useState } from "react";
import axios from "axios";

const UcenikHome = () => {
    const [trivia, setTrivia] = useState("");
    const [words, setWords] = useState([]);

    useEffect(() => {
        fetchTrivia();
        fetchWords();
    }, []);

   
    const fetchTrivia = async () => {
        try {
            const res = await axios.get("http://numbersapi.com/random/trivia");
            setTrivia(res.data);
        } catch (error) {
            console.error("Greška pri dohvaćanju trivie:", error);
        }
    };

    const fetchWords = async () => {
        const wordList = ["curiosity", "resilience", "integrity"];
        try {
            const promises = wordList.map((word) =>
                axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            );
            const results = await Promise.all(promises);
            const formatted = results.map((res) => ({
                word: res.data[0].word,
                meaning: res.data[0].meanings[0].definitions[0].definition,
            }));
            setWords(formatted);
        } catch (error) {
            console.error("Greška pri dohvaćanju reči:", error);
        }
    };

    return (
        <div className="ucenik-home">
            <h2>Dobrodošao nazad!</h2>
    
            <div className="card trivia-card">
                <h3>Zanimljivost dana za tebe:</h3>
                <p>{trivia}</p>
            </div>
    
            <h2>Nove reči koje možeš naučiti:</h2>
    
            <div className="words-container">
                {words.map((wordObj, idx) => (
                    <div className="word-card" key={idx}>
                        <h4>{wordObj.word}</h4>
                        <p>{wordObj.meaning}</p>
                    </div>
                ))}
            </div>
        </div>
    );
    
};

export default UcenikHome;