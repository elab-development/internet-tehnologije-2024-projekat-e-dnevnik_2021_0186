import React from "react";

const RenderOcena = ({ ocena }) => {
    const ocenaProcenat = ocena ? (ocena / 5) * 100 : 0;

    return (
        <div style={{ width: "100%", maxWidth: "300px", backgroundColor: "#ddd", borderRadius: "5px", overflow: "hidden" }}>
            <div
                style={{
                    width: `${ocenaProcenat}%`,
                    backgroundColor: ocena ? "yellow" : "gray",
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "3px",
                    fontSize: "12px",
                }}
            >
                {ocena ? ocena : "N/A"}
            </div>
        </div>
    );
};

export default RenderOcena;