// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CssFile.css";
import { jsPDF } from "jspdf";

function Time_Series() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://sugarcount.onrender.com/api/tasks/d"
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to convert datetime to date and time in AM/PM format with a 6-hour shift
  const formatDate = (datetime) => {
    const [date, time] = datetime.split("T");
    const timeWithoutZ = time.split("Z")[0]; // Remove 'Z' if present
    const [hours, minutes] = timeWithoutZ.split(":").map(Number);

    // Create a Date object to use for AM/PM conversion and shifting time
    const dateObject = new Date();
    dateObject.setHours(hours + 5); // Shift time by +6 hours
    dateObject.setMinutes(minutes + 30);

    // Convert hours to 12-hour format and determine AM/PM
    const ampm = dateObject.getHours() >= 12 ? "PM" : "AM";
    const hours12 = dateObject.getHours() % 12 || 12; // Convert hour '0' to '12'
    const formattedTime = `${hours12}:${dateObject
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${ampm}`;

    return { date, time: formattedTime };
  };

  const handlePrint = () => {
    window.print(); // Trigger the print dialog
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data!</p>;

  return (
    <div className="app-container">
      <button className="print-button" onClick={handlePrint}>
        Print
      </button>

      <div className="table-container">
        <div>
          <h1 className="no-print">Dalip Sugar Report</h1>
          <br />
          <hr />
          <table>
            <thead>
              <tr>
                {/* Update these headers according to your API response */}
                <th>Date</th>
                <th>Time</th>
                <th>Time Type</th>
                <th>Meal</th>
                <th>Sugar mg/dl</th>
                <th>Insulin (.01 ml)</th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.map((item) => {
                const { date, time } = formatDate(item.createdAt); // Adjust 'item.datetime' to your field name
                return (
                  <tr key={item.id}>
                    <td>{date}</td>
                    <td>{time}</td>
                    <td>{item.comment}</td>
                    <td>{item.meal}</td>
                    <td>{item.sugar}</td>
                    <td>{item.insulin}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Time_Series;
