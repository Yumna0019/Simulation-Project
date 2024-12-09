// // interarrival
// // arrival
// // waiting
// // turnaround
// // response
// // utilization


// import React from "react";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const Graph = ({ title, labels, data, type = "bar" }) => {
//   const chartData = {
//     labels: labels, // X-axis labels
//     datasets: [
//       {
//         label: title,
//         data: data, // Y-axis data
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: title,
//       },
//     },
//   };

//   return type === "line" ? (
//     <Line data={chartData} options={options} />
//   ) : (
//     <Bar data={chartData} options={options} />
//   );
// };

// export default Graph;




import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = ({ title, labels, data, type = "bar" }) => {
  const chartData = {
    labels: labels, // X-axis labels
    datasets: [
      {
        label: title,
        data: data, // Y-axis data
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    maintainAspectRatio: false, // Allow resizing freely
  };

  // Chart styles for width and height
  const chartStyle = {
    width: "400px",  // Set a fixed width
    height: "300px", // Set a fixed height
  };

  return (
    <div style={chartStyle}>  {/* Apply the style to the container */}
      {type === "line" ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default Graph;
