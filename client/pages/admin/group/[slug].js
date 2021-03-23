import dynamic from 'next/dynamic';
import { useState } from 'react';
import axios from 'axios';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import 'react-quill/dist/quill.snow.css';

const Update = ({ oldGroup, token }) => {
  const [state, setState] = useState({
    name: oldGroup.name,
    error: '',
    success: '',
    buttonText: 'Update',
    image: '',
  });

  const [content, setContent] = useState(oldGroup.content);

  const { name, success, error, image, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Update',
    });
  };

  const handleContent = (e) => {
    console.log(3);
    setContent(e);
    setState({
      ...state,
      content: { content },
      buttonText: 'Update',
      success: '',
      error: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Updating...' });
    try {
      const response = await axios.put(
        `${API}/group/${oldGroup.slug}`,
        { name, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('CATEGORY UPDATE RESPONSE', response);
      setState({
        ...state,
        buttonText: 'Updated',
        success: `${response.data.name} is updated`,
        error: '',
      });
      setContent(response.data.content);
    } catch (error) {
      console.log('CATEGORY CREATE ERROR', error);
      setState({
        ...state,
        buttonText: 'Awe',
        error: 'something boobooed',
        //
      });
    }
  };

  const updateCategoryForm = () => (
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
          <h1>Update Post</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {updateCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

Update.getInitialProps = async ({ req, query, token }) => {
  const response = await axios.post(`${API}/group/${query.slug}`);
  return { oldGroup: response.data.category, token };
};

export default withAdmin(Update);
