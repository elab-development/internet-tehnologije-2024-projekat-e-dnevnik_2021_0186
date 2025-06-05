import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa"; 

const Navbar = ({ token, setToken, tipKorisnika }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        setToken(null);
        navigate("/");
    };

    return (
        <nav className="navbar">
        <div className="nav-logo">
            <FaBook className="nav-icon" />
            <span>E-dnevnik</span>
        </div>
        <ul className="nav-links">
            {!token ? (
                <>
                    <li>
                        <Link to="/">Prijava</Link>
                    </li>
                    <li>
                        <Link to="/register">Registracija</Link>
                    </li>
                </>
            ) : (
                <>
                    {tipKorisnika === "profesor" && (
                        <>
                            <li>
                                <Link to="/dashboard-profesor">Dashboard Profesora</Link>
                            </li>
                            <li>
                            <Link to="/profesor-profile">Moj Profil</Link>
                            </li>
                        </>
                    )}
                    {tipKorisnika === "ucenik" && (
                        <>
                            <li>
                                <Link to="/ucenik-home">Početna</Link>
                            </li>
                            <li>
                                <Link to="/dashboard-ucenik">Dashboard Učenika</Link>
                            </li>
                            <li>
                            <Link to="/ucenik-profile">Moj Profil</Link>
                            </li>
                         </>
                    )}
                    {tipKorisnika === "roditelj" && (
                        <> 
                            <li>
                                <Link to="/dashboard-roditelj">Dashboard Roditelja</Link>
                            </li>
                            <li>
                                <Link to="/roditelj-profile">Moj Profil</Link>
                            </li>
                        </>
                    )}
                    {tipKorisnika === "admin" && (
                        <>
                            <li>
                                <Link to="/dashboard-admin">Dashboard Administratora</Link>
                                <Link to="/predmeti-admin">Upravljanje Predmetima</Link>
                            </li>
                        
                        </>
                    )}
                    <li>
                        <button className="logout-button" onClick={handleLogout}>
                            Odjava 
                        </button>
                    </li>
                </>
            )}
        </ul>
    </nav>
    );
};

export default Navbar;