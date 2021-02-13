import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer'
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
// import { set } from 'js-cookie';

const CreateForm = ({user, token}) => {
 
  const [state, setState] = useState({
    name: '',
    content: '',
    error: '',
    success: '',
    formData: process.browser && new FormData(),
    buttonText: 'Create',
    imageUploadText: 'Upload image',
  });

  const {
    name,
    content,
    success,
    error,
    formData,
    buttonText,
    imageUploadText,
  } = state;

  // maybe add a className that makes the div go away with transform translateY
  const handleChange = (name) => (e) => {
    const value = name === 'image' ? e.target.files[0] : e.target.value;
    const imageName =
      name === 'image' ? e.target.files[0].name : 'Upload image';
    formData.set(name, value);

    setState({
      ...state,
      [name]: value,
      error: '',
      success: '',
      imageUploadText: imageName,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonTest: 'Creating' });
    // console.log(token);
    // console.log(...formData);
    try {
      const response = await axios.post(`${API}/category`, formData,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('CATEGORY CREATE RESPONSE', response)
      setState({
        ...state,
        name: '',
        content: '',
        formData: '',
        buttonText: 'Created',
        imageUploadText: 'Upload image',
        success: `${response.data.name} is created`,
        error: ''
      })
    } catch (error) {
      console.log('CATEGORY CREATE ERROR', error)
      setState({
        ...state,
        buttonText: 'Create',
        error: 'Please fill out all fields'
        // error.response.data.error
      })
      
    }
  };

  const createCategoryForm = () => (
    <form action="" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          onChange={handleChange('name')}
          value={name}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Content</label>
        <textarea
        type="content"
          onChange={handleChange('content')}
          value={content}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadText}
        <input
          onChange={handleChange('image')}
          accept="image/*"
          type="file"
          className="form-control"
          hidden
          />
          </label>
      </div>
      <button className="btn btn-outline-warning">
        {buttonText}
      </button>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Create category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Create);
