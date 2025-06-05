import React, { useEffect, useState } from "react";
import axios from "axios";
import ReusableTable from "../reusable/ReusableTable";
import EditModal from "../reusable/EditModal";
import RenderOcena from "../reusable/RenderOcena";

const ProfesorDashboard = () => {
    const [predmeti, setPredmeti] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableFields, setEditableFields] = useState({});
    const [selectedOcenaId, setSelectedOcenaId] = useState(null);

    //za filtere i sortiranje
    const [selectedUcenik, setSelectedUcenik] = useState({});
    const [filter, setFilter] = useState({});
    const [sortOrder, setSortOrder] = useState({});

    //za paginaciju
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState({});

    const token = sessionStorage.getItem("access_token");

    const fetchDashboard = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/profesor/dashboard", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            //setuju se svi predmeti
            const fetchedPredmeti = response.data;
            setPredmeti(fetchedPredmeti);
    
            //inicijalizuju se pocetna stanja
            const initPage = {};
            const initUcenik = {};
            const initFilter = {};
            const initSort = {};
    
            fetchedPredmeti.forEach((predmet) => {
                initPage[predmet.id] = 1;
                initUcenik[predmet.id] = "";
                initFilter[predmet.id] = "";
                initSort[predmet.id] = "desc"; // default sortiranje
            });
    
            //setuju se pocetni filteri - da lista ne bi bila prazna
            setCurrentPage(initPage);
            setSelectedUcenik(initUcenik);
            setFilter(initFilter);
            setSortOrder(initSort);
        } catch (error) {
            console.error("Greška pri učitavanju podataka:", error);
            setError("Došlo je do greške pri učitavanju podataka.");
        } finally {
            setLoading(false);
        }
    };
    
//azuriranje ocene za ucenika
    const handleUpdate = async (updatedData) => {
        try {
            await axios.patch(
                "http://127.0.0.1:8000/api/profesor/oceni",
                {
                    ocena_id: selectedOcenaId,
                    ocena: updatedData.ocena,
                    komentar: updatedData.komentar,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setIsModalOpen(false);
            fetchDashboard();
            alert("Ocena je uspešno ažurirana!");
        } catch (error) {
            console.error("Greška pri ažuriranju ocene:", error);
            alert("Došlo je do greške pri ažuriranju.");
        }
    };

    //otvaranja modala za editovanje
    const openEditModal = (ocena) => {
        setSelectedOcenaId(ocena.ocena_id);
        setEditableFields({
            ocena: ocena.ocena || "",
            komentar: ocena.komentar || "",
        });
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchDashboard();
    }, []);


    //kolone za prikaz u tabeli i reusable komponenta render ocena - progress bar
    const columns = [
        { key: "ime", label: "Ime učenika" },
        { key: "ocena", label: "Ocena", render: (row) => <RenderOcena ocena={row.ocena} /> },
        { key: "datum", label: "Datum" },
        { key: "komentar", label: "Komentar" },
        {
            key: "akcija",
            label: "Akcija",
            render: (row) => (
                <button onClick={() => openEditModal(row)} className="edit-btn">
                    Izmeni ocenu
                </button>
            ),
        },
    ];

    return (
        <div className="profesor-dashboard">
            <h2>Vaši predmeti:</h2>
            {loading && <p>Učitavanje...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {predmeti.map((predmet) => {
                const ucenici = predmet.ucenici
                    .filter((u) => {
                        if (selectedUcenik[predmet.id] && u.ime !== selectedUcenik[predmet.id]) return false;
                        if (filter[predmet.id] === "ocenjeno") return u.ocena !== null;
                        if (filter[predmet.id] === "nije_ocenjeno") return u.ocena === null;
                        return true;
                    })
                    .sort((a, b) => {
                        if (sortOrder[predmet.id] === "asc") return (a.ocena || 0) - (b.ocena || 0);
                        return (b.ocena || 0) - (a.ocena || 0);
                    });

                const page = currentPage[predmet.id] || 1;
                const indexOfLastItem = page * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                const currentItems = ucenici.slice(indexOfFirstItem, indexOfLastItem);

                const uniqueUcenici = [...new Set(predmet.ucenici.map((u) => u.ime))];

                return (
                    <div className="predmet-block" key={predmet.id}>
                        <h3>{predmet.naziv}</h3>

                        {/* Filteri */}
                        <div className="filter-sort-container">
                            <label>Filtriraj po učeniku:</label>
                            <select
                                value={selectedUcenik[predmet.id] || ""}
                                onChange={(e) => setSelectedUcenik({ ...selectedUcenik, [predmet.id]: e.target.value })}
                            >
                                <option value="">Svi učenici</option>
                                {uniqueUcenici.map((ime, idx) => (
                                    <option key={idx} value={ime}>
                                        {ime}
                                    </option>
                                ))}
                            </select>

                            <label>Filtriraj po ocenama:</label>
                            <select
                                value={filter[predmet.id] || ""}
                                onChange={(e) => setFilter({ ...filter, [predmet.id]: e.target.value })}
                            >
                                <option value="">Sve ocene</option>
                                <option value="ocenjeno">Ocenjeno</option>
                                <option value="nije_ocenjeno">Nije ocenjeno</option>
                            </select>

                            <label>Sortiraj:</label>
                            <select
                                value={sortOrder[predmet.id] || "asc"}
                                onChange={(e) => setSortOrder({ ...sortOrder, [predmet.id]: e.target.value })}
                            >
                                <option value="desc">Najveće ocene prvo</option>
                                <option value="asc">Najmanje ocene prvo</option>
                            </select>
                        </div>

                        {/* Tabela */}
                        <div className="table-section">
                            <ReusableTable columns={columns} data={currentItems} />

                            {/* Paginacija */}
                            <div className="pagination">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setCurrentPage({ ...currentPage, [predmet.id]: page - 1 })}
                                >
                                    Prethodna
                                </button>
                                <button
                                    disabled={indexOfLastItem >= ucenici.length}
                                    onClick={() => setCurrentPage({ ...currentPage, [predmet.id]: page + 1 })}
                                >
                                    Sledeća
                                </button>
                            </div>
                        </div>

                    </div>
                );
            })}

            <EditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={editableFields}
                onSave={handleUpdate}
            />
        </div>
    );
};

export default ProfesorDashboard;