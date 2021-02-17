import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
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
    buttonText: 'Post',
    image: '',
  });
  

  const [content, setContent] = useState('');

  const [imageUploadButtonName, setImageUploadButtonName] = useState(
    'Upload image'
  );

  const {
    postedBy,
    name,
    success,
    meal,
    error,
    image,
    buttonText,
    imageUploadText,
  } = state;

  useEffect(() => {
    buttonText === 'Created'
    ? setTimeout(() => {
        Router.push('/');
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

  // const handleImage = (e) => {
  //     const image = e.target.files[0]
  //     console.log(image)
  // }

  const handleImage = (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    setImageUploadButtonName(event.target.files[0].name);
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          1000,
          1000,
          'JPEG',
          100,
          0,
          (uri) => {
            console.log(uri);
            setState({ ...state, image: uri, success: '', error: '' });
          },
          'base64',
          200,
          200
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Creating...' });
    // console.table({name, content, image});
    // console.log(...formData);
    

    try {
      const response = await axios.post(
        `${API}/category`,
        { name, content, image, postedBy },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('CATEGORY CREATE RESPONSE', response);
      setImageUploadButtonName('Upload image');
      setContent('');
      setState({
        ...state,
        name: '',
        // content: '',
        formData: '',
        buttonText: 'Created',
        imageUploadText: 'Upload image',
        success: `${response.data.name} is created`,
        error: '',
      });
    } catch (error) {
      console.log('CATEGORY CREATE ERROR', error);
      setState({
        ...state,
        buttonText: 'Post',
        error: 'something went wrong here',
        // some stuff
      });
    }
  };

  const createCategoryForm = () => (
    <form action="" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Post Title</label>
        <input
          type="text"
          onChange={handleChange('name')}
          value={name}
          className="form-control"
          required
        />
      </div>
      {/* <div className="form-group">
        <label className="text-muted">Meal</label>
        <select
          type="select"
          onChange={handleChange('meal')}
          value={meal}
          className="form-control"
          required
        >
        <option value='' selected></option>
        <option value='ST'>Standard</option>
        <option value='Vt'>Vegetarian</option>
        <option value='Vg'>Vegan</option>
        </select>
      </div> */}
      <div className="form-group">
        <label className="text-muted">Content</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          placeholder="write here"
          theme="snow"
          className="pd-5 mb-3"
          style={{ border: '1px solid #333' }}
        />
      {/* insert table somehow */}
      

        {/* <label className="text-muted">Content</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          placeholder="write here"
          theme="snow"
          className="pd-5 mb-3"
          style={{  border: '1px solid #333' }}
        /> */}
        {/* <textarea
          type="content"
          onChange={handleChange('content')}
          value={content}
          className="form-control"
          required
        /> */}
      </div>
      {/* <div className="form-group">
        <label className="btn btn-outline-secondary">
          Add Table
          <input
            id={'insert-table'}
            onChange={(e) => () => {
              table.insertTable(2, 2);
            }}
            className="form-control"
            hidden
          />
        </label>
      </div> */}

      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}
          <input
            onChange={e => handleImage(e)}
            accept="image/*"
            type="file"
            className="form-control"
            hidden
          />
        </label>
      </div>

      <button className="btn btn-outline-warning">{buttonText}</button>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3 pt-3">
          <h1>Create Post</h1>
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
