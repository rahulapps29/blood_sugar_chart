import React, { useState, useEffect } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "../App.css";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const Location_Count = ({ data }) => {
  // State to store location counts
  const [locationCounts, setLocationCounts] = useState({});

  // Effect to calculate location counts when 'data' prop changes
  useEffect(() => {
    if (data.tasks && data.tasks.length > 0) {
      const counts = {};

      // Iterate over the array and count people in each location
      data.tasks.forEach((person) => {
        const location = person.location;
        counts[location] = (counts[location] || 0) + 1;
      });

      setLocationCounts(counts); // Update state with calculated counts
    }
  }, [data]); // Dependency array includes 'data' to re-run when 'data' changes

  const locations_dict_temp = Object.entries(locationCounts).map(
    ([location, count]) => [location, count]
  );

  const keys = ["location", "count"];
  // Convert array of lists to array of objects
  const arrayOfObjects = locations_dict_temp.map((list) => {
    const obj = {};
    keys.forEach((key, index) => {
      obj[key] = list[index];
    });
    return obj;
  });
  arrayOfObjects.sort((a, b) => a.count - b.count);

  const listOfLists = arrayOfObjects.map((obj) => Object.values(obj));
  const dict = Object.fromEntries(listOfLists);
  const totalCount = Object.values(dict).reduce((acc, count) => acc + count, 0);
  const locationList = listOfLists.map((subList) => subList[0]);
  const countList = listOfLists.map((subList) => subList[1]);

  function selectColor(colorNum, colors) {
    if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
    return "hsl(" + ((colorNum * (360 / colors)) % 360) + ",100%,50%)";
  }

  const colorNumberList = Array.from(
    { length: locationList.length },
    (_, i) => i + 1
  );
  let colorList = [];
  colorList = colorNumberList.map((x) => {
    return selectColor(x, locationList.length);
  });

  return (
    <>
      <Bar
        data={{
          labels: locationList,
          datasets: [
            {
              label: "Count",
              data: countList,
              backgroundColor: colorList,
              borderRadius: 5,
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              text: "Gross Attendance Bar",
            },
          },
        }}
      />
    </>
  );
};

export default Location_Count;
