// imports
import styles from '../../../styles/Home.module.css';
import moment from 'moment';
import Router from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import withUser from '../../withUser';
import { getCookie, isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import axios from 'axios';

const Update = ({ oldLink, token, user, _id }) => {
  // state
  // console.log('old link data from user[id]', oldLink);
  const [state, setState] = useState({
    mealRequest: oldLink.mealRequest,
    // mealRequest: [
    //   {
    //     meal: 'Standard',
    //   },
    // ],
    // students: oldLink.students,
    mealRequest: oldLink.mealRequest,
    pickupTime: oldLink.pickupTime,
    pickupOption: oldLink.pickupOption,
    pickupDate: oldLink.pickupDate,
    buttonText: 'Update',
    pickupCode: user.userCode + '-01',
    pickupCodeAdd: oldLink.pickupCodeAdd,
    mealWeek: oldLink.pickupWeek,
    success: '',
    error: '',
    students: user.students,
  });

  const {
    pickupOption,
    pickupTime,
    mealRequest,
    pickupDate,
    pickupCode,
    students,
    pickupCodeAdd,
    title,
    url,
    success,
    error,
    type,
    medium,
  } = state;

  // const username = user.username;
  // const userCode = user.userCode
  const [showSearch, setShowSearch] = useState(false);
  // console.log(oldLink)

  //   useEffect(() => {
  //    getUser()

  //   }, []);
  // console.log(state.students)
  //   const getUser = async () => {
  //     const response = await axios.get(`${API}/user/${oldLink.id}`);
  //     setState({ ...state, students: response.data.students });
  //   }

  useEffect(() => {
    // let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
    // let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    let frontCode = [];
    // let mereq = [{ meal: 'Vegetarian' }];
    // for (const mealObj in mereq) {
    // for (const meal of mealObj) {
    // console.log(mealObj);
    mealRequest.forEach((item) => {
      switch (item.meal) {
        case 'Vegetarian':
          frontCode.push('Vt');
          // console.log('vege')
          break;
        case 'Vegan':
          frontCode.push('Vg');
          // console.log('vegan')
          break;
        case 'GlutenFree':
          frontCode.push('Gf');
          // console.log('gf')
          break;
        case 'Standard':
          frontCode.push('');
          // console.log('gf')
          break;

        default:
          break;
      }
      // }
    });
    // }
    console.log(frontCode);
    // code = frontCode; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    // codes[i] = code;

    let newPickupCode =
      frontCode.join('') + '-' + user.userCode + '-0' + mealRequest.length;

    setState({
      ...state,
      buttonText: 'Update',
      pickupCode: newPickupCode,
      pickupCodeAdd: frontCode,
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
  }, [mealRequest]);

  // console.log(user.students);
  // load categories when component mounts useing useEffect
  // load categories when component mounts useing useEffect
  useEffect(() => {
    loadCategories();
    success === 'Your request was updated'
      ? setTimeout(() => {
          Router.push('/user');
        }, 2000)
      : loadCategories();
    // : Router.push('');
    return () => clearTimeout();
  }, [success]);

  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDate: moment(pickupDate).format('l') });
    setShowSearch(!showSearch);
  };

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;
  // date.getDay() !== 2

  // meal request select
  const handleSelectChange = (e) => {
    let i = e.target.getAttribute('data-index');
    {
      // console.log(i);
    }

    let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
    let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    meal.meal = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    meals[i] = meal; // puts meal[i] back into mealRequest array
    // console.log(meal)
    // meal.meal === 'Vegetarian' ? console.log('vege') : console.log('standard')

    let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
    let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at

    // console.log(pickupCodeAdd)

    let input = e.target.value;
    let frontCode = '';
    switch (input) {
      case 'Vegetarian':
        frontCode = 'Vt';
        // console.log('vege')
        break;
      case 'Vegan':
        frontCode = 'Vg';
        // console.log('vegan')
        break;
      case 'GlutenFree':
        frontCode = 'Gf';
        // console.log('gf')
        break;
      case 'Standard':
        frontCode = '';
        // console.log('gf')
        break;

      default:
        break;
    }
    // console.log(frontCode)

    code = frontCode; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    codes[i] = code;
    // console.log(codes)
    let length = mealRequest.length;

    // move some of this code somewhere else where it doesn't have to change only when user does a meal name change
    // let newFrontCode = codes
    let newPickupCode = codes.join('') + '-' + user.userCode + '-0' + length;

    // if(student[i]==='Group A') {

    // }

    setState({
      ...state,
      mealRequest: [...meals],
      buttonText: 'Update',
      pickupCode: newPickupCode,
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
  // console.log(state.pickupCodeAdd)
  // console.log(pickupCodeAdd);

  const selectMealRequest = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            data-index={i}
            defaultValue={state.mealRequest[i].meal}
            // defaultValue={state.mealRequest[0].meal}
            onChange={(e) => handleSelectChange(e)}
            className="form-control"
          >
            {' '}
            <option value="">Choose an option</option>
            <option value={'Standard'}>Standard</option>
            <option value={'Vegetarian'}>Vegetarian</option>
            <option value={'Vegan'}>Vegan (lunch only)</option>
            <option value={'GlutenFree'}>Gluten Free (lunch only)</option>
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  // pickup options(all, breakfast only, lunch only) select
  const handlePickupOption = (e) => {
    setState({
      ...state,
      pickupOption: e.target.value,
      buttonText: 'Update',
      success: '',
      error: '',
    });
  };

  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete >', slug);
    let answer = window.confirm('WARNING! Delete this order?');
    if (answer) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('LINK DELETE SUCCESS', response);
      process.browser && window.location.reload();
    } catch (error) {
      console.log('ERROR LINK CATEGORY', error);
    }
  };

  const selectPickupOption = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            defaultValue={state.pickupOption.value}
            // value='Breakfast and Lunch'
            data-index={i}
            onChange={(e) => handlePickupOption(e)}
            className="form-control"
          >
            {' '}
            <option selected value={'Breakfast and Lunch'}>
              Breakfast and Lunch
            </option>
            <option value={'Breakfast Only'}>Breakfast Only</option>
            <option value={'Lunch Only'}>Lunch Only</option>
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  // pickup times select
  const handlePickupTimeChange = (e) => {
    setState({
      ...state,
      pickupTime: e.target.value,
      buttonText: 'Update',
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
            defaultValue={state.pickupTime}
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
  const addMeal = () => {
    setState({
      ...state,
      mealRequest: [...mealRequest, { meal: 'Standard', glutenFree: false }],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({title, url, categories, type, medium})
    // const toAddCode = user.userCode
    // const newCode = user.userCode + '_0' + toString(mealRequest.length)

    // let NewPickupCode = pickupCodeAdd + pickupCode

    // pickupCode = NewPickupCode
    // newCodeMaker()
    // console.log(pickupCode)

    // console.table({title, url, categories, type, medium})
    // use update link based on admin user roll
    let dynamicUpdateUrl;
    if (isAuth() && isAuth().role === 'admin') {
      dynamicUpdateUrl = `${API}/link/admin/${oldLink._id}`;
    } else {
      dynamicUpdateUrl = `${API}/link/${oldLink._id}`;
    }
    try {
      const response = await axios.put(
        dynamicUpdateUrl,
        { mealRequest, pickupOption, pickupTime, pickupDate, pickupCode },
        // { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // reset state
      setState({
        ...state,
        success: 'Your request was updated',
        buttonText: 'Updated',
      });
      // .then(Router.push('/user'))
    } catch (error) {
      // console.log('LINK SUBMIT ERROR', error);
      setState({
        ...state,
        // error: error.response.data.error
        error: 'some error',
      });
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
  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="" className="text-muted">
          Meal Options
        </label>
        {selectPickupOption()}
      </div>

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
          type="submit"
        >
          {isAuth() || token ? state.buttonText : 'Login to Make Request'}
        </button>

        <button
          disabled={!token}
          className="btn btn-outline-danger float-right"
          onClick={(e) => confirmDelete(e, oldLink._id)}
        >
          {isAuth() || token ? 'Delete' : 'Login to Make Request'}
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
                  {pickupDate && moment(oldLink.pickupDate).format('MMM Do')}{' '}
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
                      <h6 className="p-2">
                        <label key={i} className="form-check-label text-muted">
                          {/* Select Meal # {`${i + 1}`}  */}
                          Select meal for {`${user.students[i].name}`}
                        </label>
                      </h6>
                      {/* {console.log(x)}
                    {console.log(mealRequest)} */}

                      <div key={i} className="">
                        {selectMealRequest(i)}
                      </div>
                    </>
                  );
                })}

                <div className="">
                  {state.mealRequest.length < user.students.length && (
                    <button
                      className="btn btn-warning"
                      onClick={() => addMeal()}
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

Update.getInitialProps = async ({ req, token, query, user }) => {
  const response = await axios.get(`${API}/link/${query.id}`);
  return { oldLink: response.data, token, user };
  // const token = getCookie('token', req);
  // return { token, user };
  // const response = await axios.get(`${API}/link/${query.id}`);
  // // const token = getCookie('token', req);
  // return { oldLink: response.data, token, user};
  // // return { token, user };
};

export default withUser(Update);
// export default withUser(Create)
