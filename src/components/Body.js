import React from "react";
import "../components/Body.css";
import Display from "./Fetch";

function Body({ setCurrentPage }) {
  return (
    <div className="body">
      <button className="home-btn" onClick={() => setCurrentPage("Home")}>
        <span className="button_top">Home</span>
      </button>
      <Display />
    </div>
  );
}

export default Body;
