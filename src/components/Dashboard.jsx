/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import {
  ChefHat,
  Utensils,
  Coffee,
  TrendingUp,
  DollarSign,
  PieChart,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  BarChart3,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./../AUTH/firebase-auth";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function RestaurantDashboard() {
  const [labels, setLabels] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("last6months");
  const [activeChart, setActiveChart] = useState("bar");

  const fetchFilesData = async () => {
    try {
      setLoading(true);
      // Check if user is authenticated
      if (!auth.currentUser) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const dataRef = doc(db, "users", auth.currentUser.uid);
      const dataSnap = await getDoc(dataRef);

      if (!dataSnap.exists()) {
        setError("No data found");
        setLoading(false);
        return;
      }

      const userData = dataSnap.data();

      // Check if files data exists and is an array
      if (!userData.files || !Array.isArray(userData.files)) {
        setError("Files data is not in expected format");
        setLoading(false);
        return;
      }

      // Extract data from files array
      const labelsData = userData.files.map((file) => file.period);
      const earningsData = userData.files.map((file) => file.earnings);
      const taxesData = userData.files.map((file) => file.taxes);
      const totalSalesData = userData.files.map((file) => file.totalSales);

      setLabels(labelsData);
      setEarnings(earningsData);
      setTaxes(taxesData);
      setTotalSales(totalSalesData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilesData();
  }, []);

  // Calculate summary metrics
  const totalEarnings = earnings.reduce((sum, value) => sum + value, 0);
  const totalTaxes = taxes.reduce((sum, value) => sum + value, 0);
  const totalSalesAmount = totalSales.reduce((sum, value) => sum + value, 0);
  const netProfit = totalEarnings - totalTaxes;

  // Bar Chart data configuration
  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "Total Sales",
        data: totalSales,
        backgroundColor: "rgba(255, 138, 0, 0.7)",
        borderColor: "rgb(255, 138, 0)",
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: "Earnings",
        data: earnings,
        backgroundColor: "rgba(251, 191, 36, 0.7)",
        borderColor: "rgb(251, 191, 36)",
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: "Taxes",
        data: taxes,
        backgroundColor: "rgba(194, 65, 12, 0.7)",
        borderColor: "rgb(194, 65, 12)",
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  // Line Chart data configuration
  const lineChartData = {
    labels: labels,
    datasets: [
      {
        label: "Total Sales",
        data: totalSales,
        borderColor: "rgb(255, 138, 0)",
        backgroundColor: "rgba(255, 138, 0, 0.1)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgb(255, 138, 0)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 138, 0)",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Earnings",
        data: earnings,
        borderColor: "rgb(251, 191, 36)",
        backgroundColor: "rgba(251, 191, 36, 0.1)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgb(251, 191, 36)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(251, 191, 36)",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Taxes",
        data: taxes,
        borderColor: "rgb(194, 65, 12)",
        backgroundColor: "rgba(194, 65, 12, 0.1)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgb(194, 65, 12)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(194, 65, 12)",
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 13,
            family: "'Inter', sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: "Restaurant Financial Performance",
        font: {
          size: 16,
          weight: "bold",
          family: "'Inter', sans-serif",
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        padding: 12,
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            return `${
              context.dataset.label
            }: GHS ${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          callback: function (value) {
            return "GHS " + value.toLocaleString();
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your restaurant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-500 to-amber-50 flex justify-center items-center px-4  ">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Something went wrong
          </h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchFilesData}
            className="mt-6 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center mx-auto"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (labels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex justify-center items-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <ChefHat className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No data available
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            We couldn't find any financial records for your restaurant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 bg-orange-50 bg-opacity-80 bg-blend-overlay bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")',
      }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 mt-20">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-orange-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  GHS {totalSalesAmount.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  +12.3% from last period
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-orange-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Earnings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  GHS {totalEarnings.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  +8.5% from last period
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-orange-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  GHS {totalTaxes.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Included in expenses
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <PieChart className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-orange-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  GHS {netProfit.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  +10.2% from last period
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-orange-100">
          <div className="h-96">
            <Bar data={barChartData} options={chartOptions} />

            <Line data={lineChartData} options={chartOptions} />
          </div>

          <div className="h-96">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-orange-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()} Belee Restaurant. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        body {
          font-family: "Inter", sans-serif;
        }
      `}</style>
    </div>
  );
}
