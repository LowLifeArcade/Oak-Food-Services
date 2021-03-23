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
    pickupDate: moment(new Date()).format('l'),
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

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;

  return (
    <Layout>
      <br />
      <div className="row">
        <div className="col-md-4">
          <h3>Order Data {`for ${pickupDate}`}</h3>
          <hr />
          <div className="">
            <div className="">
              <Calendar
                onChange={(e) => onDateChange(e)}
                tileDisabled={handleDisabledDates}
                value={pickupDate}
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
        <b className="text-danger">{pickupMealsForLunch('Lunch Only') * 5}</b> -
        Curbside Lunch Meals <p />
        <b className="text-danger">{pickupMealsForBreakfast() * 5}</b> -
        Curbside Breakfast Meals <p />
      </h4>

      <h5 className="p-1">
        <b>{allOpenPickupMeals() * 5}</b> - Unfulfilled Curbside Meals <p />
        <b>{allCompletedPickupMeals() * 5}</b> - Fulfilled Curbside Meals
      </h5>
      <hr />
      <div className="p-3">
        <h6>
          {mealCounter('Standard') * 5} - Standard Breakfast and Lunch Meal
          Requests
          <hr />
          {lunchOnlyMealCounter('Standard') * 5} - Standard Meals LUNCH ONLY
          <hr />
          {mealCounter('Vegetarian') * 5} - Vegetarian Breakfast and Lunch Meal
          Requests
          <hr />
          {lunchOnlyMealCounter('Vegetarian') * 5} - Vegetarian Meals LUNCH ONLY
          <hr />
          {lunchOnlyMealCounter('Vegan') * 5} - Vegan Meals LUNCH ONLY
          <hr />
          {lunchOnlyMealCounter('GlutenFree') * 5} - Gluten Free Meals LUNCH
          ONLY
          <hr />
          {mealBreakfastOnlyCounter('Standard Onsite') * 5} - Breakfast Only
          meal requests
          <hr />
        </h6>
      </div>
      <h4>
        <b className="text-danger">{allOnsiteMeals() * 2}</b> - All Onsite Meals{' '}
        <p />
        <hr />
      </h4>

      <div className="p-3">
        <h6>
          {pickupMealsBySchool('BES', 'a-group') * 2} - BES A
          <hr />
          {pickupMealsBySchool('BES', 'b-group') * 2} - BES B
          <hr />
          {pickupMealsBySchool('OHES', 'a-group') * 2} - OHES A
          <hr />
          {pickupMealsBySchool('OHES', 'b-group') * 2} - OHES B
          <hr />
          {pickupMealsBySchool('ROES', 'a-group') * 2} - ROES A
          <hr />
          {pickupMealsBySchool('ROES', 'b-group') * 2} - ROES B
          <hr />
          {pickupMealsBySchool('MCMS', 'a-group') * 2} - MCMS A
          <hr />
          {pickupMealsBySchool('MCMS', 'b-group') * 2} - MCMS B
          <hr />
          {pickupMealsBySchool('OPHS', 'a-group') * 2} - OPHS A
          <hr />
          {pickupMealsBySchool('OPHS', 'b-group') * 2} - OPHS B
          <hr />
          {pickupMealsBySchool('OVHS') * 2} - OVHS
          <hr />
        </h6>
      </div>
    </Layout>
  );
};

Admin.getInitialProps = async ({ req, user }) => {
  const token = getCookie('token', req);

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
