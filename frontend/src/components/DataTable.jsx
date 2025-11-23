import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config/api';

const DataTable = ({ dateRange }) => {
  const [data, setData] = useState({ shoeTotals: [], grandTotals: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchTableData();
    }
  }, [dateRange]);

  const fetchTableData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('https://brand-analytics-dashboard-kuj1.onrender.com/api/analytics/shoe-totals', {
        params: dateRange
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setError('Failed to load table data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Shoe Performance Summary</h3>
        <div className="loading">Loading table data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Shoe Performance Summary</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Shoe Performance Summary</h3>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Shoe Name</th>
              <th>Sales</th>
              <th>Advertising Cost</th>
              <th>Impressions</th>
              <th>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {data.shoeTotals.map((item, index) => (
              <tr key={index}>
                <td>{item.shoeName}</td>
                <td>{item.totalSales.toLocaleString('en-IN')}</td>
                <td>₹{item.totalAdvertisingCost.toLocaleString('en-IN')}</td>
                <td>{item.totalImpressions.toLocaleString('en-IN')}</td>
                <td>{item.totalClicks.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
          {data.grandTotals && (
            <tfoot>
              <tr>
                <td><strong>Grand Total</strong></td>
                <td><strong>{data.grandTotals.totalSales.toLocaleString('en-IN')}</strong></td>
                <td><strong>₹{data.grandTotals.totalAdvertisingCost.toLocaleString('en-IN')}</strong></td>
                <td><strong>{data.grandTotals.totalImpressions.toLocaleString('en-IN')}</strong></td>
                <td><strong>{data.grandTotals.totalClicks.toLocaleString('en-IN')}</strong></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {data.shoeTotals.length === 0 && !loading && (
        <div className="loading" style={{ textAlign: 'center', padding: '2rem' }}>
          No data available for the selected date range
        </div>
      )}
    </div>
  );
};

export default DataTable;