import { useState, useEffect } from 'react';
import { API } from '../../../config';
import Layout from '../../../components/Layout';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import { autoLogout } from '../../../helpers/auth';
import axios from 'axios';

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: '',
    buttonText: 'Submit',
    success: '',
    error: '',
  });
  const { email, buttonText, success, error } = state;

  useEffect(() => {
    buttonText === 'Done'
      ? setTimeout(() => {
          autoLogout();
          console.log('log out');
        }, 5000)
      : console.log("it's fine");
    return () => clearTimeout();
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
      console.log('CHANGE PW ERROR', error);
      setState({
        ...state,
        buttonText: 'Change Password',
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
      <div className="row container">
        <div className="d-flex justify-content-center">

        <div className="col-md-12 pt-3">
          <div className="p-4"></div>
          <h2>Change Password</h2>
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
