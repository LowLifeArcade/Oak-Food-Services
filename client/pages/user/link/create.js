import styles from '../../../styles/Home.module.css';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { getCookie, isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import axios from 'axios';
import withUser from '../../withUser';
import moment from 'moment';
import Router from 'next/router';
// import Datepicker from '../../../components/Datepicker';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Create = ({ token, user }) => {
  const username = user.username;
  // const userCode = user.userCode
  const [showSearch, setShowSearch] = useState(false);
  // const [orderStatus, setOrderStatus] = useState(true)

  // state
  const [state, setState] = useState({
    mealRequest: [
      {
        meal: 'Standard',
        student: user.students[0]._id,
        studentName: user.students[0].name,
        schoolName: user.students[0].schoolName,
        group: user.students[0].group,
        teacher: user.students[0].teacher,
        pickupOption: 'Breakfast and Lunch',
        foodAllergy: user.students[0].foodAllergy,
        complete: false,
      },
    ],
    orderStatus: false,
    pickupCode: user.userCode + '-01',
    pickupCodeAdd: [''],
    pickupDate: '', //moment("2021-02-16").format('MM dd'), // get a state.pickupDate from a get request maybe from a created menu
    pickupOption: 'Breakfast and Lunch',
    pickUpTime: '',
    mealWeek: '',
    buttonText: 'Request',
    // title: '',
    // url: '',
    // categories: [],
    // loadedCategories: [],
    success: '',
    error: '',
    students: user.students,
    // type: '',
    // medium: '',
  });

  const {
    studentName,
    onsiteMealRequest,
    pickupCode,
    orderStatus,
    students,
    pickupCodeAdd,
    pickupDate,
    mealRequest,
    // pickupOption,
    pickupTime,
    title,
    url,
    // categories,
    // loadedCategories,
    success,
    error,
    type,
    medium,
  } = state;
  // console.log(user.students);
  // load categories when component mounts useing useEffect
  useEffect(() => {
    // const timer = setTimeout()
    // loadCategories();
    // loadStudents()
    //  Router.push('user')
    success === 'Request was created'
      ? setTimeout(() => {
          Router.push('/user');
        }, 2000)
      : Router.push('');
    return () => clearTimeout();
  }, [success]);

  // useEffect(() => {
  //     // if mealRequest.student.id === cohort a || cohort b
  //     // const onsiteMealRequest =  {mealRequest: mealRequest.meal, student: mealRequest.student, complete: false }
  //     setState({...state,
  //       mealRequest1: {mealRequest: mealRequest[0].meal, student: mealRequest[0].student, complete: false },
  //     })
  // }, [mealRequest[0]])

  console.log(user.students[0].group);

  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDate: moment(pickupDate).format('l') });
    setShowSearch(!showSearch);
  };

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;
  // date.getDay() !== 2

  // meal request select
  const handleSelectChange = (
    e,
    student,
    studentName,
    schoolName,
    group,
    teacher
  ) => {
    let i = e.target.getAttribute('data-index');

    let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
    let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at

    // console.log(pickupCodeAdd)

    let input = e.target.value;
    let frontCode = '';
    let pickupOptionLO = '';
    switch (input) {
      case 'Vegetarian':
        frontCode = 'Vt';
        pickupOptionLO = state.mealRequest[i].pickupOption;
        break;
      case 'Vegan':
        frontCode = 'Vg';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'GlutenFree':
        frontCode = 'Gf';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Standard':
        frontCode = '';
        pickupOptionLO = state.mealRequest[i].pickupOption;
        break;
      case 'None':
        frontCode = 'None';
        // console.log('gf')
        break;

      default:
        break;
    }
    // console.log(frontCode)

    code = frontCode; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    codes[i] = code;

    let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
    let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    meal.meal = e.target.value;
    meal.student = student;
    meal.studentName = studentName;
    meal.group = group;
    meal.teacher = teacher;
    meal.pickupOption = pickupOptionLO;

    meals[i] = meal; // puts meal[i] back into mealRequest array

    setState({
      ...state,
      mealRequest: [...meals],
      buttonText: 'Request',
      // pickupCode: newPickupCode,
      pickupCodeAdd: codes,
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
    // setState({...state,
    //   mealRequest: [...mealRequest, {meal: e.target.value}]});
    // console.log(e.target.getAttribute("data-index"))
    // setState({...state, pickupCode: user.userCode})
    // console.log(codes)
  };
  console.log('code add', pickupCodeAdd);
  // console.log(state.pickupCodeAdd)
  // console.log(user)
  const selectMealRequest = (
    i,
    student,
    studentName,
    schoolName,
    group,
    teacher
  ) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            data-index={i}
            defaultValue={'Standard'}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) =>
              handleSelectChange(
                e,
                student,
                studentName,
                schoolName,
                group,
                teacher
              )
            }
            className="form-control"
          >
            {' '}
            <option value="">Choose an option</option>
            <option value={'Standard'}>Standard</option>
            <option value={'Vegetarian'}>Vegetarian</option>
            <option value={'Vegan'}>Vegan (lunch only)</option>
            <option value={'GlutenFree'}>Gluten Free (lunch only)</option>
            <option value={'None'}>None</option>
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  // pickup options(all, breakfast only, lunch only) select
  const handlePickupOption = (i, e) => {
    let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
    let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    meal.pickupOption = e.target.value;

    meals[i] = meal;

    setState({
      ...state,
      mealRequest: [...meals],
      buttonText: 'Request',
      success: '',
      error: '',
    });
  };

  console.log('pickup option', mealRequest[0].pickupOption);
  const selectPickupOption = (i) => (
    <>
      <div key={i} className="form-group">
        {/* <div className=""> */}
        <select
          type="select"
          defaultValue={state.mealRequest[i].pickupOption}
          value={state.mealRequest[i].pickupOption}
          // value='Breakfast and Lunch'
          data-index={i}
          onChange={(e) => handlePickupOption(i, e)}
          className="form-control"
        >
          {' '}
          <option selected value={'Breakfast and Lunch'}>
            Breakfast and Lunch
          </option>
          <option value={'Breakfast Only'}>Breakfast Only</option>
          <option value={'Lunch Only'}>Lunch Only</option>
          <option value={'Breakfast Distance Lunch Onsite'}>
            Breakfast (Distance)/Lunch (Onsite)
          </option>
        </select>
        <div className="p-2"></div>
        {/* </div> */}
      </div>
    </>
  );
  const selectPickupLunchOnlyOption = (i) => (
    <>
      <div key={i} className="form-group">
        {/* <div className=""> */}
        <select
          type="select"
          defaultValue={state.mealRequest[i].pickupOption}
          value="Breakfast and Lunch"
          data-index={i}
          onChange={(e) => handlePickupOption(i, e)}
          className="form-control"
        >
          {' '}
          <option selected value={'Lunch Only'}>
            Lunch Only
          </option>
        </select>
        <div className="p-2"></div>
        {/* </div> */}
      </div>
    </>
  );

  // pickup times select
  const handlePickupTimeChange = (e) => {
    setState({
      ...state,
      pickupTime: e.target.value,
      buttonText: 'Request',
      success: '',
      error: '',
    });
  };

  const selectPickupTime = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            data-index={i}
            onChange={(e) => handlePickupTimeChange(e)}
            className="form-control"
          >
            {' '}
            <option value="">Choose an option</option>
            <option value={'7am-9am'}>7am-9am</option>
            <option value={'11am-1pm'}>11am-1pm</option>
            <option value={'4pm-6pm'}>4pm-6pm</option>
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  // add meal button
  const addMeal = (student, studentName, schoolName, group, teacher) => {
    setState({
      ...state,
      mealRequest: [
        ...mealRequest,
        {
          meal: 'Standard',
          student: student,
          studentName: studentName,
          schoolName: schoolName,
          group: group,
          teacher: teacher,
          complete: false,
        },
      ],
      pickupCodeAdd: [...pickupCodeAdd, ''],
    });
  };
  // console.log(pickupCodeAdd)

  // remove meal button
  const removeMeal = (index) => {
    const list = [...state.mealRequest];
    // console.log(list);
    list.splice(-1)[0];
    // list.splice(index, 1);

    const list2 = [...state.pickupCodeAdd];
    // console.log(list);
    list2.splice(-1)[0];
    setState({ ...state, mealRequest: list, pickupCodeAdd: list2 });
    // list.splice(index, 1);
    // setState({ ...state, pickupCodeAdd: list2 });
  };

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  // const loadStudents = async () => {
  //   const response = await axios.get(`${API}/user`);
  //   setState({ ...state, student: [...response.data.student] });
  // };

  const handleTitleChange = async (e) => {
    setState({ ...state, title: e.target.value, error: '', success: '' });
  };

  const yesterday = [moment().subtract(1, 'day')];
  // const disablePastDt = (current) => {
  //   return current.isAfter(yesterday);
  // }

  // handles lead time for orders
  let twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 12);
  // console.log(pickupCodeAdd)

  const submit = () => {
    // mealRequest.forEach((meal) => {
    //     if(meal.meal === 'None'){
    //       // delete meal
    //       console.log(meal)
    //       mealRequest.splice(meal,1)
    //     }
    // })

    const mealRequestNew = mealRequest.filter((meal) => meal.meal != 'None');
    const newPickupCodeAdd = pickupCodeAdd.filter((code) => code != 'None');
    console.log(mealRequestNew);
    console.log('code to add array', newPickupCodeAdd);
    // pickupCodeAdd.forEach((code) => {
    //     if(code === 'None'){
    //       // delete meal
    //       console.log(code)
    //       pickupCodeAdd.splice(code,1)
    //     }
    // })

    let length = newPickupCodeAdd.length;

    // let newFrontCode = codes
    let newPickupCode =
      newPickupCodeAdd.join('') + '-' + user.userCode + '-0' + length;

    setState({
      ...state,
      pickupCode: newPickupCode,
      mealRequest: mealRequestNew,
      pickupCodeAdd: newPickupCodeAdd,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({title, url, categories, type, medium})
    // const toAddCode = user.userCode
    // const newCode = user.userCode + '_0' + toString(mealRequest.length)

    // let NewPickupCode = pickupCodeAdd + pickupCode

    // pickupCode = NewPickupCode
    // newCodeMaker()
    // console.log(pickupCode)
    try {
      const response = await axios.post(
        `${API}/link`,
        {
          mealRequest,
          pickupOption,
          pickupTime,
          pickupDate,
          username,
          pickupCode,
          pickupCodeAdd,
          orderStatus,
        },
        // { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // const response2 = await axios.post(
      //   `${API}/individual-link`,
      //   {mealRequest},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      // reset state
      setState({
        ...state,
        success: 'Request was created',
        error: '',
      });
      // .then(Router.push('/user'))
    } catch (error) {
      // console.log('LINK SUBMIT ERROR', error);
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
  const submitLinkForm = (student) => (
    <form onSubmit={handleSubmit}>
      {/* <div className="form-group">
        <label htmlFor="" className="text-muted">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          onChange={handleTitleChange}
          value={title}
        />
      </div> */}
      {/* <div className="form-group">
        <label htmlFor="" className="text-muted">
          Meal Options
        </label>
        {selectPickupOption()}
      </div> */}

      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Pickup Time
        </label>
        {selectPickupTime()}
      </div>

      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      <div>
        <button
          disabled={!token}
          className="btn btn-outline-warning"
          onClick={submit}
          type="submit"
        >
          {isAuth() || token ? state.buttonText : 'Login to Make Request'}
        </button>
      </div>

      {/* <div className="form-group">
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
       */}
    </form>
  );

  return (
    <div
      className={styles.background}
      style={
        {
          // background: '#eeeff0'
        }
      }
    >
      <Layout>
        <div className="col-md-6 offset-md-3 pt-4">
          <div className={styles.subcard}>
            <div className="row">
              <div className="col-md-12">
                <h3>
                  Meal Request for:{' '}
                  {pickupDate && moment(state.pickupDate).format('MMM Do')}{' '}
                </h3>
                {showSearch && (
                  <Calendar
                    onChange={(e) => onDateChange(e)}
                    tileDisabled={handleDisabledDates}
                    defaultValue={twoWeeksFromNow}
                    // tileDisabled={(date, view) =>
                    //   yesterday.some(date =>
                    //      moment().isAfter(yesterday)
                    //   )}
                    // minDate={handlePastDate}
                    minDate={twoWeeksFromNow}
                    // minDate={new Date().getDate() + 14}

                    value={''}
                  />
                )}
                <br />
                {/* // <input
                  // type="date"
                  // defaultValue={moment(state.pickupDate).format(
                    //   'dddd, MMMM Do '
                    //   )}
                  //   /> */}

                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  Select Date
                </button>

                <br />
                {/* {`${moment(state.pickupDate).format('dddd, MMMM Do ')}`}{' '} */}
                <br />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                {state.mealRequest.map((x, i) => {
                  return (
                    <>
                      <div>
                        <label key={i} className="text-muted">
                          Select meal for {`${state.students[i].name}`}
                        </label>
                      </div>
                      <div key={i} className="">
                        {selectMealRequest(
                          i,
                          state.students[i]._id,
                          state.students[i].name,
                          state.students[i].schoolName,
                          state.students[i].group,
                          state.students[i].teacher
                        )}
                      </div>
                      {x.meal === 'GlutenFree' || x.meal === 'Vegan'
                        ? selectPickupLunchOnlyOption(i)
                        : selectPickupOption(i)}
                      {/* <div className="form-group"> */}
                      {/* <label htmlFor="" className="text-muted">
                          Meal Options
                        </label> */}
                      {/* </div> */}
                      {/* {console.log('student info', state.students[i])} */}
                    </>
                  );
                })}
                <div className="">
                  {state.mealRequest.length < state.students.length && (
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        state.mealRequest.map((x, i) =>
                          addMeal(
                            state.students[`${i + 1}`]._id,
                            state.students[`${i + 1}`].name,
                            state.students[`${i + 1}`].schoolName,
                            state.students[`${i + 1}`].group,
                            state.students[`${i + 1}`].teacher
                          )
                        )
                      }
                    >
                      Add Meal
                    </button>
                  )}

                  {state.mealRequest.length !== 1 && (
                    <button
                      className="btn btn-warning float-right"
                      onClick={() => removeMeal()}
                    >
                      Remove Meal
                    </button>
                  )}
                  {/* {console.log(mealRequest)} */}
                </div>
                {/* {console.log(mealRequest)} */}
              </div>
              <div className="col-md-6 p-3">
                {/* {success && showSuccessMessage(success)}
              {error && showErrorMessage(error)} */}
                {submitLinkForm()}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

Create.getInitialProps = ({ req, user }) => {
  const token = getCookie('token', req);
  return { token, user };
};

export default withUser(Create);
// export default withUser(Create)
