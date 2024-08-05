import React, { useState } from 'react';
import './App.css';
import Home from "./components/Home";
import Body from "./components/Body";

function App() {
  const [currentPage, setCurrentPage] = useState("Home");

  return (
    <div className="App">
      {currentPage === "Home" && <Home setCurrentPage={setCurrentPage} />}
      {currentPage === "Body" && <Body setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default App;
