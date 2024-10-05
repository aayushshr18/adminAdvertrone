import React, { useState } from "react";
import * as XLSX from "xlsx";
import GetData from "./GetData";

const CreateData = () => {
  const [bulkData, setBulkData] = useState([
    { name: "", number: "", flag: false },
  ]);
  const [bulkError, setBulkError] = useState(null);

  const handleBulkChange = (index, key, value) => {
    const newBulkData = [...bulkData];
    newBulkData[index][key] = value;
    setBulkData(newBulkData);
  };

  const handleAddRow = () => {
    setBulkData([...bulkData, { name: "", number: "", flag: false }]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });

        const newBulkData = worksheet.slice(1).map((row) => ({
          name: row[0] || "",
          number: row[1] || "",
          flag: false,
        }));
        setBulkData(newBulkData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleBulkSubmit = async (event) => {
    event.preventDefault();
    setBulkError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URI}/api/admin/bulk-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bulkData),
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setBulkData([{ name: "", number: "", flag: false }]);
    } catch (err) {
      setBulkError(err.message || "Error creating bulk data");
    }
  };

  return (
    <>
    <div style={{ margin: "auto", padding: "100px"}}>
      <h1>Bulk Create Data</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <form onSubmit={handleBulkSubmit}>
        {bulkData.map((entry, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Name"
              value={entry.name}
              onChange={(e) => handleBulkChange(index, "name", e.target.value)}
              style={{
                padding: "10px",
                margin: "5px",
                fontSize: "16px",
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="text"
              placeholder="Number"
              value={entry.number}
              onChange={(e) =>
                handleBulkChange(index, "number", e.target.value)
              }
              style={{
                padding: "10px",
                margin: "5px",
                fontSize: "16px",
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddRow}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            border: "none",
            borderRadius: "4px",
            margin: "10px 5px",
            backgroundColor: "#6c757d",
            color: "white",
          }}
        >
          Add Row
        </button>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            border: "none",
            borderRadius: "4px",
            margin: "10px 5px",
            backgroundColor: "#007bff",
            color: "white",
          }}
        >
          Submit
        </button>
      </form>
      <GetData />
   
      {bulkError && (
        <div style={{ color: "red", margin: "20px 0" }}>{bulkError}</div>
      )}
    </div>
    </>
  );
};

export default CreateData;
