import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import {
  showErrorMessage,
  showSuccessMessage,
  showMessageMessage,
} from '../helpers/alerts';
import { API } from '../config';
import styles from '../styles/Home.module.css';
import { isAuth } from '../helpers/auth';

const Register = () => {
  const [state, setState] = useState({
    name: '',
    lastName: '',
    addButtonText: 'Add student',
    email: '',
    password: '',
    confirmPassword: '',
    error: '',
    message: '',
    goodMessage: '',
    success: '',
    buttonText: 'Register',
    students: [],
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
    lastName,
    message,
    goodMessage,
    email,
    password,
    confirmPassword,
    error,
    students,
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

  useEffect(() => {
    // isAuth() && Router.push('/user');
    isAuth() && isAuth().role === 'admin'
      ? Router.push('admin')
      : isAuth() && isAuth().role === 'subscriber'
      ? Router.push('user')
      : !isAuth()
      ? console.log('not registered or signed in')
      : Router.push('/');
    // : Router.push('user')
  }, [success]);

  const makeUserCode = (length) => {
    let result = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const charsLength = chars.length;
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return result;
  };
  // this takes first 3 letters of last name and 1 random character
  const userCode =
    lastName.substr(0, 3).toUpperCase() + makeUserCode(1).toUpperCase();
  // console.log('USERCODE', userCode);

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

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.group = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array
    setState({
      ...state,
      students: [...students],
      buttonText: 'Register',
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
    // setState({...state,
    //   mealRequest: [...mealRequest, {meal: e.target.value}]});
    // console.log(e.target.getAttribute("data-index"))
  };

  // const addStudentGroup = (i) => (
  //   <>
  //     <div key={i} className="form-group">
  //       <div className="">
  //         <select
  //           type="select"
  //           // value={state.value}
  //           data-index={i}
  //           // defaultValue={''}
  //           // defaultValue={state.mealRequest[0].meal}
  //           onChange={(e) => handleSelectChange(e)}
  //           className="form-control"
  //           required
  //         >
  //           {' '}
  //           <option selected disabled value="">Choose A Student Group</option>
  //           {state.loadedGroups.map((g, i) => {
  //             return <option value={g._id}>{g.name}</option>;
  //             // return <option value={g._id}>{g.name}</option>;
  //           })}
  //         </select>
  //         <div className="p-2"></div>
  //       </div>
  //     </div>
  //   </>
  // );

  // adding a student to fields
  const addStudent = (e) => {
    e.preventDefault();
    setState({
      ...state,
      students: [...students, { name: '', schoolName: '', group: '' }],
    });
  };

  // remove meal button
  const removeStudent = (e, index) => {
    e.preventDefault();
    const list = [...state.students];
    // console.log(list);
    list.splice(-1)[0];
    // list.splice(index, 1);
    setState({ ...state, students: list });
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

  const handlePasswordChange = () => (e) => {
    let shallowMessage = '';
    let shallowGoodMessage = '';

    if (password.length < 7) {
      shallowMessage = 'Password must be at least 8 characters';
    } else if (
      // password.match(/[A-Z]/g) === 0 ||
      !e.target.value.match(/[A-Z]/g)
      // password.match(/[A-Z]/g) === null
    ) {
      shallowMessage = 'Password must contain at least one capitol letter';
    } else if (!e.target.value.match(/[^A-Za-z0-9]/g)) {
      shallowMessage = 'Password must contain at least one special character';
    } else if (password.length < 13) {
      shallowGoodMessage = 'Good password'

    } else if (password.length > 12){
      shallowGoodMessage = 'Great Password!'
    }



      console.log('regex check', e.target.value);
    setState({
      ...state,
      password: e.target.value,
      message: shallowMessage,
      goodMessage: shallowGoodMessage,
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };

  const handleObjectNameChange = (name) => (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
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
      students: [
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

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
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
      students: [
        ...students,
        // schoolName: e.target.value,
      ],
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };
  console.log(students);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({ name, email, password });
    setState({ ...state, buttonText: 'Registering' });
    if (password !== confirmPassword) {
      setState({ ...state, error: "Passwords don't match" });
    } else if (password.length < 7) {
      setState({ ...state, error: "Password MUST be at least 8 characters" });

    }else if (password.match(/[A-Z]/g) === null) {
      setState({ ...state, error: "Password MUST contain at least one capitol letter" });
    } else if (!password.match(/[^A-Za-z0-9]/g)) {
      setState({ ...state, error: "Password MUST contain at least one special character" });

    }
  
    else {
      try {
        const response = await axios.post(`${API}/register`, {
          name,
          lastName,
          email,
          password,
          // students,
        });
        console.log(response);
        setState({
          ...state,
          // name: '',
          // email: '',
          password: '',
          confirmPassword: '',
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
    }
  };

  const registerForm = () => (
    <form
      onSubmit={handleSubmit}
      onKeyPress={(e) => {
        if (e.key === 'Enter') e.preventDefault();
      }}
      action="POST"
    >
      <div className="form-group">
        <input
          value={name}
          onChange={handleChange('name')}
          type="text"
          className="form-control"
          placeholder="Parent First Name"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={lastName}
          onChange={handleChange('lastName')}
          type="text"
          className="form-control"
          placeholder="Parent Last Name"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange('email')}
          type="email"
          className="form-control"
          placeholder="Email"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handlePasswordChange('password')}
          type="password"
          className="form-control"
          placeholder="New password"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={confirmPassword}
          onChange={handleChange('confirmPassword')}
          type="password"
          className="form-control"
          placeholder="Repeat password"
          required
        />
      </div>
      {/* <label className="text-muted ml-2 pt-2"> Students: </label> */}

      {/* <div className="row">
          <div className="col-md-12 pt-2">
            {state.students
              .slice(0)
              // .reverse()
              .map((x, i) => {
                return (
                  <>
                    <h6 className="p-2">
                      <label key={i} className="form-check-label text-muted">
                        Student # {`${i + 1}`} information
                      </label>
                    </h6>


                    <div className="form-group pt-1">
                      <input
                        value={students.student}
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
                      <select
                        value={students.student}
                        data-index={i}
                        onChange={handleObjectSchoolChange()}
                        // onChange={handleChange({student: 'name'})}
                        type="text"
                        className="form-control"
                        placeholder="School student attends"
                        required
                      >
                      <option selected disabled value="">Choose A School</option>
                      <option value="OPMS">Oak Park Middle School</option>
                      <option value="OPHS">Oak Park High School</option>
                      <option value="OPES">Oak Park Elementary School</option>
                      </select>
                    </div>
                    {/* <div className="form-group pt-1">
                      <input
                        value={students.student}
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
      </div> 
                  </>
                );
              })}
          </div>
        </div>

        {console.log('student array in state', state.students[0].group)}

        <div className="form-group">
        <button
          type="text"
          onClick={(e) => addStudent(e)}
          className="btn btn-outline-primary "
        >
          {addButtonText}
        </button>
        {/* <div className=""> 
          

         {!state.students.length < 1 && (
          <button
          className="btn btn-danger float-right"
          onClick={(e) => removeStudent(e)}
          >
          Remove 
          </button>
          )}
          </div> 
        {addStudent(i)} */}

      <div className="row">
        <div className="col">
          <div className="pt-1"></div>
          {success && showSuccessMessage(success)}
          {goodMessage && showSuccessMessage(goodMessage)}
          {error && showErrorMessage(error)}
          {message && showMessageMessage(message)}
          <br />
          <button type="text" className="btn btn-warning">
            {buttonText}
          </button>
        </div>
        {/* {!state.students.length < 1 && (
          <button type="text" className="btn btn-warning">
            {buttonText}
          </button>
        )} */}
      </div>
    </form>
  );

  return (
    <div
      className={styles.background}
      style={
        {
          // height: '100vh'
        }
      }
    >
      <Layout>
        <div className={styles.body}>
          <div className="pt-5 pb-2"></div>

          {/* <div className="pt-4"></div> */}
          <div className="col-md-6 offset-md-3 pt-4">
            <div className={styles.subcard}>
              {/* + "col-md-6 offset-md-3 subcard" */}
              <h2 className={'text-muted ' + styles.title}>Register</h2>
              <br />
              {registerForm()}
              {/* {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)} */}
            </div>
          </div>
        </div>
        {/* <div className="pb-4"></div> */}
      </Layout>
    </div>
  );
};

export default Register;
