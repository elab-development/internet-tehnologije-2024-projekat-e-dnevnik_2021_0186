import React, { useState, useEffect } from "react";
import axios from "axios";
import EditModal from "../reusable/EditModal";
import ReusableTable from "../reusable/ReusableTable";

const ProfesorProfile = () => {
    const [profesor, setProfesor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableFields, setEditableFields] = useState({});
    const [predmeti, setPredmeti] = useState([]);
    const [noviPredmetId, setNoviPredmetId] = useState(""); // Za biranje novog predmeta

    const [dostupniPredmeti, setDostupniPredmeti] = useState([]);

    // Uzimamo podatke iz sessionStorage
    const profesorId = sessionStorage.getItem("related_model_id");
    const token = sessionStorage.getItem("access_token");

    // Kolone za tabelu predmeta
    const columns = [
        { key: "naziv", label: "Naziv" },
        { key: "opis", label: "Opis" },
        { key: "tezina", label: "Težina" },
        { 
            key: "action", 
            label: "Akcija", 
            render: (predmet) => (
                <button onClick={() => handleRemoveSubject(predmet.id)} className="remove-btn">
                    Ukloni
                </button>
            ) 
        },
    ];

    // Fetch podataka profesora
    const fetchProfesor = async () => {
        if (!profesorId || !token) {
            setError("Nedostaju podaci za autentifikaciju.");
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/profesori/${profesorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfesor(response.data.data);
            setPredmeti(response.data.data.predmeti); // Postavljamo predmete u state
            setEditableFields({
                titula: response.data.data.titula,
                kabinet: response.data.data.kabinet,
                konsultacije: response.data.data.konsultacije,
            });

        } catch (err) {
            console.error("Greška prilikom učitavanja profila profesora:", err);
            setError("Greška prilikom učitavanja profila profesora.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch dostupnih predmeta (koji nemaju profesora)
    const fetchDostupniPredmeti = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/predmeti/dostupni", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Dostupni predmeti iz API-ja:", response.data.data);
            setDostupniPredmeti(response.data.data);
        } catch (error) {
            console.error("Greška prilikom učitavanja dostupnih predmeta:", error);
        }
    };


    useEffect(() => {
        fetchProfesor();
        fetchDostupniPredmeti();
    }, [profesorId, token]);

    // Ažuriranje profila profesora
    const handleUpdate = async (updatedData) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/profesori/${profesorId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setProfesor(response.data.data);
            fetchProfesor();
            setIsModalOpen(false);
            alert("Profil uspešno ažuriran!");
        } catch (err) {
            console.error("Greška pri ažuriranju profesora:", err);
            alert("Greška pri ažuriranju profila.");
        }
    };

    // Uklanjanje predmeta sa profila
    const handleRemoveSubject = async (predmetId) => {
        if (!window.confirm("Da li ste sigurni da želite da uklonite ovaj predmet?")) {
            return;
        }

        try {
            await axios.delete(`http://127.0.0.1:8000/api/profesori/ukloni-predmet/${predmetId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPredmeti(prev => prev.filter(predmet => predmet.id !== predmetId));
            alert("Predmet uspešno uklonjen!");

        } catch (error) {
            console.error("Greška pri uklanjanju predmeta:", error);
            alert("Došlo je do greške pri uklanjanju predmeta.");
        }
    };

    // Dodavanje predmeta profesoru
    const handleAddSubject = async () => {
        if (!noviPredmetId) {
            alert("Nema dostupnih predmeta za dodavanje.");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/profesori/dodaj-predmet",
                { predmet_id: noviPredmetId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setPredmeti(prev => [...prev, response.data.predmet]); // Dodaj novi predmet u tabelu
            alert("Predmet uspešno dodeljen profesoru!");
            fetchDostupniPredmeti(); // Osveži listu dostupnih predmeta
        } catch (error) {
            console.error("Greška pri dodavanju predmeta:", error);
            alert("Došlo je do greške pri dodavanju predmeta.");
        }
    };

    return (
        <div className="profesor-profile-page">
            <h2>Moj Profil</h2>

            {loading && <p>Učitavanje podataka...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {profesor ? (
                <div className="profesor-profile-container">
                    {/* Leva strana - Podaci o profesoru */}
                    <div className="profile-info">
                        <div className="professor-info">
                            <h3>Podaci o profesoru</h3>
                            <p><strong>Ime:</strong> {profesor.ime || "Nema podataka"}</p>
                            <p><strong>Titula:</strong> {profesor.titula || "Nema podataka"}</p>
                            <p><strong>Kabinet:</strong> {profesor.kabinet || "Nema podataka"}</p>
                            <p><strong>Konsultacije:</strong> {profesor.konsultacije || "Nema podataka"}</p>
                        </div>

                        <button className="edit-btn" onClick={() => setIsModalOpen(true)}>Ažuriraj profil</button>
                    </div>

                    {/* Desna strana - Tabela predmeta */}
                    <div className="subject-table">
                        <h3>Predmeti</h3>
                        <ReusableTable columns={columns} data={predmeti} />

                        {/* Dodavanje novog predmeta */}
                        <div className="add-subject">
                        <select value={noviPredmetId} onChange={(e) => setNoviPredmetId(e.target.value)}>
                            <option value="">Izaberi predmet</option>
                            {dostupniPredmeti.length > 0 ? (
                                dostupniPredmeti.map((predmet) => (
                                    <option key={predmet.id} value={predmet.id}>
                                        {predmet.naziv}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Nema dostupnih predmeta</option>
                            )}
                        </select>
                            <button onClick={handleAddSubject} className="add-btn">
                                Dodaj predmet
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}

            {/* Modal za ažuriranje profesora */}
            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={editableFields}
                onSave={handleUpdate}
            />
        </div>
    );
};

export default ProfesorProfile;
