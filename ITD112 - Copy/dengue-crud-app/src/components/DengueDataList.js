import React, { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Bar, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './DengueDataList.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Title, Tooltip, Legend);

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dengueCollection = collection(db, "dengueData");
        const dengueSnapshot = await getDocs(dengueCollection);
        const dataList = dengueSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDengueData(dataList);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = useCallback(async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData((prevData) => prevData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete data. Please try again.");
    }
  }, []);

  const handleEdit = useCallback((data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  }, []);

  const handleUpdate = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      setDengueData((prevData) =>
        prevData.map((data) =>
          data.id === editingId ? { id: editingId, ...editForm } : data
        )
      );
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [editForm, editingId]);

  const filteredData = useMemo(() => dengueData.filter((data) =>
    data.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.regions.toLowerCase().includes(searchTerm.toLowerCase())
  ), [dengueData, searchTerm]);

  const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData, itemsPerPage]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = useMemo(() => filteredData.slice(startIndex, startIndex + itemsPerPage), [filteredData, startIndex, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Define a threshold for high cases
  const highCasesThreshold = 100; // Adjust this value as needed

  // Prepare data for the bar chart with color coding for high cases
  const barChartData = {
    labels: filteredData.map(data => data.location),
    datasets: [
      {
        label: 'Number of Cases',
        data: filteredData.map(data => data.cases),
        backgroundColor: filteredData.map(data =>
          data.cases > highCasesThreshold ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)' // Red for high cases, Blue otherwise
        ),
        borderColor: filteredData.map(data =>
          data.cases > highCasesThreshold ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)' // Red for high cases, Blue otherwise
        ),
        borderWidth: 2,
        borderRadius: 8, // Rounded corners
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)', // Darker Red on hover
        hoverBorderColor: 'rgba(255, 99, 132, 1)', // Darker Red on hover
        barThickness: 30,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right', // Change the position to right
        labels: {
          usePointStyle: true, // Use point style to reduce legend clutter
          padding: 20,
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Cases: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Location',
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45, // Rotate labels to avoid overlap
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Cases',
        },
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };
  

  // Prepare data for the scatter plot
  const scatterData = {
    datasets: [
      {
        label: 'Cases vs Deaths',
        data: filteredData.map(data => ({
          x: data.cases,
          y: data.deaths,
          label: data.location,
        })),
        backgroundColor: filteredData.map(data =>
          data.cases > highCasesThreshold ? 'rgba(255, 99, 132, 0.8)' : 'rgba(54, 162, 235, 0.8)' // Red for high cases, Blue otherwise
        ),
        borderColor: filteredData.map(data =>
          data.cases > highCasesThreshold ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)' // Red for high cases, Blue otherwise
        ),
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Cases: ${tooltipItem.raw.x}, Deaths: ${tooltipItem.raw.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Number of Cases',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Deaths',
        },
      },
    },
  };

  return (
    <div className="data-list">
      <h2>Dengue Data List</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by location or region..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
      </div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {editingId ? (
            <form className="data-form" onSubmit={handleUpdate}>
              <input
                                type="text"
                                placeholder="Location"
                                value={editForm.location}
                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                required
                              />
                              <input
                                type="number"
                                placeholder="Cases"
                                value={editForm.cases}
                                onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
                                required
                              />
                              <input
                                type="number"
                                placeholder="Deaths"
                                value={editForm.deaths}
                                onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
                                required
                              />
                              <input
                                type="date"
                                placeholder="Date"
                                value={editForm.date}
                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                required
                              />
                              <input
                                type="text"
                                placeholder="Regions"
                                value={editForm.regions}
                                onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
                                required
                              />
                              <button type="submit" disabled={loading}>
                                {loading ? "Updating..." : "Update Data"}
                              </button>
                              <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                            </form>
                          ) : (
                            <>
                              <table className="data-table">
                                <thead>
                                  <tr>
                                    <th>Location</th>
                                    <th>Cases</th>
                                    <th>Deaths</th>
                                    <th>Date</th>
                                    <th>Regions</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {currentPageData.length > 0 ? (
                                    currentPageData.map((data) => (
                                      <tr key={data.id}>
                                        <td>{data.location}</td>
                                        <td>{data.cases}</td>
                                        <td>{data.deaths}</td>
                                        <td>{data.date}</td>
                                        <td>{data.regions}</td>
                                        <td className="actions">
                                          <button onClick={() => handleEdit(data)}>Edit</button>
                                          <button onClick={() => handleDelete(data.id)}>Delete</button>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="6">No data found</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                              <div className="pagination">
                                <button
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                >
                                  Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                >
                                  Next
                                </button>
                              </div>
                              <br />
                              <h3>Bar Chart</h3>
                              <div className="chart-container">
                                <h3>Cases by Location</h3>
                                <Bar data={barChartData} options={barChartOptions} />
                              </div>
                              <h3>Scatter Plot</h3>
                              <div className="chart-container">
                                <h3>Cases vs Deaths</h3>
                                <Scatter data={scatterData} options={scatterOptions} />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  );
                };
                
                export default DengueDataList;
                