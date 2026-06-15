import React from 'react';
import styles from './Sidebar.module.css';
import { FiGrid, FiActivity, FiEye, FiBarChart2, FiAlertTriangle, FiSettings, FiActivity as LogoIcon } from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'apis', label: 'APIs', icon: FiActivity },
    { id: 'monitoring', label: 'Monitoring', icon: FiEye },
    { id: 'reports', label: 'Reports', icon: FiBarChart2 },
    { id: 'alerts', label: 'Alerts', icon: FiAlertTriangle },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <LogoIcon className={styles.logoIcon} />
        <span className={styles.logoText}>API-Monitor</span>
      </div>

      <nav className={styles.navMenu}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <IconComponent className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <span className={styles.version}>v1.0.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
