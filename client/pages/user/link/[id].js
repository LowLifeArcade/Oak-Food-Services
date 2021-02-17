// imports
import styles from '../../../styles/Home.module.css';
import moment from 'moment';
import Router from 'next/router'
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import axos from 'axios';
import withUser from '../../withUser';
import { getCookie, isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import axios from 'axios';

const Update = ({ oldLink, token, _id }) => {
  // state
  // console.log('old link data from user[id]', oldLink);
  const [state, setState] = useState({
    // title: oldLink.title,
    // url: oldLink.url,
    // categories: oldLink.categories,
    mealRequest: oldLink.mealRequest ,
    pickupTime: oldLink.pickupTime,
    pickupOption: oldLink.pickupOption,
    pickupDate: oldLink.pickupDate,
    buttonText: 'Update',
    // loadedCategories: [],
    success: '',
    error: '',
    // type: oldLink.type,
    // medium: oldLink.medium,
  });

  const {
    pickupOption,
    pickupTime,
    mealRequest,
    pickupDate,
    // title,
    // url,
    // categories,
    // loadedCategories,
    success,
    error,
    // type,
    // medium,
  } = state;

  // load categories when component mounts useing useEffect
  useEffect(() => {
    loadCategories();
  }, []);

  // delete
  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete >', slug);
    let answer = window.confirm('WARNING! Confirm delete.');
    if (answer) {
      handleDelete(id);
    }
  };
  // delete
  const handleDelete = async (id) => {
    // console.log('delete link', id)
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setState({...state, success: 'Request was deleted'})
      console.log('LINK DELETE SUCCESS', response);
      response
      ? setTimeout(() => {
          Router.push('/user');
        }, 2000)
      : Router.push('');
    return () => clearTimeout();
      // Router.replace('/user');
    } catch (error) {
      console.log('ERROR DELETING LINK', error);
    }
  };


  // meal request select
  const handleSelectChange = (e) => {
    let i = e.target.getAttribute('data-index');
    {
      console.log(i);
    }

    let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
    let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    meal.meal = e.target.value; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    meals[i] = meal; // puts meal[i] back into mealRequest array
    setState({ ...state, mealRequest: [...meals], success: '',
    error: '', }); //puts ...mealRequest with new meal back into mealRequest: []
    // setState({...state,
    //   mealRequest: [...mealRequest, {meal: e.target.value}]});
    // console.log(e.target.getAttribute("data-index"))
  };

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
    setState({...state, pickupOption: e.target.value, buttonText: 'Update',success: '',
    error: '',})
  };

  const selectPickupOption = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            defaultValue={state.pickupOption}
            // value='Breakfast and Lunch'
            data-index={i}
            onChange={(e) => handlePickupOption(e)}
            className="form-control"
          >
            {' '}
            <option selected value={'Breakfast and Lunch'}>Breakfast and Lunch</option>
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
    setState({...state, pickupTime: e.target.value, buttonText: 'Update', success: '', error: ''})
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
    });
  };

  // remove meal button
  const removeMeal = (index) => {
    const list = [...state.mealRequest];
    // console.log(list);
    list.splice(-1)[0];
    // list.splice(index, 1);
    setState({ ...state, mealRequest: list });
  };





  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleTitleChange = async (e) => {
    setState({ ...state, title: e.target.value, error: '', success: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        { mealRequest, pickupOption, pickupTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        ...state,
        success: 'Your request is updated',
        buttonText: 'Updated'
      });
    } catch (error) {
      console.log('LINK SUBMIT ERROR', error);
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

  // show types
  const showTypes = () => (
    <>
      <div className="form-check ml-5">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleTypeClick}
            defaultChecked={type === 'free'}
            value="free"
            className="form-check-input"
            name="type"
          />{' '}
          Free
        </label>
      </div>

      <div className="form-check ml-5">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleTypeClick}
            defaultChecked={type === 'paid'}
            value="paid"
            className="form-check-input"
            name="type"
          />
          Paid
        </label>
      </div>
    </>
  );
  // show medium
  const showMedium = () => (
    <>
      <div className="form-check ml-5">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleMediumClick}
            defaultChecked={oldLink.medium}
            value="video"
            className="form-check-input"
            name="medium"
          />{' '}
          Video
        </label>
      </div>
      <div className="form-check ml-5">
        <label className="form-check-label">
          <input
            type="radio"
            onClick={handleMediumClick}
            defaultChecked={oldLink.medium}
            value="book"
            className="form-check-input"
            name="medium"
          />{' '}
          Book
        </label>
      </div>
    </>
  );

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
            // bellow is how a method we use to loop through cat and find the ones that apply with includes
            checked={categories.includes(c._id)}
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
          Title
        </label>
        <input
          type="text"
          className="form-control"
          onChange={handleTitleChange}
          value={title}
        />
      </div>
      <div className="form-group">
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
      <div>
        <button
          disabled={!token}
          className="btn btn-outline-warning"
          type="submit"
        >
          {isAuth() || token ? 'Update' : 'Login to update'}
        </button>
      </div> */}
    </form>
  );

  return (
    <Layout>
      {/* {console.log(oldLink)} */}
    <div className="col-md-6 offset-md-3">
      <div className={styles.subcard}>
        <div className="row">
          <div className="col-md-12">
            <h2>
              Meal Request for{' '}
              {`${moment(oldLink.pickupDate).format('MMMM Do ')}`}{' '}
              {/* {`${moment(new Date()).format('dddd, MMMM Do ')}`}{' '} */}
            </h2>
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
                      Select Meal # {`${i + 1}`}
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
              {state.mealRequest.length < 5 && (
                <button className="btn btn-warning" onClick={() => addMeal()}>
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


    // <Layout>
    //   <div className="row">
    //     <div className="col-md-12">
    //       <h1>Edit Request</h1>
    //       <br />
    //     </div>
    //   </div>
    //   <div className="row">
    //     <div className="col-md-3">
    //       <div className="form-group">
    //         <label className="text-muted ml-3"> Category </label>

    //         <ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>
    //           {showCategories()}
    //         </ul>
    //       </div>
    //       <div className="form-group">
    //         <label className="text-muted ml-3"> Type </label>

    //         {showTypes()}
    //       </div>
    //       <div className="form-group">
    //         <label className="text-muted ml-3"> Medium </label>

    //         {showMedium()}
    //       </div>
    //     </div>
    //     <div className="col-md-6">
    //       {/* {console.log(success)} */}
    //       {success && showSuccessMessage(success)}
    //       {error && showErrorMessage(error)}
    //       {submitLinkForm()}
    //     </div>
    //   </div>
    // </Layout>
  );
};

Update.getInitialProps = async ({ req, token, query }) => {
  const response = await axios.get(`${API}/link/${query.id}`);
  return { oldLink: response.data, token };
};

export default withUser(Update);
// export default withUser(Create)
