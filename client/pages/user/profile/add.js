import Layout from '../../../components/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import styles from '../../../styles/Home.module.css';
import { isAuth, updateUser } from '../../../helpers/auth';
import withUser from '../../withUser';
import Link from 'next/link';
import  Router  from 'next/router';

const Profile = ({ user, token }) => {
  const [state, setState] = useState({
    // name: user.name,
    // lastName: user.lastName,
    // email: user.email,
    // password: '',
    // confirmPassword: '',
    error: '',
    success: '',
    buttonText: 'Register',
    addButtonText: 'Add Student',
    students: [{ name: '', schoolName: '', group: '', teacher: '' }],
    loadedCategories: [],
    categories: user.categories, // categories selected by user for signup
    groups: [],
    teachers: [],
    loadedGroups: [],
    loadedTeachers: []
  });
  // console.log(user)

  // useEffect(() => {
  //   isAuth() && Router.push('/');
  // }, []);

  const {
    addButtonText,
    students,
    // name,
    // lastName,
    // email,
    // password,
    // confirmPassword,
    error,
    success,
    buttonText,
    loadedCategories,
    categories,
    groups,
    teachers,
    loadedGroups,
    loadedTeachers
  } = state;

  // load categories when component mounts useing useEffect
  useEffect(() => {
    // loadCategories();
    // setTimeout(() => {
    // }, 1000)
    loadGroups();
    // loadTeachers();
  }, []);

  // useEffect(() => {
  //   // loadCategories();
  //   // loadGroups();
  //   loadTeachers();
  // }, []);

  useEffect(() => {
      success === "You've successfully registered your students"
      ? setTimeout(() => {
        Router.push('/user') 
      }, 2000)
      : console.log('add students')
  }, [success])

  // useEffect(() => {
  //   // isAuth() && Router.push('/user');
  //   isAuth() && isAuth().role === 'admin'
  //     ? Router.push('admin')
  //     : isAuth() && isAuth().role === 'user'
  //     ? Router.push('user')
  //     : !isAuth() ? console.log('not registered or signed in') : Router.push('/');
  //   // : Router.push('user')
  // }, [success]);
  const loadGroups = async () => {
    const response = await axios.get(`${API}/groups`);
    const response2 = await axios.get(`${API}/teachers`);
    // console.log(response.data)
    // setState({ ...state, loadedTeachers: response2.data });
    // console.log(response.data)
    setState({ ...state, loadedTeachers: response2.data, loadedGroups: response.data });
  };

  // const loadCategories = async () => {
  //   const response = await axios.get(`${API}/categories`);
  //   setState({ ...state, loadedCategories: response.data });
  // };


  console.log('loaded groups', loadedGroups);
  // const loadTeachers = async () => {
  //   const response = await axios.get(`${API}/teachers`);
  //   // console.log(response.data)
  //   setState({ ...state, loadedTeachers: response.data });
  // };
  console.log('loaded teachers', loadedTeachers);

  // student add select THIS is where things are going to be tricky
  const handleSelectGroupChange = (e) => {
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

  const addStudentGroup = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) => handleSelectGroupChange(e)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">Choose Student Group</option>
            {state.loadedGroups.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })}
          </select>
          <div className=""></div>
        </div>
      </div>
    </>
  );

   // student add select THIS is where things are going to be tricky
   const handleSelectTeacherChange = (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.teacher = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
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

  const addTeacher = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) => handleSelectTeacherChange(e)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">Choose Teacher</option>
            {state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
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
      students: [...students, { name: '', schoolName: '', group: '', teacher: '' }],
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

  // category checkboxes
  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            checked={categories.includes(c._id)} // populates checked categories from registration
            type="checkbox"
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

  const handleChange = (name, student) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      [student]: e.target.value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submit', students);
    setState({ ...state, buttonText: 'Registering...' });
    // if (password !== confirmPassword) {
    //   setState({ ...state, error: "Passwords don't match" });
    //   // alert('passwords dont match')
    // } else {
    try {
      const response = await axios.put(
        `${API}/user/add`,
        {
          // name,
          // lastName,
          // email,
          // password,
          students,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('User update response', response);
      updateUser(response.data, () => {
        setState({
          ...state,
          // name: '',
          // email: '',
          // password: '',
          // confirmPassword: '',
          buttonText: 'Submitted',
          success: "You've successfully registered your students",
          // success: response.data.message,
        });
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: 'Register failed',
        error: error.response.data.error,
      });
    }
    // }
  };

  const registerForm = () => (
    <form
      onSubmit={handleSubmit}
      onKeyPress={(e) => {
        if (e.key === 'Enter') e.preventDefault();
      }}
      action="POST"
    >
      {/* <div className="text-muted">First Name</div> */}
      {/* <div className="form-group pt-2">
        <input
          value={name}
          onChange={handleChange('name')}
          type="text"
          className="form-control"
          placeholder="Enter your name"
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
          type="text"
          className="form-control"
          placeholder="Type your email"
          required
          // disabled
        />
      </div>
      {
        <Link href="/auth/password/change">
          <a className="text-danger float-right">Change Password</a>
        </Link>
      }
      <br /> */}
      {/* <div className="form-group">
        <input
          value={password}
          onChange={handleChange('password')}
          autoComplete='current-password'
          type="current-password"
          className="form-control"
          placeholder="password"
          // disabled
        />
      </div>
      <div className="form-group">
        <input
          value={confirmPassword}
          onChange={handleChange('confirmPassword')}
          type="password"
          className="form-control"
          placeholder="Repeat password"
          // required
        />
      </div> */}

      {/* <div className="text-muted">Student Name and School</div> */}

      <div className="row">
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
                  {/* {console.log(x)} */}

                  <div className="form-group pt-1">
                    <input
                      value={x.name}
                      data-index={i}
                      onChange={handleObjectNameChange()}
                      // onChange={handleChange({student: 'name'})}
                      type="text"
                      className="form-control"
                      placeholder="Student Name"
                      required
                    />
                  </div>
                  <div className="form-group pt-1">
                    <select
                      value={x.schoolName}
                      data-index={i}
                      onChange={handleObjectSchoolChange()}
                      // onChange={handleChange({student: 'name'})}
                      type="text"
                      defaultValue={''}
                      className="form-control"
                      placeholder="School student attends"
                      required
                    >
                      <option value="">Choose School</option>
                      <option value="BES">Brookside Elementary School</option>
                      <option value="OHES">Oak Hills Elementary School</option>
                      <option value="ROES">Red Oak Elementary School</option>
                      <option value="MCMS">Medea Creek Middle School</option>
                      <option value="OPHS">Oak Park High School</option>
                      <option value="OVHS">Oak View High School</option>
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
                    </div> */}
                  <div key={1} className="">
                    {addStudentGroup(i)}
                  </div>
                  <div key={2} className="">
                    {addTeacher(i)}
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

      {/* {console.log('student array in state', state.students)} */}

      <div className="form-group">
        <button
          type="text"
          onClick={(e) => addStudent(e)}
          className="btn btn-outline-primary "
        >
          {addButtonText}
        </button>
        {/* <div className=""> */}

        {!state.students.length < 1 && (
          <button
            className="btn btn-danger float-right"
            onClick={(e) => removeStudent(e)}
          >
            Remove
          </button>
        )}
        {/* </div> */}
        {/* {addStudent(i)} */}

        <div className="pt-4"></div>
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {!state.students.length < 1 && (
          <button type="text" className="btn btn-warning">
            {buttonText}
          </button>
        )}
      </div>
    </form>
  );

  // return (
  //   <Layout>
  //     <div className="pt-4"></div>
  //     <div className={styles.subcard}>
  //       {/* + "col-md-6 offset-md-3 subcard" */}
  //       <h2 className={styles.title}>Update Profile</h2>
  //       <br />
  //       {success && showSuccessMessage(success)}
  //       {error && showErrorMessage(error)}
  //       {updateForm()}
  //     </div>
  //   </Layout>
  // );
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
              <h4 className={'text-muted ' + styles.title}>Register Students for Meal Requests</h4>
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

// Profile.getInitialProps = () => {
//   loadGroups();
//   loadTeachers();
// }

export default withUser(Profile);