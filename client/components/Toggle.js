import React from 'react';
import styles from '../styles/Home.module.css';

const Toggle = ({
  isOn,
  handleToggle,
  toggleId,
  toggleName,
  dataIndex,
  toggleKey,
}) => {
  return (
    <>
      <div className={styles.toggleContainer}>
        <input
          key={toggleKey}
          data-index={dataIndex}
          type="checkbox"
          id={toggleId + dataIndex}
          onChange={handleToggle}
          className={styles.toggle}
          checked={isOn}
        />
        <label htmlFor={toggleId + dataIndex} className={styles.label}>
          <div className={styles.ball}></div>
        </label>
        <span className="text-secondary" className={styles.toggleName}>
          {' '}
          {toggleName}
        </span>
      </div>
    </>
  );
};

export default Toggle;

{/* <div className="toggle-container"></div>; */}
