import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("week");

  // Sample sales data - replace with your actual data
  const salesData = {
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      revenue: [1200, 1900, 1500, 2100, 3200, 2800, 3500],
      popularItems: [
        { name: "Truffle Pasta", sales: 42 },
        { name: "Orange Salmon", sales: 38 },
        { name: "Belee Burger", sales: 35 },
      ],
    },
    month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      revenue: [9800, 11500, 10200, 13400],
      popularItems: [
        { name: "Truffle Pasta", sales: 156 },
        { name: "Orange Salmon", sales: 142 },
        { name: "Belee Burger", sales: 128 },
      ],
    },
  };

  const currentData = salesData[timeRange];
  const totalRevenue = currentData.revenue.reduce((a, b) => a + b, 0);

  const revenueChart = {
    labels: currentData.labels,
    datasets: [
      {
        label: "Revenue ($)",
        data: currentData.revenue,
        backgroundColor: "rgba(249, 115, 22, 0.7)",
        borderColor: "rgba(249, 115, 22, 1)",
        borderWidth: 1,
      },
    ],
  };

  const popularItemsChart = {
    labels: currentData.popularItems.map((item) => item.name),
    datasets: [
      {
        data: currentData.popularItems.map((item) => item.sales),
        backgroundColor: [
          "rgba(249, 115, 22, 0.7)",
          "rgba(251, 146, 60, 0.7)",
          "rgba(253, 186, 116, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  
  return (
    <div>
      {/* Dashboard Section (Replaces Menu) */}
      <section id="dashboard" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">
              Sales Dashboard
            </h2>
            <div className="w-20 h-1 bg-orange-400 mx-auto mb-6"></div>

            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setTimeRange("week")}
                className={`px-4 py-2 rounded-full ${
                  timeRange === "week"
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-4 py-2 rounded-full ${
                  timeRange === "month"
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">
              Total Revenue: ${totalRevenue.toLocaleString()}
            </h3>
            <div className="h-64">
              <Bar
                data={revenueChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">
                Popular Items
              </h3>
              <div className="h-64">
                <Pie
                  data={popularItemsChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">
                Top Selling Items
              </h3>
              <ul className="space-y-3">
                {currentData.popularItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                      {item.sales} sold
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
