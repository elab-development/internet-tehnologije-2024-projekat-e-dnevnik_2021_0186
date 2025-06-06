import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const RoditeljForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user_id } = location.state;

    const [ime, setIme] = useState("");
    const [kontakt, setKontakt] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/roditelj", {
                user_id,
                ime,
                kontakt,
            });

            setMessage("Roditelj uspešno kreiran!");
            console.log("Roditelj kreiran:", response.data);
            alert("Uspesno ste uneli podatke za roditelja!");

            navigate("/");
        } catch (error) {
            console.error("Greška prilikom kreiranja roditelja:", error.response ? error.response.data : error.message);
            setError("Greška prilikom kreiranja roditelja. Proverite unete podatke.");
        }
    };

    return (
        <div className="user-page">
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            <form  className="user-form" onSubmit={handleSubmit}>
            <h2>Dodavanje podataka za roditelja</h2>
                <label>
                    Ime:
                    <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} required />
                </label>
                <label>
                    Kontakt:
                    <input type="text" value={kontakt} onChange={(e) => setKontakt(e.target.value)} required />
                </label>
                <button type="submit">Sačuvaj</button>
            </form>
        </div>
    );
};

export default RoditeljForm;