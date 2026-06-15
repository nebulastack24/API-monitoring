import React, { useState, useEffect } from 'react';
import styles from './ApiDetailModal.module.css';
import { FiX, FiActivity, FiClock, FiHeart, FiGlobe, FiAlertCircle } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';

const ApiDetailModal = ({ api, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!api) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:8080/apis/${api.id}/history?page=0&size=20`);
        if (!response.ok) {
          throw new Error('Failed to fetch check history.');
        }
        const data = await response.json();
        // The endpoint returns Page<ApiCheckResponseDto>
        // In Spring Boot, Page.content contains the actual list
        setHistory(data.content || []);
      } catch (err) {
        console.error(err);
        setError('Could not retrieve API history from backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [api]);

  if (!api) return null;

  // Chart configuration for the API's recent checks
  const recentChecks = [...history].reverse(); // oldest to newest for the graph
  
  const chartData = {
    labels: recentChecks.map(check => {
      const date = new Date(check.checkedAt);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: recentChecks.map(check => check.status === 'DOWN' ? 0 : check.responseTime),
        borderColor: api.status === 'UP' ? '#22c55e' : '#ef4444',
        backgroundColor: api.status === 'UP' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: api.status === 'UP' ? '#22c55e' : '#ef4444',
        pointRadius: 3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 } } },
      y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8', font: { size: 9 } } }
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{api.name} Details</h2>
            <span className={styles.url}>{api.url}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.body}>
          {/* Quick Stats Grid */}
          <div className={styles.quickStats}>
            <div className={styles.statBox}>
              <FiHeart className={`${styles.statIcon} ${api.status === 'UP' ? styles.up : styles.down}`} />
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Current Status</span>
                <span className={styles.statValue}>{api.status || 'PENDING'}</span>
              </div>
            </div>

            <div className={styles.statBox}>
              <FiClock className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Response Time</span>
                <span className={styles.statValue}>
                  {api.status === 'DOWN' ? '0 ms' : `${api.responseTime || 0} ms`}
                </span>
              </div>
            </div>

            <div className={styles.statBox}>
              <FiActivity className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Uptime Ratio</span>
                <span className={styles.statValue}>{(api.uptimePercentage || 100.0).toFixed(1)}%</span>
              </div>
            </div>

            <div className={styles.statBox}>
              <FiGlobe className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Interval</span>
                <span className={styles.statValue}>{api.checkInterval}s</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className={styles.chartSection}>
            <h3 className={styles.sectionTitle}>Latency History (Last 20 Checks)</h3>
            <div className={styles.chartContainer}>
              {loading ? (
                <div className={styles.centerMessage}>Loading historical chart...</div>
              ) : error ? (
                <div className={styles.centerMessage}>{error}</div>
              ) : history.length === 0 ? (
                <div className={styles.centerMessage}>No historical data yet. Waiting for scheduled checks.</div>
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* History List */}
          <div className={styles.historySection}>
            <h3 className={styles.sectionTitle}>Raw Check Logs</h3>
            <div className={styles.tableWrapper}>
              {loading ? (
                <div className={styles.centerMessage}>Loading checks...</div>
              ) : error ? (
                <div className={styles.errorMessage}>{error}</div>
              ) : history.length === 0 ? (
                <div className={styles.emptyLogs}>
                  <FiAlertCircle />
                  <p>No checks logged yet. Checks run automatically every minute.</p>
                </div>
              ) : (
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>Time Checked</th>
                      <th>Status Code</th>
                      <th>Latency</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((check, idx) => (
                      <tr key={idx}>
                        <td>{new Date(check.checkedAt).toLocaleString()}</td>
                        <td>
                          <span className={styles.code}>{check.statusCode || '-'}</span>
                        </td>
                        <td>{check.status === 'DOWN' ? '-' : `${check.responseTime} ms`}</td>
                        <td>
                          <span className={`badge ${check.status === 'UP' ? 'badge-success' : 'badge-danger'}`}>
                            {check.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDetailModal;
