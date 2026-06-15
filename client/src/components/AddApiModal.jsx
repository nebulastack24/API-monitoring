import React, { useState } from 'react';
import styles from './AddApiModal.module.css';
import { FiX } from 'react-icons/fi';

const AddApiModal = ({ isOpen, onClose, onAddApi }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [checkInterval, setCheckInterval] = useState(60);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('API Name is required.');
      return;
    }
    if (!url.trim()) {
      setError('Endpoint URL is required.');
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    onAddApi({
      name: name.trim(),
      url: url.trim(),
      checkInterval: parseInt(checkInterval),
    });

    // Reset fields
    setName('');
    setUrl('');
    setCheckInterval(60);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Monitored API</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="api-name" className={styles.label}>API Name</label>
            <input
              id="api-name"
              type="text"
              placeholder="e.g. Stripe Payment API"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="api-url" className={styles.label}>Endpoint URL</label>
            <input
              id="api-url"
              type="text"
              placeholder="e.g. https://api.stripe.com/v1/health"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="api-interval" className={styles.label}>Check Interval (Seconds)</label>
            <select
              id="api-interval"
              value={checkInterval}
              onChange={(e) => setCheckInterval(e.target.value)}
              className={styles.select}
            >
              <option value={10}>10 Seconds (Real-time)</option>
              <option value={30}>30 Seconds</option>
              <option value={60}>60 Seconds (1 Minute)</option>
              <option value={120}>120 Seconds (2 Minutes)</option>
              <option value={300}>300 Seconds (5 Minutes)</option>
            </select>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Add Endpoint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApiModal;
