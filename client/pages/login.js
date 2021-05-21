import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FakeLoginForm from '../components/FakeLoginForm';
import FormInput from '../components/FormInput';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import { API } from '../config';
import { showErrorMessage, showSuccessMessage } from '../helpers/alerts';
import { authenticate, isAuth } from '../helpers/auth';
import styles from '../styles/Home.module.css';

const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Login',
  });

  const { email, password, error, success, buttonText } = state;
  const [loaded, setLoaded] = useState(false);

  // redirects if already logged in
  useEffect(() => {
    isAuth() && isAuth().role === 'admin'
      ? Router.push('admin/link/list')
      : isAuth() && isAuth().role === 'subscriber' && Router.push('user');
  }, []);

  // shows fake form while loading
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 200);
  }, []);

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
      authenticate(response, () =>
        isAuth() && isAuth().role === 'admin'
          ? Router.push('admin/link/list')
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
        <FormInput
          value={email}
          onChange={handleChange('email')}
          type="email"
          name="email"
          autoComplete="username"
          placeholder="Enter your email"
          required='required'
        />
      </div>
      <div className="form-group">
        <FormInput
          value={password}
          onChange={handleChange('password')}
          type="password"
          placeholder="Type your password"
          required='required'
        />
      </div>
      <div className="form-group">
        <button type="text" className="btn btn-outline-warning">
          <i className="far fa-paper-plane"></i> &nbsp;
          {buttonText}
        </button>
        <Link href="/auth/password/forgot">
          <a className="text-danger float-right" style={{ fontSize: '13px' }}>
            Forgot Password?
          </a>
        </Link>
      </div>
    </form>
  );

  return (
    <div
      className={styles.background}
      style={{
        height: '100vh',
      }}
    >
      <Layout>
        {/* <div className={'d-flex align-items-center'}> */}
        <div className={styles.body}>
          <div className="pt-5 pb-5"></div>

          {loaded ? (
            // <div className="d-flex align-items-center">
            <div className="container">

            <div className="col-md-6 offset-md-3 pt-5">
              <div className={styles.subcard}>
                <h2 className={'text-muted ' + styles.title}>Login</h2>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {loginForm()}
              </div>
            </div>
            {/* </div> */}
            </div>
          ) : (
            <FakeLoginForm />
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Login;
