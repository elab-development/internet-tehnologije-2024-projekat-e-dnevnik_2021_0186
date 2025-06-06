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
                        <Route path='/profesor-profile' element={
                            <div> 
                               <h1 style={{marginLeft:"500px", marginTop:'200px', fontWeight:"bold", fontSize:"50px"}}> ZA PROJEKAT POSLE </h1>  
                               <img style={{height:"200px", width:"200px", marginLeft:"650px", marginBottom:"20px", marginTop:'20px'}} src="https://cdn-icons-png.flaticon.com/512/5578/5578703.png"></img>
                            </div>
                        } />
                        </>
                    )}

                    {token && tipKorisnika === "ucenik" && (
                        <>
                        <Route path="/ucenik-home" element={<UcenikHome />} />
                        <Route path="/dashboard-ucenik" element={<UcenikDashboard />} />
                        <Route path="/ucenik-profile" element={
                            <div> 
                               <h1 style={{marginLeft:"500px", marginTop:'200px', fontWeight:"bold", fontSize:"50px"}}> ZA PROJEKAT POSLE </h1>  
                               <img style={{height:"200px", width:"200px", marginLeft:"650px", marginBottom:"20px", marginTop:'20px'}} src="https://cdn-icons-png.flaticon.com/512/5578/5578703.png"></img>
                            </div>
                        } />
                        </>
                    )}

                    {token && tipKorisnika === "roditelj" && (
                        <>
                        <Route path="/dashboard-roditelj" element={<RoditeljDashboard />} />
                        <Route path="/roditelj-profile" element={
                            <div> 
                               <h1 style={{marginLeft:"500px", marginTop:'200px', fontWeight:"bold", fontSize:"50px"}}> ZA PROJEKAT POSLE </h1>  
                               <img style={{height:"200px", width:"200px", marginLeft:"650px", marginBottom:"20px", marginTop:'20px'}} src="https://cdn-icons-png.flaticon.com/512/5578/5578703.png"></img>
                            </div>
                        } />
                        </>
                    )}
                     {token && tipKorisnika === "admin" && (
                        <>
                        <Route path="/dashboard-admin" element={<AdminDashboard />} />
                        <Route path="/predmeti-admin" element={
                            <div> 
                               <h1 style={{marginLeft:"500px", marginTop:'200px', fontWeight:"bold", fontSize:"50px"}}> ZA PROJEKAT POSLE </h1>  
                               <img style={{height:"200px", width:"200px", marginLeft:"650px", marginBottom:"20px", marginTop:'20px'}} src="https://cdn-icons-png.flaticon.com/512/5578/5578703.png"></img>
                            </div>
                        } />
                        </>
                    )}
                </Routes>
            </BrowserRouter>
            <Footer/>
        </div>
    );
}

export default App;