import React from "react";

function TotalAttendance({ data }) {
  return (
    <div>
      <h1> Total Attendance Count : {data.transCount}</h1>
      <hr />
    </div>
  );
}

export default TotalAttendance;
