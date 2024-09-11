import React from "react";
import AddDengueData from "./components/AddDengueData";
import DengueDataList from "./components/DengueDataList";
import CsvUploader from "./components/CsvUploader"; // Fixed the import name

import './App.css'; // Assuming custom CSS for styling

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Dengue Data Management</h1>
      <div className="form-container">
        <AddDengueData />
        <CsvUploader />
      </div>
      <DengueDataList />
    </div>
  );
}

export default App;
