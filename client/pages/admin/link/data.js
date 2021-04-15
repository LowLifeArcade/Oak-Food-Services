import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import withAdmin from '../../withAdmin';
import axios from 'axios';
import { API } from '../../../config';
import Layout from '../../../components/Layout';
import { getCookie } from '../../../helpers/auth';

const Admin = ({ token, user, initRequests }) => {
  const [state, setState] = useState({
    requests: initRequests,
    pickupDate: localStorage.getItem('search-date')
    ? moment(JSON.parse(localStorage.getItem('search-date'))).format('l')
    : moment(new Date()).format('l'),
    // pickupDate: moment(new Date()).format('l'),
    meals: [],
  });

  const { requests, pickupDate, meals } = state;
  let myDate = '';

  useEffect(() => {
    let allMealsArray = [];
    const pushAllMeals = (meal) => {
      requests.map((r, i) =>
        r.mealRequest.map((meal) => allMealsArray.push(meal))
      );
      console.log('meal array', allMealsArray);
    };
    console.log('none array', meals);
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
      (m) =>
        m.meal == meal && m.meal !== 'None' && m.pickupOption !== 'Lunch Only'
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
        m.group === 'distance-learning' ||
        (m.pickupOption === 'Lunch Only' && m.group === 'distance-learning') ||
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
    meals
      .filter(
        (m) =>
          m.group === 'distance-learning' ||
          m.pickupOption === 'Lunch Onsite / Breakfast Pickup'
      )
      .filter((x) => x.complete === false).length;

  const allCompletedPickupMeals = (meal) =>
    meals
      .filter(
        (m) =>
          m.group === 'distance-learning' ||
          m.pickupOption === 'Lunch Onsite / Breakfast Pickup'
      )
      .filter((x) => x.complete === true).length;

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

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 1;

  return (
    <Layout>
      <br />
      <div className="row">
        <div className="col-md-4">
          <h3>Friday Pickup {`${moment(pickupDate).subtract(3, 'day').format('MMMM Do')}`}
          <br/>
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
          </div>
        </div>
      </div>

      <hr />
      <h3>
        <b className="text-danger">{requests.length}</b> - All Meal Requests{' '}
        <p />
      </h3>
      <hr />
      <h4>
        <b className="text-danger">{pickupMealsForLunch('Lunch Only')}</b> -
        Curbside Lunch Meals <p />
        <b className="text-danger">{pickupMealsForBreakfast()}</b> -
        Curbside Breakfast Meals <p />
      </h4>

      <h5 className="p-1">
        <b>{allOpenPickupMeals() }</b> - Unfulfilled Curbside Meals <p />
        <b>{allCompletedPickupMeals()}</b> - Fulfilled Curbside Meals
      </h5>
      <hr />
      <div className="p-3">
        <h6>
          {mealCounter('Standard') } - Standard Breakfast and Lunch Meal
          Requests
          <hr />
          {lunchOnlyMealCounter('Standard') } - Standard Meals LUNCH ONLY
          <hr />
          {mealCounter('Vegetarian') } - Vegetarian Breakfast and Lunch Meal
          Requests
          <hr />
          {lunchOnlyMealCounter('Vegetarian') } - Vegetarian Meals LUNCH ONLY
          <hr />
          {lunchOnlyMealCounter('Vegan') } - Vegan Meals LUNCH ONLY
          <hr />
          {lunchOnlyMealCounter('GlutenFree') } - Gluten Free Meals LUNCH
          ONLY
          <hr />
          {lunchOnlyMealCounter('Sesame') } - Sesame Free Meals LUNCH
          ONLY
          <hr />
          {mealBreakfastOnlyCounter('Standard Onsite') } - Breakfast Only
          meal requests
          <hr />
        </h6>
      </div>
      <h4>
        <b className="text-danger">{allOnsiteMeals() }</b> - All Onsite Meals{' '}
        <p />
        <hr />
      </h4>

      <div className="p-3">
        <h6>
          {pickupMealsBySchool('BES', 'a-group') } - BES A
          <hr />
          {pickupMealsBySchool('BES', 'b-group') } - BES B
          <hr />
          {pickupMealsBySchool('OHES', 'a-group') } - OHES A
          <hr />
          {pickupMealsBySchool('OHES', 'b-group') } - OHES B
          <hr />
          {pickupMealsBySchool('ROES', 'a-group') } - ROES A
          <hr />
          {pickupMealsBySchool('ROES', 'b-group') } - ROES B
          <hr />
          {pickupMealsBySchool('MCMS', 'a-group') } - MCMS A
          <hr />
          {pickupMealsBySchool('MCMS', 'b-group') } - MCMS B
          <hr />
          {pickupMealsBySchool('OPHS', 'a-group') } - OPHS A
          <hr />
          {pickupMealsBySchool('OPHS', 'b-group') } - OPHS B
          <hr />
          {pickupMealsBySchool('OVHS') } - OVHS
          <hr />
        </h6>
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
