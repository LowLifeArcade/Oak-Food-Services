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
        {/* <div className="p-5"></div> */}
        <div className="p-4 pt-5 col-md-8 offset-md-2">
          <h2>Hello, {name}, click on the button to activate your account.</h2>
          <h6 className="pt-4 p-2 text-muted">
            On your first login, please register your participating students.
            You can modify this information in <i>Profile Update</i>.
          </h6>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <button
            className="btn btn-outline-warning"
            // onClick={clickSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
