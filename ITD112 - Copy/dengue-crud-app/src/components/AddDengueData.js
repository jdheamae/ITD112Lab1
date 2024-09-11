import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import './AddDengueData.css'; // Custom CSS for styling

const AddDengueData = () => {
  const [formData, setFormData] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error

    try {
      await addDoc(collection(db, "dengueData"), {
        ...formData,
        cases: Number(formData.cases),
        deaths: Number(formData.deaths),
      });
      setFormData({
        location: "",
        cases: "",
        deaths: "",
        date: "",
        regions: "",
      });
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Failed to add data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="data-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cases"
          placeholder="Cases"
          value={formData.cases}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="deaths"
          placeholder="Deaths"
          value={formData.deaths}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="regions"
          placeholder="Regions"
          value={formData.regions}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Data"}
        </button>
      </form>
    </div>
  );
};

export default AddDengueData;
