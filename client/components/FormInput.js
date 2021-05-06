import React from 'react';
import styles from '../styles/Home.module.css';

const FormInput = (props) => {
  return (
    <input
      value={props.value}
      onChange={props.onChange}
      type={props.type}
      name={props.name}
      autoComplete={props.autoComplete}
      className='form-control'
      placeholder={props.placeholder}
      required={props.required}
    />
  );
};

export default FormInput