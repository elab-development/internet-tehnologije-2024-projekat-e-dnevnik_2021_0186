import React, { useState, useEffect } from "react";
import axios from "axios";
import ReusableTable from "../reusable/ReusableTable";
import RenderTezina from "../reusable/RenderTezina";
import RenderOcena from "../reusable/RenderOcena";

const RoditeljDashboard = () => {
    const [ocene, setOcene] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Broj ocena po stranici

    const [selectedUcenik, setSelectedUcenik] = useState(""); // Filter po učeniku
    const [filter, setFilter] = useState(""); // Ocenjeno/Nije ocenjeno
    const [sortOrder, setSortOrder] = useState("asc"); // Rastuće ili opadajuće sortiranje

    const token = sessionStorage.getItem("access_token");

    const fetchOcene = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/ocene/moje-dece", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const oceneData = response.data.data.flatMap((ucenik) =>
                ucenik.ocene.map((ocena) => ({
                    id: ocena.id,
                    ucenik: ucenik.ime,
                    predmet: ocena.predmet.naziv,
                    opis: ocena.predmet.opis,
                    tezina: ocena.predmet.tezina,
                    ocena: ocena.ocena,
                    datum: ocena.datum,
                    komentar: ocena.komentar,
                    profesor: ocena.predmet.profesor ? ocena.predmet.profesor.ime : "Nepoznato",
                    kabinet: ocena.predmet.profesor ? ocena.predmet.profesor.kabinet : "N/A",
                    konsultacije: ocena.predmet.profesor ? ocena.predmet.profesor.konsultacije : "N/A",
                }))
            );

            setOcene(oceneData);
        } catch (error) {
            console.error("Greška prilikom učitavanja ocena dece:", error);
            setError("Greška pri učitavanju ocena dece.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOcene();
    }, []);

    useEffect(() => {
        console.log("Podaci o ocenama:", ocene);
    }, [ocene]);

    // 1. Filtriranje po učeniku
    const filtriraneOcene = ocene.filter((ocena) => {
        if (selectedUcenik && ocena.ucenik !== selectedUcenik) return false;
        if (filter === "ocenjeno") return ocena.ocena !== null;
        if (filter === "nije_ocenjeno") return ocena.ocena === null;
        return true;
    });

    // 2. Sortiranje po oceni
    const sortiraneOcene = [...filtriraneOcene].sort((a, b) => {
        if (sortOrder === "asc") return (a.ocena || 0) - (b.ocena || 0);
        return (b.ocena || 0) - (a.ocena || 0);
    });

    // 3. Paginacija
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortiraneOcene.slice(indexOfFirstItem, indexOfLastItem);

    // Lista unikatnih učenika za dropdown filter
    const uniqueUcenici = [...new Set(ocene.map((ocena) => ocena.ucenik))];

    const columns = [
        { key: "ucenik", label: "Učenik" },
        { key: "predmet", label: "Predmet" },
        { key: "opis", label: "Opis predmeta" },
        { key: "tezina", label: "Težina", render: (row) => <RenderTezina tezina={row.tezina} /> },
        { key: "ocena", label: "Ocena", render: (row) => <RenderOcena ocena={row.ocena} /> },
        { key: "profesor", label: "Profesor" },
        { key: "komentar", label: "Komentar profesora" },
        { key: "kabinet", label: "Kabinet profesora" },
        { key: "konsultacije", label: "Konsultacije" }
    ];

    return (
        <div className="roditelj-dashboard">
            <h2>Ocene Moje Dece</h2>
            {loading && <p>Učitavanje...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Filteri */}
            <div className="filter-sort-container">
                <label>Filtriraj po uceniku:</label>
                <select value={selectedUcenik} onChange={(e) => setSelectedUcenik(e.target.value)}>
                    <option value="">Svi učenici</option>
                    {uniqueUcenici.map((ucenik, index) => (
                        <option key={index} value={ucenik}>
                            {ucenik}
                        </option>
                    ))}
                </select>

                <label>Filtriraj po ocenama:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    
                    <option value="">Sve ocene</option>
                    <option value="ocenjeno">Ocenjeno</option>
                    <option value="nije_ocenjeno">Nije ocenjeno</option>
                </select>

                <label>Sortiraj:</label>
                <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                    <option value="desc">Najveće ocene prvo</option>
                    <option value="asc">Najmanje ocene prvo</option>
                </select>
            </div>

            {/* Tabela */}
            <div className="table-section">
                {currentItems.length > 0 ? (
                    <ReusableTable columns={columns} data={currentItems} />
                ) : (
                    <p>Nema dostupnih ocena.</p>
                )}
                {/* Paginacija */}
                <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                        Prethodna
                    </button>
                    <button
                        disabled={indexOfLastItem >= sortiraneOcene.length}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Sledeća
                    </button>
                </div>
            </div>

            
        </div>
    );
};

export default RoditeljDashboard;