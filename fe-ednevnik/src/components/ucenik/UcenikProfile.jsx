import React, { useState, useEffect } from "react";
import axios from "axios";
import EditModal from "../reusable/EditModal";
import usePexelsImage from "../../hooks/usePexelsImage";

const UcenikProfile = () => {
    const [ucenik, setUcenik] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableFields, setEditableFields] = useState({});

    const ucenikImage = usePexelsImage("student");

    // Uzimamo podatke iz sessionStorage
    const [ucenikId, setUcenikId] = useState(sessionStorage.getItem("related_model_id"));
    const [token, setToken] = useState(sessionStorage.getItem("access_token"));

    const fetchUcenik = async () => {
        if (!ucenikId || !token) {
            setError("Nedostaju podaci za autentifikaciju.");
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/ucenici/${ucenikId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            setUcenik(response.data.data);
            setEditableFields({
                razred: response.data.data.razred,
                odeljenje: response.data.data.odeljenje,
                roditelj_id: response.data.data.roditelj ? response.data.data.roditelj.id : "",
            });

        } catch (err) {
            console.error("Greška prilikom učitavanja profila učenika:", err);
            setError("Greška prilikom učitavanja profila učenika.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!ucenikId || !token) {
            console.error("Ne može se pozvati fetchUcenik() jer nema `ucenikId` ili `token`.");
            return;
        }
        fetchUcenik();

    }, [ucenikId, token]);

   
//azuriranje profila
    const handleUpdate = async (updatedData) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/ucenici/${ucenikId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            // Odmah ažuriramo podatke učenika u state-u
            setUcenik((prev) => ({
                ...prev,
                ...response.data.ucenik, 
                roditelj: response.data.ucenik.roditelj 
            }));
    
            setIsModalOpen(false); // Zatvaramo modal
            alert("Profil uspešno ažuriran!");
        } catch (err) {
            console.error("Greška pri ažuriranju učenika:", err);
            alert("Greška pri ažuriranju profila.");
        }
    };

    return (
        <div className="profile-page">
            <h2>Moj Profil</h2>
    
            {loading && <p>Učitavanje podataka...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
    
            {ucenik ? (
                <div className="profile-container">
                    {/* Leva strana - Podaci učenika i roditelja */}
                    <div className="profile-info">
                        <div className="student-info">
                            <h3>Podaci o učeniku</h3>
                            <p><strong>Ime:</strong> {ucenik.ime || "Nema podataka"}</p>
                            <p><strong>Razred:</strong> {ucenik.razred || "Nema podataka"}</p>
                            <p><strong>Odeljenje:</strong> {ucenik.odeljenje || "Nema podataka"}</p>
                        </div>
    
                        {ucenik.roditelj && (
                            <div className="parent-info">
                                <h3>Podaci o roditelju</h3>
                                <p><strong>Roditelj:</strong> {ucenik.roditelj.ime || "Nepoznato"}</p>
                                <p><strong>Kontakt:</strong> {ucenik.roditelj.kontakt || "Nema kontakta"}</p>
                            </div>
                        )}
    
                        <button className="edit-btn" onClick={() => setIsModalOpen(true)}>Ažuriraj profil</button>
                    </div>
    
                    {/* Pexels API slika */}
                    <div className="profile-image">
                        {ucenikImage ? (
                            <img src={ucenikImage} alt="Random ucenik" />
                        ) : (
                            <p>Učitavanje slike...</p>
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
    
            {/* Modal za ažuriranje */}
            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={editableFields}
                onSave={handleUpdate}
            />
        </div>
    );
    
};

export default UcenikProfile;
