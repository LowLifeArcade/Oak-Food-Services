import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import axios from 'axios';
import {
  showErrorMessage,
  showSuccessMessage,
  showMessageMessage,
} from '../helpers/alerts';
import { API } from '../config';
import { isAuth } from '../helpers/auth';
import styles from '../styles/Home.module.css';

const Register = () => {
  const [state, setState] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    message: '',
    goodMessage: '',
    success: '',
    buttonText: 'Register',
    addButtonText: 'Add student',
    students: [],
    groups: [],
    loadedGroups: [],
  });

  useEffect(() => {
    isAuth() && Router.push('/');
  }, []);

  const {
    name,
    lastName,
    message,
    goodMessage,
    email,
    password,
    confirmPassword,
    error,
    success,
    buttonText,
  } = state;

  useEffect(() => {
    success &&
      setTimeout(() => {
        Router.push('/login');
      }, 50000);
    setState({ ...state, goodMessage: '' });
  }, [success]);

  useEffect(() => {
    if (password === '') {
      setState({ ...state, message: '', goodMessage: '', error: '' });
    }
  }, [password]);

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };

  const handlePasswordChange = () => (e) => {
    let shallowMessage = '';
    let shallowGoodMessage = '';

    if (password.length < 7) {
      shallowMessage =
        'Password must be at least 8 characters long and have at least one capital letter, one special character, and one number';
    } else if (!e.target.value.match(/[A-Z]/g)) {
      shallowGoodMessage = '';
      shallowMessage = 'Password must contain at least one capital letter';
    } else if (!e.target.value.match(/[^A-Za-z0-9]/g)) {
      shallowGoodMessage = '';
      shallowMessage = 'Password must contain at least one special character';
    } else if (!e.target.value.match(/[0-9]/g)) {
      shallowGoodMessage = '';
      shallowMessage = 'Password must contain at least one number';
    } else if (password.length < 13) {
      shallowMessage = '';
      shallowGoodMessage = 'Good password';
    } else if (password.length > 12) {
      shallowMessage = '';
      shallowGoodMessage = 'Great Password!';
    }

    setState({
      ...state,
      password: e.target.value,
      message: shallowMessage,
      goodMessage: shallowGoodMessage,
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ ...state, buttonText: 'Registering' });
    if (password !== confirmPassword) {
      setState({
        ...state,
        message: '',
        goodMessage: '',
        error: "Passwords don't match",
      });
    } else if (password.length < 7) {
      setState({
        ...state,
        message: '',
        goodMessage: '',
        error: 'Password MUST be at least 8 characters',
      });
    } else if (password.match(/[A-Z]/g) === null) {
      setState({
        ...state,
        message: '',
        goodMessage: '',
        error: 'Password MUST contain at least one capitol letter',
      });
    } else if (!password.match(/[^A-Za-z0-9]/g)) {
      setState({
        ...state,
        message: '',
        goodMessage: '',
        error: 'Password MUST contain at least one special character',
      });
    } else if (password.match(/[0-9]/g) === null) {
      setState({
        ...state,
        message: '',
        goodMessage: '',
        error: 'Password MUST contain at least one special number',
      });
    } else {
      try {
        const response = await axios.post(`${API}/register`, {
          name,
          lastName,
          email,
          password,
        });
        setState({
          ...state,
          password: '',
          confirmPassword: '',
          buttonText: 'Submitted',
          success: response.data.message,
        });
      } catch (error) {
        console.log('submit error', error);
        setState({
          ...state,
          buttonText: 'Register',
          goodMessage: '',
          error: error.response.data.error,
        });
      }
    }
  };

  const registerForm = () => (
    <form
      onSubmit={handleSubmit}
      onKeyPress={(e) => {
        if (e.key === 'Enter') e.preventDefault();
      }}
      action="POST"
    >
      <div className="form-group">
        <input
          value={name}
          onChange={handleChange('name')}
          type="text"
          className="form-control"
          placeholder="Parent First Name"
          disabled={success}
          required
        />
      </div>
      <div className="form-group">
        <input
          value={lastName}
          onChange={handleChange('lastName')}
          type="text"
          className="form-control"
          placeholder="Parent Last Name"
          disabled={success}
          required
        />
      </div>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange('email')}
          type="email"
          className="form-control"
          placeholder="Email"
          disabled={success}
          required
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handlePasswordChange('password')}
          type="password"
          className="form-control"
          placeholder="New password"
          disabled={success}
          required
        />
      </div>
      <div className="form-group">
        <input
          value={confirmPassword}
          onChange={handleChange('confirmPassword')}
          type="password"
          className="form-control"
          placeholder="Repeat password"
          disabled={success}
          required
        />
      </div>

      <div className="row">
        <div className="col">
          <div className="pt-1"></div>
          {success && showSuccessMessage(success)}
          {goodMessage && showSuccessMessage(goodMessage)}
          {error && showErrorMessage(error)}
          {message && showMessageMessage(message)}
          <br />

          {success ? (
            <button
              disabled="true"
              type="text"
              className="text-warning btn btn-outline-warning"
            >
              <i className="far fa-paper-plane"></i> &nbsp;
              {buttonText}
            </button>
          ) : (
            <button type="text" className="text-white btn btn-warning">
              <i className="far fa-paper-plane"></i> &nbsp;
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </form>
  );

  return (
    <div className={styles.background}>
      <Layout>
        <div className={styles.body}>
          <div className="pt-5 pb-2"></div>
          <div className="col-md-6 offset-md-3 pt-4">
            <div className={styles.subcard}>
              <h2 className={'text-muted ' + styles.title}>Register</h2>
              <br />
              {registerForm()}
            </div>
          </div>
        </div>
      </Layout>
      <div className="p-5"></div>
    </div>
  );
};

export default Register;
