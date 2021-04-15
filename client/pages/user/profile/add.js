import Layout from '../../../components/Layout';
import Toggle from '../../../components/Toggle';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  showErrorMessage,
  showSuccessMessage,
  showMessageMessage,
} from '../../../helpers/alerts';
import { API } from '../../../config';
import styles from '../../../styles/Home.module.css';
import { updateUser } from '../../../helpers/auth';
import withUser from '../../withUser';
import Router from 'next/router';

const head = () => (
  <>
    {/* bootstrap */}
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
      crossOrigin="anonymous"
    />
    {/* progress bar cdn */}
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
      integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
      crossOrigin="anonymous"
    />
    {/* <link rel="stylesheet" href="../styles/Home.module.css"/> */}

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
      integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
      crossOrigin="anonymous"
    />
  </>
);

const Profile = ({ user, token }) => {
  const [state, setState] = useState({
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
    loadedCategories: [],
    categories: [], // categories selected by user for signup
    error: '',
    success: '',
    buttonText: 'Register',
    addButtonText: 'Add Student',
    special: { sendEmail: true, gfplus:false, vgplus: false, twothree: false },
    groups: [],
    teachers: [],
    loadedGroups: [],
    loadedTeachers: [],
  });

  const {
    special,
    showAllergies,
    addButtonText,
    students,
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
    loadGroups();
  }, []);

  useEffect(() => {
    localStorage.setItem('no-students', true);
  }, []);

  useEffect(() => {
    success === "You've successfully registered your students"
      ? setTimeout(() => {
          Router.push('/user');
        }, 2000)
      : console.log('add students');
  }, [success]);

  const loadGroups = async () => {
    const response = await axios.get(`${API}/groups`);
    const response2 = await axios.get(`${API}/teachers`);
    setState({
      ...state,
      loadedTeachers: response2.data,
      loadedGroups: response.data,
    });
  };

  const handleSelectGroupChange = (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
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
  };

  const addStudentGroup = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            value={students[i].group}
            data-index={i}
            onChange={(e) => handleSelectGroupChange(e)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">
              Curbside or Onsite?
            </option>
            <option value="distance-learning">Curbside Pickup</option>
            {students[i].foodAllergy.gluten === true ||
            students[i].foodAllergy.egg === true ||
            students[i].foodAllergy.dairy === true ||
            students[i].foodAllergy.soy === true ? (
              <option disabled value="a-group">
                Onsite Lunch - Cohort A
              </option>
            ) : (
              <option value="a-group">Onsite Lunch - Cohort A</option>
            )}
            {students[i].foodAllergy.gluten === true ||
            students[i].foodAllergy.egg === true ||
            students[i].foodAllergy.dairy === true ||
            students[i].foodAllergy.soy === true ? (
              <option disabled value="b-group">
                Onsite Lunch - Cohort B
              </option>
            ) : (
              <option value="b-group">Onsite Lunch - Cohort B</option>
            )}
          </select>
          <div className=""></div>
        </div>
      </div>
    </>
  );

  const addStudentGroupHS = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            value={students[i].group}
            data-index={i}
            onChange={(e) => handleSelectGroupChange(e)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">
              Curbside or Onsite?
            </option>
            <option value="distance-learning">Curbside Pickup</option>
            {students[i].foodAllergy.gluten === true ||
            students[i].foodAllergy.egg === true ||
            students[i].foodAllergy.dairy === true ||
            students[i].foodAllergy.soy === true ? (
              <option disabled value="a-group">
                Onsite Lunch
              </option>
            ) : (
              <option value="a-group">Onsite Lunch</option>
            )}
            {/*             
            {students[i].foodAllergy.gluten === true ||
            students[i].foodAllergy.egg === true ||
            students[i].foodAllergy.dairy === true ||
            students[i].foodAllergy.soy === true ? (
              <option disabled value="b-group">
                Onsite - Cohort B
              </option>
            ) : (
              <option value="b-group">Onsite - Cohort B</option>
            )} */}
          </select>
          <div className=""></div>
        </div>
      </div>
    </>
  );

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
  };

  const addBESTeacher = (i, x) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            data-index={i}
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
            data-index={i}
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
            <option value="4th-chobanian">4th - Chobanian</option>
            <option value="5th-bailey">5th - Bailey</option>
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
            data-index={i}
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
            data-index={i}
            onChange={(e) => handleSelectTeacherChange(e)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            <option value="6th-grade">6th </option>
            <option value="7th-grade">7th </option>
            <option value="8th-grade">8th </option>
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
            data-index={i}
            onChange={(e) => handleSelectTeacherChange(e)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            <option value="9th-grade">9th</option>
            <option value="10th-grade">10th </option>
            <option value="11th-grade">11th </option>
            <option value="12th-grade">12th </option>
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );
  const addOPISTeacher = (i, x) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            data-index={i}
            onChange={(e) => handleSelectTeacherChange(e)}
            className="form-control"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            <option value="k">K</option>
            <option value="1st-grade">1st</option>
            <option value="2nd-grade">2nd</option>
            <option value="3rd-grade">3rd</option>
            <option value="4th-grade">4th</option>
            <option value="5th-grade">5th</option>
            <option value="6th-grade">6th</option>
            <option value="7th-grade">7th</option>
            <option value="8th-grade">8th</option>
            <option value="9th-grade">9th</option>
            <option value="10th-grade">10th </option>
            <option value="11th-grade">11th </option>
            <option value="12th-grade">12th </option>
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
    list.splice(i, 1);
    setState({ ...state, students: list });
  };

  const handleToggle = (c) => () => {
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    setState({ ...state, categories: all, success: '', error: '' });
  };

  const handleObjectNameChange = (name) => (e) => {
    let i = e.target.getAttribute('data-index');

    let students = [...state.students]; // spreads array from mealRequest: [] into an array called meals
    let oneStudent = { ...students[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    oneStudent.name = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array

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

    setState({
      ...state,
      students: [...students],
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
      e.target.value === 'NON' ||
      e.target.value === 'DK' ||
      e.target.value === 'OPIS'
        ? 'distance-learning'
        : ''; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    students[i] = oneStudent; // puts meal[i] back into mealRequest array
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
    setState({ ...state, buttonText: 'Registering...' });
    try {
      const response = await axios.put(
        `${API}/user/add`,
        {
          students,
          categories,
          special,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem('no-students');
      updateUser(response.data, () => {
        setState({
          ...state,
          buttonText: 'Submitted',
          success: "You've successfully registered your students",
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
  };

  const handleAllergy = (name) => (e) => {
    let value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    let i = e.target.getAttribute('data-index');

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

    setState({ ...state, students: [...students] });
  };

  const handleShowAllergies = (e) => {
    let i = e.target.getAttribute('data-index');

    let allShow = [...state.showAllergies];

    let showOne = { ...allShow[i] };

    showOne.showAllergy = !showOne.showAllergy;

    allShow[i] = showOne;

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
                      Student #{`${i + 1}`} Information
                    </label>
                  </h6>

                  <div className="form-group pt-1">
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
                    <button
                      key={i}
                      data-index={i}
                      className="btn text-danger btn-outline-secondary float-right"
                      onClick={(e) => removeStudent(e)}
                    >
                      <i class="fas fa-user-times"></i>{' '}
                    </button>
                  }

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
                        ></Toggle>

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

                        {/* <Toggle
                          toggleKey={i}
                          dataIndex={i}
                          isOn={students[i].foodAllergy.soy}
                          toggleId="soy"
                          toggleName="Soy"
                          handleToggle={handleAllergy('soy')}
                        ></Toggle> */}

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
                    ? showMessageMessage(
                        'Curbside Pickup Only for this Food Allergy'
                      )
                    : students[i].foodAllergy.gluten === true
                    ? showMessageMessage(
                        'Curbside Pickup Only for this Food Allergy'
                      )
                    : students[i].foodAllergy.soy === true
                    ? showMessageMessage(
                        'Curbside Pickup Only for this Food Allergy'
                      )
                    : students[i].foodAllergy.egg === true &&
                      showMessageMessage(
                        'Curbside Pickup Only for this Food Allergy'
                      )}
                  <div className="form-group pt-3">
                    <select
                      value={students[i].schoolName}
                      data-index={i}
                      onChange={handleObjectSchoolChange()}
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
                      <option value="OPIS">Oak Park Independent School</option>
                      <option value="NON">Non OPUSD Student</option>
                    </select>
                  </div>

                  {students[i].schoolName != 'NON' &&
                    students[i].schoolName != 'DK' &&
                    students[i].schoolName != 'OVHS' &&
                    students[i].schoolName != 'OPIS' &&
                    students[i].schoolName != 'OPHS' && (
                      <div key={i + 14} className="">
                        {addStudentGroup(i)}
                      </div>
                    )}
                  {students[i].schoolName == 'OPHS' && (
                    <div key={i + 14} className="">
                      {addStudentGroupHS(i)}
                    </div>
                  )}
                  {students[i].schoolName == 'OVHS' && (
                    <div key={i + 14} className="">
                      {addStudentGroupHS(i)}
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

                  {x.schoolName === 'OPIS' && addOPISTeacher(i, x)}

                  {students[i].schoolName === 'DK' && (
                    <div className="form-group pt-1">
                      <input
                        value={x.age}
                        data-index={i}
                        onChange={handleObjectAgeChange()}
                        type="text"
                        className="form-control"
                        placeholder="Age"
                        required={true}
                      />
                      <div className="p-2"></div>

                      {showMessageMessage('Curbside Pickup Only for Preschool')}
                    </div>
                  )}
                  {students[i].schoolName === 'NON' && (
                    <div className="form-group pt-1">
                      <input
                        value={x.age}
                        data-index={i}
                        onChange={handleObjectAgeChange()}
                        type="text"
                        className="form-control"
                        placeholder="Age (must be under 18)"
                        required={true}
                      />
                      <div className="p-2"></div>

                      {showMessageMessage('Curbside Pickup Only for Non OPUSD')}
                    </div>
                  )}
                  <hr className={'p-2 ' + styles.hrstudents} />
                </div>
              );
            })}
        </div>
      </div>

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

        <div className="pt-4"></div>
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {!state.students.length < 1 && (
          <button type="text" className="btn btn-warning">
            <i class="far fa-folder-open"></i> &nbsp;
            {buttonText}
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div className={styles.background}>
      {/* <Layout> */}
      {head()}
      <div className={styles.body}>
        <div className="pt-5 pb-2"></div>

        <div className="col-md-6 offset-md-3 pt-4">
          <div className={styles.subcard}>
            <h4 className={'text-muted ' + styles.title}>
              Register Students for Meal Requests
            </h4>
            <br />
            {registerForm()}
          </div>
        </div>
      </div>
      {/* </Layout> */}
      {/* {head()} */}
      <div className="p-5"></div>
    </div>
  );
};

export default withUser(Profile);
