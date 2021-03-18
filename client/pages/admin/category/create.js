import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  // modules: {
  //   table: true,
  //   toolbar: '#toolbar'
  // },

  
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
    
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
    
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
    
      ['clean']                                         // remove formatting button
    ],
  }
});
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import 'react-quill/dist/quill.snow.css';
import Router from 'next/router'
// import { set } from 'js-cookie';
// var toolbarOptions = [
//   ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
//   ['blockquote', 'code-block'],

//   [{ 'header': 1 }, { 'header': 2 }],               // custom button values
//   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//   [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
//   [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
//   [{ 'direction': 'rtl' }],                         // text direction

//   [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
//   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

//   [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
//   [{ 'font': [] }],
//   [{ 'align': [] }],

//   ['clean']                                         // remove formatting button
// ];

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: '',
    postedBy: user._id,
    error: '',
    success: '',
    // content: {content},
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
      : console.log('none')
    // : Router.push('');
  }, [buttonText])

   // student add select THIS is where things are going to be tricky
  //  const handleSelectGroupChange = (e) => {
  //   let i = e.target.getAttribute('data-index');

  //   let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
  //   let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
  //   oneStudent.group = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
  //   students[i] = oneStudent; // puts meal[i] back into mealRequest array
  //   setState({
  //     ...state,
  //     students: [...students],
  //     buttonText: 'Register',
  //     success: '',
  //     error: '',
  //   }); //puts ...mealRequest with new meal back into mealRequest: []
  //   // setState({...state,
  //   //   mealRequest: [...mealRequest, {meal: e.target.value}]});
  //   // console.log(e.target.getAttribute("data-index"))
  // };

  const chooseEmailGroup = () => (
    <>
      <div className="form-group col-md-4">
        <div className="">
          <select
            type="select"
            // value={state.value}
            // data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
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
            {/* {state.loadedGroups.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className=""></div>
        </div>
      </div>
    </>
  );

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
        error: error.response.data.error,
        // some stuff
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
          className="pd-7 mb-3"
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
