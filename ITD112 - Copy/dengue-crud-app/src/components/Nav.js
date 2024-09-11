// Sidebar.js
import React from 'react';
import './nav.css'; // Ensure you create and style this CSS file

const Sidebar = ({ currentView, onChangeView }) => {
  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li
          className={currentView === 'dataList' ? 'active' : ''}
          onClick={() => onChangeView('dataList')}
        >
          Dengue Data List
        </li>
        <li
          className={currentView === 'graphs' ? 'active' : ''}
          onClick={() => onChangeView('graphs')}
        >
          Graphs
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
