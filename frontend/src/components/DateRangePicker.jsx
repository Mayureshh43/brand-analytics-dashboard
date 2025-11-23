import { useState, useEffect } from "react";
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  startOfMonth,
  endOfMonth,
} from "date-fns";

const DateRangePicker = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showQuickRanges, setShowQuickRanges] = useState(false);

  // Set default date range to last 30 days
  useEffect(() => {
    const defaultEndDate = new Date();
    const defaultStartDate = subDays(defaultEndDate, 30);

    setStartDate(format(defaultStartDate, "yyyy-MM-dd"));
    setEndDate(format(defaultEndDate, "yyyy-MM-dd"));

    const timer = setTimeout(() => {
      onDateRangeChange({
        startDate: format(defaultStartDate, "yyyy-MM-dd"),
        endDate: format(defaultEndDate, "yyyy-MM-dd"),
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [onDateRangeChange]);

  // Notify parent when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const timer = setTimeout(() => {
        onDateRangeChange({ startDate, endDate });
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [startDate, endDate, onDateRangeChange]);

  const handleQuickRange = (range) => {
    let newStart = new Date();
    let newEnd = new Date();

    switch (range) {
      case "last7days":
        newStart = subDays(newEnd, 7);
        break;
      case "last30days":
        newStart = subDays(newEnd, 30);
        break;
      case "last90days":
        newStart = subDays(newEnd, 90);
        break;
      case "thisMonth":
        newStart = startOfMonth(newEnd);
        break;
      case "lastMonth":
        const lastMonth = subMonths(newEnd, 1);
        newStart = startOfMonth(lastMonth);
        newEnd = endOfMonth(lastMonth);
        break;
      case "last3months":
        newStart = subMonths(newEnd, 3);
        break;
      default:
        break;
    }

    setStartDate(format(newStart, "yyyy-MM-dd"));
    setEndDate(format(newEnd, "yyyy-MM-dd"));
    setShowQuickRanges(false);
  };

  const validateDateRange = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return "End date cannot be before start date";
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 365 * 2) {
      return "Date range cannot exceed 2 years";
    }

    return null;
  };

  const validationError = validateDateRange();

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3 className="text-xl font-bold">Date Range</h3>
        <button
          onClick={() => setShowQuickRanges(!showQuickRanges)}
          className="btn"
          style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
          aria-expanded={showQuickRanges}
          aria-controls="quick-ranges"
        >
          📅 Quick Ranges
        </button>
      </div>

      {showQuickRanges && (
        <div id="quick-ranges" style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {[
              { label: "Last 7 Days", value: "last7days" },
              { label: "Last 30 Days", value: "last30days" },
              { label: "Last 90 Days", value: "last90days" },
              { label: "This Month", value: "thisMonth" },
              { label: "Last Month", value: "lastMonth" },
              { label: "Last 3 Months", value: "last3months" },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => handleQuickRange(range.value)}
                className="btn"
                style={{
                  backgroundColor: "#eff6ff",
                  color: "#1e40af",
                  fontSize: "12px",
                  padding: "6px 12px",
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label" htmlFor="start-date">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-describedby={validationError ? "date-error" : undefined}
            max={endDate || "2025-12-31"}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="end-date">
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-describedby={validationError ? "date-error" : undefined}
            min={startDate}
            max="2025-12-31"
          />
        </div>
      </div>

      {validationError && (
        <div
          id="date-error"
          style={{
            color: "#dc2626",
            fontSize: "14px",
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          role="alert"
        >
          ⚠️ {validationError}
        </div>
      )}

      <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
        <strong>Data Available:</strong> Jan 2024 - Dec 2025
      </div>
    </div>
  );
};

export default DateRangePicker;
