import styles from '../../../styles/Home.module.css';
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
import { isAuth } from '../../../helpers/auth';
import Link from 'next/link';

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: '',
    menu: [
      { row1: 'day', row2: 'breakfast food', row3: 'lunch', row4: 'vege food' },
    ],
    postedBy: user._id,
    error: '',
    success: '',
    buttonText: 'Post',
    image: '',
  });


  const [menuChange, setMenuChange] = useState('');
  const [content, setContent] = useState('');
  const [group, setGroup] = useState('');
  const [menuType, setMenuType] = useState('Pickup');
  const [menuPost, setMenuPost] = useState(false);

  const [imageUploadButtonName, setImageUploadButtonName] = useState(
    'Upload image'
  );
  

  const {
    menu,
    postedBy,
    name,
    success,
    meal,
    error,
    image,
    buttonText,
    imageUploadText,
  } = state;

  // useEffect(() => {
  //   menuType === 'Onsite' ? setMenuType('Pickup') : setMenuType('Onsite');
  // }, [menuType]);

  useEffect(() => {
    buttonText === 'Created'
      ? setTimeout(() => {
          Router.push('/');
        }, 2000)
      : console.log('none');
  }, [buttonText]);

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
    });
  };

  const resetMenuType = (menuTypeStatus) => {
    setMenuType(menuTypeStatus)
    console.log('menu type', menuType)
    let currentMenuType = menuTypeStatus === 'Pickup' ? { row1: 'day', row2: 'breakfast food', row3: 'lunch', row4: 'vege food' } : { row1: 'day', row2: 'breakfast food', row3: 'lunch' }
    setState({...state,
    menu: [currentMenuType]
    })
  }

  const resetMenuPost = (menuPostStatus) => {
      setMenuPost(menuPostStatus)
      setState({...state,
        menu: [
          { row1: 'day', row2: 'breakfast food', row3: 'lunch', row4: 'vege food' },
        ],
      })
  }

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, content: { content }, success: '', error: '' });
  };

  const handleMenu = (rowName) => (e) => {
    let i = e.target.getAttribute('data-index');

    setMenuChange(e.target.value);

    let newMenu = [...state.menu];
    let menuRow = { ...newMenu[i] };

    menuRow[rowName] = e.target.value;
    // menuRow[rowName] = menuChange;

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
        { name, content, group, image, postedBy, menu },
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

  const addRow = (e) => {
    // e.preventDefault();
    setState({
      ...state,
      menu: [
        ...menu,
        menuType === 'Pickup'
          ? { row1: '', row2: '', row3: '', row4: '' }
          : { row1: '', row2: '', row3: '' },
      ],
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

      {/* {chooseEmailGroup()} */}

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
      {menuPost === false && 
        <button
          className="btn btn-warning"
          type="button"
          onClick={(e) => setMenuPost(!menuPost)}
          // value="Onsite"
        >
          <i class="fas fa-book"></i>
          &nbsp; Add Menu to Post?
        </button>
      }
      {menuPost && 
        <button
          className="btn btn-warning"
          type="button"
          onClick={(e) => resetMenuPost(!menuPost)}
          // value="Onsite"
        >
          <i class="fas fa-book"></i>
          &nbsp; Delete Menu from Post?
        </button>
      }
      <br />
      <br />
      {menuPost && (
        <>
          <div>
            {menuType === 'Pickup' && (
              <button
                type="button"
                className="btn btn-warning fas fa-car-side"
                onClick={(e) => resetMenuType('Onsite')}
                // value="Onsite"
              >
                &nbsp; Curbside Menu
              </button>
            )}
            {menuType === 'Onsite' && (
              <button
                type="button"
                className="btn  btn-warning fas fa-school"
                onClick={(e) => resetMenuType('Pickup')}
                // value="Pickup"
              >
                &nbsp; Onsite Menu
              </button>
            )}
          </div>
          <br />
          <br />

          {/* table menu */}
          <table className="table table-striped table-sm table-bordered">
            {menuType === 'Pickup' ? (
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Breakfast</th>
                  <th scope="col">Lunch</th>
                  <th scope="col">Vegetarian Lunch</th>
                </tr>
              </thead>
            ) : (
              <thead>
                <tr>
                  <th scope="col">Secondary</th>
                  <th scope="col">Day 1</th>
                  <th scope="col">Day 2</th>
                  {/* <th scope="col">Vegetarian Lunch</th> */}
                </tr>
              </thead>
            )}
            <tbody>
              {console.log('what"s in menu', menu)}
              {menuType === 'Pickup'
                ? menu.map((l, i) => (
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
                      </tr>
                    </>
                  ))
                : menu.map((l, i) => (
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
                        {/* <td>
                      <input
                        data-index={i}
                        value={l.row1.value}
                        onChange={handleMenu('row4')}
                      />
                    </td> */}
                      </tr>
                    </>
                  ))}
            </tbody>
          </table>
          <div className="p-1"></div>
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
        </>
      )}
      {/* <div className="p-2"></div> */}
      <hr />
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
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      <button className="btn btn-outline-warning">{buttonText}</button>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-10 offset-md-1 pt-3">
          <h1>Create Post</h1>
          <br />

          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Create);
