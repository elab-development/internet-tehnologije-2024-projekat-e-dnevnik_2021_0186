import React, { useState, useEffect } from "react";
import axios from "axios";
import EditModal from "../reusable/EditModal";
import usePexelsImage from "../../hooks/usePexelsImage";
import ReusableTable from "../reusable/ReusableTable";

const RoditeljProfile = () => {
    const [roditelj, setRoditelj] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableFields, setEditableFields] = useState({});

    const parentImage = usePexelsImage("parent student horizontal");

    //za tabelu dece od roditelja
    const columns = [
        { key: "ime", label: "Ime" },
        { key: "razred", label: "Razred" },
        { key: "odeljenje", label: "Odeljenje" },
    ];

    // Uzimamo podatke iz sessionStorage
    const [roditeljId, setRoditeljId] = useState(sessionStorage.getItem("related_model_id"));
    const [token, setToken] = useState(sessionStorage.getItem("access_token"));

  
    const fetchRoditelj = async () => {
        if (!roditeljId || !token) {
            setError("Nedostaju podaci za autentifikaciju.");
            return;
        }
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/roditelji/${roditeljId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setRoditelj(response.data.data);
            setEditableFields({
                ime: response.data.data.ime,
                kontakt: response.data.data.kontakt,
            });

        } catch (err) {
            console.error("Greška prilikom učitavanja profila roditelja:", err);
            setError("Greška prilikom učitavanja profila roditelja.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!roditeljId || !token) {
            console.error("Ne može se pozvati fetchRoditelj() jer nema `roditeljId` ili `token`.");
            return;
        }

        fetchRoditelj();

    }, [roditeljId, token]);

    //azuriranje profila roditelja
    const handleUpdate = async (updatedData) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/roditelji/${roditeljId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setRoditelj(response.data.data);
            setIsModalOpen(false);
            alert("Profil uspešno ažuriran!");
        } catch (err) {
            console.error("Greška pri ažuriranju roditelja:", err);
            alert("Greška pri ažuriranju profila.");
        }
    };

    return (
        <div className="profile-page">
            <h2>Moj Profil</h2>

            {loading && <p>Učitavanje podataka...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {roditelj ? (
                <div className="profile-container">
                    {/* Leva strana - Podaci o roditelju i deci */}
                    <div className="profile-info">
                        <div className="parent-info">
                            <h3>Podaci o roditelju</h3>
                            <p><strong>Ime:</strong> {roditelj.ime || "Nema podataka"}</p>
                            <p><strong>Kontakt:</strong> {roditelj.kontakt || "Nema kontakta"}</p>
                        </div>

                        {roditelj.ucenici && roditelj.ucenici.length > 0 && (
                            <div className="children-info">
                                <h3>Moji ucenici</h3>
                                <ReusableTable columns={columns} data={roditelj.ucenici} />
                            </div>
                        )}

                        <button className="edit-btn" onClick={() => setIsModalOpen(true)}>Ažuriraj profil</button>
                    </div>

                    {/* Desna strana - Random slika roditelja */}
                    <div className="profile-image">
                        {parentImage ? (
                            <img src={parentImage} alt="Random parent" />
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

export default RoditeljProfile;
