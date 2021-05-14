import { useState, useEffect, useRef, useCallback } from 'react';
import Router from 'next/router';
import styles from '../../../styles/Home.module.css';
// components and helpers
import Layout from '../../../components/Layout';
import AdminPanel from '../../../components/AdminPanel';
import AddMeal from '../../../components/AddMeal';
import AdminCode from '../../../components/AdminCode';
import SelectMealRequest from '../../../components/SelectMealRequest';
import SelectPickupOption from '../../../components/SelectPickupOption';
import SelectPickupTime from '../../../components/SelectPickupTime';
import SubmitButton from '../../../components/SubmitButton';
import RemoveMeal from '../../../components/RemoveMeal';
import SelectDaysPanel from '../../../components/SelectDaysPanel';
import MealRequestStudent from '../../../components/MealRequestStudent';
import FakeMealRequestForm from '../../../components/FakeMealRequestForm';
import MealRequestCalanderPanel from '../../../components/MealRequestCalanderPanel';
import { getCookie, isAuth } from '../../../helpers/auth';
import withUser from '../../withUser';
import { API } from '../../../config';
// dependencies
import axios from 'axios';
import moment from 'moment';

const Create = ({ token, user }) => {
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState({
    mealRequest: [
      {
        // FIXME: refactor into own state object for mealRequest
        meal:
          user.students[0].group === 'a-group' ||
          user.students[0].group === 'b-group'
            ? 'Standard Onsite'
            : user.students[0].foodAllergy.dairy === false &&
              user.students[0].foodAllergy.gluten === false &&
              user.students[0].foodAllergy.soy === true &&
              user.students[0].foodAllergy.sesame === true
            ? 'Soy and Sesame Free'
            : user.students[0].foodAllergy.soy === false &&
              user.students[0].foodAllergy.sesame === false &&
              user.students[0].foodAllergy.dairy === true &&
              user.students[0].foodAllergy.gluten === true
            ? 'Gluten Free Dairy Free'
            : user.students[0].foodAllergy.soy === false &&
              user.students[0].foodAllergy.sesame === false &&
              user.students[0].foodAllergy.dairy === true &&
              user.students[0].foodAllergy.gluten === false
            ? 'Standard Dairy Free'
            : user.students[0].foodAllergy.soy === false &&
              user.students[0].foodAllergy.sesame === false &&
              user.students[0].foodAllergy.dairy === false &&
              user.students[0].foodAllergy.gluten === true
            ? 'Gluten Free'
            : user.students[0].foodAllergy.soy === true &&
              user.students[0].foodAllergy.sesame === false &&
              user.students[0].foodAllergy.dairy === false &&
              user.students[0].foodAllergy.gluten === false
            ? 'Standard Soy Free'
            : user.students[0].foodAllergy.soy === false &&
              user.students[0].foodAllergy.sesame === true &&
              user.students[0].foodAllergy.dairy === false &&
              user.students[0].foodAllergy.gluten === false
            ? 'Standard Sesame Free'
            : user.students[0].foodAllergy.soy === true &&
              user.students[0].foodAllergy.sesame === true &&
              user.students[0].foodAllergy.dairy === true &&
              user.students[0].foodAllergy.gluten === false
            ? 'Soy Sesame Dairy Free'
            : user.students[0].foodAllergy.soy === true &&
              user.students[0].foodAllergy.sesame === true &&
              user.students[0].foodAllergy.dairy === false &&
              user.students[0].foodAllergy.gluten === true
            ? 'Soy Sesame Gluten Free'
            : user.students[0].foodAllergy.soy === true &&
              user.students[0].foodAllergy.sesame === true &&
              user.students[0].foodAllergy.dairy === true &&
              user.students[0].foodAllergy.gluten === true
            ? 'Soy Sesame Dairy Gluten Free'
            : 'Standard',
        student: user.students[0]._id,
        studentName: user.students[0].name,
        lastName: user.lastName,
        schoolName: user.students[0].schoolName,
        group: user.students[0].group,
        teacher: user.students[0].teacher,
        pickupOption:
          user.students[0].group === 'a-group' ||
          user.students[0].group === 'b-group'
            ? 'Lunch Onsite'
            : user.students[0].foodAllergy.egg === true ||
              user.students[0].foodAllergy.soy === true ||
              user.students[0].foodAllergy.dairy === true ||
              user.students[0].foodAllergy.gluten === true
            ? 'Lunch Only'
            : 'Breakfast and Lunch',
        foodAllergy: user.students[0].foodAllergy,
        parentEmail: user.email,
        parentName: user.name,
        individualPickupTime: '',
        complete: false,
        days:
          user.students[0].group === 'a-group' // a group is monday and tuesday
            ? {
                sunday: false,
                monday: true, // a
                tuesday: true, // a
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
              }
            : user.students[0].group === 'b-group' // b group is wednesday and thursday
            ? {
                sunday: false,
                monday: false,
                tuesday: false,
                wednesday: true, // b
                thursday: true, // b
                friday: false,
                saturday: false,
              }
            : {
                // default is offsite
                sunday: false,
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
              },
      },
    ],
    orderStatus: false,
    userCode: user.userCode,
    pickupCode: user.userCode + '-01',
    pickupCodeInput: '',
    pickupCodeAdd: [''],
    pickupDate: localStorage.getItem('search-date')
      ? moment(JSON.parse(localStorage.getItem('search-date'))).format('l')
      : '',
    pickupTime: '',
    mealWeek: '',
    buttonText: 'Submit',
    success: '',
    error: '',
    students: user.students,
  });
  const {
    pickupCode,
    orderStatus,
    userCode,
    pickupCodeInput,
    students,
    pickupCodeAdd,
    pickupDate,
    mealRequest,
    pickupTime,
    success,
    error,
  } = state;

  // displays loading form for n seconds
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoaded(true);
  //   }, 600);
  // }, []);

  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const imageLoaded = () => setFirstImageLoaded(true);

  const firstImage = useCallback((firstImageNode) => {
    firstImageNode && firstImageNode.addEventListener('load', imageLoaded());
    return () => firstImageNode.removeEventListener('load', imageLoaded());
  }, []);

  useEffect(() => {
    return () => {
      setLoaded(true);
    };
  }, [firstImageLoaded]);
  // reroutes if not signed in
  useEffect(() => {
    !isAuth() && Router.push('/');
  });

  // reads date into local storage
  useEffect(() => {
    const data = localStorage.getItem('search-date');
    if (data) {
      try {
        handleDateChange(JSON.parse(data));
      } catch (error) {
        setState({ ...state, error: error });
      }
      localStorage.removeItem('search-date');
    }
  }, []);

  // sets default pickupTime as onsite 'Cafeteria' if all meals are onsite meals
  useEffect(() => {
    // TODO: refactor into helper or component
    setState({
      ...state,
      pickupTime:
        isAuth().role === 'admin'
          ? '11am-1pm'
          : mealRequest
              .filter((meal) => meal.meal !== 'None')
              .every((meal) => meal.meal === 'Standard Onsite') &&
            mealRequest
              .filter((meal) => meal.meal !== 'None')
              .some((meal) => meal.pickupOption === 'Lunch Onsite')
          ? 'Cafeteria'
          : '',
    });
  }, [mealRequest]);

  // Generates pickup code TODO: reafactor into helper or component
  useEffect(() => {
    let frontCode = [];
    mealRequest.forEach((item) => {
      if (
        item.pickupOption != 'Lunch Onsite' &&
        item.pickupOption != 'Breakfast Only'
      ) {
        switch (item.meal) {
          case 'Standard': // TODO add if statement to handle L instead of blank
            frontCode.push('');
            break;
          // case 'Vegetarian' && !item.pickupOption === 'Lunch Only':
          //   frontCode.push('Vt');
          //   break;
          // I can probably handle all vegetarian cases in the case statement with if statements
          case 'Vegan':
            frontCode.push('Vg');
            break;
          case 'Vegan B':
            frontCode.push('Vgb');
            break;
          case 'Gluten Free':
            frontCode.push('Gf');
            break;
          case 'Gluten Free with Breakfast':
            frontCode.push('Gfb');
            break;
          case 'Standard Dairy Free':
            frontCode.push('Df');
            break;
          case 'Gluten Free Dairy Free':
            frontCode.push('Gfdf');
            break;
          case 'Standard Sesame Free':
            frontCode.push('Sm');
            break;
          case 'Vegetarian Sesame Free':
            frontCode.push('Vtsm');
            break;
          case 'Vegan Sesame Free':
            frontCode.push('Vgsm');
            break;
          case 'Standard Soy Free':
            frontCode.push('Sy');
            break;
          case 'Vegetarian Soy Free':
            frontCode.push('Vtsy');
            break;
          case 'Vegan Soy Free':
            frontCode.push('Vgsy');
            break;
          case 'Soy and Sesame Free':
            frontCode.push('Sp');
            break;
          case 'Soy Sesame Dairy Free':
            frontCode.push('Sp');
            break;
          case 'Soy Sesame Gluten Free':
            frontCode.push('Sp');
            break;
          case 'Soy Sesame Dairy Gluten Free':
            frontCode.push('Sp');
            break;
          case '2on 3off':
            frontCode.push('H');
            break;
          default:
            break;
        }
      }
    });

    mealRequest.forEach((item) => {
      switch (item.pickupOption) {
        case 'Breakfast Only':
          frontCode.push('B');
          break;
        case 'Lunch Onsite / Breakfast Pickup':
          frontCode.push('B');
          break;
        default:
          break;
      }
      item.pickupOption === 'Lunch Only' && item.meal === 'Standard'
        ? frontCode.push('L')
        : null;
      item.pickupOption === 'Lunch Only' && item.meal === 'Vegetarian'
        ? frontCode.push('Lv')
        : null;
      item.pickupOption === 'Breakfast and Lunch' && item.meal === 'Vegetarian'
        ? frontCode.push('Vt')
        : null;
    });
    let newPickupCode =
      frontCode.join('') + '-' + user.userCode + '-0' + mealRequest.length;

    setState({
      ...state,
      buttonText: 'Submit',
      pickupCode: newPickupCode,
      pickupCodeAdd: frontCode, // FIXME: i don't think i need this
      success: '',
      error: '',
    });
  }, [mealRequest]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API}/link`,
        {
          mealRequest,
          pickupTime,
          pickupDate,
          // username, // don't think i need this
          pickupCode,
          pickupCodeAdd,
          orderStatus,
          userCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setState({
        ...state,
        success: 'Request was created',
        error: '',
      });

      isAuth().role === 'admin'
        ? setTimeout(() => {
            Router.push('/user');
          }, 2000)
        : setTimeout(() => {
            Router.push('/user');
          }, 2000);

      return () => clearTimeout();
    } catch (error) {
      console.log('LINK SUBMIT ERROR', error);
      setState({ ...state, error: error.response.data.error });
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API}/mock-link`,
        {
          mealRequest,
          pickupTime,
          pickupDate,
          // username, // don't think i need this
          pickupCode,
          pickupCodeAdd,
          orderStatus,
          userCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // reset state
      setState({
        ...state,
        success: 'Admin request was created',
        error: '',
      });

      isAuth().role === 'admin'
        ? setTimeout(() => {
            Router.push('/user');
          }, 2000)
        : setTimeout(() => {
            Router.push('/user');
          }, 2000);
    } catch (error) {
      console.log('LINK SUBMIT ERROR', error);
      setState({ ...state, error: error.response.data.error });
    }
  };

  return (
    <div className={styles.background}>
      <Layout>
        {loaded ? (
          <div className="col-md-6 offset-md-3 pt-4">
            <div className={styles.subcard}>
              <MealRequestCalanderPanel
                pickupDate={pickupDate}
                auth={isAuth()}
                state={state}
                setState={setState}
              />
              <hr />
              <AdminCode
                state={state}
                setState={setState}
                auth={isAuth()}
                pickupCodeInput={pickupCodeInput}
              />
              <div className="row">
                <div className="col-md-12">
                  {state.mealRequest.map((x, i) => {
                    return (
                      <>
                        <MealRequestStudent
                          i={i}
                          state={state}
                          auth={isAuth()}
                        />
                        <AdminPanel
                          index={i}
                          meal={x}
                          setState={setState}
                          state={state}
                          auth={isAuth()}
                        />
                        <SelectMealRequest
                          i={i}
                          user={user}
                          meal={state.mealRequest[i].meal}
                          student={students[i]}
                          state={state}
                          setState={setState}
                        />
                        <SelectPickupOption
                          i={i}
                          x={x}
                          state={state}
                          setState={setState}
                          auth={isAuth()}
                          user={user}
                        />
                        <SelectDaysPanel
                          i={i}
                          x={x}
                          auth={isAuth()}
                          state={state}
                          setState={setState}
                        />
                        <hr />
                      </>
                    );
                  })}
                  <div>
                    <AddMeal
                      state={state}
                      setState={setState}
                      user={user}
                      mealRequest={mealRequest}
                      pickupCodeAdd={pickupCodeAdd}
                    />
                    <RemoveMeal state={state} setState={setState} />
                  </div>
                </div>
                <div className="col-md-6 p-3">
                  <SelectPickupTime
                    auth={isAuth()}
                    mealRequest={mealRequest}
                    state={state}
                    setState={setState}
                    pickupTime={pickupTime}
                  />
                  <SubmitButton
                    auth={isAuth()}
                    userCode={user.userCode}
                    success={success}
                    error={error}
                    mealRequest={mealRequest}
                    handleAdminSubmit={handleAdminSubmit}
                    handleSubmit={handleSubmit}
                    pickupCodeAdd={pickupCodeAdd}
                    pickupCodeInput={pickupCodeInput}
                    state={state}
                    setState={setState}
                    token={token}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <FakeMealRequestForm />
            <img
              ref={firstImage}
              hidden
              src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step3b.png"
              // loading="lazy"
              alt=""
              class="stepimage"
              width="320"
            />
          </>
        )}
      </Layout>
      <div className="p-5"></div>
    </div>
  );
};

Create.getInitialProps = ({ req, user }) => {
  const token = getCookie('token', req);
  return { token, user };
};

export default withUser(Create);
