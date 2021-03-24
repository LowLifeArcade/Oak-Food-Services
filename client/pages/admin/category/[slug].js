import styles from '../../../styles/Home.module.css';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
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
import { isAuth } from '../../../helpers/auth';
import Link from 'next/link';

const Update = ({ oldCategory, token }) => {
  const [state, setState] = useState({
    name: oldCategory.name,
    emailGroup: oldCategory.group,
    menu: oldCategory.menu,
    error: '',
    success: '',
    buttonText: 'Update',
    imagePreview: categoryImage,
    image: '',
  });
  console.log('old category', oldCategory);

  const categoryImage = oldCategory.image && oldCategory.image.url;
  const [content, setContent] = useState(oldCategory.content);
  const [group, setGroup] = useState(oldCategory.group);

  const [
    imageUploadButtonName,
    setImageUploadButtonName,
    emailGroup,
  ] = useState('Update image');

  const {
    menu,
    name,
    success,
    meal,
    error,
    image,
    buttonText,
    imageUploadText,
    imagePreview,
  } = state;

  useEffect(() => {
    buttonText === 'Updated'
      ? setTimeout(() => {
          Router.push('/');
        }, 2000)
      : console.log('none');
  }, [buttonText]);


  const confirmDelete = (e, slug) => {
    e.preventDefault();
    let answer = window.confirm('WARNING! Confirm delete.');
    if (answer) {
      handleDelete(slug);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setState({
        ...state,
        success: 'Successfully deleted menu',
        buttonText: 'Updated',
      });
      console.log('CATEGORY DELETE SUCCESS', response);
      // loadCatergories();
    } catch (error) {
      console.log('ERROR DELETING CATEGORY', error);
    }
  };

  // maybe add a className that makes the div go away with transform translateY
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
      success: '',
      error: '',
    });
  };

  const handleMenu = (rowName) => (e) => {
    let i = e.target.getAttribute('data-index');

    setMenuChange(e.target.value);

    let newMenu = [...state.menu];
    let menuRow = { ...newMenu[i] };

    menuRow[rowName] = menuChange;

    newMenu[i] = menuRow;

    setState({
      ...state,
      menu: [...newMenu],
      success: '',
      error: '',
    });
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
            setState({
              ...state,
              image: uri,
              buttonText: 'Update',
              success: '',
              error: '',
            });
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
    setState({ ...state, buttonText: 'Updating...' });
    try {
      const response = await axios.put(
        `${API}/category/${oldCategory.slug}`,
        { name, content, image, group },
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
        imagePreview: categoryImage,
        success: `${response.data.name} is updated`,
        error: '',
      });
      setContent(response.data.content);
    } catch (error) {
      console.log('CATEGORY CREATE ERROR', error);
      setState({
        ...state,
        buttonText: 'Awe',
        error: error.response.data.error,
      });
    }
  };

  const addRow = (e) => {
    // e.preventDefault();
    setState({
      ...state,
      menu: [...menu, { row1: '', row2: '', row3: '', row4: '' }],
    });
  };

  const removeRow = (e) => {
    e.preventDefault();
    const list = [...state.menu];
    list.splice(-1)[0];

    setState({ ...state, menu: list });
  };

  const chooseEmailGroup = () => (
    <>
      <div className="form-group">
        <div className="">
          <select
            type="select"
            defaultValue={group}
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

      {/* table menu */}
      <table className="table table-striped">

{/* add menu button */}

      {menu.length > 0 && <thead>
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col">Breakfast</th>
                    <th scope="col">Lunch</th>
                    <th scope="col">Vegetarian Lunch</th>
                  </tr>
                </thead>}
        <tbody>
          {menu.map((l, i) => (
            <>
              <tr key={i}>
                <td>
                  <input
                    data-index={i}
                    value={l.row1.value}
                    onChange={handleMenu('row1')}
                  />
                </td>
                <td>
                  <input
                    data-index={i}
                    value={l.row1.value}
                    onChange={handleMenu('row2')}
                  />
                </td>
                <td>
                  <input
                    data-index={i}
                    value={l.row1.value}
                    onChange={handleMenu('row3')}
                  />
                </td>
                <td>
                  <input
                    data-index={i}
                    value={l.row1.value}
                    onChange={handleMenu('row4')}
                  />
                </td>
                {/* <td>{l.row2}</td>
                <td>{l.row3}</td>
                <td>{l.row4}</td> */}
              </tr>
              <div className="p-2"></div>
            </>
          ))}
        </tbody>
      </table>
      <div className="">
        {
          <button
            className={'btn  btn-outline-info ' + styles.buttonshadow}
            type="button"
            onClick={() => menu.map((e) => addRow(e))}
          >
            <i class="fas fa-utensils"></i>
            &nbsp;&nbsp; Add Row
          </button>
        }

        {menu.length !== 1 && (
          <button
            type="button"
            className={'btn float-right ' + styles.buttonshadow}
            onClick={(e) => removeRow(e)}
          >
            Remove
          </button>
        )}
      </div>
      <div className="p-2"></div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}
          <span>
            <img src={imagePreview} alt="image" height="150" />
          </span>
          <input
            onChange={handleImage}
            accept="image/*"
            type="file"
            className="form-control"
            hidden
          />
        </label>
      </div>
      <button className="btn btn-outline-warning">{buttonText}</button>
      
          {/* <Link href={`/admin/category/${oldCategory.slug}`}>
            <button className="badge btn btn-sm btn-outline-warning  mb-1">
            Update
            </button>
          </Link> */}
          <button
            onClick={(e) => confirmDelete(e, oldCategory.slug)}
            className="badge btn btn btn-outline-danger float-right"
          >
            Delete
          </button>
          <div className="p-2"></div>
      
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
  const response = await axios.post(`${API}/category/${query.slug}`);
  return { oldCategory: response.data.category, token };
};

export default withAdmin(Update);
