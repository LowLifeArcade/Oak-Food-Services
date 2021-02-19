import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../helpers/alerts';
import { API } from '../config';
import styles from '../styles/Home.module.css';
import { isAuth } from '../helpers/auth';

const Register = () => {
  const [state, setState] = useState({
    name: '',
    addButtonText: 'Add student',
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Register',
    student: [],
    loadedCategories: [],
    categories: [], // categories selected by user for signup
    groups: [],
    loadedGroups: [],
  });

  useEffect(() => {
    isAuth() && Router.push('/');
  }, []);

  const {
    addButtonText,
    name,
    email,
    password,
    error,
    student,
    success,
    buttonText,
    loadedCategories,
    categories,
    groups,
    loadedGroups,
  } = state;

  // load categories when component mounts useing useEffect
  useEffect(() => {
    loadGroups();
  }, []);

  // const loadCategories = async () => {
  //   const response = await axios.get(`${API}/categories`);
  //   setState({ ...state, loadedCategories: response.data });
  // };

  const loadGroups = async () => {
    const response = await axios.get(`${API}/groups`);
    // console.log(response.data)
    setState({ ...state, loadedGroups: response.data });
    // console.log('loaded groups', loadedGroups)
  };

  // student add select THIS is where things are going to be tricky
  const handleSelectChange = (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.student]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.group = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array
    setState({
      ...state,
      student: [...students],
      buttonText: 'Register',
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
    // setState({...state,
    //   mealRequest: [...mealRequest, {meal: e.target.value}]});
    // console.log(e.target.getAttribute("data-index"))
  };

  const addStudentGroup = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            data-index={i}
            defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) => handleSelectChange(e)}
            className="form-control"
          >
            {' '}
            <option value="">Student Group</option>
            {state.loadedGroups.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
            })}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  // adding a student to fields
  const addStudent = (e) => {
    e.preventDefault();
    setState({
      ...state,
      student: [...student, { name: '', schoolName: '', group: '' }],
    });
  };

  // remove meal button
  const removeStudent = (e, index) => {
    e.preventDefault();
    const list = [...state.student];
    // console.log(list);
    list.splice(-1)[0];
    // list.splice(index, 1);
    setState({ ...state, student: list });
  };

  // change to toggle instead of being able to select all
  const handleToggle = (c) => () => {
    // return the first index or -1
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    // if (clickedCategory === -1) {
    //   all.push(c);
    // } else {
    //   all.splice(clickedCategory, 1);
    // }

    // console.log('all >> categories', all);
    setState({ ...state, categories: all, success: '', error: '' });
  };

  // category checkboxes turn into select
  const showGroups = () => {
    return (
      loadedGroups &&
      loadedGroups.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            onChange={handleToggle(c._id)}
            className="mr-2 "
          />
          <label htmlFor="" className="form-check-label">
            {c.name}
          </label>
        </li>
      ))
    );
  };

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };
  const handleObjectNameChange = (name) => (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.student]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.name = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array

    // setState({
    //   ...state,
    //   student: [...students],
    //   buttonText: 'Register',
    //   success: '',
    //   error: '',
    // });

    setState({
      ...state,
      student: [
        ...students,
        // {
        //   name: e.target.value,
        // },
      ],
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };
  const handleObjectSchoolChange = (name) => (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.student]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.schoolName = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array

    // setState({
    //   ...state,
    //   student: [...students],
    //   buttonText: 'Register',
    //   success: '',
    //   error: '',
    // });

    setState({
      ...state,
      student: [
        ...students,
        // schoolName: e.target.value,
      ],
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.table({ name, email, password });
    setState({ ...state, buttonText: 'Registering' });
    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password,
      });
      console.log(response);
      setState({
        ...state,
        name: '',
        email: '',
        password: '',
        buttonText: 'Submitted',
        success: response.data.message,
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: 'Register',
        error: error.response.data.error,
      });
    }
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit} action="POST">
      <div className="form-group">
        <input
          value={name}
          onChange={handleChange('name')}
          type="text"
          className="form-control"
          placeholder="Parent name"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange('email')}
          type="text"
          className="form-control"
          placeholder="Email"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handleChange('password')}
          type="password"
          className="form-control"
          placeholder="New password"
          required
        />
      </div>
      {/* <label className="text-muted ml-2 pt-2"> Students: </label> */}

      <div className="form-group">
        <button
          type="text"
          onClick={(e) => addStudent(e)}
          className="btn btn-outline-primary "
        >
          {addButtonText}
        </button>
        {/* <div className=""> */}

        {!state.student.length < 1 && (
          <button
            className="btn btn-warning float-right"
            onClick={(e) => removeStudent(e)}
          >
            Remove Student
          </button>
        )}
        {/* </div> */}
        {/* {addStudent(i)} */}

        <div className="row">
          <div className="col-md-12 pt-2">
            {state.student
              .slice(0)
              .reverse()
              .map((x, i) => {
                return (
                  <>
                    <h6 className="p-2">
                      <label key={i} className="form-check-label text-muted">
                        Student # {`${i + 1}`} information
                      </label>
                    </h6>
                    {/* {console.log(x)} */}

                    <div className="form-group pt-1">
                      <input
                        value={student.student}
                        data-index={i}
                        onChange={handleObjectNameChange()}
                        // onChange={handleChange({student: 'name'})}
                        type="text"
                        className="form-control"
                        placeholder="Student's full name"
                        required
                      />
                    </div>
                    <div className="form-group pt-1">
                      <input
                        value={student.student}
                        data-index={i}
                        onChange={handleObjectSchoolChange()}
                        // onChange={handleChange({student: 'name'})}
                        type="text"
                        className="form-control"
                        placeholder="School student attends"
                        required
                      />
                    </div>
                    <div key={i} className="">
                      {addStudentGroup(i)}
                    </div>
                    {/* <div className="form-group">
        <label className="text-muted ml-3"> Student Group </label>

        <ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>
          {showGroups()}
        </ul>
      </div> */}
                  </>
                );
              })}
          </div>
        </div>

        {console.log('student array in state', state.student)}

        <div className="pt-4"></div>
        {!state.student.length < 1 && <button type="text" className="btn btn-warning">
          {buttonText}
        </button>}
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="pt-4"></div>
      <div className={styles.subcard}>
        {/* + "col-md-6 offset-md-3 subcard" */}
        <h2 className={styles.title}>Register</h2>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {registerForm()}
      </div>
      <div className="pb-4"></div>
    </Layout>
  );
};

export default Register;
