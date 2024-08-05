import React from "react";
import "../components/Body.css";
import Display from "./Fetch.js";

function Body() {
  return (
    <div className="body">
      <button className="home-btn">
        <span class="button_top">Home</span>
      </button>
      <Display />
    </div>
  );
}
export default Body;
