import { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import withAdmin from '../../withAdmin';
import axios from 'axios';
import { API } from '../../../config';
import Layout from '../../../components/Layout';
import { getCookie } from '../../../helpers/auth';
import { showErrorMessage } from '../../../helpers/alerts';
import { CSVLink } from 'react-csv';
import styles from '../../../styles/Home.module.css';
import Head from 'next/head';

const Admin = ({ token, user, initRequests }) => {
  const [state, setState] = useState({
    requests: initRequests,
    pickupButton: '',
    pickupDate: localStorage.getItem('search-date')
      ? moment(JSON.parse(localStorage.getItem('search-date'))).format('l')
      : moment(new Date()).format('l'),
    meals: [],
    error: '',
  });

  const [userList, setUserList] = useState([]);

  const { requests, pickupDate, pickupButton, meals, error } = state;
  let myDate = '';

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
    handleUserList();
  }, []);

  // csv stuff

  const emailHeaders = [
    { label: 'First Name', key: 'name' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Code', key: 'userCode' },
    { label: 'Email', key: 'email' },
  ];

  const handleTimeSelect = (e, pickupTimeSelected) => {
    e.preventDefault();

    let allMealsArray2 = [];

    requests
      .filter((mealRequest) => mealRequest.pickupTime === pickupTimeSelected)
      .map((r, i) => r.mealRequest.map((meal) => allMealsArray2.push(meal)));

    setState({
      ...state,
      meals: allMealsArray2,
      pickupButton: pickupTimeSelected,
    });
    console.log('req ', meals);
  };
  const resetTimeSelect = (e, pickupTimeSelected) => {
    e.preventDefault();

    let allMealsArray2 = [];

    requests
      // .filter((mealRequest) => mealRequest.pickupTime === pickupTimeSelected)
      .map((r, i) => r.mealRequest.map((meal) => allMealsArray2.push(meal)));

    setState({ ...state, meals: allMealsArray2, pickupButton: '' });
    console.log('req ', meals);
  };

  const bagsCounter = () =>
    state.meals
      .filter((m) => m.meal !== 'None')
      .filter((m) => m.pickupOption !== 'Lunch Onsite').length;

  const mealCounter = (meal, pickupOption) =>
    state.meals.filter(
      (m) =>
        m.meal == meal && m.meal !== 'None' && m.pickupOption == pickupOption
      //  && m.pickupOption !== 'Lunch Only'
    ).length;
  const sesameMealCounter = (meal) =>
    state.meals.filter(
      (m) => m.meal == meal && m.meal !== 'None'
      //  && m.pickupOption !== 'Lunch Only'
    ).length;
  const lunchOnlymealCounter = (meal, pickupOption) =>
    state.meals.filter(
      (m) =>
        m.meal == meal && m.pickupOption == pickupOption && m.meal !== 'None'
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
  console.log(
    'all Breakfast Only',
    state.meals.filter(
      (m) =>
        m.pickupOption === 'Lunch Onsite / Breakfast Pickup' &&
        m.meal === 'Standard Onsite'
      // m.pickupOption === 'Breakfast Only'
    )
  );

  const allOnsiteMeals = () =>
    // requests.filter((m) => m.mealRequest.map((meal) => meal.group == 'distance-learning')).length
    requests.filter((l) =>
      l.mealRequest
        .map((s) => s.meal)
        .toString()
        .includes('Standard Onsite')
    ).length;
  // requests.filter((request) =>
  //   request.mealRequest.every((meal) => meal.meal == 'Standard Onsite')
  // ).length;
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
        m.pickupOption === 'Breakfast and Lunch' ||
        m.pickupOption === 'Two Onsite / Three Breakfast and Lunches'
    ).length;
  const pickupMealsForBreakfast = () =>
    meals.filter(
      (m) =>
        m.pickupOption === 'Breakfast Only' ||
        m.pickupOption === 'Breakfast and Lunch' ||
        m.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
        m.pickupOption === 'Two Onsite / Three Breakfast and Lunches'
    ).length;

  const pickupMealsBySchool = (school, group) =>
    meals.filter((m) => m.schoolName === school && m.group === group).length;

  const allOpenPickupMeals = (meal) =>
    pickupButton
      ? requests
          .filter((mealRequest) => mealRequest.pickupTime === pickupButton)
          .filter((m) => m.pickupTime !== 'Cafeteria')
          .filter((x) => x.orderStatus === false).length
      : requests
          .filter((m) => m.pickupTime !== 'Cafeteria')
          .filter((x) => x.orderStatus === false).length;

  const allCompletedPickupMeals = (meal) =>
    pickupButton
      ? requests
          .filter((mealRequest) => mealRequest.pickupTime === pickupButton)
          .filter((m) => m.pickupTime !== 'Cafeteria')
          .filter((x) => x.orderStatus === true).length
      : requests
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
      const response = await axios.get(`${API}/user-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserList(response.data);
    } catch (error) {
      console.log('USER LIST ERROR', error);
      setState({
        ...state,
        error: error.response.data.error,
      });
    }
  };

  let twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
  let summerFromNow = new Date();
  summerFromNow.setDate(summerFromNow.getDate() + 90);

  // {requests.map(request => console.log('request email', request.postedBy.email))}
  // {userList.map(user => console.log('user email', user.email))}

  // userers who have not ordered yet
  const userListFiltered = () =>
    userList
      .filter(
        (user) =>
          !requests
            .map((request) => request.postedBy.email)
            .includes(user.email)
      )
      .map((l, i) => (
        <>
          <tr key={i}>
            <td>{l.name + ' ' + l.lastName}</td>
            <td>{l.userCode}</td>
            <td>{l.email}</td>
          </tr>
        </>
      ));
  const userListFiltered2 = () =>
    userList
      .filter((user) =>
        requests.map((request) => request.postedBy.email).includes(user.email)
      )
      .map((l, i) => (
        <>
          <tr key={i}>
            <td>{l.name + ' ' + l.lastName}</td>
            <td>{l.userCode}</td>
            <td>{l.email}</td>
          </tr>
        </>
      ));

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 1;

  // const myChartRef = useRef();
  // let studentsChart = '';
  // let studentsChart2 = '';
  // let studentsChart3 = '';
  useEffect(() => {
    // let myChart = document.getElementById('myChart')
    let studentsChart = new Chart(document.getElementById('myChart'), {
      type: 'pie', // bar, horzontalBar, pie, line, doughnut, radar, ploarArea
      data: {
        labels: [
          `BES ${
            pickupMealsBySchool('BES', 'a-group') +
            pickupMealsBySchool('BES', 'b-group')
          }`,
          `OHES ${
            pickupMealsBySchool('OHES', 'a-group') +
            pickupMealsBySchool('OHES', 'b-group')
          }`,
          `ROES ${
            pickupMealsBySchool('ROES', 'a-group') +
            pickupMealsBySchool('ROES', 'b-group')
          }`,
          `MCMS ${
            pickupMealsBySchool('MCMS', 'a-group') +
            pickupMealsBySchool('MCMS', 'b-group')
          }`,
          `OPHS ${pickupMealsBySchool('OPHS', 'a-group')}`,
          `OVHS ${pickupMealsBySchool('OVHS', 'a-group')}`,
        ],
        datasets: [
          {
            label: 'Number of Meals',
            data: [
              parseInt(
                pickupMealsBySchool('BES', 'a-group') +
                  pickupMealsBySchool('BES', 'b-group'),
                10
              ),
              parseInt(
                pickupMealsBySchool('OHES', 'a-group') +
                  pickupMealsBySchool('OHES', 'b-group'),
                10
              ),
              parseInt(
                pickupMealsBySchool('ROES', 'a-group') +
                  pickupMealsBySchool('ROES', 'b-group'),
                10
              ),
              parseInt(
                pickupMealsBySchool('MCMS', 'a-group') +
                  pickupMealsBySchool('MCMS', 'b-group'),
                10
              ),
              parseInt(pickupMealsBySchool('OPHS', 'a-group'), 10),
              parseInt(pickupMealsBySchool('OVHS', 'a-group'), 10),
            ],
            backgroundColor: [
              '#b8d8d8',
              '#7a9e9f',
              '#4f6367',
              '#eef5db',
              '#fe5f55',
              '#c5dfc4',
            ],
            borderWidth: 1,
            hoverBorderWidth: '3',
            hoverBorderColor: '#000',
            // borderColor:
          },
        ],
      },
      options: { responsive: true },
    });
    let studentsChart2 = new Chart(document.getElementById('myBarChart'), {
      type: 'bar', // bar, horzontalBar, pie, line, doughnut, radar, ploarArea
      data: {
        labels: [
          'Standard ' + `${mealCounter('Standard', 'Breakfast and Lunch')}`,
          `Vegetarian ${mealCounter('Vegetarian', 'Breakfast and Lunch')}`,
          `Vegan ${mealCounter('Vegan', 'Lunch Only')}`,
          `Gluten Free ${mealCounter('Gluten Free', 'Lunch Only')}`,
          `Dairy Free ${mealCounter('Standard Dairy Free', 'Lunch Only')}`,
          `Breakfast Only ${mealBreakfastOnlyCounter('Standard Onsite')}`,
        ],
        datasets: [
          {
            label: 'Number of Curbside Meals',
            data: [
              parseInt(mealCounter('Standard', 'Breakfast and Lunch'), 10),
              parseInt(mealCounter('Vegetarian', 'Breakfast and Lunch'), 10),
              parseInt(mealCounter('Vegan', 'Lunch Only'), 10),
              parseInt(mealCounter('Gluten Free', 'Lunch Only'), 10),
              parseInt(mealCounter('Standard Dairy Free', 'Lunch Only'), 10),
              parseInt(mealBreakfastOnlyCounter('Standard Onsite'), 10),
            ],
            // backgroundColor: 'green'
            backgroundColor: [
              '#b8d8d8',
              '#7a9e9f',
              '#4f6367',
              '#eef5db',
              '#fe5f55',
              '#c5dfc4',
            ],
            borderWidth: 1,
            hoverBorderWidth: '3',
            hoverBorderColor: '#000',
            // borderColor:
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            // position: 'top',
          },
          title: {
            display: false,
            text: 'Requests By School',
          },
        },
      },
    });
    let studentsChart3 = new Chart(document.getElementById('completedChart'), {
      type: 'pie', // bar, horzontalBar, pie, line, doughnut, radar, ploarArea
      data: {
        labels: [
          `Unfullfilled ${allOpenPickupMeals()}`,
          `Fullfilled ${allCompletedPickupMeals()}`,
        ],
        datasets: [
          {
            label: 'Curbside',
            data: [
              parseInt(allOpenPickupMeals(), 10),
              parseInt(allCompletedPickupMeals(), 10),
            ],
            // backgroundColor: 'green'
            backgroundColor: ['#fe5f55', '#c5dfc4'],
            borderWidth: 1,
            hoverBorderWidth: '3',
            hoverBorderColor: '#000',
            // borderColor:
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            // position: 'top',
          },
          title: {
            display: true,
            text: 'Completed Curbside Requests',
          },
        },
      },
    });
    let studentsChart4 = new Chart(document.getElementById('polarArea'), {
      type: 'pie', // bar, horzontalBar, pie, line, doughnut, radar, ploarArea
      data: {
        labels: [
          `Not Ordered ${userListFiltered().length}`,
          `Ordered ${userListFiltered2().length}`,
        ],
        datasets: [
          {
            label: 'Curbside',
            data: [
              parseInt(userListFiltered().length, 10),
              parseInt(userListFiltered2().length, 10),
            ],
            // backgroundColor: 'green'
            backgroundColor: ['#fe5f55', '#c5dfc4'],
            borderWidth: 1,
            hoverBorderWidth: '3',
            hoverBorderColor: '#000',
            // borderColor:
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            // position: 'top',
          },
          title: {
            display: true,
            text: `Registered but Not Ordered`,
          },
        },
      },
    });
    // let studentsChart4 = new Chart(document.getElementById('polarArea'), {
    //   type: 'radar', // bar, horzontalBar, pie, line, doughnut, radar, ploarArea
    //   data: {
    //     labels: ['BES', 'OHES', 'ROES', 'MCMS', 'OPHS', 'OVHS'],
    //     datasets: [
    //       {
    //         label: 'Number of Meals',
    //         data: [
    //           parseInt(
    //             pickupMealsBySchool('BES', 'a-group') +
    //               pickupMealsBySchool('BES', 'b-group'),
    //             10
    //           ),
    //           parseInt(
    //             pickupMealsBySchool('OHES', 'a-group') +
    //               pickupMealsBySchool('OHES', 'b-group'),
    //             10
    //           ),
    //           parseInt(
    //             pickupMealsBySchool('ROES', 'a-group') +
    //               pickupMealsBySchool('ROES', 'b-group'),
    //             10
    //           ),
    //           parseInt(
    //             pickupMealsBySchool('MCMS', 'a-group') +
    //               pickupMealsBySchool('MCMS', 'b-group'),
    //             10
    //           ),
    //           parseInt(pickupMealsBySchool('OPHS', 'a-group'), 10),
    //           parseInt(pickupMealsBySchool('OVHS', 'a-group'), 10),
    //         ],
    //         // backgroundColor: 'green'
    //         backgroundColor: [
    //           '#b8d8d8',
    //           '#7a9e9f',
    //           '#4f6367',
    //           '#eef5db',
    //           '#fe5f55',
    //           '#c5dfc4',
    //         ],
    //         borderWidth: 1,
    //         hoverBorderWidth: '3',
    //         hoverBorderColor: '#000',
    //         // borderColor:
    //       },
    //     ],
    //   },
    //   options: {
    //     responsive: true,
    //     plugins: {
    //       legend: {
    //         display: false,
    //         // position: 'top',
    //       },
    //       title: {
    //         display: false,
    //         text: 'Requests By School',
    //       },
    //     },
    //   },
    // });

    return () => {
      studentsChart.destroy();
      studentsChart2.destroy();
      studentsChart3.destroy();
      studentsChart4.destroy();
    };
  }, [meals]);

  const Title = ({ pickupDate, pickupButton }) => {
    // not sure what it does
    return (
      <div className="h2 text-center pb-3">
        <span className='text-danger'> {requests.length}</span> - Meal Requests for Friday Pickup{' '}
        {`${moment(pickupDate).subtract(3, 'day').format('MMMM Do')}`} Week of{' '}
        {`${pickupDate}`} {`${pickupButton}`}
      </div>
    );
  };

  return (
    <Layout>
      {/* <Head>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.1.1/chart.min.js"
          integrity="sha512-BqNYFBAzGfZDnIWSAEGZSD/QFKeVxms2dIBPfw11gZubWwKUjEgmFUtUls8vZ6xTRZN/jaXGHD/ZaxD9+fDo0A=="
          crossOrigin="anonymous"
        ></script>
      </Head> */}

      <br />
      <div
        className=""
        style={{
          // color: 'grey',
          border: '1px solid grey',
          padding: '30px',
          boxShadow: '4px 3px 7px 2px rgba(0,0,0,0.2)',
          borderRadius: '8px',
          borderBlock: '5px',
        }}
      >
        <div className="h2 text-center pb-3">
          Friday Pickup{' '}
          {`${moment(pickupDate).subtract(3, 'day').format('MMMM Do')}`} Week of{' '}
          {`${pickupDate}`} {`${pickupButton}`}
        </div>

        <div className="">
          {/* <hr className="col-md-3"/> */}

          <div className="row align-items-center">
            <div className="col">
              <div className="">
                <Calendar
                  // className={styles.reactCalendar}
                  onChange={(e) => onDateChange(e)}
                  // activeStartDate={twoWeeksFromNow}
                  // maxDate={summerFromNow}
                  // activeStartDate={moment(new Date()).add(14, 'day').format('l')}
                  tileDisabled={handleDisabledDates}
                  value={new Date()}
                  value={''}
                />
              </div>
              <button onClick={(e) => resetTimeSelect(e)}>All</button>
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
            <div className="col-sm-7 pt-4 float-right">
              {<canvas className=" " id="myBarChart"></canvas>}
              <br />
              {/* <button onClick={(e) => handleUserList(e)}>User List</button>
            {error && showErrorMessage(error)} */}
            </div>
            <div className="row pt-4">
              <div className="col-sm-4 p-4">
                {<canvas className=" " id="myChart"></canvas>}
              </div>

              <div className="col-sm-4 p-4">
                <CSVLink
                  className=""
                  headers={emailHeaders}
                  filename={`unfulfilled_curbside_email_list_${pickupDate}_${pickupButton}-CSV`}
                  data={userList.filter((user) =>
                    pickupButton
                      ? requests
                          .filter(
                            (mealRequest) =>
                              mealRequest.pickupTime === pickupButton
                          )
                          .filter((m) => m.pickupTime !== 'Cafeteria')
                          .filter((m) => m.orderStatus === false)
                          .map((request) => request.postedBy.email)
                          // .filter((request) => request.orderStatus != true).map(request => request.postedBy.email)
                          .includes(user.email)
                      : requests
                          .filter((m) => m.pickupTime !== 'Cafeteria')
                          .filter((m) => m.orderStatus === false)
                          .map((request) => request.postedBy.email)
                          // .filter((request) => request.orderStatus != true).map(request => request.postedBy.email)
                          .includes(user.email)
                  )}
                >
                  {<canvas className=" " id="completedChart"></canvas>}
                </CSVLink>
              </div>
              <div className="col-sm-4 p-4">
                <CSVLink
                  className=""
                  filename={`users_not_ordered_for_${pickupDate}-CSV`}
                  headers={emailHeaders}
                  data={userList.filter(
                    (user) =>
                      !requests
                        .map((request) => request.postedBy.email)
                        .includes(user.email)
                  )}
                >
                  {<canvas className=" " id="polarArea"></canvas>}
                </CSVLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <hr /> */}

      {/* <div className="row pt-5 pb-5 ml-3">
        <div className="col-sm-4 mb-3">
          <b className="h2 text-danger">{requests.length}</b> -{' '}
          <b className="h2 ">Meal Requests</b>
        </div> */}
        {/* <div className="col"> */}
          {/* {user.userCode === 'LYF' && (
            <CSVLink
              className="btn btn-sm btn-outline-dark text float-right mr-3 mb-3"
              headers={emailHeaders}
              data={userList.filter(
                (user) =>
                  !requests
                    .map((request) => request.postedBy.email)
                    .includes(user.email)
              )}
            >
              Email List of {userListFiltered().length} users who haven't
              ordered CSV{' '}
            </CSVLink>
          )}
          {user.userCode === 'DOOB' && (
            <CSVLink
              className="btn btn-sm btn-outline-dark text float-right mr-3 mb-3"
              headers={emailHeaders}
              data={userList.filter(
                (user) =>
                  !requests
                    .map((request) => request.postedBy.email)
                    .includes(user.email)
              )}
            >
              Email List of {userListFiltered().length} users who haven't
              ordered CSV{' '}
            </CSVLink>
          )} */}
          {/* &nbsp;&nbsp; */}
          {/* {user.userCode === 'LYF' && (
            <CSVLink
              className="btn btn-sm btn-outline-dark text float-right mr-3"
              headers={emailHeaders}
              filename="all_registered_users_email_list-CSV"
              data={userList}
            >
              Full Email List of {userList.length} users CSV{' '}
            </CSVLink>
          )}
          {user.userCode === 'DOOB' && (
            <CSVLink
              className="btn btn-sm btn-outline-dark text float-right mr-3"
              headers={emailHeaders}
              filename="all_registered_users_email_list-CSV"
              data={userList}
            >
              Full Email List of {userList.length} users CSV{' '}
            </CSVLink>
          )} */}
        {/* </div> */}
      {/* </div> */}

      {/* {filter((l) =>
        l.postedBy.students
          .map((s) => s.name.toLowerCase())
          .toString()
          .includes(search.toLowerCase())
      )} */}

      {console.log(
        // This shows descripency with All Onsite numbers first filter returning more. Including all the orders with breakfast pickups.
        'totals check OR sesame check',
        requests
          // .filter((request) => request.pickupTime != 'Cafeteria')
          .filter((l) =>
            l.mealRequest
              .map((s) => s.meal)
              .toString()
              .includes('Standard Onsite')
          )
          .filter(
            (l) =>
              !l.mealRequest.every((meal) => meal.meal == 'Standard Onsite')
          ).length,
        userList.filter((user) =>
          requests // sesame
            // .filter((request) => request.pickupTime != 'Cafeteria')
            .filter((request) =>
              request.mealRequest
                .map((s) => s.meal)
                .toString()
                .includes('Vegan')
            )
            .map((request) => request.postedBy.email)
            .includes(user.email)
        )
      )}

      {
        // this returns the user information that has a certain peram (meal here) in their mealRequest
        console.log(
          'userList vs mealRequest',
          userList.filter((user) =>
            requests // sesame
              // .filter((request) => request.pickupTime != 'Cafeteria')
              .filter(
                (request) =>
                  request.mealRequest
                    .map((s) => s.meal)
                    .toString()
                    .includes('Vegan') // meal in their request
              )
              .map((request) => request.postedBy.email)
              .includes(user.email)
          )
        )
      }

      {
        // let's find sesame
        console.log(
          'sesame user finder',
          userList.filter((user) =>
            user.students
              .map((student) => student.foodAllergy.dairy)
              .includes(true)
          )
        )
      }
      <div className="p-4"></div>
      <Title  pickupDate={pickupDate} pickupButton={pickupButton} />
      <div className="row" id="dataCards">
        <div className="col-sm-4 pb-4" id="curbside">
          <div
            id="inner"
            style={{
              // color: 'grey',
              border: '1px solid grey',
              padding: '30px',
              boxShadow: '4px 4px 7px 0px rgba(0,0,0,0.2)',
              borderRadius: '8px',
              // borderBlock: '5px',
            }}
          >
            <b className="text-danger h3">
              {requests.filter((meal) => meal.pickupTime != 'Cafeteria').length}
            </b>{' '}
            - <b className=" h3">All Curbside</b>
            {user.userCode === 'DOOB' && (
              <CSVLink
                className="badge btn btn-sm btn-outline-dark text float-right"
                filename={`all_curbside_orders_email_list_${pickupDate}-CSV`}
                headers={emailHeaders}
                data={userList.filter((user) =>
                  requests
                    .filter((request) => request.pickupTime != 'Cafeteria')
                    .map((request) => request.postedBy.email)
                    .includes(user.email)
                )}
              >
                Curbside{' '}
              </CSVLink>
            )}
            {user.userCode === 'LYF' && (
              <CSVLink
                className="badge btn btn-sm btn-outline-dark text float-right "
                filename="all_curbside_orders_email_list-CSV"
                headers={emailHeaders}
                data={userList.filter((user) =>
                  requests
                    .filter((request) => request.pickupTime != 'Cafeteria')
                    .map((request) => request.postedBy.email)
                    .includes(user.email)
                )}
              >
                Curbside{' '}
              </CSVLink>
            )}
            <p />
            <hr />
            <b className="text-danger">{allOpenPickupMeals()}</b> - Unfulfilled
            Curbside
            <div className="">
              {/* {user.userCode === 'LYF' && (
                <CSVLink
                  className="badge btn btn-sm btn-outline-dark text float-right"
                  headers={emailHeaders}
                  filename="unfulfilled_curbside_email_list-CSV"
                  data={userList.filter((user) =>
                    requests
                    .filter((mealRequest) => mealRequest.pickupTime === pickupButton)
                      .filter(
                        (request) =>
                          request.pickupTime != 'Cafeteria' &&
                          request.orderStatus != true
                      )
                      .map((request) => request.postedBy.email)
                      // .filter((request) => request.orderStatus != true).map(request => request.postedBy.email)
                      .includes(user.email)
                  )}
                >
                  Unfulfilled{' '}
                </CSVLink>
              )}
              {user.userCode === 'DOOB' && (
                <CSVLink
                  className="badge btn btn-sm btn-outline-dark text float-right"
                  headers={emailHeaders}
                  filename="unfulfilled_curbside_email_list-CSV"
                  data={userList.filter((user) =>
                    requests
                      .filter(
                        (request) =>
                          request.pickupTime != 'Cafeteria' &&
                          request.orderStatus != true
                      )
                      .map((request) => request.postedBy.email)
                      // .filter((request) => request.orderStatus != true).map(request => request.postedBy.email)
                      .includes(user.email)
                  )}
                >
                  Unfulfilled{' '}
                </CSVLink>
              )} */}
              <p />
              <b className="text-danger">{allCompletedPickupMeals()}</b> -
              Fulfilled Curbside
            </div>
            <hr />
            <b className="h5">Curbside Kitchen Prep Data</b>
            <div className="pt-3"></div>
            <b className="text-danger">{bagsCounter()}</b> - Total Bags <p />
            <b className="text-danger">{pickupMealsForLunch()}</b> - Individual
            Curbside Lunches <p />
            <b className="text-danger">{pickupMealsForBreakfast()}</b> -
            Individual Curbside Breakfasts
            {/* <hr/>
            <hr/>
            <b className="h3 text-danger">{allOnsiteMeals()}</b> - <b className="h3 ">All Onsite</b>{' '}
            <hr />
              <b className='h5'>Onsite Kitchen Prep Data</b>
              <div className="pt-3"></div>
              <b className="text-danger">{allIndividualOnsiteMeals()}</b> -
              Individual Onsite Meals
              <div className="p-1"></div> */}
          </div>
          <div
            className="mt-3"
            id="inner"
            style={{
              // color: 'grey',
              border: '1px solid grey',
              padding: '30px',
              boxShadow: '4px 4px 7px 0px rgba(0,0,0,0.2)',
              borderRadius: '8px',
              // borderBlock: '5px',
            }}
          >
            {/* <b className="text-danger h3">
              {requests.filter((meal) => meal.pickupTime != 'Cafeteria').length}
            </b>{' '}
            - <b className=" h3">All Curbside</b>
            {user.userCode === 'DOOB' && (
              <CSVLink
                className="badge btn btn-sm btn-outline-dark text float-right"
                headers={emailHeaders}
                data={userList.filter((user) =>
                  requests
                    .filter((request) => request.pickupTime != 'Cafeteria')
                    .map((request) => request.postedBy.email)
                    .includes(user.email)
                )}
              >
                Curbside CSV{' '}
              </CSVLink>
            )}
            {user.userCode === 'LYF' && (
              <CSVLink
                className="badge btn btn-sm btn-outline-dark text float-right "
                headers={emailHeaders}
                data={userList.filter((user) =>
                  requests
                    .filter((request) => request.pickupTime != 'Cafeteria')
                    .map((request) => request.postedBy.email)
                    .includes(user.email)
                )}
              >
                Curbside CSV{' '}
              </CSVLink>
            )}
            <p />
            <hr />
            <b className="text-danger">{allOpenPickupMeals()}</b> - Unfulfilled
            Curbside
            <div className="">
              {user.userCode === 'LYF' && (
                <CSVLink
                  className="badge btn btn-sm btn-outline-dark text float-right"
                  headers={emailHeaders}
                  data={userList.filter((user) =>
                    requests
                      .filter(
                        (request) =>
                          request.pickupTime != 'Cafeteria' &&
                          request.orderStatus != true
                      )
                      .map((request) => request.postedBy.email)
                      // .filter((request) => request.orderStatus != true).map(request => request.postedBy.email)
                      .includes(user.email)
                  )}
                >
                  Unfulfilled CSV{' '}
                </CSVLink>
              )}
              {user.userCode === 'DOOB' && (
                <CSVLink
                  className="badge btn btn-sm btn-outline-dark text float-right"
                  headers={emailHeaders}
                  data={userList.filter((user) =>
                    requests
                      .filter(
                        (request) =>
                          request.pickupTime != 'Cafeteria' &&
                          request.orderStatus != true
                      )
                      .map((request) => request.postedBy.email)
                      // .filter((request) => request.orderStatus != true).map(request => request.postedBy.email)
                      .includes(user.email)
                  )}
                >
                  Unfulfilled{' '}
                  CSV{' '}
                </CSVLink>
              )}
              <p />
              <b className="text-danger">{allCompletedPickupMeals()}</b> -
              Fulfilled Curbside
            </div>
            <hr />
            <b className="h5">Curbside Kitchen Prep Data</b>
            <div className="pt-3"></div>
            <b className="text-danger">{pickupMealsForLunch()}</b> - Individual
            Curbside Lunches <p />
            <b className="text-danger">{pickupMealsForBreakfast()}</b> -
            Individual Curbside Breakfasts
            <hr/>
            <hr/> */}
            <b className="h3 text-danger">{allOnsiteMeals()}</b> -{' '}
            <b className="h3 ">All Onsite</b> <hr />
            <b className="h5">Onsite Kitchen Prep Data</b>
            <div className="pt-3"></div>
            <b className="text-danger">{allIndividualOnsiteMeals()}</b> -
            Individual Onsite Meals
            <div className="p-1"></div>
          </div>
        </div>
        <div className="col-sm-4 pb-4" id="standardRequests">
          <div
            id="inner"
            style={{
              // color: 'grey',
              border: '1px solid grey',
              padding: '30px',
              boxShadow: '4px 4px 7px 0px rgba(0,0,0,0.2)',
              borderRadius: '8px',
              // borderBlock: '5px',
            }}
          >
            {/* <b className="h3">Curbside Requests</b>
            <hr /> */}
            <b className="h5 strong">Standard Requests</b>
            <hr />
            <div className="">
              <h6>
                {mealCounter('Standard', 'Breakfast and Lunch')} -{' '}
                <b>Standard</b> Breakfast and Lunch
                <br />
                <br />
                {lunchOnlymealCounter('Standard', 'Lunch Only')} -{' '}
                <b>Standard</b> Lunch Only
                <br />
                <br />
                {mealCounter('Vegetarian', 'Breakfast and Lunch')} -{' '}
                <b>Vegetarian</b> Breakfast and Lunch
                <br />
                <br />
                {lunchOnlymealCounter('Vegetarian', 'Lunch Only')} -{' '}
                <b>Vegetarian</b> Lunch Only
                <br />
                <br />
                {mealCounter('Vegan', 'Lunch Only')} - <b>Vegan</b> Meals
                <br />
                <br />
                {mealCounter('Gluten Free', 'Lunch Only')} - <b>Gluten Free</b>{' '}
                Meals
                <br />
                <br />
                {mealCounter('Standard Dairy Free', 'Lunch Only')} -{' '}
                <b>Dairy Free</b> Meals
                <br />
                <br />
                {mealBreakfastOnlyCounter('Standard Onsite')} -{' '}
                <b>BREAKFAST ONLY </b> Meals
                {/* {lunchOnlyMealCounter('Standard')} - <b>LUNCH ONLY</b> Standard
          <hr />
          {lunchOnlyMealCounter('Vegetarian')} - <b>LUNCH ONLY</b> Vegetarian */}
                <hr />
                <b className="h5">Special Requests</b>
                <hr />
                <div className="">
                  <h6>
                    {mealCounter('Vegan B', 'Breakfast and Lunch')} -{' '}
                    <b>Vegan</b> with Breakfast
                    <br />
                    <br />
                    {mealCounter(
                      'Gluten Free with Breakfast',
                      'Breakfast and Lunch'
                    )}{' '}
                    - <b>Gluten Free</b> with Breakfast
                    <br />
                    <br />
                    {mealCounter('Gluten Free Dairy Free', 'Lunch Only')} -{' '}
                    <b>Gluten Free Dairy Free</b>
                    <br />
                    <br />
                    {mealCounter(
                      '2on 3off',
                      'Two Onsite / Three Breakfast and Lunches'
                    )}{' '}
                    - <b>Two On Three Off</b>
                    {/* <br />
                    <br />
                    {sesameMealCounter('Standard Sesame Free')} - Standard
                    Sesame Free Meals
                    <br />
                    <br />
                    {sesameMealCounter('Vegetarian Sesame Free')} - Vegetarian
                    Sesame Free Meals
                    <br />
                    <br />
                    {sesameMealCounter('Vegan Sesame Free')} - Vegan Sesame Free
                    Meals
                    <br />
                    <br />
                    {sesameMealCounter('Sesame Dairy Free')} - Sesame Dairy Free
                    Meals
                    <br />
                    <br />
                    {sesameMealCounter('Sesame Dairy Free')} - Sesame Dairy Free
                    Meals
                    <br />
                    <br />
                    {mealCounter('None', 'None')} - None Meals */}
                  </h6>
                </div>
              </h6>
            </div>
          </div>
        </div>

        {/* <div className="col-sm-4 pb-4" id="standardRequests">
          <div
            id="inner"
            style={{
              // color: 'grey',
              border: '1px solid grey',
              padding: '30px',
              boxShadow: '4px 4px 7px 0px rgba(0,0,0,0.2)',
              borderRadius: '8px',
              // borderBlock: '5px',
            }}
          >
            <b className="h4">Special Requests</b>
            <hr />
            <div className="">
              <h6>
                {mealCounter('Vegan B', 'Breakfast and Lunch')} - <b>Vegan</b>{' '}
                with Breakfast
                <br />
                <br />
                {mealCounter(
                  'Gluten Free with Breakfast',
                  'Breakfast and Lunch'
                )}{' '}
                - <b>Gluten Free</b> with Breakfast
                <br />
                <br />
                {mealCounter('Gluten Free Dairy Free', 'Lunch Only')} -{' '}
                <b>Gluten Free Dairy Free</b>
                <br />
                <br />
                {mealCounter(
                  '2on 3off',
                  'Two Onsite / Three Breakfast and Lunches'
                )}{' '}
                - <b>Two On Three Off</b>
                <br />
                <br />
                {sesameMealCounter('Standard Sesame Free')} - Standard Sesame
                Free Meals
                <br />
                <br />
                {sesameMealCounter('Vegetarian Sesame Free')} - Vegetarian
                Sesame Free Meals
                <br />
                <br />
                {sesameMealCounter('Vegan Sesame Free')} - Vegan Sesame Free
                Meals
                <br />
                <br />
                {sesameMealCounter('Sesame Dairy Free')} - Sesame Dairy Free
                Meals
                <br />
                <br />
                {sesameMealCounter('Sesame Dairy Free')} - Sesame Dairy Free
                Meals
                <br />
                <br />
                {mealCounter('None', 'None')} - None Meals
              </h6>
            </div>
          </div>
        </div> */}
        {/* <div className="col-sm-4 pb-4" id="onsiteData">
          <div
            id="inner"
            style={{
              // color: 'grey',
              border: '1px solid grey',
              padding: '30px',
              boxShadow: '4px 4px 7px 0px rgba(0,0,0,0.2)',
              borderRadius: '8px',
              // borderBlock: '5px',
            }}
          >
            
          </div>
        </div> */}

        <div className="col-sm-4 pb-4" id="onsiteData">
          <div
            id="inner"
            style={{
              // color: 'grey',
              border: '1px solid grey',
              padding: '30px',
              boxShadow: '4px 4px 7px 0px rgba(0,0,0,0.2)',
              borderRadius: '8px',
              // borderBlock: '5px',
            }}
          >
            <b className="h4">Onsite School Numbers</b>
            <div className="pl-3">
              <hr />
              <h6>
                <b className="text-danger">
                  {pickupMealsBySchool('BES', 'a-group') +
                    pickupMealsBySchool('BES', 'b-group')}{' '}
                </b>{' '}
                - BES
                <br />
                <div className="px-2">
                  {pickupMealsBySchool('BES', 'a-group')} - BES A
                  <br />
                  {pickupMealsBySchool('BES', 'b-group')} - BES B
                </div>
                <hr />
                <b className="text-danger">
                  {pickupMealsBySchool('OHES', 'a-group') +
                    pickupMealsBySchool('OHES', 'b-group')}{' '}
                </b>{' '}
                - OHES
                <br />
                <div className="px-2">
                  {pickupMealsBySchool('OHES', 'a-group')} - OHES A
                  <br />
                  {pickupMealsBySchool('OHES', 'b-group')} - OHES B
                </div>
                <hr />
                <b className="text-danger">
                  {pickupMealsBySchool('ROES', 'a-group') +
                    pickupMealsBySchool('ROES', 'b-group')}{' '}
                </b>{' '}
                - ROES
                <br />
                <div className="px-2">
                  {pickupMealsBySchool('ROES', 'a-group')} - ROES A
                  <br />
                  {pickupMealsBySchool('ROES', 'b-group')} - ROES B
                </div>
                <hr />
                <b className="text-danger">
                  {pickupMealsBySchool('MCMS', 'a-group') +
                    pickupMealsBySchool('MCMS', 'b-group')}{' '}
                </b>{' '}
                - MCMS
                <br />
                <div className="px-2">
                  {pickupMealsBySchool('MCMS', 'a-group')} - MCMS A
                  <br />
                  {pickupMealsBySchool('MCMS', 'b-group')} - MCMS B
                </div>
                <hr />
                {/* <div className="px-2"> */}
                <b className="text-danger">
                  {pickupMealsBySchool('OPHS', 'a-group')}
                </b>{' '}
                - OPHS
                <hr />
                {/* {pickupMealsBySchool('OPHS', 'b-group')} - OPHS B
          <hr /> */}
                <b className="text-danger">
                  {pickupMealsBySchool('OVHS', 'a-group')}
                </b>{' '}
                - OVHS
                {/* </div> */}
                {user.userCode === 'DOOB' && (
                  <CSVLink
                    className="badge btn btn-sm btn-outline-dark text float-right"
                    headers={emailHeaders}
                    data={userList.filter((user) =>
                      requests
                        .filter((request) =>
                          request.mealRequest.filter(
                            (meal) => meal.schoolName === 'OVHS'
                          )
                        )
                        .map((request) => request.postedBy.email)
                        .includes(user.email)
                    )}
                  >
                    OVHS CSV{' '}
                    {
                      userList.filter((user) =>
                        requests
                          .filter((request) =>
                            request.mealRequest.filter(
                              (meal) => meal.schoolName === 'OVHS'
                            )
                          )
                          .map((request) => request.postedBy.email)
                          .includes(user.email)
                      ).length
                    }{' '}
                  </CSVLink>
                )}
                {user.userCode === 'LYF' && (
                  <CSVLink
                    className="badge btn btn-sm btn-outline-dark text float-right"
                    headers={emailHeaders}
                    data={userList.filter((user) =>
                      requests
                        .filter((request) =>
                          request.mealRequest.filter(
                            (meal) => meal.schoolName === 'OVHS'
                          )
                        )
                        .map((request) => request.postedBy.email)
                        .includes(user.email)
                    )}
                  >
                    OVHS CSV{' '}
                    {
                      userList.filter((user) =>
                        requests
                          .filter((request) =>
                            request.mealRequest.filter(
                              (meal) => meal.schoolName === 'OVHS'
                            )
                          )
                          .map((request) => request.postedBy.email)
                          .includes(user.email)
                      ).length
                    }{' '}
                  </CSVLink>
                )}
                <hr />
              </h6>
            </div>
          </div>
          <br />
          {user.userCode === 'DOOB' || user.userCode === 'LYF' ? (
            <CSVLink
              className="btn btn-sm btn-outline-dark text float-right mr-3"
              headers={emailHeaders}
              filename="all_registered_users_email_list-CSV"
              data={userList}
            >
              {/* {!requests.map((request) => request.postedBy.email)} */}
              All {userList.length} users CSV{' '}
              {/* {console.log(
                'test',
                userList.filter((user) =>
                  requests
                    .filter((request) => request.pickupTime != 'Cafeteria')
                    .map((request) => request.postedBy.email)
                    .includes(user.email)
                )
              )} */}
              {/* {console.log('test2', requests.filter(request => request.pickupTime === 'Cafeteria'))} */}
              {/* {console.log('test2', !requests
                .map((request) => request.postedBy.email).includes(user.email))} */}
            </CSVLink>
          ) : (
            ''
          )}
        </div>
        <br />
        {/* {user.userCode === 'DOOB' && (
          <h5>
            <b className="text-danger">
              {userListFiltered().length} users who have not ordered yet for{' '}
              {moment(pickupDate).format('MMMM Do')}
            </b>
          </h5>
        )}
        {user.userCode === 'LYF' && (
          <h5>
            <b className="text-danger">
              {userListFiltered().length} users who have not ordered yet for{' '}
              {moment(pickupDate).format('MMMM Do')}
            </b>
          </h5>
        )} */}
        {/* <h5>email list</h5> */}
        {/* {console.log('test', userList.filter(
            (user) =>
              !requests
                .map((request) => request.postedBy.email)
                .includes(user.email)
          ))} */}

        <br />
        <br />
        {/* Curbside only{' '}
        {
          userList.filter((user) =>
          requests
            .filter((request) => request.pickupTime != 'Cafeteria').map(request => request.postedBy.email)
            .includes(user.email)
        ).length
        }
        <br />
        <CSVLink
          className="btn btn-sm btn-outline-dark text"
          headers={emailHeaders}
          data={userList.filter((user) =>
            requests
              .filter((request) => request.pickupTime != 'Cafeteria').map(request => request.postedBy.email)
              .includes(user.email)
          )}
        >
          Curbside Only CSV{' '}
        </CSVLink> */}
        <br />
        <br />
        {/* {user.userCode === 'LYF' && (
          <table className="table table-striped table-sm table-bordered">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">User Code</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>{userListFiltered()}</tbody>
          </table>
        )}
        {user.userCode === 'DOOB' && (
          <table className="table table-striped table-sm table-bordered">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">User Code</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>{userListFiltered()}</tbody>
          </table>
        )} */}
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
