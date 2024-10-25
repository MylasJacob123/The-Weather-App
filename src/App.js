import React, { useState } from 'react';
import './App.css';
import Home from "./components/Home";
import Body from "./components/Body";
import PrivacyAndData from './components/PrivacyAndData';

function App() {
  const [currentPage, setCurrentPage] = useState("Home");

  return (
    <div className="App">
      {currentPage === "Home" && <Home setCurrentPage={setCurrentPage} />}
      {currentPage === "Body" && <Body setCurrentPage={setCurrentPage} />}
      {currentPage === "PrivacyAndData" && <PrivacyAndData setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;
