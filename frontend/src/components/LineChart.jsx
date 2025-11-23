import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { getApiUrl } from '../config/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ dateRange }) => {
  const [shoes, setShoes] = useState([]);
  const [selectedShoe, setSelectedShoe] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState(["sales", "clicks"]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const metricsOptions = [
    { value: "sales", label: "Sales" },
    { value: "advertisingCost", label: "Advertising Cost" },
    { value: "impressions", label: "Impressions" },
    { value: "clicks", label: "Clicks" },
  ];

  useEffect(() => {
    fetchShoes();
  }, []);

  useEffect(() => {
    if (
      selectedShoe &&
      dateRange.startDate &&
      dateRange.endDate &&
      selectedMetrics.length > 0
    ) {
      fetchChartData();
    }
  }, [selectedShoe, dateRange, selectedMetrics]);

  const fetchShoes = async () => {
    try {
      const response = await axios.get("https://brand-analytics-dashboard-kuj1.onrender.com/api/shoes");
      setShoes(response.data);
      if (response.data.length > 0) {
        setSelectedShoe(response.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching shoes:", error);
      setError("Failed to load shoes data.");
    }
  };

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("https://brand-analytics-dashboard-kuj1.onrender.com/api/analytics/shoe-metrics", {
        params: {
          shoeId: selectedShoe,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          metrics: selectedMetrics,
        },
      });

      const responseData = response.data;

      const data = responseData.data || responseData;

      if (!data || data.length === 0) {
        setChartData(null);
        return;
      }

      // Handle both array and object responses
      const chartData = {
        labels: Array.isArray(data)
          ? data.map((item) => new Date(item.date).toLocaleDateString())
          : [],
        datasets: selectedMetrics.map((metric, index) => {
          const colors = ["#2563eb", "#dc2626", "#16a34a", "#9333ea"];
          return {
            label: metricsOptions.find((m) => m.value === metric)?.label,
            data: Array.isArray(data) ? data.map((item) => item[metric]) : [],
            borderColor: colors[index],
            backgroundColor: colors[index] + "20",
            tension: 0.1,
          };
        }),
      };

      setChartData(chartData);

      if (responseData.warnings && responseData.warnings.length > 0) {
        console.warn("Data warnings:", responseData.warnings);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);

      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
          .map((err) => err.msg)
          .join(", ");
        setError(`Validation error: ${validationErrors}`);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to load chart data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMetricChange = (metric, isChecked) => {
    if (isChecked) {
      if (selectedMetrics.length < 2) {
        setSelectedMetrics([...selectedMetrics, metric]);
      }
    } else {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Metrics Trend Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Metrics Comparison</h3>

      {dateRange.startDate && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            padding: "8px",
            borderRadius: "4px",
            marginBottom: "10px",
            border: "1px solid #ffeaa7",
            fontSize: "12px",
          }}
        >
          <strong>Chart Data Range:</strong> {dateRange.startDate} to{" "}
          {dateRange.endDate}
          {selectedShoe && (
            <span>
              {" "}
              | <strong>Shoe:</strong>{" "}
              {shoes.find((s) => s._id === selectedShoe)?.name}
            </span>
          )}
        </div>
      )}

      {error && <div className="error mb-4">{error}</div>}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="form-group">
          <label className="form-label">Select Shoe</label>
          <select
            className="form-input"
            value={selectedShoe}
            onChange={(e) => setSelectedShoe(e.target.value)}
            disabled={shoes.length === 0}
          >
            {shoes.map((shoe) => (
              <option key={shoe._id} value={shoe._id}>
                {shoe.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Select Metrics (Max 2)</label>
          <div className="flex gap-4 flex-wrap">
            {metricsOptions.map((metric) => (
              <label key={metric.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.value)}
                  onChange={(e) =>
                    handleMetricChange(metric.value, e.target.checked)
                  }
                  disabled={
                    selectedMetrics.length >= 2 &&
                    !selectedMetrics.includes(metric.value)
                  }
                  className="mr-2"
                />
                {metric.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading chart data...</div>
      ) : chartData ? (
        <div>
          <Line data={chartData} options={chartOptions} />
          {chartData.labels.length === 0 && (
            <div
              className="loading"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              No data points available for the selected criteria
            </div>
          )}
        </div>
      ) : (
        <div className="loading">
          Select a shoe and metrics to view chart data
        </div>
      )}
    </div>
  );
};

export default LineChart;
