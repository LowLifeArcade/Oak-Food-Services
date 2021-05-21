import styles from '../../../styles/Home.module.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import moment from 'moment';
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
    menu: oldCategory.menu,
    menu2: oldCategory.menu2,
    menu3: oldCategory.menu3,
    pickupWeek: oldCategory.pickupWeek,
    error: '',
    success: '',
    // postedBy: user._id,
    buttonText: 'Update',
    imagePreview: categoryImage,
    image: '',
  });
  console.log('old category', oldCategory);

  const categoryImage = oldCategory.image && oldCategory.image.url;
  const [menuChange, setMenuChange] = useState('');
  const [content, setContent] = useState(oldCategory.content);
  const [group, setGroup] = useState(oldCategory.group);
  const [menuType, setMenuType] = useState('Pickup');
  const [menuPost, setMenuPost] = useState(true);

  const [imageUploadButtonName, setImageUploadButtonName] = useState(
    'Update image'
  );

  const {
    pickupWeek,
    menu,
    menu2,
    menu3,
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

  const resetMenuPost = (menuPostStatus) => {
    setMenuPost(menuPostStatus);
    setState({
      ...state,
      menu: [],
      menu2: [],
      menu3: [],
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

    menuRow[rowName] = e.target.value;

    newMenu[i] = menuRow;

    setState({
      ...state,
      menu: [...newMenu],
      success: '',
      error: '',
    });
  };

  const handleMenu2 = (rowName) => (e) => {
    let i = e.target.getAttribute('data-index');

    setMenuChange(e.target.value);

    let newMenu = [...state.menu2];
    let menuRow = { ...newMenu[i] };

    menuRow[rowName] = e.target.value;
    // menuRow[rowName] = menuChange;

    newMenu[i] = menuRow;

    setState({
      ...state,
      menu2: [...newMenu],
      success: '',
      error: '',
    });
  };

  const handleMenu3 = (rowName) => (e) => {
    let i = e.target.getAttribute('data-index');

    setMenuChange(e.target.value);

    let newMenu = [...state.menu3];
    let menuRow = { ...newMenu[i] };

    menuRow[rowName] = e.target.value;
    // menuRow[rowName] = menuChange;

    newMenu[i] = menuRow;

    setState({
      ...state,
      menu3: [...newMenu],
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
        { name,
          content,
          group,
          image,
          postedBy,
          menu,
          menu2,
          menu3,
          pickupWeek, },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('CATEGORY UPDATE RESPONSE', response);
      setState({
        ...state,
        name: '',
        formData: '',
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
      menu: [
        ...menu,
        menuType === 'Pickup'
          ? { row1: '', row2: '', row3: '', row4: '' }
          : { row1: '', row2: '', row3: '' },
      ],
    });
  };

  const addRow2 = (e) => {
    // e.preventDefault();
    setState({
      ...state,
      menu2: [
        ...menu2,
        menuType === 'Onsite'
          ? { row1: '', row2: '', row3: '', row4: '' }
          : { row1: '', row2: '' },
      ],
    });
  };
  
  const addRow3 = (e) => {
    // e.preventDefault();
    setState({
      ...state,
      menu3: [
        ...menu3,
        menuType === 'Onsite'
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

  const removeRow2 = (e) => {
    e.preventDefault();
    const list = [...state.menu2];
    list.splice(-1)[0];

    setState({ ...state, menu2: list });
  };
  
  const removeRow3 = (e) => {
    e.preventDefault();
    const list = [...state.menu3];
    list.splice(-1)[0];

    setState({ ...state, menu3: list });
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

  const onDateChange = (pickupWeek) => {
    setState({ ...state, pickupWeek: moment(pickupWeek).format('l') });
    // handleDateChange(pickupWeek);
  };

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 1;

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

      {/* {chooseEmailGroup()} */}
      <div className="">
        <Calendar
          onChange={(e) => onDateChange(e)}
          tileDisabled={handleDisabledDates}
          value={pickupWeek}
          value={''}
        />
      </div>
      <br />
      Menu is for week of {`${pickupWeek}`}
      {console.log('pickup week', pickupWeek)}
      <br />
      <br />

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
      {menuPost === false && (
        <button
          className="btn btn-warning"
          type="button"
          onClick={(e) => setMenuPost(!menuPost)}
          // value="Onsite"
        >
          <i class="fas fa-book"></i>
          &nbsp; Add Menu to Post?
        </button>
      )}
      {menuPost && (
        <button
          className="btn btn-warning"
          type="button"
          onClick={(e) => resetMenuPost(!menuPost)}
          // value="Onsite"
        >
          <i class="fas fa-book"></i>
          &nbsp; Delete Menu from Post?
        </button>
      )}
      <br />
      <br />
      {menuPost && ( // menu 1
        <>
          {/* <div>
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
          </div> */}
          <br />
          <br />
          <h3>Curbside Menu </h3>
          <div className="p-1"></div>
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
                            defaultValue={l.row1}
                            value={l.row1.value}
                            onChange={handleMenu('row1')}
                          />
                        </td>
                        <td>
                          <input
                          defaultValue={l.row2}
                            data-index={i}
                            value={l.row1.value}
                            onChange={handleMenu('row2')}
                          />
                        </td>
                        <td>
                          <input
                          defaultValue={l.row3}
                            data-index={i}
                            value={l.row1.value}
                            onChange={handleMenu('row3')}
                          />
                        </td>
                        <td>
                          <input
                          defaultValue={l.row4}
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
                            defaultValue={l.row1}
                            value={l.row1.value}
                            onChange={handleMenu('row1')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            defaultValue={l.row2}
                            value={l.row1.value}
                            onChange={handleMenu('row2')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            defaultValue={l.row3}
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
      <br />
      {menuPost && ( // menu 2
        <>
          {/* <div>
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
          </div> */}
          <br />
          <br />
          <h3>Elementary Menu </h3>
          {/* table menu */}
          <table className="table table-striped table-sm table-bordered">
            {menuType === 'Onsite' ? (
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
                  {/* <th scope="col">Secondary</th> */}
                  <th scope="col">Monday/Wednesday</th>
                  <th scope="col">Tuesday/Thursday</th>
                  {/* <th scope="col">Vegetarian Lunch</th> */}
                </tr>
              </thead>
            )}
            <tbody>
              {console.log('what"s in menu', menu)}
              {menuType === 'Onsite'
                ? menu2.map((l, i) => (
                    <>
                      <tr key={i}>
                        <td>
                          <input
                            data-index={i}
                            value={l.row1.value}
                            onChange={handleMenu2('row1')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            value={l.row1.value}
                            onChange={handleMenu2('row2')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            value={l.row1.value}
                            onChange={handleMenu2('row3')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            value={l.row1.value}
                            onChange={handleMenu2('row4')}
                          />
                        </td>
                      </tr>
                    </>
                  ))
                : menu2.map((l, i) => (
                    <>
                      <tr key={i}>
                        <td>
                          <input
                            data-index={i}
                            value={l.row1.value}
                            defaultValue={l.row1}
                            onChange={handleMenu2('row1')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            value={l.row1.value}
                            defaultValue={l.row2}
                            onChange={handleMenu2('row2')}
                          />
                        </td>
                        {/* <td>
                          <input
                            data-index={i}
                            value={l.row1.value}
                            onChange={handleMenu2('row3')}
                          />
                        </td> */}
                        {/* <td>
                      <input
                        data-index={i}
                        value={l.row1.value}
                        onChange={handleMenu2('row4')}
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
                onClick={() => menu2.map((e) => addRow2(e))}
              >
                <i class="fas fa-utensils"></i>
                &nbsp;&nbsp; Add Row
              </button>
            }
            {menu.length !== 1 && (
              <button
                type="button"
                className={'btn float-right ' + styles.buttonshadow}
                onClick={(e) => removeRow2(e)}
              >
                Remove
              </button>
            )}
          </div>
        </>
      )}
      <br />
      {menuPost && ( // menu 3
        <>
          {/* <div>
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
          </div> */}
          <br />
          <br />
          <h3>Highschool Menu </h3>
          {/* table menu */}
          <table className="table table-striped table-sm table-bordered">
            {menuType === 'Pickup' ? (
              <thead>
                <tr>
                  <th scope="col">Monday</th>
                  <th scope="col">Tuesday</th>
                  <th scope="col">Wednesday</th>
                  <th scope="col">Thursday</th>
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
                ? menu3.map((l, i) => (
                    <>
                      <tr key={i}>
                        <td>
                          <input
                            data-index={i}
                            defaultValue={l.row1}
                            value={l.row1.value}
                            onChange={handleMenu3('row1')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            defaultValue={l.row2}
                            value={l.row1.value}
                            onChange={handleMenu3('row2')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            defaultValue={l.row3}
                            value={l.row1.value}
                            onChange={handleMenu3('row3')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            defaultValue={l.row4}
                            value={l.row1.value}
                            onChange={handleMenu3('row4')}
                          />
                        </td>
                      </tr>
                    </>
                  ))
                : menu3.map((l, i) => (
                    <>
                      <tr key={i}>
                        <td>
                          <input
                            data-index={i}
                            defaultValue={l.row1}
                            value={l.row1.value}
                            onChange={handleMenu3('row1')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            defaultValue={l.row2}
                            value={l.row1.value}
                            onChange={handleMenu3('row2')}
                          />
                        </td>
                        <td>
                          <input
                            data-index={i}
                            defaultValue={l.row3}
                            value={l.row1.value}
                            onChange={handleMenu3('row3')}
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
                onClick={() => menu3.map((e) => addRow3(e))}
              >
                <i class="fas fa-utensils"></i>
                &nbsp;&nbsp; Add Row
              </button>
            }
            {menu.length !== 1 && (
              <button
                type="button"
                className={'btn float-right ' + styles.buttonshadow}
                onClick={(e) => removeRow3(e)}
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
      <div className="container pt-5">
      <div className="row pt-3">
        <div className="col-md-6 offset-md-1 pt-3">
          <h1>Update Post</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {updateCategoryForm()}
        </div>
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
