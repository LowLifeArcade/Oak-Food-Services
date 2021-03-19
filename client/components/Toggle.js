import React from 'react';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

const Toggle = ({isOn, handleToggle, toggleId, toggleName, dataIndex}) => {
  // const [toggle, setToggle] = useState(true);

  // const onToggleChange = (e) => {
  //   setToggle(e.target.type === 'checkbox' ? e.target.checked : e.target.value);
  // };

  return (
    // toggleId, allergyType, toggleName
    <>
      <div className={styles.toggleContainer}>
        <input
        data-index={dataIndex}
          type="checkbox"
          id={toggleId}
          onChange={handleToggle}
          className={styles.toggle}
          checked={isOn}
          // value={true}
        />
        <label for={toggleId} className={styles.label}>
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

<div className="toggle-container"></div>;
