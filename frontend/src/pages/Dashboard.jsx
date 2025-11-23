import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import DateRangePicker from '../components/DateRangePicker';
import MetricTiles from '../components/MetricTiles';
import LineChart from '../components/LineChart';
import DataTable from '../components/DataTable';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({});
  const [activeDateRange, setActiveDateRange] = useState({});

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const timer = setTimeout(() => {
        console.log('🔄 Applying date range:', dateRange);
        setActiveDateRange(dateRange);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [dateRange]);

  const handleDateRangeChange = useCallback((range) => {
    console.log('📅 Date range selected:', range);
    setDateRange(range);
  }, []);

  return (
    <Layout>
      <DateRangePicker onDateRangeChange={handleDateRangeChange} />
      
      {activeDateRange.startDate && activeDateRange.endDate ? (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '10px', 
              borderRadius: '4px', 
              marginBottom: '10px',
              border: '1px solid #4caf50'
            }}>
              <strong>Active Date Range:</strong> {activeDateRange.startDate} to {activeDateRange.endDate}
            </div>
            <MetricTiles dateRange={activeDateRange} />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <LineChart dateRange={activeDateRange} />
          </div>
          <DataTable dateRange={activeDateRange} />
        </>
      ) : (
        <div className="card">
          <div className="loading">Select a date range to view analytics</div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;