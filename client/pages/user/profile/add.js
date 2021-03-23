import Layout from '../../../components/Layout';
import Toggle from '../../../components/Toggle';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import styles from '../../../styles/Home.module.css';
import { isAuth, updateUser } from '../../../helpers/auth';
import withUser from '../../withUser';
import Link from 'next/link';
import Router from 'next/router';

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
    students: [
      {
        name: '',
        schoolName: '',
        group: '',
        teacher: '',
        foodAllergy: {
          peanuts: false,
          treeNuts: false,
          dairy: false,
          gluten: false,
          egg: false,
          sesame: false,
          soy: false,
          seafood: false,
        },
        age: '',
      },
    ],
    showAllergies: [{ showAllergy: false }],
    // showAllergies: [{student: false, student2: false, student3: false, student4: false, student5: false, }],
    loadedCategories: [],
    categories: [], // categories selected by user for signup
    // categories: user.categories, // categories selected by user for signup
    groups: [],
    teachers: [],
    loadedGroups: [],
    loadedTeachers: [],
  });
  // console.log(user)

  // useEffect(() => {
  //   isAuth() && Router.push('/');
  // }, []);

  const {
    showAllergies,
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
    loadedTeachers,
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
          Router.push('/user');
        }, 2000)
      : console.log('add students');
  }, [success]);

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
    setState({
      ...state,
      loadedTeachers: response2.data,
      loadedGroups: response.data,
    });
  };

  // const loadCategories = async () => {
  //   const response = await axios.get(`${API}/categories`);
  //   setState({ ...state, loadedCategories: response.data });
  // };

  // console.log('loaded groups', loadedGroups);
  // const loadTeachers = async () => {
  //   const response = await axios.get(`${API}/teachers`);
  //   // console.log(response.data)
  //   setState({ ...state, loadedTeachers: response.data });
  // };
  // console.log('loaded teachers', loadedTeachers);

  // student add select THIS is where things are going to be tricky
  const handleSelectGroupChange = (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    // console.log('group student', students);
    oneStudent.group = e.target.value;
    oneStudent.age = ''; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array
    setState({
      ...state,
      students: [...students],
      categories: [...categories, e.target.value],
      buttonText: 'Register',
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
    // setState({...state,
    //   mealRequest: [...mealRequest, {meal: e.target.value}]});
    // console.log(e.target.getAttribute("data-index"))
  };
  // console.log('categories added',categories)

  const addStudentGroup = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            value={students[i].group}
            data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) => handleSelectGroupChange(e)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Cohort
            </option>
            <option value="distance-learning">
              Distance Learning (pickup)
            </option>
            {students[i].foodAllergy.gluten === true ||
            students[i].foodAllergy.egg === true ||
            students[i].foodAllergy.dairy === true ||
            students[i].foodAllergy.soy === true ? (
              <option disabled value="a-group">
                A (onsite)
              </option>
            ) : (
              <option value="a-group">A (onsite)</option>
            )}
            {students[i].foodAllergy.gluten === true ||
            students[i].foodAllergy.egg === true ||
            students[i].foodAllergy.dairy === true ||
            students[i].foodAllergy.soy === true ? (
              <option disabled value="b-group">
                B (onsite)
              </option>
            ) : (
              <option value="b-group">B (onsite)</option>
            )}
            {/* {state.loadedGroups.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
            {/* {console.log(students[i].foodAllergy.hasOwnProperty({gluten: false}))} */}
            {/* {console.log(students[i].foodAllergy.gluten === true)}
            {console.log(students[i].foodAllergy)} */}
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

  const addBESTeacher = (i, x) => (
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
            <option selected disabled value="">
              Choose Teacher
            </option>
            ,<option value="k-annino/lee">K - Annino/Lee</option>
            <option value="k-milbourn">K - Milbourn</option>
            <option value="1st-hirano">1st - Hirano</option>
            <option value="1st-morrow">1st - Morrow</option>
            <option value="2nd-watson">2nd - Watson</option>
            <option value="2nd-gerin">2nd - Gerin</option>
            <option value="3rd-squire">3rd - Squire</option>
            <option value="3rd-altman">3rd - Altman</option>
            <option value="3rd-rosenblum">3rd - Rosenblum</option>
            <option value="4th-keane">4th - Keane</option>
            <option value="4th-farlow">4th - Farlow</option>
            <option value="5th-stephens">5th - Stephens</option>
            <option value="5th-becker">5th - Becker</option>
            <option value="5th-powers">5th - Powers</option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  const addOHESTeacher = (i, x) => (
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
            <option selected disabled value="">
              Choose Teacher
            </option>
            ,<option value="k-sloan">K - Sloan</option>
            <option value="k-foy">K - Foy</option>
            <option value="1st-aaronson">1st - Aaronson</option>
            <option value="1st-bretzing">1st - Bretzing</option>
            <option value="2nd-lieberman">2nd - Lieberman</option>
            <option value="2nd-ruben">2nd - Ruben</option>
            <option value="3rd-arnold">3rd - Arnold</option>
            <option value="4th-lockrey">4th - Lockrey</option>
            {/* <option value="4th-farlow">4th - Farlow</option> */}
            <option value="4th-chobanian">4th - Chobanian</option>
            <option value="5th-bailey">5th - Bailey</option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  const addROESTeacher = (i, x) => (
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
            <option selected disabled value="">
              Choose Teacher
            </option>
            ,<option value="k-lobianco">K - LoBianco</option>
            <option value="1st-bird">1st - Bird</option>
            <option value="1st-ewing">1st - Ewing</option>
            <option value="1st-holland">1st - Holland</option>
            <option value="2nd-mcdowell">2nd - McDowell</option>
            <option value="2nd-share">2nd - Share</option>
            <option value="3rd-cantillon">3rd - Cantillon</option>
            <option value="3rd-strong">3rd - Strong</option>
            <option value="4th-duffy">4th - Duffy</option>
            <option value="4th-matthews">4th - Matthews</option>
            <option value="5th-bodily">5th - Bodily</option>
            <option value="5th-cass">5th - Cass</option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );
  const addMCMSTeacher = (i, x) => (
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
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="6th-grade">6th </option>
            <option value="7th-grade">7th </option>
            <option value="8th-grade">8th </option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  const addOPHSTeacher = (i, x) => (
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
            <option selected disabled value="">
              Choose Grade Level
            </option>
            -grade ,<option value="9th-grade">9th</option>
            <option value="10th-grade">10th </option>
            <option value="11th-grade">11th </option>
            <option value="12th-grade">12th </option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  // const addOODTeacher = (i, x) => (
  //   <>
  //     <div key={i} className="form-group">
  //       <div className="">
  //         <select
  //           type="select"
  //           // value={state.value}
  //           data-index={i}
  //           // defaultValue={''}
  //           // defaultValue={state.mealRequest[0].meal}
  //           onChange={(e) => handleSelectTeacherChange(e)}
  //           className="form-control"
  //         >
  //           {' '}
  //           <option selected disabled value="">
  //             Choose Grade Level
  //           </option>
  //           ,<option value="9th">9th</option>
  //           <option value="10th">10th </option>
  //           <option value="11th">11th </option>
  //           <option value="12th">12th </option>
  //           {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
  //             return <option value={g._id}>{g.name}</option>;
  //             // return <option value={g._id}>{g.name}</option>;
  //           })} */}
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
      students: [
        ...students,
        {
          name: '',
          schoolName: '',
          group: '',
          teacher: '',
          foodAllergy: {
            peanuts: false,
            treeNuts: false,
            dairy: false,
            gluten: false,
            egg: false,
            sesame: false,
            soy: false,
            seafood: false,
          },
          age: '',
        },
      ],
      showAllergies: [
        ...showAllergies,
        {
          showAllergy: false,
        },
      ],
    });
  };

  // remove meal button
  const removeStudent = (e) => {
    let i = e.target.getAttribute('data-index');
    e.preventDefault();

    const list = [...state.students];
    // console.log(list);
    list.splice(i, 1);
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
  const handleObjectAllergyChange = (name) => (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.foodAllergy = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    oneStudent.group = e.target.value === 'gluten' && '';
    students[i] = oneStudent; // puts meal[i] back into mealRequest array

    console.log('group', students[i].group);
    // setState({
    //   ...state,
    //   student: [...students],
    //   buttonText: 'Register',
    //   success: '',
    //   error: '',
    // });

    setState({
      ...state,
      students: [...students],
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };

  const handleObjectAgeChange = (age) => (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.age = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
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
    oneStudent.schoolName = e.target.value;
    oneStudent.teacher = '';
    oneStudent.age = '';
    oneStudent.group =
      e.target.value === 'NON' || e.target.value === 'DK'
        ? 'distance-learning'
        : ''; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
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
    // console.log('submit', students);
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
          categories,
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

  const handleAllergy = (name) => (e) => {
    let value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    let i = e.target.getAttribute('data-index');
    // console.log('let students value', e.target);

    let students = [...state.students];
    let oneStudent = { ...students[i] };
    oneStudent.foodAllergy[name] = value;
    oneStudent.foodAllergy.gluten === true ||
    oneStudent.foodAllergy.egg === true ||
    oneStudent.foodAllergy.dairy === true ||
    oneStudent.foodAllergy.soy === true
      ? (oneStudent.group = 'distance-learning')
      : null;
    students[i] = oneStudent;
    console.log('group', students[i].group);

    setState({ ...state, students: [...students] });
  };

  const handleShowAllergies = (e) => {
    let i = e.target.getAttribute('data-index');

    let allShow = [...state.showAllergies];

    let showOne = { ...allShow[i] };

    showOne.showAllergy = !showOne.showAllergy;

    allShow[i] = showOne;
    // console.log(allShow);

    setState({ ...state, showAllergies: [...allShow] });
  };

  const registerForm = () => (
    <form
      onSubmit={handleSubmit}
      onKeyPress={(e) => {
        if (e.key === 'Enter') e.preventDefault();
      }}
      action="POST"
    >
      <div className="row">
        <div className="col-md-12 pt-2">
          {state.students
            .slice(0)
            // .reverse()
            .map((x, i) => {
              return (
                <div key={i}>
                  <h6 className="p-2">
                    <label key={i} className="form-check-label text-muted">
                      Student # {`${i + 1}`} information
                    </label>
                  </h6>

                  <div className="form-group pt-1">
                    {/* <div className="form-group">
                      <label htmlFor="" className="form-check-label text-muted">
                        Student's Full Name
                      </label>
                    </div> */}
                    <input
                      key={i + 3}
                      value={x.all}
                      data-index={i}
                      onChange={handleObjectNameChange()}
                      // onChange={handleChange({student: 'name'})}
                      type="text"
                      className="form-control"
                      placeholder="Student's Full Name"
                      required
                    />
                  </div>
                  {/* <label htmlFor="" className="form-check-label text-muted">
                        Food Allergies (Only)
                      </label> */}
                  {/* <div className="form-group pt-1">
                    <input
                      value={x.foodAllergy}
                      data-index={i}
                      onChange={handleObjectAllergyChange()}
                      // onChange={handleChange({student: 'name'})}
                      type="text"
                      className="form-control"
                      placeholder="List Food Allergies (Only)"
                    />
                  </div> */}

                  {/* <div className="toggle-container">
                    <input type="checkbox" id="allergy" className="toggle" />
                    <label htmlFor="" className="label">
                      <div className="ball"></div>
                    </label>
                    <span>&nbsp; Peanutes</span>
                  </div> */}

                  {/* <h6 key={i} className="form-control"> */}
                  <label
                    data-index={i}
                    onClick={(e) => handleShowAllergies(e)}
                    className="form btn-sm btn-outline-muted  "
                  >
                    &nbsp;&nbsp;Food Allergies? &nbsp;
                    <i
                      data-index={i}
                      onClick={(e) => handleShowAllergies(e)}
                      class="far fa-arrow-alt-circle-down"
                    ></i>
                  </label>

                  {
                    // students.length > 1 &&
                    <button
                      key={i}
                      data-index={i}
                      className="btn text-danger btn-outline-secondary float-right"
                      onClick={(e) => removeStudent(e)}
                    >
                      <i class="fas fa-user-times"></i>{' '}
                    </button>
                  }
                  {/* </h6> */}

                  {/* <div className={styles.toggleContainer}> */}
                  {/* <input
                          key={i}
                          data-index={i}
                          type="checkbox"
                          id={'peanuts' + [i]}
                          onChange={handleAllergy('peanuts')}
                          className={styles.toggle}
                          checked={students[i].foodAllergy.peanuts}
                        />
                          <label data-index={i} htmlFor={'peanuts'+ [i]} className={styles.label}>
                          <div className={styles.ball}></div>
                        </label>
                        <span
                        data-index={i}
                          className="text-secondary"
                          className={styles.toggleName}
                        >
                          {' '}
                          {'Peanutes'}
                        </span> */}
                  {/* </div> */}

                  {showAllergies[i].showAllergy && (
                    <div className="form-control ">
                      <div className="row p-1">
                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.peanuts}
                          toggleId="peanuts"
                          toggleName="Peanuts"
                          handleToggle={handleAllergy('peanuts')}
                          // indexIs={getIndex}
                        ></Toggle>

                        {/* <button key={i} > test + `${i}` </button> */}
                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.treeNuts}
                          toggleId="treenuts"
                          toggleName="Tree Nuts"
                          handleToggle={handleAllergy('treeNuts')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.dairy}
                          toggleId="dairy"
                          toggleName="Dairy"
                          handleToggle={handleAllergy('dairy')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.gluten}
                          toggleId="gluten"
                          toggleName="Gluten"
                          handleToggle={handleAllergy('gluten')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.egg}
                          toggleId="egg"
                          toggleName="Egg"
                          handleToggle={handleAllergy('egg')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.sesame}
                          toggleId="sesame"
                          toggleName="Sesame"
                          handleToggle={handleAllergy('sesame')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.soy}
                          toggleId="soy"
                          toggleName="Soy"
                          handleToggle={handleAllergy('soy')}
                        ></Toggle>

                        <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.seafood}
                          toggleId="seafood"
                          toggleName="Seafood"
                          handleToggle={handleAllergy('seafood')}
                        ></Toggle>
                      </div>
                    </div>
                  )}
                  {students[i].foodAllergy.dairy === true
                    ? showSuccessMessage(
                        'Curbside pickup only for your allergy group'
                      )
                    : students[i].foodAllergy.gluten === true
                    ? showSuccessMessage(
                        'Curbside pickup only for your allergy group'
                      )
                    : students[i].foodAllergy.soy === true
                    ? showSuccessMessage(
                        'Curbside pickup only for your allergy group'
                      )
                    : students[i].foodAllergy.egg === true &&
                      showSuccessMessage(
                        'Curbside pickup only for your allergy group'
                      )}
                  {/* <hr /> */}
                  <div className="form-group pt-3">
                    <select
                      value={students[i].schoolName}
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
                      <option value="DK">Preschool</option>
                      <option value="BES">Brookside Elementary School</option>
                      <option value="OHES">Oak Hills Elementary School</option>
                      <option value="ROES">Red Oak Elementary School</option>
                      <option value="MCMS">Medea Creek Middle School</option>
                      <option value="OPHS">Oak Park High School</option>
                      <option value="OVHS">Oak View High School</option>
                      <option value="NON">Non OPUSD Student</option>
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
                  {students[i].schoolName != 'NON' &&
                    students[i].schoolName != 'DK' &&
                    students[i].schoolName != 'OVHS' && (
                      <div key={i + 14} className="">
                        {addStudentGroup(i)}
                      </div>
                    )}
                  {students[i].schoolName != 'NON' &&
                    students[i].group != 'distance-learning' && (
                      <div key={i + 15} className="">
                        {x.schoolName === 'BES' && addBESTeacher(i, x)}
                        {x.schoolName === 'OHES' && addOHESTeacher(i, x)}
                        {x.schoolName === 'ROES' && addROESTeacher(i, x)}
                        {x.schoolName === 'MCMS' && addMCMSTeacher(i, x)}
                        {x.schoolName === 'OPHS' && addOPHSTeacher(i, x)}
                        {x.schoolName === 'OVHS' && addOPHSTeacher(i, x)}
                        {x.schoolName === 'NON' ||
                          (x.schoolName === 'DK' && (
                            <div className="form-group pt-1">
                              <input
                                value={x.age}
                                data-index={i}
                                onChange={handleObjectAgeChange()}
                                // onChange={handleChange({student: 'name'})}
                                type="text"
                                className="form-control"
                                placeholder="Age (must be under 18)"
                                required={true}
                              />
                            </div>
                          ))}
                      </div>
                    )}

                  {students[i].schoolName === 'DK' && (
                    <div className="form-group pt-1">
                      <input
                        value={x.age}
                        data-index={i}
                        onChange={handleObjectAgeChange()}
                        // onChange={handleChange({student: 'name'})}
                        type="text"
                        className="form-control"
                        placeholder="Age"
                        required={true}
                      />
                    </div>
                  )}
                  {students[i].schoolName === 'NON' && (
                    <div className="form-group pt-1">
                      <input
                        value={x.age}
                        data-index={i}
                        onChange={handleObjectAgeChange()}
                        // onChange={handleChange({student: 'name'})}
                        type="text"
                        className="form-control"
                        placeholder="Age (must be under 18)"
                        required={true}
                      />
                    </div>
                  )}

                  {/* <div className="form-group">
        <label className="text-muted ml-3"> Student Group </label>

        <ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>
          {showGroups()}
        </ul>
      </div> */}
                </div>
              );
            })}
        </div>
      </div>

      {/* {console.log('student array in state', state.students)} */}

      <div className="form-group">
        {students.length < 5 && (
          <button
            type="text"
            onClick={(e) => addStudent(e)}
            className={'btn text-dark btn-outline-secondary'}
          >
            <i class="fas fa-graduation-cap"></i> &nbsp;
            {addButtonText}
          </button>
        )}
        {/* <div className=""> */}

        {/* {students.length > 1 && (
          <button
            className="btn text-danger btn-outline-secondary float-right"
            onClick={(e) => removeStudent(e)}
          >
            <i class="fas fa-user-times"></i>{' '}
          </button>
        )} */}
        {/* </div> */}
        {/* {addStudent(i)} */}

        <div className="pt-4"></div>
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {!state.students.length < 1 && (
          <button type="text" className="btn btn-warning">
            <i className="far fa-paper-plane"></i> &nbsp;
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
              <h4 className={'text-muted ' + styles.title}>
                Register Students for Meal Requests
              </h4>
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
