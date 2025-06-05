import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image1 from "../../images/image1.png";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tipKorisnika, setTipKorisnika] = useState("profesor"); // Default tip korisnika
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/register", {
                email,
                password,
                tip_korisnika: tipKorisnika,
            });

            console.log("Uspešno registrovan korisnik:", response.data);

            // Preuzimamo user_id iz odgovora API-ja
            const { user } = response.data;

            // Preusmeravamo korisnika na odgovarajuću stranicu za unos dodatnih podataka
            if (tipKorisnika === "profesor") {
                navigate("/profesor", { state: { user_id: user.id } });
            } else if (tipKorisnika === "ucenik") {
                navigate("/ucenik", { state: { user_id: user.id } });
            } else if (tipKorisnika === "roditelj") {
                navigate("/roditelj", { state: { user_id: user.id } });
            }
        } catch (error) {
            setError("Greška prilikom registracije. Proverite podatke i pokušajte ponovo.");
            console.error("Greška prilikom registracije:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className = "login-page"> 
        <div className="login-container"> 
        <img src={image1} alt="Registracija" className="login-image" />
        <form className="login-form"  onSubmit={handleSubmit}>
        <h2>Registracija</h2>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Lozinka:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
           
            <label>Tip korisnika:</label>
            <select value={tipKorisnika} onChange={(e) => setTipKorisnika(e.target.value)}>
                <option value="profesor">Profesor</option>
                <option value="ucenik">Učenik</option>
                <option value="roditelj">Roditelj</option>
            </select>
            <button type="submit">Registruj se</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        </div>
        </div>
    );
};

export default RegisterForm;