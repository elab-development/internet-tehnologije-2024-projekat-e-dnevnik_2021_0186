import { useState, useEffect } from "react";
import axios from "axios";

const useRoditelji = () => {
    const [roditelji, setRoditelji] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoditelji = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/roditelji");
                if (Array.isArray(response.data.data)) {
                    setRoditelji(response.data.data); 
                } else {
                    setRoditelji([]);
                }
            } catch (err) {
                setError("Greška prilikom učitavanja liste roditelja.");
                console.error("Error fetching roditelji:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoditelji();
    }, []);

    return { roditelji, loading, error };
};

export default useRoditelji;