import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import './CsvUploader.css'; // Assuming custom CSS for styling

function CsvUploader() {
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const data = [];

      rows.forEach((row, index) => {
        const columns = row.split(',');
        if (columns.length >= 5 && index > 0) {
          data.push({
            location: columns[0].trim(),
            cases: Number(columns[1].trim()),
            deaths: Number(columns[2].trim()),
            date: columns[3].trim(),
            regions: columns[4].trim(),
          });
        }
      });

      try {
        const batch = data.map(async (item) => {
          await addDoc(collection(db, 'dengueData'), item);
        });

        await Promise.all(batch);
        alert('CSV data uploaded successfully!');
      } catch (error) {
        console.error('Error uploading CSV data:', error);
        alert('Failed to upload CSV data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="csv-uploader">
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
}

export default CsvUploader;