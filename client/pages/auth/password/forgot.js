import { useState, useEffect } from 'react';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import Router from 'next/router';
import Layout from '../../../components/Layout';

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: '',
    buttonText: 'Submit',
    success: '',
    error: '',
  });
  const { email, buttonText, success, error } = state;

  useEffect(() => {
    buttonText === 'Done' &&
      setTimeout(() => {
        Router.push('/login');
      }, 2000);
  }, [success]);

  const handleChange = (e) => {
    setState({ ...state, email: e.target.value, success: '', error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API}/forgot-password`, { email });
      setState({
        ...state,
        email: '',
        buttonText: 'Done',
        success: response.data.message,
      });
    } catch (error) {
      console.log('FORGOT PW ERROR', error);
      setState({
        ...state,
        buttonText: 'Submit',
        error: error.response.data.error,
      });
    }
  };

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          name="email"
          className="form-control"
          onChange={handleChange}
          value={email}
          placeholder="Enter email"
          required
        />
      </div>
      <div>
        <button className="btn btn-outline-warning">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="container d-flex justify-content-center">

      <div className="row">
        <div className="col-md-12 pt-3">
        <div className="p-4"></div>
          <h2>Forgot Password</h2>
          <div className="col-md">
            <br />
            <h5 className="text-muted">
              After clicking submit go to your email and follow the provided
              link to reset your password.
            </h5>
            <br />
          </div>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordForgotForm()}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
