import React from "react";

const RenderTezina = ({ tezina, maxTezina = 5 }) => {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span><strong>Težina:</strong></span>
            {Array.from({ length: maxTezina }).map((_, index) => (
                <span
                    key={index}
                    style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: index < tezina ? "yellow" : "gray",
                        display: "inline-block",
                    }}
                ></span>
            ))}
        </div>
    );
};

export default RenderTezina;