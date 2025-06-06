import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useRoditelji from "../../hooks/useRoditelji"; 
import axios from "axios";

const UcenikForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user_id } = location.state;

    const [ime, setIme] = useState("");
    const [razred, setRazred] = useState("");
    const [odeljenje, setOdeljenje] = useState("");
    const [roditeljId, setRoditeljId] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Koristi custom hook za dohvatanje roditelja
    const { roditelji, loading, error: roditeljiError } = useRoditelji();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/ucenik", {
                user_id,
                ime,
                razred,
                odeljenje,
                roditelj_id: roditeljId,
            });

            setMessage("Učenik uspešno kreiran!");
            alert("Uspešno ste uneli podatke za učenika!");
            navigate("/");
        } catch (error) {
            console.error("Greška prilikom kreiranja učenika:", error.response ? error.response.data : error.message);
            setError("Greška prilikom kreiranja učenika. Proverite unete podatke.");
        }
    };

    return (
        <div className="user-page">
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            {roditeljiError && <p style={{ color: "red" }}>{roditeljiError}</p>}
            
            <form className="user-form" onSubmit={handleSubmit}>
                <h2>Dodavanje podataka za učenika</h2>

                <label>
                    Ime:
                    <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} required />
                </label>

                <label>
                    Razred:
                    <input type="number" value={razred} onChange={(e) => setRazred(e.target.value)} required />
                </label>

                <label>
                    Odeljenje:
                    <input type="text" value={odeljenje} onChange={(e) => setOdeljenje(e.target.value)} required />
                </label>

                <label>
                    Roditelj:
                    {loading ? (
                        <p>Učitavanje roditelja...</p>
                    ) : (
                        <select value={roditeljId} onChange={(e) => setRoditeljId(e.target.value)} required>
                            <option value="">Izaberite roditelja</option>
                            {roditelji.map((roditelj) => (
                                <option key={roditelj.id} value={roditelj.id}>
                                    {roditelj.ime} {roditelj.prezime}
                                </option>
                            ))}
                        </select>
                    )}
                </label>

                <button type="submit">Sačuvaj</button>
            </form>
        </div>
    );
};

export default UcenikForm;