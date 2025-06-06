import React, { useState, useEffect } from "react";

const EditModal = ({ isOpen, onClose, user, onSave }) => {
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        if (user) {
            setEditedData({ ...user });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedData);
    };

    if (!isOpen) return null; // Ako modal nije otvoren, ne prikazuj ga

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Izmeni podatke</h2>
                <form onSubmit={handleSubmit}>
                    {Object.entries(editedData).map(([key, value]) => (
                        <label key={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                            <input
                                type={typeof value === "number" ? "number" : "text"}
                                name={key}
                                value={value || ""}
                                onChange={handleChange}
                            />
                        </label>
                    ))}
                    <div className="modal-actions">
                        <button type="submit" className="save-btn">Sačuvaj</button>
                        <button type="button" className="close-btn" onClick={onClose}>Otkaži</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;