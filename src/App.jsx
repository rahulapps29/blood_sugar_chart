import React from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import "./App.css";

import revenueData from "./data/revenueData.json";
import sourceData from "./data/sourceData.json";
import { useEffect, useState } from "react";
defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";
import TotalAttendance from "./Components/TotalAttendance";
import Location_Count from "./Components/Location_Count";
import LocationPercentage from "./Components/Location_Percentage";
import Time_Series from "./Components/Time_Series";

export const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://223.239.128.54:5000/api/tasks/d");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once, like componentDidMount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      {/* <TotalAttendance data={data} /> */}

      <div>
        <Time_Series data={data} />
      </div>

      {/* <div className="dataCard customerCard">
        <Location_Count data={data} />
      </div>
      <div className="dataCard categoryCard">
        <LocationPercentage data={data} />
      </div> */}
    </div>
  );
};
