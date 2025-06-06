import React from "react";

const ReusableTable = ({ columns, data }) => {
    return (
        <table className="reusable-table">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key}>{column.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((row, index) => (
                        <tr key={index}>
                            {columns.map((col, colIndex) => (
                                <td key={`${index}-${colIndex}`}>
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} style={{ textAlign: "center", padding: "10px" }}>
                            Nema dostupnih podataka
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default ReusableTable;