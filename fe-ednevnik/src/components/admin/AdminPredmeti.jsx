import React, { useState, useEffect } from "react";
import axios from "axios";
import ReusableTable from "../reusable/ReusableTable";
import EditModal from "../reusable/EditModal";
import predmetSlika from "../../images/predmet.png";

const AdminPredmeti = () => {
    const [predmeti, setPredmeti] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableFields, setEditableFields] = useState({});
    const [selectedPredmetId, setSelectedPredmetId] = useState(null);

    //za paginaciju
    const [currentPage, setCurrentPage] = useState(1);
    const [meta, setMeta] = useState(null);
    const [links, setLinks] = useState([]);


    const [noviPredmet, setNoviPredmet] = useState({
        naziv: "",
        opis: "",
        tezina: "",
        profesor_id: ""
    });

    const token = sessionStorage.getItem("access_token");

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    
    const fetchPredmeti = async (page = 1) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/predmeti?page=${page}`, { headers });
            setPredmeti(response.data.data);
            setMeta(response.data.meta);
            setLinks(response.data.meta.links);
            setCurrentPage(page);
        } catch (err) {
            console.error("Greška pri učitavanju predmeta:", err);
            setError("Greška pri učitavanju predmeta.");
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchPredmeti(currentPage);
    }, [currentPage]);
    
    //sklanjanje profesora sa predmeta
    const handleRemoveProfessor = async (predmetId) => {
        if (!window.confirm("Da li ste sigurni da želite da uklonite profesora sa predmeta?")) return;

        try {
            const response = await axios.patch(`http://127.0.0.1:8000/api/predmeti/${predmetId}/ukloni-profesora`, {}, { headers });
            setPredmeti(prev =>
                prev.map(p => p.id === predmetId ? response.data.predmet : p)
            );
            alert("Profesor uspešno uklonjen.");
        } catch (err) {
            console.error("Greška pri uklanjanju profesora:", err);
            alert("Došlo je do greške.");
        }
    };

    //dodavanje novog predmeta
    const handleAddPredmet = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/predmeti", noviPredmet, { headers });
            setPredmeti(prev => [...prev, response.data]);
            setNoviPredmet({ naziv: "", opis: "", tezina: "", profesor_id: "" });
            alert("Predmet dodat.");
        } catch (err) {
            console.error("Greška pri dodavanju predmeta:", err);
            alert("Greška pri dodavanju.");
        }
    };

    //azuriranje predmeta
    const handleUpdate = async (updatedData) => {
        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/predmeti/${selectedPredmetId}`,
                updatedData,
                { headers }
            );
    
            const updatedPredmet = response.data.predmet || response.data; 
    
            setPredmeti(prev =>
                prev.map(p => p.id === selectedPredmetId ? updatedPredmet : p)
            );
    
            setIsModalOpen(false);
            alert("Predmet uspešno ažuriran!");
        } catch (err) {
            console.error("Greška pri ažuriranju predmeta:", err);
            alert("Greška pri ažuriranju.");
        }
    };

    const handleDeletePredmet = async (id) => {
        if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj predmet?")) return;
    
        try {
            await axios.delete(`http://127.0.0.1:8000/api/predmeti/${id}`, { headers });
    
            setPredmeti(prev => prev.filter(p => p.id !== id));
            alert("Predmet je uspešno obrisan.");
        } catch (error) {
            console.error("Greška pri brisanju predmeta:", error);
            alert("Došlo je do greške pri brisanju.");
        }
    };
    
    

    //kolone za tabelu
    const columns = [
        { key: "naziv", label: "Naziv" },
        { key: "opis", label: "Opis" },
        { key: "tezina", label: "Težina" },
        {
            key: "profesor_ime",
            label: "Profesor",
            render: (predmet) => predmet.profesor ? predmet.profesor.ime : "Nema profesora"
        },
        {
            key: "action",
            label: "Akcija",
            render: (predmet) => (
                <>
                    <button onClick={() => {
                        setSelectedPredmetId(predmet.id);
                        setEditableFields({
                            naziv: predmet.naziv,
                            opis: predmet.opis,
                            tezina: predmet.tezina,
                            profesor_id: predmet.profesor ? predmet.profesor.id : ""
                        });
                        setIsModalOpen(true);
                    }} className="edit-btn">
                        Izmeni
                    </button>
                    <button onClick={() => handleRemoveProfessor(predmet.id)} className="remove-btn">
                        Ukloni profesora
                    </button>
                    <button onClick={() => handleDeletePredmet(predmet.id)} className="delete-btn">
                        Obriši
                    </button>
                </>
            )
        }
        
    ];
    

    return (
        <div className="admin-subjects-page">
            <h2>Admin - Upravljanje Predmetima</h2>
            {loading && <p>Učitavanje...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="add-subject-section"> 
                <div className="add-subject-form">
                    <h3>Dodaj novi predmet</h3>
                    <input
                        placeholder="Naziv"
                        value={noviPredmet.naziv}
                        onChange={(e) => setNoviPredmet({ ...noviPredmet, naziv: e.target.value })}
                    /><br />
                    <input
                        placeholder="Opis"
                        value={noviPredmet.opis}
                        onChange={(e) => setNoviPredmet({ ...noviPredmet, opis: e.target.value })}
                    /><br />
                    <input
                        placeholder="Težina"
                        type="number"
                        value={noviPredmet.tezina}
                        onChange={(e) => setNoviPredmet({ ...noviPredmet, tezina: e.target.value })}
                    /><br />
                    <input
                        placeholder="Profesor ID"
                        value={noviPredmet.profesor_id}
                        onChange={(e) => setNoviPredmet({ ...noviPredmet, profesor_id: e.target.value })}
                    /><br />
                    <button onClick={handleAddPredmet} className="add-btn">Dodaj predmet</button>
                </div>

                <div className="add-subject-image">
                    <img src={predmetSlika} alt="Slika predmeta" />
                </div>


            </div>

            <div className="table-section">
                <h3>Lista predmeta</h3>
                <ReusableTable columns={columns} data={predmeti} />
            </div>

            {meta && (
                <div className="pagination">
                    {meta.links.map((link, index) => {
                        if (link.url === null) return null;

                        const pageNumberMatch = link.url.match(/page=(\d+)/);
                        const pageNumber = pageNumberMatch ? parseInt(pageNumberMatch[1]) : null;

                        return (
                            <button
                                key={index}
                                onClick={() => pageNumber && setCurrentPage(pageNumber)}
                                className={link.active ? "active-page" : ""}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            )}


            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={editableFields}
                onSave={handleUpdate}
            />
        </div>
    );
};

export default AdminPredmeti;
