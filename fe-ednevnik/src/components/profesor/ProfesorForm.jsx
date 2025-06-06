import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ProfesorForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user_id } = location.state; // Preuzimanje user_id iz state-a

    const [ime, setIme] = useState("");
    const [titula, setTitula] = useState("Docent");
    const [kabinet, setKabinet] = useState("");
    const [konsultacije, setKonsultacije] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Poziv API-ja za kreiranje profesora
            const response = await axios.post("http://127.0.0.1:8000/api/profesor", {
                user_id, // Prosleđivanje user_id-a
                ime,
                titula,
                kabinet,
                konsultacije,
            });

            setMessage("Profesor uspešno kreiran!");
            console.log("Profesor kreiran:", response.data);
            alert("Uspesno ste uneli podatke za profesora!");

            // Nakon uspešnog unosa podataka, preusmeravanje na login stranicu
            navigate("/");
        } catch (error) {
            console.error("Greška prilikom kreiranja profesora:", error.response ? error.response.data : error.message);
            setError("Greška prilikom kreiranja profesora. Proverite unete podatke.");
        }
    };

    return (
        <div className="user-page">
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            <form className="user-form" onSubmit={handleSubmit}>
            <h2>Dodavanje podataka za profesora</h2>
                <label>
                    Ime:
                    <input
                        type="text"
                        value={ime}
                        onChange={(e) => setIme(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Titula:
                    <select
                        value={titula}
                        onChange={(e) => setTitula(e.target.value)}
                    >
                        <option value="Docent">Docent</option>
                        <option value="Vanredni profesor">Vanredni profesor</option>
                        <option value="Redovni profesor">Redovni profesor</option>
                    </select>
                </label>
                <label>
                    Kabinet:
                    <input
                        type="number"
                        value={kabinet}
                        onChange={(e) => setKabinet(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Konsultacije:
                    <input
                        type="text"
                        placeholder="npr. Utorak 15-17h"
                        value={konsultacije}
                        onChange={(e) => setKonsultacije(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Sačuvaj</button>
            </form>
        </div>
    );
};

export default ProfesorForm;