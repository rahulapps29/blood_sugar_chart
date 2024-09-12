import React, { useState, useEffect } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import "../App.css";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const Time_Series = ({ data }) => {
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

  let df = [];
  data.tasks.forEach((entry) => {
    df.push({
      month_year:
        entry.tdate.substring(0, 4) + "-" + entry.tdate.substring(5, 7),
      name: entry.name,
      location: entry.location,
      emp_id: entry.emp_id,
      count: 1,
    });
  });

  let uniqueLocations = [];
  uniqueLocations = df.reduce((uniqueValues, obj) => {
    if (!uniqueValues.includes(obj["location"])) {
      uniqueValues.push(obj["location"]);
    }
    return uniqueValues;
  }, []);

  let uniqueMonthYear = [];
  uniqueMonthYear = df.reduce((uniqueValues, obj) => {
    if (!uniqueValues.includes(obj["month_year"])) {
      uniqueValues.push(obj["month_year"]);
    }
    return uniqueValues;
  }, []);

  const sortUniqueMonthYear = uniqueMonthYear.sort();

  const crossProduct = (a, b) =>
    a.reduce((acc, x) => [...acc, ...b.map((y) => [x, y])], []);

  const df_dummy_temp = crossProduct(uniqueMonthYear, uniqueLocations);

  let df_dummy = df_dummy_temp.map((x) => {
    return { month_year: x[0], location: x[1], count: 0 };
  });

  const df_combined_initial = [...df_dummy, ...df];

  let df_combined_initial2 = Object.values(df_combined_initial);

  let df_concat = df_combined_initial2.map((x) => {
    return {
      month_year_location: x.month_year + " " + x.location,
      count: x.count,
    };
  });

  let df_concat_temp = Object.values(df_concat);

  let df_summary = df_concat_temp.reduce(
    (a, { month_year_location, count }) => {
      a[month_year_location] = a[month_year_location] || {
        month_year_location,
        count: 0,
      };
      a[month_year_location].count += count;
      return a;
    },
    {}
  );
  let df_summary_temp = Object.values(df_summary);

  let df_summary_temp2 = df_summary_temp.map((x) => {
    return {
      month_year: x.month_year_location.substring(0, 7),
      location: x.month_year_location.substring(
        8,
        x.month_year_location.length
      ),
      count: x.count,
    };
  });

  let df_final = Object.values(df_summary_temp2);

  // const df_combined = [...df_concat_summary, ...df_dummy];

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

  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  const df_combined2 = df_final.sort(dynamicSort("location"));
  const df_combined3 = df_combined2.sort(dynamicSort("month_year"));
  const df_combined4 = df_combined3.sort(dynamicSort("location"));

  console.log(df_combined2);
  console.log("test");
  const dynamicData = pivotBy(
    df_combined4,
    "location",
    "month_year",
    "count",
    colorList
  );
  const dynamicData_sorted = dynamicData.sort(dynamicSort("count"));

  const updatedDynamicData_sorted = dynamicData_sorted.map((obj, index) => ({
    ...obj, // Copy existing object properties
    backgroundColor: colorList[index], // Add the corresponding list item as a new property
  }));

  console.log("test9");
  console.log(df_combined4);
  console.log(updatedDynamicData_sorted);
  console.log("test2");
  console.log(colorList);
  function pivotBy(data, groupBy, key, value, colorList) {
    let uniqueKeys = [];
    let pivotedData = [];
    // let colorLists = colorList;

    uniqueKeys = data.reduce((uniqueValues, obj) => {
      if (!uniqueValues.includes(obj[groupBy])) {
        uniqueValues.push(obj[groupBy]);
      }
      return uniqueValues;
    }, []);

    const coords = uniqueKeys.map((x, i) => [x, colorList[i]]);
    coords.forEach((item) => {
      let data7 = [];
      let data8 = 0;
      pivotedData.push(
        data.reduce((pivotedObj, obj, i, arr) => {
          if (item[0] == obj[groupBy]) {
            pivotedObj["label"] = obj[groupBy]; // retain the property class
            // pivotedObj[obj[key]] = obj[value]; // transforms rows into columns
            pivotedObj["backgroundColor_not_in_use"] = item[1];
            data8 += obj[value];
            pivotedObj["count"] = data8;
            data7.push(obj[value]);
            pivotedObj["data"] = data7;
          }
          return pivotedObj;
        }, {})
      );
    });

    return pivotedData;
  }

  return (
    <>
      <Bar
        data={{
          labels: uniqueMonthYear,
          datasets: updatedDynamicData_sorted,
        }}
        options={{
          elements: {
            line: {
              tension: 0.5,
            },
          },
          plugins: {
            title: {
              text: "Attendance TimeSeries",
            },
          },
        }}
      />
    </>
  );
};

export default Time_Series;
