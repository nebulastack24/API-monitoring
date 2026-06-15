import React, { useState } from 'react';
import styles from './ResponseChart.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ResponseChart = () => {
  const [timeframe, setTimeframe] = useState('7d');

  // Chart datasets depending on selected timeframe
  const datasets = {
    '24h': {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      data: [95, 110, 145, 130, 105, 120, 98],
      label: 'Response Time (ms)',
    },
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [120, 140, 110, 180, 100, 130, 115],
      label: 'Response Time (ms)',
    },
    '30d': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [135, 122, 145, 118],
      label: 'Average Response Time (ms)',
    }
  };

  const currentData = datasets[timeframe];

  const chartData = {
    labels: currentData.labels,
    datasets: [
      {
        label: currentData.label,
        data: currentData.data,
        fill: true,
        borderColor: '#3b82f6', // primary color
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // gradient transparent blue
        borderWidth: 3,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointHoverRadius: 7,
        pointRadius: 4,
        tension: 0.4, // smooth curved line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend since we only have one dataset
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${context.parsed.y} ms`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Outfit, sans-serif',
            size: 11,
          }
        }
      },
      y: {
        grid: {
          color: '#1e293b',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Outfit, sans-serif',
            size: 11,
          },
          callback: function (value) {
            return `${value}ms`;
          }
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>API Response Time Trends</h2>
          <p className={styles.subtitle}>Historical latency trends across all monitored endpoints</p>
        </div>
        <div className={styles.timeframeTabs}>
          {['24h', '7d', '30d'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`${styles.tabBtn} ${timeframe === tab ? styles.activeTab : ''}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.chartWrapper}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ResponseChart;
