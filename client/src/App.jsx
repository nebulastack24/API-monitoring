import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import ResponseChart from './components/ResponseChart';
import ApiTable from './components/ApiTable';
import AlertsPanel from './components/AlertsPanel';
import AddApiModal from './components/AddApiModal';
import ApiDetailModal from './components/ApiDetailModal';

import { FiServer, FiCheckCircle, FiXCircle, FiActivity, FiRefreshCw, FiWifi, FiWifiOff } from 'react-icons/fi';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dashboard & APIs states
  const [apis, setApis] = useState([]);
  const [metrics, setMetrics] = useState({
    totalApis: 0,
    healthyApis: 0,
    failedApis: 0,
    averageResponseTime: 0,
    uptimePercentage: 100,
  });
  
  // Alerts state
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'GitHub API Timeout', timestamp: '5 min ago' },
    { id: 2, message: 'Stripe API Returned 503', timestamp: '10 min ago' },
    { id: 3, message: 'Auth Service Unreachable', timestamp: '1 hour ago' },
  ]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);
  
  // Backend connectivity state
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock data to seed if backend is offline
  const mockApis = [
    { id: 101, name: 'GitHub API', url: 'https://api.github.com', checkInterval: 60, status: 'UP', responseTime: 120, uptimePercentage: 99.8, lastChecked: new Date(Date.now() - 120000).toISOString() },
    { id: 102, name: 'Stripe API', url: 'https://api.stripe.com', checkInterval: 60, status: 'DOWN', responseTime: 0, uptimePercentage: 97.3, lastChecked: new Date(Date.now() - 30000).toISOString() },
    { id: 103, name: 'Slack API', url: 'https://api.slack.com', checkInterval: 60, status: 'UP', responseTime: 145, uptimePercentage: 100.0, lastChecked: new Date(Date.now() - 60000).toISOString() },
    { id: 104, name: 'AWS S3 Service', url: 'https://s3.amazonaws.com', checkInterval: 60, status: 'UP', responseTime: 62, uptimePercentage: 99.9, lastChecked: new Date(Date.now() - 15000).toISOString() },
    { id: 105, name: 'Vercel Edge API', url: 'https://vercel.com', checkInterval: 60, status: 'UP', responseTime: 78, uptimePercentage: 100.0, lastChecked: new Date(Date.now() - 5000).toISOString() },
    { id: 106, name: 'Supabase API', url: 'https://api.supabase.com', checkInterval: 60, status: 'UP', responseTime: 210, uptimePercentage: 96.4, lastChecked: new Date(Date.now() - 40000).toISOString() },
  ];

  const mockMetrics = {
    totalApis: 6,
    healthyApis: 5,
    failedApis: 1,
    averageResponseTime: 123.0,
    uptimePercentage: 98.9,
  };

  // Fetch data from Spring Boot backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard metrics
        const metricsRes = await fetch('http://localhost:8080/dashboard');
        if (!metricsRes.ok) throw new Error('Backend unresponsive');
        const metricsData = await metricsRes.json();
        
        // Fetch APIs list
        const apisRes = await fetch('http://localhost:8080/apis');
        if (!apisRes.ok) throw new Error('Backend unresponsive');
        const apisData = await apisRes.json();

        setMetrics({
          totalApis: metricsData.totalApis,
          healthyApis: metricsData.healthyApis,
          failedApis: metricsData.failedApis,
          averageResponseTime: metricsData.averageResponseTime || 0,
          uptimePercentage: metricsData.uptimePercentage || 100,
        });
        setApis(apisData);
        setIsOnline(true);
      } catch (error) {
        console.warn('Backend connection failed. Running in demo mock mode.', error);
        setIsOnline(false);
        // Load mock data
        setApis(mockApis);
        setMetrics(mockMetrics);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  // Handler to add API
  const handleAddApi = async (newApi) => {
    if (isOnline) {
      try {
        const response = await fetch('http://localhost:8080/apis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newApi),
        });
        if (response.ok) {
          setIsAddModalOpen(false);
          setRefreshKey(prev => prev + 1); // trigger reload
        } else {
          alert('Failed to register API on backend.');
        }
      } catch (err) {
        alert('Error communicating with backend.');
      }
    } else {
      // Mock mode adding
      const mockNew = {
        ...newApi,
        id: Date.now(),
        status: 'UP',
        responseTime: Math.floor(Math.random() * 100) + 50,
        uptimePercentage: 100.0,
        lastChecked: new Date().toISOString(),
      };
      const updatedApis = [...apis, mockNew];
      setApis(updatedApis);
      setMetrics(prev => ({
        ...prev,
        totalApis: updatedApis.length,
        healthyApis: prev.healthyApis + 1,
      }));
      setIsAddModalOpen(false);
    }
  };

  // Handler to delete API
  const handleDeleteApi = async (id) => {
    if (isOnline) {
      try {
        const response = await fetch(`http://localhost:8080/apis/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // If the currently viewed API is deleted, close details modal
          if (selectedApi && selectedApi.id === id) {
            setSelectedApi(null);
          }
          setRefreshKey(prev => prev + 1);
        } else {
          alert('Failed to delete API from backend.');
        }
      } catch (err) {
        alert('Error communicating with backend.');
      }
    } else {
      // Mock mode delete
      const target = apis.find(a => a.id === id);
      const updatedApis = apis.filter(a => a.id !== id);
      setApis(updatedApis);
      setMetrics(prev => ({
        ...prev,
        totalApis: updatedApis.length,
        healthyApis: target && target.status === 'UP' ? prev.healthyApis - 1 : prev.healthyApis,
        failedApis: target && target.status === 'DOWN' ? prev.failedApis - 1 : prev.failedApis,
      }));
      if (selectedApi && selectedApi.id === id) {
        setSelectedApi(null);
      }
    }
  };

  // Handler to clear alerts
  const handleResolveAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Filter APIs by search query
  const filteredApis = apis.filter(api =>
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    api.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Panel Content */}
      <div style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin var(--transition-speed) ease',
      }} className="main-panel">
        
        {/* Header */}
        <Header 
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Inner Content Padding */}
        <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Connection Status & Refresh Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid var(--border-color)',
            padding: '12px 18px',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.9rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isOnline ? (
                <>
                  <FiWifi style={{ color: 'var(--success-color)' }} />
                  <span>Backend Live (Online Mode)</span>
                </>
              ) : (
                <>
                  <FiWifiOff style={{ color: 'var(--warning-color)' }} />
                  <span style={{ color: 'var(--text-muted)' }}>
                    Backend Offline. Running in <strong style={{ color: 'var(--warning-color)' }}>Demo Sandbox Mode</strong>.
                  </span>
                </>
              )}
            </div>
            
            <button 
              onClick={() => setRefreshKey(prev => prev + 1)} 
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
              }}
              title="Refresh dashboard statistics"
            >
              <FiRefreshCw /> Refresh Stats
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <>
              {/* Stat Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
              }}>
                <MetricCard 
                  icon={FiServer} 
                  title="Total Endpoints" 
                  value={metrics.totalApis} 
                  trend="Monitored APIs" 
                  trendType="neutral"
                />
                <MetricCard 
                  icon={FiCheckCircle} 
                  title="Healthy APIs" 
                  value={metrics.healthyApis} 
                  trend={`${metrics.totalApis > 0 ? Math.round((metrics.healthyApis / metrics.totalApis) * 100) : 100}% online`} 
                  trendType="success"
                />
                <MetricCard 
                  icon={FiXCircle} 
                  title="Failed APIs" 
                  value={metrics.failedApis} 
                  trend={metrics.failedApis > 0 ? `${metrics.failedApis} needs attention` : 'All checks passing'} 
                  trendType={metrics.failedApis > 0 ? 'danger' : 'success'}
                />
                <MetricCard 
                  icon={FiActivity} 
                  title="Overall Uptime" 
                  value={`${metrics.uptimePercentage.toFixed(1)}%`} 
                  trend={`${metrics.averageResponseTime ? Math.round(metrics.averageResponseTime) : 0}ms avg latency`} 
                  trendType="primary"
                />
              </div>

              {/* Middle Section: Chart & Incident Feed */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '24px',
              }} className="chart-alerts-row">
                <ResponseChart />
                <AlertsPanel alerts={alerts} onResolveAlert={handleResolveAlert} />
              </div>

              {/* Bottom Section: API Status Table */}
              <ApiTable 
                apis={filteredApis} 
                onSelectApi={setSelectedApi} 
                onDeleteApi={handleDeleteApi}
                onAddApiClick={() => setIsAddModalOpen(true)}
              />
            </>
          )}

          {activeTab === 'apis' && (
            <ApiTable 
              apis={filteredApis} 
              onSelectApi={setSelectedApi} 
              onDeleteApi={handleDeleteApi}
              onAddApiClick={() => setIsAddModalOpen(true)}
            />
          )}

          {/* Placeholders for secondary tabs to make the UI look finished & high quality */}
          {activeTab === 'monitoring' && (
            <div style={{
              backgroundColor: 'var(--card-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '60px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}>
              <FiActivity style={{ fontSize: '3rem', color: 'var(--primary-color)' }} />
              <h3>Real-Time Health Stream</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '500px' }}>
                This panel displays sub-second latency streams and raw WebSocket check payloads. Set intervals in the settings tab to configure socket connections.
              </p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div style={{
              backgroundColor: 'var(--card-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '60px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}>
              <FiServer style={{ fontSize: '3rem', color: 'var(--success-color)' }} />
              <h3>Uptime Report Generator</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '500px' }}>
                Generate PDF or CSV summaries of service levels agreements (SLA), daily error distributions, and peak load traffic schedules.
              </p>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div style={{
              backgroundColor: 'var(--card-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '40px 24px',
            }}>
              <h3 style={{ marginBottom: '16px' }}>Incident Alert Policies</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                Configure alert hooks to Slack, Discord, email notifications, or pager services when response latency exceeds limits or returns error status codes.
              </p>
              <AlertsPanel alerts={alerts} onResolveAlert={handleResolveAlert} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{
              backgroundColor: 'var(--card-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}>
              <h3>Global Monitoring Settings</h3>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Scheduler Timeout</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Maximum time in milliseconds allowed for a service request to complete before triggering a timeout alert. (Default: 5000ms)
                </p>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Flyway DB Sync</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Autocommit intervals for Flyway migration history records in the postgres tables.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Add API Form Modal */}
      <AddApiModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddApi={handleAddApi} 
      />

      {/* Inspect API History Details Modal */}
      {selectedApi && (
        <ApiDetailModal 
          api={selectedApi} 
          onClose={() => setSelectedApi(null)} 
        />
      )}

      {/* Global CSS responsive adjustments injected directly */}
      <style>{`
        @media (max-width: 768px) {
          .main-panel {
            margin-left: var(--sidebar-collapsed-width) !important;
          }
        }
        @media (max-width: 992px) {
          .chart-alerts-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
