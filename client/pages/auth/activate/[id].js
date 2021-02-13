import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import { withRouter } from 'next/router';
import Layout from '../../../components/Layout';

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

  const clickSubmit = async (e) => {
    e.preventDefault();
    console.log('activate account');
    setState({ ...state, buttonText: 'Activating' });

    try {
      const response = await axios.post(`${API}/register/activate`, { token });
      console.log('account activate response', response);
      setState({
        ...state,
        name: '',
        token: '',
        buttonText: 'Activated!',
        success: response.data.message,
      });
    } catch (error) {
      setState({ ...state, buttonText: 'Activation Failed', error: 'error submitting' });
      // error.response.data.error
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Hello, {name}. Activate your account now!</h1>
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
      {/* {JSON.stringify(state)} */}
    </Layout>
  );
  // return <div>{JSON.stringify(router)}</div>;
};

export default withRouter(ActivateAccount);
