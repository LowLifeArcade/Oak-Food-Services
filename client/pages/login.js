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
    // isAuth() && Router.push('/user');
    isAuth() && isAuth().role === 'admin'
          ? Router.push('admin') 
          : isAuth() && isAuth().role === 'user'
          ? Router.push('user')
          : Router.push('/login')
          // : Router.push('user')
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
          type="text"
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
        <button type="text" className="btn btn-outline-warning ">
          {buttonText}
        </button>
        <Link href="/auth/password/forgot" >
            <a className="text-danger float-right">Forgot Password?</a>
          </Link>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <div className={styles.subcard}>
          {/* + "subcard col-md4 offset-md-3" */}

          <h1 className={styles.title}>Login</h1>
          {/* {JSON.stringify(isAuth())} */}
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {loginForm()}
          
        </div>
      </div>
    </Layout>
  );
};

export default Login;
