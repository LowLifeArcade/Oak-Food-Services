import React from 'react';
import styles from '../styles/Home.module.css';

const FakeLoginForm = () => (
  <div className="container">

  <div className="col-md-6 offset-md-3 pt-5">
    <div className={styles.subcard}>
      <div className="row">
        <div className="col-md-12">
          <div className={'p-5 ' + styles.animatedBg}></div>
          <h3 className="text-dark"></h3>
          &nbsp;
          <div className={'p-3 ' + styles.animatedBg}></div>
          <div className={'p-3 ' + styles.animatedBg}></div>
          <div className="p-1"></div>
          <div className="p-1"></div>
          <div className="p-1"></div>
        </div>
  </div>
      </div>
    </div>
  </div>
);

export default FakeLoginForm