import React from "react";
import { FaBook } from "react-icons/fa"; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="logo">
                    <FaBook size={20} /> 
                    <span>E-Dnevnik</span>
                </div>
                <p>Kontakt: <a href="mailto:support@e-dnevnik.com">support@e-dnevnik.com</a></p>
                <p>© 2025 All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;