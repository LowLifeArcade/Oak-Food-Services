import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  modules: {
    table: true,
  },
});
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import 'react-quill/dist/quill.snow.css';
import Router from 'next/router'
// import { set } from 'js-cookie';

const Create = ({ user, username, token }) => {
  const [state, setState] = useState({
    name: '',
    postedBy: username,
    error: '',
    success: '',
    // content: {content},
    buttonText: 'Set Group',
    image: '',
  });

  const [content, setContent] = useState('');

  const {
    postedBy,
    name,
    success,
    error,
    image,
    buttonText,
  } = state;

  useEffect(() => {
    buttonText === 'Created'
    ? setTimeout(() => {
        Router.push('/admin');
      }, 2000)
      : console.log('none')
    // : Router.push('');
  }, [buttonText])

  // maybe add a className that makes the div go away with transform translateY
  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
    });
  };

  const handleContent = (e) => {
    console.log(3);
    setContent(e);
    setState({ ...state, content: { content }, success: '', error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Creating...' });   

    try {
      const response = await axios.post(
        `${API}/group`,
        { name, content, postedBy },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('GROUP CREATE RESPONSE', response);
      setContent('');
      setState({
        ...state,
        name: '',
        // content: '',
        formData: '',
        buttonText: 'Group set',
        success: `${response.data.name} is created`,
        error: '',
      });
    } catch (error) {
      console.log('GROUP CREATE ERROR', error);
      setState({
        ...state,
        buttonText: 'Set Group',
        error: error.response.data.error,
        // error: 'something went wrong here',
      });
    }
  };

  const createGroupForm = () => (
    <form action="" onSubmit={handleSubmit}>

      <div className="form-group">
        <label className="text-muted">Group Title</label>
        <input
          type="text"
          onChange={handleChange('name')}
          value={name}
          className="form-control"
          required
        />
      </div>
 
      <div className="form-group">
        <label className="text-muted">Group Description</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          placeholder="write here"
          theme="snow"
          className="pd-5 mb-3"
          style={{ border: '1px solid #333' }}
        />
      </div>

      <button className="btn btn-outline-warning">{buttonText}</button>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3 pt-3">
          <h1>Create Group</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createGroupForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Create);
