import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = sessionStorage.getItem("access_token");

    const fetchMetrics = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/metrics", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMetrics(response.data);
        } catch (error) {
            console.error("Greška prilikom učitavanja metrika:", error);
            setError("Greška pri učitavanju metrika.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!metrics) return null;

    const profesori = {
        labels: metrics.predmeti_po_profesoru.map(p => p.ime),
        datasets: [
            {
                label: "Broj predmeta",
                data: metrics.predmeti_po_profesoru.map(p => p.predmeti_count),
                backgroundColor: "#86EE60",
                borderRadius: 10,
            },
        ],
    };

    const predmeti = {
        labels: metrics.ocene_po_predmetu.map(s => s.naziv),
        datasets: [
            {
                label: "Broj ocena",
                data: metrics.ocene_po_predmetu.map(s => s.ocene_count),
                backgroundColor: "#86EE60",
                borderRadius: 10,
            },
        ],
    };

    const profesoriOpcije = {
        responsive: true,
        scales: {
            y: { 
                beginAtZero: true, 
                ticks: { stepSize: 1, color: "#FFFFFF", font: { size: 16 } } 
            },
            x: { 
                ticks: { font: { size: 16 }, autoSkip: false, color: "#FFFFFF" } 
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: "#FFFFFF",
                    font: { size: 18 }
                }
            }
        }
    };
    
    const predmetiOpcije = {
        indexAxis: "y",
        responsive: true,
        scales: {
            x: { 
                beginAtZero: true, 
                ticks: { stepSize: 1, color: "#FFFFFF", font: { size: 16 } } 
            },
            y: { 
                ticks: { font: { size: 16 }, autoSkip: false, color: "#FFFFFF" } 
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: "#FFFFFF",
                    font: { size: 18 }
                }
            }
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard - Statistika</h2>

            <div className="chart-section">
                <h3>Broj predmeta po profesoru</h3>
                <Bar data={profesori} options={profesoriOpcije} />
            </div>

            <div className="chart-section">
                <h3>Broj ocena po predmetu</h3>
                <Bar data={predmeti} options={predmetiOpcije} />
            </div>

        </div>
    );
};

export default AdminDashboard;