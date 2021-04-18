import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import withAdmin from '../../withAdmin';
import axios from 'axios';
import { API } from '../../../config';
import Layout from '../../../components/Layout';
import { getCookie } from '../../../helpers/auth';
import { showErrorMessage } from '../../../helpers/alerts';

const Admin = ({ token, user, initRequests }) => {
  const [state, setState] = useState({
    requests: initRequests,
    pickupDate: localStorage.getItem('search-date')
      ? moment(JSON.parse(localStorage.getItem('search-date'))).format('l')
      : moment(new Date()).format('l'),
    // pickupDate: moment(new Date()).format('l'),
    meals: [],
    error: '',
  });

  const [userList, setUserList] = useState([])

  const { requests, pickupDate, meals, error } = state;
  let myDate = '';

  // console.log('all meals by date', requests)
  useEffect(() => {
    let allMealsArray = [];
    const pushAllMeals = (meal) => {
      requests.map((r, i) =>
        r.mealRequest.map((meal) => allMealsArray.push(meal))
      );
      console.log('all meals by date', pickupDate, allMealsArray);
      console.log('all requests by date', pickupDate, requests);
    };
    pushAllMeals();
    setState({
      ...state,
      meals: allMealsArray.filter((meal) => meal.meal !== 'None'),
    });
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('search-date', JSON.stringify(pickupDate));
    // localStorage.setItem('curbsideToggle', JSON.stringify(orderType));
  });

  useEffect(() => {
    const data = localStorage.getItem('search-date');
    console.log('data', data);
    if (data) {
      try {
        handleDateChange(JSON.parse(data));
      } catch (error) {
        setState({ ...state, error: error });
      }
    }
  }, []);

  useEffect(() => {
      handleUserList()
  }, [])

  const handleTimeSelect = (e, pickupTimeSelected) => {
    e.preventDefault();

    let allMealsArray2 = [];

    requests
      .filter((mealRequest) => mealRequest.pickupTime === pickupTimeSelected)
      .map((r, i) => r.mealRequest.map((meal) => allMealsArray2.push(meal)));

    setState({ ...state, meals: allMealsArray2 });
    console.log('req ', meals);
  };

  const mealCounter = (meal) =>
    state.meals.filter(
      (m) => m.meal == meal && m.meal !== 'None'
      //  && m.pickupOption !== 'Lunch Only'
    ).length;

  const lunchOnlyMealCounter = (meal) =>
    state.meals.filter((m) => m.meal == meal && m.pickupOption === 'Lunch Only')
      .length;

  const mealBreakfastOnlyCounter = (meal) =>
    state.meals.filter(
      (m) =>
        m.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
        m.pickupOption === 'Breakfast Only'
    ).length;

  const allOnsiteMeals = () =>
    // requests.filter((m) => m.mealRequest.map((meal) => meal.group == 'distance-learning')).length
    requests.filter((request) =>
      request.mealRequest.every((meal) => meal.meal == 'Standard Onsite')
    ).length;
  // console.log('all onsite', requests.filter((request) => request.mealRequest.every((meal) => meal.group == 'distance-learning')).length)
  // meals.filter((m) => m.group == 'b-group').length;
  const allIndividualOnsiteMeals = () =>
    meals.filter((m) => m.group == 'a-group').length +
    meals.filter((m) => m.group == 'b-group').length;

  const allOpenOnsiteMeals = () =>
    meals
      .filter((m) => m.group == 'a-group')
      .filter((x) => x.complete === false).length +
    meals
      .filter((m) => m.group == 'b-group')
      .filter((x) => x.complete === false).length;

  const allCompletedOnsiteMeals = () =>
    meals.filter((m) => m.group == 'a-group').filter((x) => x.complete === true)
      .length +
    meals.filter((m) => m.group == 'b-group').filter((x) => x.complete === true)
      .length;

  const allPickupMeals = (meal) =>
    meals.filter(
      (m) =>
        m.group === 'distance-learning' ||
        m.pickupOption === 'Lunch Onsite / Breakfast Pickup'
    ).length;

  const pickupMealsForLunch = () =>
    meals.filter(
      (m) =>
        // m.group === 'distance-learning' ||
        // m.group === 'distance-learning' ||
        m.pickupOption === 'Lunch Only' ||
        m.pickupOption === 'Breakfast and Lunch'
    ).length;
  const pickupMealsForBreakfast = () =>
    meals.filter(
      (m) =>
        m.pickupOption === 'Breakfast Only' ||
        m.pickupOption === 'Breakfast and Lunch' ||
        m.pickupOption === 'Lunch Onsite / Breakfast Pickup'
    ).length;

  const pickupMealsBySchool = (school, group) =>
    meals.filter((m) => m.schoolName === school && m.group === group).length;

  const allOpenPickupMeals = (meal) =>
    requests
      .filter((m) => m.pickupTime !== 'Cafeteria')
      .filter((x) => x.orderStatus === false).length;

  const allCompletedPickupMeals = (meal) =>
    requests
      .filter((m) => m.pickupTime !== 'Cafeteria')
      .filter((x) => x.orderStatus === true).length;
  // const allOpenPickupMeals = (meal) =>
  //   meals
  //     .filter(
  //       (m) =>
  //         m.group === 'distance-learning' ||
  //         m.pickupOption === 'Lunch Onsite / Breakfast Pickup'
  //     )
  //     .filter((x) => x.complete === false).length;

  // const allCompletedPickupMeals = (meal) =>
  //   meals
  //     .filter(
  //       (m) =>
  //         m.group === 'distance-learning' ||
  //         m.pickupOption === 'Lunch Onsite / Breakfast Pickup'
  //     )
  //     .filter((x) => x.complete === true).length;

  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDate: moment(pickupDate).format('l') });
    handleDateChange(pickupDate);
  };

  const handleDateChange = async (pickupDate) => {
    const pickupDateLookup = moment(pickupDate).format('l');
    const response = await axios.post(
      `${API}/links-by-date`,
      { pickupDateLookup },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setState({
      ...state,
      pickupDate: pickupDateLookup,
      requests: response.data,
    });
  };

  const handleUserList = async () => {
    // const pickupDateLookup = moment(pickupDate).format('l');
    try {
    const response = await axios.get(
      `${API}/user-list`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUserList(
     response.data,
    );
  } catch (error) {
    console.log('USER LIST ERROR', error);
    setState({
      ...state,
      error: error.response.data.error,
    });
  }
  };

  // {requests.map(request => console.log('request email', request.postedBy.email))}
  // {userList.map(user => console.log('user email', user.email))}

  // userers who have not ordered yet
  const userListFiltered = () => ( 
    userList
    .filter((user) => !requests.map(request => request.postedBy.email).includes(user.email))
    .map((l, i) => (
      <>
        <tr key={i}>
          <td>
            {l.name + ' ' + l.lastName}
          </td>
          <td>
            {l.userCode}
          </td>
          <td>
            {l.email}
          </td>
        </tr>
      </>
    ))
  )

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 1;

  return (
    <Layout>
      <br />
      <div className="row">
        <div className="col-md-4">
          <h3>
            Friday Pickup{' '}
            {`${moment(pickupDate).subtract(3, 'day').format('MMMM Do')}`}
            <br />
            Week of {`${pickupDate}`}
          </h3>
          <hr />
          <div className="">
            <div className="">
              <Calendar
                onChange={(e) => onDateChange(e)}
                tileDisabled={handleDisabledDates}
                value={new Date()}
                value={''}
              />
            </div>
            <button onClick={(e) => handleTimeSelect(e, '7am-9am')}>
              7am-9am
            </button>
            <button onClick={(e) => handleTimeSelect(e, '11am-1pm')}>
              11am-1pm
            </button>
            <button onClick={(e) => handleTimeSelect(e, '4pm-6pm')}>
              4pm-6pm
            </button>
            <br/>
            <button onClick={(e) => handleUserList(e)}>
              User List
            </button>
            {error && showErrorMessage(error)}
          </div>
        </div>
      </div>

      <hr />
      <h2>
        <b className="text-danger">{requests.length}</b> - All (Curbside and
        Onsite)
      </h2>
      <hr style={{ textSize: '20px' }}/>
      <hr style={{ textSize: '20px' }}/>
      <hr style={{ textSize: '20px' }}/>
      <h3 className="">
        <b className="text-danger">
          {requests.filter((meal) => meal.pickupTime != 'Cafeteria').length}
        </b>{' '}
        - All Curbside <p />
        <hr />
        <b className="text-danger">{allOpenPickupMeals()}</b> - Unfulfilled
        Curbside <p />
        <b className="text-danger">{allCompletedPickupMeals()}</b> - Fulfilled
        Curbside
      </h3>
      <hr />
      <h5><b>Curbside Kitchen Prep Data</b></h5>
      <div className="pt-2"></div>
      <h5>
        <b className="text-danger">{pickupMealsForLunch()}</b> - Individual Curbside Lunches <p />
        <b className="text-danger">{pickupMealsForBreakfast()}</b> - Individual Curbside Breakfasts <p />
      </h5>

      <hr />
      <h5><b>Standard Requests</b></h5> 
      <div className="p-3">
        <h6>
          {mealCounter('Standard')} - <b>Standard</b> Breakfast and Lunch 
          <hr />
          {mealCounter('Vegetarian')} - <b>Vegetarian</b> Breakfast and Lunch 
          <hr />
          {mealCounter('Vegan')} - <b>Vegan</b>   Meals
          <hr />
          {mealCounter('Gluten Free')} - <b>Gluten Free</b>  Meals
          <hr />
          {mealCounter('Standard Dairy Free')} - <b>Dairy Free</b>  Meals
          <hr />
          {mealBreakfastOnlyCounter('Standard Onsite')} - <b>BREAKFAST ONLY </b> Meals
          <hr />
          {/* {lunchOnlyMealCounter('Standard')} - <b>LUNCH ONLY</b> Standard
          <hr />
          {lunchOnlyMealCounter('Vegetarian')} - <b>LUNCH ONLY</b> Vegetarian */}
          {/* <hr /> */}
          </h6>
          </div>
          <h5><b>Special Requests</b></h5> 
          <h6>
          <div className="p-3">
          <hr/>
          {mealCounter('Vegan B')} - <b>Vegan</b> with Breakfast 
          <hr />
          {mealCounter('Gluten Free with Breakfast')} - <b>Gluten Free</b> with Breakfast
          <hr />
          {mealCounter('Gluten Free Dairy Free')} - <b>Gluten Free Dairy Free</b> 
          <hr />
          {mealCounter('2on 3off')} - <b>Two On Three Off</b> 
          <hr />
          
          {mealCounter('Standard Sesame Free')} - Standard Sesame Free Meals
          <hr />
          {mealCounter('Vegetarian Sesame Free')} - Vegetarian Sesame Free Meals
          <hr />
          {mealCounter('Vegan Sesame Free')} - Vegan Sesame Free Meals
          <hr />
          {mealCounter('Sesame Dairy Free')} - Sesame Dairy Free Meals
          <hr />
          {mealCounter('Sesame Dairy Free')} - Sesame Dairy Free Meals
          <hr />
          {mealCounter('None')} - None Meals
          <hr />
          
      </div>
        </h6>
      <h3>
        <b className="text-danger">{allOnsiteMeals()}</b> - All Onsite{' '}
      </h3>
      <hr/>
      <div className="pt-1"></div>
      <h5><b>Onsite Kitchen Prep Data</b></h5>
      <div className="pt-1"></div>
      <h5 className="">
        <b className="text-danger">{allIndividualOnsiteMeals()}</b> - Individual Onsite Meals 
        <div className="p-1"></div>
      </h5>
        <hr />
          
      <h5><b>School Numbers</b></h5> 
      <div className="p-3">
        <h6>
          {pickupMealsBySchool('BES', 'a-group')} - BES A
          <br/>
          {pickupMealsBySchool('BES', 'b-group')} - BES B
          <hr />
          {pickupMealsBySchool('OHES', 'a-group')} - OHES A
          <br/>
          {pickupMealsBySchool('OHES', 'b-group')} - OHES B
          <hr />
          {pickupMealsBySchool('ROES', 'a-group')} - ROES A
          <br/>
          {pickupMealsBySchool('ROES', 'b-group')} - ROES B
          <hr />
          {pickupMealsBySchool('MCMS', 'a-group')} - MCMS A
          <br/>
          {pickupMealsBySchool('MCMS', 'b-group')} - MCMS B
          <hr />
          {pickupMealsBySchool('OPHS', 'a-group')} - OPHS A
          <br/>
          {pickupMealsBySchool('OPHS', 'b-group')} - OPHS B
          <hr />
          {pickupMealsBySchool('OVHS')} - OVHS
          <hr />
        </h6>
        <br/>
        <h5><b className='text-danger' >{userListFiltered().length} users who have not ordered yet for {moment(pickupDate).format('MMMM Do')}</b></h5> 
        {/* <h5>email list</h5> */}
        <br/>
        <table className="table table-striped table-sm table-bordered">
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">User Code</th>
          <th scope="col">Email</th>
        </tr>
      </thead>
      <tbody>
        {userListFiltered()}
      </tbody>
    </table>
      </div>
    </Layout>
  );
};

Admin.getInitialProps = async ({ req, user }) => {
  const token = getCookie('token', req);
  // find way to handle it the way i do the calendar where certain days are blanked out so it auto fills data just from monday
  const dateLookup = moment(new Date()).format('l');
  const response = await axios.post(
    `${API}/links-by-date`,
    { dateLookup },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  let initRequests = response.data;
  return { initRequests };
};

export default withAdmin(Admin);
