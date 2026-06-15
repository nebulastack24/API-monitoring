import React, { useState } from 'react';
import styles from './ApiTable.module.css';
import { FiTrash2, FiExternalLink, FiPlus, FiAlertCircle } from 'react-icons/fi';

const ApiTable = ({ apis, onSelectApi, onDeleteApi, onAddApiClick }) => {
  const [filter, setFilter] = useState('all'); // all, up, down

  // Filter APIs by Status Tab
  const filteredApis = apis.filter((api) => {
    if (filter === 'up') return api.status === 'UP';
    if (filter === 'down') return api.status === 'DOWN';
    return true;
  });

  const formatLastChecked = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins === 1) return '1 min ago';
      if (diffMins < 60) return `${diffMins} min ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours === 1) return '1 hour ago';
      if (diffHours < 24) return `${diffHours} hours ago`;
      
      return date.toLocaleDateString();
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>API Status Monitor</h2>
          <div className={styles.tabs}>
            <button
              onClick={() => setFilter('all')}
              className={`${styles.tabBtn} ${filter === 'all' ? styles.activeTab : ''}`}
            >
              All ({apis.length})
            </button>
            <button
              onClick={() => setFilter('up')}
              className={`${styles.tabBtn} ${filter === 'up' ? styles.activeTab : ''}`}
            >
              UP ({apis.filter(a => a.status === 'UP').length})
            </button>
            <button
              onClick={() => setFilter('down')}
              className={`${styles.tabBtn} ${filter === 'down' ? styles.activeTab : ''}`}
            >
              DOWN ({apis.filter(a => a.status === 'DOWN').length})
            </button>
          </div>
        </div>
        
        <button className={styles.addBtn} onClick={onAddApiClick}>
          <FiPlus /> Add New API
        </button>
      </div>

      <div className={styles.tableWrapper}>
        {filteredApis.length === 0 ? (
          <div className={styles.emptyState}>
            <FiAlertCircle className={styles.emptyIcon} />
            <p>No endpoints match the current filter.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>API Name</th>
                <th>Endpoint URL</th>
                <th>Status</th>
                <th>Response Time</th>
                <th>Uptime %</th>
                <th>Last Checked</th>
                <th className={styles.actionsHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApis.map((api) => (
                <tr 
                  key={api.id} 
                  className={styles.row}
                  onClick={() => onSelectApi(api)}
                >
                  <td className={styles.nameCell}>
                    <span className={styles.apiName}>{api.name}</span>
                  </td>
                  <td className={styles.urlCell}>
                    <div className={styles.urlWrapper}>
                      <span className={styles.apiUrl}>{api.url}</span>
                      <a 
                        href={api.url} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()} // prevent row click
                        className={styles.linkIcon}
                        title="Open in new tab"
                      >
                        <FiExternalLink />
                      </a>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${api.status === 'UP' ? 'badge-success' : api.status === 'DOWN' ? 'badge-danger' : 'badge-warning'}`}>
                      {api.status || 'PENDING'}
                    </span>
                  </td>
                  <td className={styles.responseTime}>
                    {api.status === 'DOWN' ? '0 ms' : `${api.responseTime || 0} ms`}
                  </td>
                  <td>
                    <span className={styles.uptime}>
                      {(api.uptimePercentage !== undefined ? api.uptimePercentage : 100.0).toFixed(1)}%
                    </span>
                  </td>
                  <td className={styles.lastChecked}>
                    {formatLastChecked(api.lastChecked)}
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent modal opening
                        if (confirm(`Are you sure you want to delete ${api.name}?`)) {
                          onDeleteApi(api.id);
                        }
                      }}
                      className={styles.deleteBtn}
                      title="Delete API"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ApiTable;
