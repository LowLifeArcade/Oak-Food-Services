import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/alerts';
import { API } from '../../../../config';
import Router, { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Layout from '../../../../components/Layout';

const ResetPassword = ({ router }) => {
  const [state, setState] = useState({
    name: '',
    token: '',
    newPassword: '',
    confirmPassword: '',
    buttonText: 'Reset Password',
    success: '',
    error: '',
  });
  const {
    name,
    token,
    newPassword,
    buttonText,
    success,
    error,
    confirmPassword,
  } = state;

  useEffect(() => {
    const decoded = jwt.decode(router.query.id);
    if (decoded)
      setState({ ...state, name: decoded.name, token: router.query.id });
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, newPassword: e.target.value, success: '', error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Sending...' });
    // console.log('post email to ', email);

    if (newPassword !== confirmPassword) {
      setState({...state, error: "Passwords don't match"}); 
      // alert('passwords dont match')
    } else {
    try {
      const response = await axios.put(`${API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });
      // console.log('FORGOT PW', response)
      setState({
        ...state,
        newPassword: '',
        buttonText: 'Done',
        success: response.data.message,
      });
    } catch (error) {
      console.log('RESET PW ERROR', error);
      setState({
        ...state,
        buttonText: 'Forgot Password',
        error: error.response.data.error,
      });
    }}
  };

  const handleChangeConfirm = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };

  const passwordResetForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          onChange={handleChange}
          value={newPassword}
          placeholder="Type new password"
          required
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          onChange={handleChangeConfirm('confirmPassword')}
          value={confirmPassword}
          placeholder="Repeat password"
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
      <div className="row">
        <div className="col-md-6 offset-md3 pt-3">
          <h2>Hi {name}, Please reset your password now.</h2>
          <div className="col-md-3">
            <br />
          </div>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordResetForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
