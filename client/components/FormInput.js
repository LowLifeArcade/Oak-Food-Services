import React from 'react';
import styles from '../styles/Home.module.css';

const FormInput = ({
  value,
  onChange,
  type,
  name,
  autoComplete,
  className,
  placeholder,
  ...props
}) => {
  return (
    <input
      value={value}
      onChange={onChange}
      type={type}
      name={name}
      autoComplete={autoComplete}
      className={className}
      placeholder={placeholder}
      required={props.required}
    />
  );
};

export default FormInput