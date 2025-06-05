import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image1 from "../../images/image1.png";

const LoginForm = ({ setToken, setTipKorisnika, setRelatedModelId }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    let navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                email,
                password,
            });

            const { token, user } = response.data;

            // Čuvanje podataka u sessionStorage
            sessionStorage.setItem("access_token", token);
            sessionStorage.setItem("tip_korisnika", user.tip_korisnika);
            sessionStorage.setItem("related_model_id", user.related_model_id);

             // Logovanje podataka u konzolu
            console.log("Uspešna prijava!");
            console.log("Token:", token);
            console.log("Tip korisnika:", user.tip_korisnika);
            console.log("ID povezanog modela:", user.related_model_id);

            // Ažuriranje state-a
            setToken(token);
            setTipKorisnika(user.tip_korisnika);
            setRelatedModelId(user.related_model_id);

            // Preusmeravanje na odgovarajući dashboard
            switch (user.tip_korisnika) {
                case "profesor":
                    navigate("/dashboard-profesor");
                    break;
                case "ucenik":
                    navigate("/ucenik-home");
                    break;
                case "roditelj":
                    navigate("/dashboard-roditelj");
                    break;
                case "admin":
                    navigate("/dashboard-admin");
                    break;
                default:
                    navigate("/");
                    break;
            }
        } catch (error) {
            setError("Neispravni podaci za prijavu.");
            console.error("Greška prilikom prijave:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="login-page">
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="login-container"> 
            <img src={image1} alt="Registracija" className="login-image" />
            <form className="login-form" onSubmit={handleSubmit}>
            <h2>Prijava</h2>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Lozinka:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Prijavi se</button>
            </form>
            </div>
        </div>
    );
};

export default LoginForm;