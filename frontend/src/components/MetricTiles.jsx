import { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from './SkeletonLoader';

const MetricTiles = ({ dateRange }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchMetrics();
    }
  }, [dateRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/analytics/summary', {
        params: dateRange
      });
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      
      if (error.response?.status === 429) {
        setError('Too many requests. Please wait a moment.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load metrics. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const tileData = [
    {
      title: 'Total Sales',
      value: metrics?.totalSales || 0,
      format: (val) => val.toLocaleString('en-IN'), 
      color: 'text-green-600',
      icon: '🛒',
      description: 'Total units sold'
    },
    {
      title: 'Total Advertising Cost',
      value: metrics?.totalAdvertisingCost || 0,
      format: (val) => `₹${val.toLocaleString('en-IN')}`,
      color: 'text-blue-600',
      icon: '💰',
      description: 'Total ad spend'
    },
    {
      title: 'Total Impressions',
      value: metrics?.totalImpressions || 0,
      format: (val) => val.toLocaleString('en-IN'),
      color: 'text-purple-600',
      icon: '👀',
      description: 'Total ad views'
    },
    {
      title: 'Total Clicks',
      value: metrics?.totalClicks || 0,
      format: (val) => val.toLocaleString('en-IN'),
      color: 'text-orange-600',
      icon: '🖱️',
      description: 'Total ad clicks'
    }
  ];

  if (loading) {
    return <SkeletonLoader type="tile" count={4} />;
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="card">
          <div 
            className="error" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              justifyContent: 'center'
            }}
          >
            ❌ {error}
            <button 
              onClick={fetchMetrics}
              className="btn"
              style={{ 
                marginLeft: '1rem',
                padding: '4px 12px',
                fontSize: '12px'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="card">
          <div className="loading" style={{ textAlign: 'center' }}>
            Select a date range to view metrics
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {tileData.map((tile, index) => (
        <div 
          key={index} 
          className="card"
          role="region"
          aria-label={`${tile.title} metric`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600" style={{ fontSize: '14px' }}>
                {tile.title}
              </p>
              <p className={`text-2xl font-bold ${tile.color}`}>
                {tile.format(tile.value)}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                {tile.description}
              </p>
            </div>
            <span 
              style={{ fontSize: '2rem' }}
              role="img"
              aria-label={tile.description}
            >
              {tile.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricTiles;