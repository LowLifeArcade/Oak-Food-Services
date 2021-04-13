import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import { withRouter } from 'next/router';
import Layout from '../../../components/Layout';
import Router from 'next/router';

const ActivateAccount = ({ router }) => {
  const [state, setState] = useState({
    name: '',
    token: '',
    buttonText: 'Activate Account',
    success: '',
    error: '',
  });
  const { name, token, buttonText, success, error } = state;

  useEffect(() => {
    let token = router.query.id;
    if (token) {
      const { name } = jwt.decode(token);
      setState({ ...state, name, token });
    }
  }, [router]);

  useEffect(() => {
    success === 'Registration successful. Please login.'
      ? setTimeout(() => {
          Router.push('/login');
        }, 2000)
      : console.log("it's fine");
    return () => clearTimeout();
  }, [success]);

  const clickSubmit = async (e) => {
    e.preventDefault();
    console.log('activate account');
    setState({ ...state, buttonText: 'Activating' });

    try {
      const response = await axios.post(`${API}/register/activate`, { token });
      console.log('account activate response', response);
      setState({
        ...state,
        token: '',
        buttonText: 'Activated!',
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: 'Activation Failed',
        error: error.response.data.error,
      });
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="p-4"></div>
        <div className="col-md-6 offset-md-3">
          <h2>Hello, {name}. Click on the button to activate your account.</h2> 
          <div className="p-2"></div>
          <h4>
          After your first login you'll be asked to fill out the student registration form for all students participating in the OPUSD school meals program. Later, you can add students as well as change and update this information in Profile Update.
          </h4>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <button
            className="btn btn-outline-warning btn-block"
            onClick={clickSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
