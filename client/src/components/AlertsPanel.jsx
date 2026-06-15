import React from 'react';
import styles from './AlertsPanel.module.css';
import { FiAlertTriangle, FiCheck } from 'react-icons/fi';

const AlertsPanel = ({ alerts, onResolveAlert }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Incident Alerts</h2>
        <span className={styles.badge}>{alerts.length} Active</span>
      </div>

      <div className={styles.list}>
        {alerts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.successCircle}>
              <FiCheck className={styles.successIcon} />
            </div>
            <p className={styles.emptyText}>All systems operational</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={styles.alertCard}>
              <div className={styles.alertHeader}>
                <FiAlertTriangle className={styles.alertIcon} />
                <div className={styles.alertDetails}>
                  <span className={styles.alertMessage}>{alert.message}</span>
                  <span className={styles.alertTime}>{alert.timestamp}</span>
                </div>
              </div>
              <button
                onClick={() => onResolveAlert(alert.id)}
                className={styles.resolveBtn}
                title="Acknowledge & Resolve"
              >
                Resolve
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
