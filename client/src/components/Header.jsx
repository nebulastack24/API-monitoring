import React from 'react';
import styles from './Header.module.css';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

const Header = ({ title, searchQuery, setSearchQuery }) => {
  return (
    <header className={styles.header}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.actionsContainer}>
        <div className={styles.searchWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search APIs or URLs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <button className={styles.notificationBtn} aria-label="Notifications">
          <FiBell className={styles.icon} />
          <span className={styles.badge}></span>
        </button>

        <div className={styles.profile}>
          <div className={styles.avatar}>
            <FiUser className={styles.avatarIcon} />
          </div>
          <div className={styles.profileDetails}>
            <span className={styles.profileName}>Admin Operator</span>
            <span className={styles.profileRole}>System Engineer</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
