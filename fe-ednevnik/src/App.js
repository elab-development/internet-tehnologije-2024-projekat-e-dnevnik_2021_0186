import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/reusable/Navbar";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ProfesorDashboard from "./components/profesor/ProfesorDashboard";
import UcenikDashboard from "./components/ucenik/UcenikDashboard";
import RoditeljDashboard from "./components/roditelj/RoditeljDashboard";
import './App.css';
import Footer from "./components/reusable/Footer";
import AdminDashboard from "./components/admin/AdminDashboard";
import UcenikHome from "./components/ucenik/UcenikHome";
import ProfesorForm from "./components/profesor/ProfesorForm";
import UcenikForm from "./components/ucenik/UcenikForm";
import RoditeljForm from "./components/roditelj/RoditeljForm";
import Breadcrumbs from "./components/reusable/Breadcrumbs";
import UcenikProfile from "./components/ucenik/UcenikProfile";
import RoditeljProfile from "./components/roditelj/RoditeljProfile";
import ProfesorProfile from "./components/profesor/ProfesorProfile";
import AdminPredmeti from "./components/admin/AdminPredmeti";

function App() {
    const [token, setToken] = useState(sessionStorage.getItem("access_token"));
    const [tipKorisnika, setTipKorisnika] = useState(sessionStorage.getItem("tip_korisnika"));
    const [relatedModelId, setRelatedModelId] = useState(sessionStorage.getItem("related_model_id"));


    console.log("Token:", token);
    console.log("Tip korisnika:", tipKorisnika);
    console.log("ID povezanog modela:", relatedModelId);

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar
                    token={token}
                    setToken={setToken}
                    tipKorisnika={tipKorisnika}
                    setTipKorisnika={setTipKorisnika}
                    setRelatedModelId={setRelatedModelId}
                />
                <Breadcrumbs />
                <Routes>
                    {/* Opšte rute za sve korisnike */}
                    
                    <Route
                        path="/"
                        element={
                            <LoginForm
                                setToken={setToken}
                                setTipKorisnika={setTipKorisnika}
                                setRelatedModelId={setRelatedModelId}
                            />
                        }
                    />
                    <Route path="/register" element={<RegisterForm />} />

                    {/* Rute za unos dodatnih podataka nakon registracije */}
                    {!token && (
                        <>
                            <Route path="/profesor" element={< ProfesorForm />} />
                            <Route path="/ucenik" element={< UcenikForm />} />
                            <Route path="/roditelj" element={< RoditeljForm />} />
                        </>
                    )}

                    {/* Dashboard rute za ulogovane korisnike */}
                    {token && tipKorisnika === "profesor" && (
                        <>
                        <Route path="/dashboard-profesor" element={<ProfesorDashboard />} />
                        <Route path='/profesor-profile' element={<ProfesorProfile/> } />
                        </>
                    )}

                    {token && tipKorisnika === "ucenik" && (
                        <>
                        <Route path="/ucenik-home" element={<UcenikHome />} />
                        <Route path="/dashboard-ucenik" element={<UcenikDashboard />} />
                        <Route path="/ucenik-profile" element={<UcenikProfile/> } />
                        </>
                    )}

                    {token && tipKorisnika === "roditelj" && (
                        <>
                        <Route path="/dashboard-roditelj" element={<RoditeljDashboard />} />
                        <Route path="/roditelj-profile" element={<RoditeljProfile/> } />
                        </>
                    )}
                     {token && tipKorisnika === "admin" && (
                        <>
                        <Route path="/dashboard-admin" element={<AdminDashboard />} />
                        <Route path="/predmeti-admin" element={<AdminPredmeti/> } />
                        </>
                    )}
                </Routes>
            </BrowserRouter>
            <Footer/>
        </div>
    );
}

export default App;