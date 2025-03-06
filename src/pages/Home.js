import React, { useState } from "react";
import CsvToErd from "../components/CsvToErd";
import SyntheticData from "../components/SyntheticData";
import "./Home.css";

function Home() {
  const [activeTab, setActiveTab] = useState("syntheticData");

  return (
    <div className="home-container">
      <div className="tab-bar">
        <button
          className={activeTab === "syntheticData" ? "active" : ""}
          onClick={() => setActiveTab("syntheticData")}
        >
          Generation of New Data
        </button>
        <button
          className={activeTab === "csvToErd" ? "active" : ""}
          onClick={() => setActiveTab("csvToErd")}
        >
          CSV to ERD
        </button>
      </div>
      <div className="tab-content">
        {activeTab === "syntheticData" && <SyntheticData />}
        {activeTab === "csvToErd" && <CsvToErd />}
      </div>
    </div>
  );
}

export default Home;
