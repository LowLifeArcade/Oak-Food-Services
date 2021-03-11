import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/Home.module.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Router from 'next/router';
import withAdmin from '../withAdmin';
import Link from 'next/link';
import axios from 'axios';
import { API } from '../../config';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

// const sdk = new ChartsEmbedSDK({
//   baseUrl: 'https://charts.mongodb.com/charts-charts-fixture-tenant-zdvkh',
// });
// const chart = sdk.createChart({
//   chartId: '48043c78-f1d9-42ab-a2e1-f2d3c088f864',
// });

import Layout from '../../components/Layout';

const Admin = ({ token, user }) => {
  const [state, setState] = useState({
    requests: [],
    pickupDate: '',
    meals: [],
  });

  const { requests, pickupDate, meals } = state;

  useEffect(() => {
    // loadRequests();
    pushAllMeals();
    setState({
      ...state,
      meals: allMealsArray,
    });
  }, [requests]);

  let allMealsArray = [];
  const pushAllMeals = (meal) => {
    requests.map((r, i) =>
      r.mealRequest.map((meal) => allMealsArray.push(meal))
    );
  };
  // setState({...state, meals: [...allMealsArray]})
  console.log('state.meals', meals);

  // console.log(allMealsArray);
  // console.log(state.meals);

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
  // console.log('a group open meals', meals.filter((m) => m.group == 'a-group').filter((x) => x.complete === false))

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
      (m) => m.group === 'distance-learning' || m.pickupOption === 'Lunch Only' &&  m.group === 'distance-learning' || m.pickupOption === 'Breakfast and Lunch'
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
      .filter((m) => m.group === 'distance-learning' || m.pickupOption === 'Lunch Onsite / Breakfast Pickup')
      .filter((x) => x.complete === false).length;

  const allCompletedPickupMeals = (meal) =>
    meals
      .filter((m) => m.group === 'distance-learning' || m.pickupOption === 'Lunch Onsite / Breakfast Pickup')
      .filter((x) => x.complete === true).length;

  // state.meals.filter((m) =>
  //   m == meal).length

  // const allStandardMeals = (meal) =>
  //   requests.map((r, i) =>
  //     r.mealRequest.filter((meal) => {
  //     meal.standard === 'Standard'
  //     })
  //   );
  // const ref = useRef('chart');
  // const renderChart = () => {
  //   // render the chart into a container
  //   chart.render(ref).catch(() => window.alert('Chart failed to initialise'));
  // };

  // const allMealsArray = (mr, i) =>
  //   requests.map((r, i) =>
  //     r.mealRequest.forEach((mr, i) => {
  //       let veg = 0
  //       let stn = 0
  //       if (mr.meal === 'Vegetarian') {
  //         veg ++;
  //         console.log(veg)
  //       }
  //       if (mr.meal === 'Standard') {
  //         stn ++
  //         console.log(stn)
  //       }
  //       if (mr.meal === 'Vegan') {
  //         return <h1>vegan</h1>;
  //       }
  //     })
  //   );

  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDate: moment(pickupDate).format('l') });
    // setShowSearch(!showSearch);
    handleDateChange(pickupDate);
  };

  const handleDateChange = async (pickupDate) => {
    const pickupDateLookup = moment(pickupDate).format('l');
    const response = await axios.post(
      `${API}/links-by-date`,
      { pickupDateLookup },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setState({ ...state, requests: response.data });
  };

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;

  // console.log(requests)

  return (
    <Layout>
      <br />
      <div className="row">
        <div className="col-md-4">
          <h1>Admin Dashboard</h1>
          <hr />
          <div className="">
            <ul className="nav flex-column pt-1 ">
              <li className="nav-item">
                <li className="nav-item">
                  <Link href="/admin/link/list">
                    <a className="nav-link" href="">
                      Lists and CSV Page
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/link/read">
                    <a className="nav-link" href="">
                      Order Details Page
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/category/create">
                    <a className="nav-link" href="">
                      Create Blog Post
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/category/read">
                    <a className="nav-link" href="">
                      Edit Blog Posts
                    </a>
                  </Link>
                </li>
                {/* <li className="nav-item">

                <Link href="/admin/group/create">
                  <a className="nav-link" href="">
                    Create Student Group
                  </a>
                </Link>
              </li> */}
              </li>

              {/* <li className="nav-item">
                <Link href="/admin/group/read">
                  <a className="nav-link" href="">
                    Edit Student Groups
                  </a>
                </Link>
              </li> */}
              {/* 
              <li className="nav-item">
                <Link href="/admin/teacher/create">
                  <a className="nav-link" href="">
                    Create Teacher
                  </a>
                </Link>
              </li>

              <li className="nav-item">
                <Link href="/admin/teacher/read">
                  <a className="nav-link" href="">
                    Edit Teacher
                  </a>
                </Link>
              </li> 
              */}
              {/* <li className="nav-item">
                <Link href="/user/link/mockCreate">
                  <a className="nav-link" href="">
                    Create Mock Order
                  </a>
                </Link>
              </li> */}
              <li className="nav-item">
                <Link href="/user/link/create">
                  <a className="nav-link" href="">
                    Create Order
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/user">
                  <a className="nav-link" href="">
                    Admin's Created Orders
                  </a>
                </Link>
              </li>

              <li className="nav-item">
                <Link href="/user/profile/update">
                  <a className="nav-link" href="">
                    Profile Update
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/user/profile/add">
                  <a className="nav-link">Add students</a>
                </Link>
              </li>
            </ul>
            <hr />
            <div className="">
              <Calendar
                onChange={(e) => onDateChange(e)}
                tileDisabled={handleDisabledDates}
                // defaultValue={twoWeeksFromNow}
                // tileDisabled={(date, view) =>
                //   yesterday.some(date =>
                //      moment().isAfter(yesterday)
                //   )}
                // minDate={handlePastDate}
                // minDate={twoWeeksFromNow}
                // minDate={new Date().getDate() + 14}

                value={''}
              />
            </div>
          </div>
        </div>
      </div>

      <hr />
      <h3>
        <b className="text-danger">{requests.length}</b> - All Meal Requests{' '}
        <p />
        {/* <b>{allPickupMeals() * 5}</b> - All Individual Meals <p /> */}
      </h3>
      <hr />
      <h4>
        <b className="text-danger">{allPickupMeals() * 5}</b> - Total Pickup
        Meals <p />
        <b className="text-danger">{pickupMealsForLunch('Lunch Only') * 5}</b> -
        All Lunch Meals <p />
        <b className="text-danger">{pickupMealsForBreakfast() * 5}</b> - All
        Breakfast Meals <p />
      </h4>

      <h5 className="p-1">
        <b>{allOpenPickupMeals() * 5}</b> - Unfulfilled Pickup Meals <p />
        <b>{allCompletedPickupMeals() * 5}</b> - Fulfilled Pickup Meals
      </h5>
      <hr />
      <div className="p-3">
        <h6>
          {mealCounter('Standard') * 5} - Standard meal requests
          <hr />
          {lunchOnlyMealCounter('Standard') * 5} - Standard meals LUNCH ONLY
          <hr />
          {mealCounter('Vegetarian') * 5} - Vegetarian meal requests
          <hr />
          {lunchOnlyMealCounter('Vegetarian') * 5} - Vegetarian meals LUNCH ONLY
          <hr />
          {lunchOnlyMealCounter('Vegan') * 5} - Vegan meals LUNCH ONLY
          <hr />
          {lunchOnlyMealCounter('GlutenFree') * 5} - Gluten Free meals LUNCH
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
        {/* <b>{allOpenOnsiteMeals() * 2}</b> - Unfulfilled onsite Meals <p />
        <b>{allCompletedOnsiteMeals() * 2}</b> - Fulfilled onsite Meals <p /> */}
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
      {/* {chart.render(ref)} */}
      {/* {renderChart()} */}
      {/* <div className="p-2 chart" ref={ref} id="chart"> */}
      {/* {chart.render().catch(() => window.alert('Chart failed to initialise'))} */}
      {/* </div> */}
    </Layout>
  );
};

// https://charts.mongodb.com/charts-oakfood-apdce
// 7e5526b4-2296-4299-9c21-9dc11ed4817a

// Admin.getInitialProps = async () => {
//   const response = await axios.get(`${API}/links-by-date`);
//   return {
//     initialRequests: response.data,
//   };
// };

export default withAdmin(Admin);
