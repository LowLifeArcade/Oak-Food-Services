import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button
    ],
  },
});
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import 'react-quill/dist/quill.snow.css';
import Router from 'next/router';

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: '',
    postedBy: user._id,
    error: '',
    success: '',
    buttonText: 'Post',
    image: '',
  });

  const [content, setContent] = useState('');
  const [group, setGroup] = useState('');

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
      : console.log('none');
  }, [buttonText]);

  const chooseEmailGroup = () => (
    <>
      <div className="form-group col-md-4">
        <div className="">
          <select
            type="select"
            onChange={(e) => setGroup(e.target.value)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Student Group
            </option>
            <option value="all-students">All Students</option>
            <option value="distance-learning">Distance Learning</option>
            <option value="a-group">A - Group</option>
            <option value="b-group">B - Group</option>
          </select>
          <div className=""></div>
        </div>
      </div>
    </>
  );

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
    });
  };

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, content: { content }, success: '', error: '' });
  };

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

    try {
      const response = await axios.post(
        `${API}/category`,
        { name, content, group, image, postedBy },
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
        error: error.response.data.error,
      });
    }
  };

  const createCategoryForm = () => (
    <form action="" onSubmit={handleSubmit}>
      <div className="form-group col-md-4">
        <label className="text-muted">Post Title</label>
        <input
          type="text"
          onChange={handleChange('name')}
          value={name}
          className="form-control"
          required
        />
      </div>
      {chooseEmailGroup()}

      <div className="form-group">
        <label className="text-muted">Content</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          placeholder="write here"
          theme="snow"
          className="pd-7 mb-3"
          style={{ border: '1px solid #333' }}
        />
      </div>

      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}
          <input
            onChange={(e) => handleImage(e)}
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
        <div className="col-md-10 offset-md-1 pt-3">
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
