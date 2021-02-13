// imports
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import axos from 'axios';
import withUser from '../../withUser';
import { getCookie, isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import axios from 'axios';

const Update = ({ oldLink, token }) => {
  // state
  // console.log('old link data from user[id]', oldLink);
  const [state, setState] = useState({
    title: oldLink.title,
    url: oldLink.url,
    categories: oldLink.categories,
    loadedCategories: [],
    success: '',
    error: '',
    type: oldLink.type,
    medium: oldLink.medium,
  });

  const {
    title,
    url,
    categories,
    loadedCategories,
    success,
    error,
    type,
    medium,
  } = state;

  // load categories when component mounts useing useEffect
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleTitleChange = async (e) => {
    setState({ ...state, title: e.target.value, error: '', success: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({title, url, categories, type, medium})
    // use update link based on admin user roll
    let dynamicUpdateUrl;
    if (isAuth() && isAuth().role === 'admin') {
      dynamicUpdateUrl = `${API}/link/admin/${oldLink._id}`;
    } else {
      dynamicUpdateUrl = `${API}/link/${oldLink._id}`;
    }
    try {
      const response = await axios.put(
        dynamicUpdateUrl,
        { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        ...state,
        success: 'Link is updated',
      });
    } catch (error) {
      console.log('LINK SUBMIT ERROR', error);
      setState({ ...state, error: error.response.data.error });
    }
  };

  const handleURLChange = async (e) => {
    setState({ ...state, url: e.target.value, error: '', success: '' });
  };

  const handleTypeClick = (e) => {
    setState({ ...state, type: e.target.value, success: '', error: '' });
  };

  const handleMediumClick = (e) => {
    setState({ ...state, medium: e.target.value, success: '', error: '' });
  };

  // show types
  const showTypes = () => (
    <>
      <div className="form-check ml-5">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleTypeClick}
            defaultChecked={type === 'free'}
            value="free"
            className="form-check-input"
            name="type"
          />{' '}
          Free
        </label>
      </div>

      <div className="form-check ml-5">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleTypeClick}
            defaultChecked={type === 'paid'}
            value="paid"
            className="form-check-input"
            name="type"
          />
          Paid
        </label>
      </div>
    </>
  );
  // show medium
  const showMedium = () => (
    <>
      <div className="form-check ml-5">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleMediumClick}
            defaultChecked={oldLink.medium}
            value="video"
            className="form-check-input"
            name="medium"
          />{' '}
          Video
        </label>
      </div>
      <div className="form-check ml-5">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleMediumClick}
            defaultChecked={oldLink.medium}
            value="book"
            className="form-check-input"
            name="medium"
          />{' '}
          Book
        </label>
      </div>
    </>
  );

  // should be id instead of c but it's fine
  const handleToggle = (c) => () => {
    // return the first index or -1
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }

    // console.log('all >> categories', all);
    setState({ ...state, categories: all, success: '', error: '' });
  };

  // category checkboxes
  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            // bellow is how a method we use to loop through cat and find the ones that apply with includes
            checked={categories.includes(c._id)}
            onChange={handleToggle(c._id)}
            className="mr-2"
          />
          <label htmlFor="" className="form-check-label">
            {c.name}
          </label>
        </li>
      ))
    );
  };

  // create form
  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          onChange={handleTitleChange}
          value={title}
        />
      </div>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          URL
        </label>
        <input
          type="url"
          className="form-control"
          onChange={handleURLChange}
          value={url}
        />
      </div>
      <div>
        <button
          disabled={!token}
          className="btn btn-outline-warning"
          type="submit"
        >
          {isAuth() || token ? 'Update' : 'Login to update'}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1>Edit Request</h1>
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label className="text-muted ml-3"> Category </label>

            <ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>
              {showCategories()}
            </ul>
          </div>
          <div className="form-group">
            <label className="text-muted ml-3"> Type </label>

            {showTypes()}
          </div>
          <div className="form-group">
            <label className="text-muted ml-3"> Medium </label>

            {showMedium()}
          </div>
        </div>
        <div className="col-md-6">
          {/* {console.log(success)} */}
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {submitLinkForm()}
        </div>
      </div>
    </Layout>
  );
};

Update.getInitialProps = async ({ req, token, query }) => {
  const response = await axios.get(`${API}/link/${query.id}`);
  return { oldLink: response.data, token };
};

export default withUser(Update);
// export default withUser(Create)
