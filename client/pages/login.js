import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../helpers/alerts';
import { API } from '../config';

import styles from '../styles/Home.module.css';
import { authenticate, isAuth } from '../helpers/auth';

const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Login',
  });

  useEffect(() => {
    isAuth() && isAuth().role === 'admin'
      ? Router.push('admin')
      : isAuth() && isAuth().role === 'subscriber'
      ? Router.push('user')
      : Router.push('/login');
  }, []);

  const { email, password, error, success, buttonText } = state;

  // maybe add a className that makes the div go away with transform translateY
  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Login',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Logging in...' });
    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password,
      });
      // console.log(response); // user token
      authenticate(response, () =>
        // isAuth() && isAuth().role === 'user' && user.students === []
        // ? Router.push('user/profile/add')
        isAuth() && isAuth().role === 'admin'
          ? Router.push('admin')
          : Router.push('user')
      );
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: 'Login',
        error: error.response.data.error,
      });
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit} action="POST">
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange('email')}
          type="email"
          name="email"
          autoComplete="username"
          className="form-control"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handleChange('password')}
          type="password"
          className="form-control"
          placeholder="Type your password"
          required
        />
      </div>
      <div className="form-group">


        <button type="text" className="btn btn-outline-warning">
            <i className="far fa-paper-plane"></i> &nbsp;
            {buttonText}
          </button>


        <Link href="/auth/password/forgot" >
          <a className="text-danger float-right" style={{ fontSize: '13px' }}>Forgot Password?</a>
        </Link>
      </div>
    </form>
  );

  return (
    <div
      className={styles.background}
      style={{
        // background: '#eeeff0',
        height: '100vh',
      }}
    >
      <Layout>
        <div className={styles.body}>
          <div className="pt-5 pb-5"></div>
          <div className="col-md-6 offset-md-3 pt-4">
            <div className={styles.subcard}>
              {/* + "subcard col-md4 offset-md-3" */}

              <h2 className={'text-muted ' + styles.title}>Login</h2>
              {/* {JSON.stringify(isAuth())} */}
              <br />
              {success && showSuccessMessage(success)}
              {error && showErrorMessage(error)}
              {loginForm()}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Login;
