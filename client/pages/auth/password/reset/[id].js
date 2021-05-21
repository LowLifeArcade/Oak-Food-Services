import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  showErrorMessage,
  showSuccessMessage,
  showMessageMessage,
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
    message: '',
    goodMessage: '',
    success: '',
    error: '',
  });
  const {
    name,
    token,
    newPassword,
    buttonText,
    message,
    goodMessage,
    success,
    error,
    confirmPassword,
  } = state;

  useEffect(() => {
    const decoded = jwt.decode(router.query.id);
    if (decoded)
      setState({ ...state, name: decoded.name, token: router.query.id });
  }, [router]);

  useEffect(() => {
    buttonText === 'Done'
      ? setTimeout(() => {
          Router.push('/login');
        }, 2000)
      : console.log("it's fine");
    return () => clearTimeout();
  }, [success]);

  const handleChange = (e) => {
    let shallowMessage = '';
    let shallowGoodMessage = '';

    if (newPassword.length < 7) {
      shallowMessage = 'Password must be at least 8 characters';
    } else if (!e.target.value.match(/[A-Z]/g)) {
      shallowMessage = 'Password must contain at least one capitol letter';
    } else if (!e.target.value.match(/[^A-Za-z0-9]/g)) {
      shallowMessage = 'Password must contain at least one special character';
    } else if (!e.target.value.match(/[0-9]/g)) {
      shallowMessage = 'Password must contain at least one special number';
    } else if (newPassword.length < 13) {
      shallowGoodMessage = 'Good password';
    } else if (newPassword.length > 12) {
      shallowGoodMessage = 'Great Password!';
    }

    setState({
      ...state,
      newPassword: e.target.value,
      message: shallowMessage,
      goodMessage: shallowGoodMessage,
      success: '',
      error: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Sending...' });

    if (newPassword !== confirmPassword) {
      setState({ ...state, error: "Passwords don't match" });
    } else if (newPassword.length < 7) {
      setState({ ...state, error: 'Password must be at least 8 characters long and have at least one capital letter, one special character, and one number' });
    } else if (newPassword.match(/[A-Z]/g) === null) {
      setState({
        ...state,
        error: 'Password MUST contain at least one capital letter',
      });
    } else if (!newPassword.match(/[^A-Za-z0-9]/g)) {
      setState({
        ...state,
        error: 'Password MUST contain at least one special character',
      });
    } else if (newPassword.match(/[0-9]/g) === null) {
      setState({
        ...state,
        error: 'Password MUST contain at least one number',
      });
    } else {
      try {
        const response = await axios.put(`${API}/reset-password`, {
          resetPasswordLink: token,
          newPassword,
        });
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
      }
    }
  };

  const handleChangeConfirm = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Update',
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
      <div className="row container">
        <div className="col-md-6 offset-md3 pt-3 container">
        <div className="p-5"></div>
          <h2>Hi {name}, Please reset your password now.</h2>
          <div className="col-md-3">
            <br />
          </div>
          {success && showSuccessMessage(success)}
          {goodMessage && showSuccessMessage(goodMessage)}
          {error && showErrorMessage(error)}
          {message && showMessageMessage(message)}
          {passwordResetForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
