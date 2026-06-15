import React from 'react';
import styles from './MetricCard.module.css';

const MetricCard = ({ icon: Icon, title, value, trend, trendType = 'neutral' }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={`${styles.iconContainer} ${styles[trendType]}`}>
          <Icon className={styles.icon} />
        </div>
      </div>
      
      <div className={styles.body}>
        <h3 className={styles.value}>{value}</h3>
        {trend && (
          <div className={`${styles.trend} ${styles[`trend-${trendType}`]}`}>
            <span className={styles.trendText}>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
