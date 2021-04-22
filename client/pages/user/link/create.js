import styles from '../../../styles/Home.module.css';
import { useState, useEffect, useRef } from 'react';
import Layout from '../../../components/Layout';
import Toggle from '../../../components/Toggle';
import { getCookie, isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import axios from 'axios';
import withUser from '../../withUser';
import moment from 'moment';
import Router from 'next/router';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import PickupDate from '../../../helpers/pickupDate';

const Create = ({ token, user }) => {
  // useEffect(() => {
  //   // !isAuth() && Router.push('/');
  //   user.students.length === 0 && Router.push('/user/profile/add');
  // }, []);
  const username = user.username;
  const [showSearch, setShowSearch] = useState(false);

  // state

  const [state, setState] = useState({
    mealRequest: [
      {
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
          user.students[0].group === 'a-group'
            ? {
                sunday: false,
                monday: true,
                tuesday: false,
                wednesday: true,
                thursday: false,
                friday: false,
                saturday: false,
              }
            : user.students[0].group === 'b-group'
            ? {
                sunday: false,
                monday: false,
                tuesday: true,
                wednesday: false,
                thursday: true,
                friday: false,
                saturday: false,
              }
            : {
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
      : '', //moment("2021-02-16").format('MM dd'), // get a state.pickupDate from a get request maybe from a created menu
    pickupTime: '',
    mealWeek: '',
    buttonText: 'Submit',
    success: '',
    error: '',
    students: user.students,
  });
  const {
    studentName,
    onsiteMealRequest,
    pickupCode,
    foodAllergy,
    orderStatus,
    userCode,
    pickupCodeInput,
    students,
    pickupCodeAdd,
    pickupDate,
    mealRequest,
    pickupTime,
    title,
    url,
    success,
    error,
    type,
    medium,
  } = state;
  // console.log('MEAL REQ', mealRequest);
  const [loaded, setLoaded] = useState(false);

  const calendarButton = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (
        calendarButton.current &&
        !calendarButton.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  });

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 600);
  }, []);

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
    }
  }, []);

  // puts date into localstorage
  useEffect(() => {
    localStorage.removeItem('search-date');
    // localStorage.setItem('search-date', JSON.stringify(pickupDate));
    // localStorage.setItem('curbsideToggle', JSON.stringify(orderType));
  }, []);

  // conditions: mealRequest has only Onsite Standard meals. So if nothing other than that exists than true.
  useEffect(() => {
    setState({
      ...state,
      pickupTime:
        isAuth().role === 'admin'
          ? '11am-1pm'
          : mealRequest
              .filter(
                (meal) => meal.meal !== 'None'
                // meal.pickupOption !== 'Lunch Onsite / Breakfast Pickup'
              )
              .every((meal) => meal.meal === 'Standard Onsite') && // im confused this should be Lunch Onsite
            mealRequest
              .filter(
                (meal) => meal.meal !== 'None'
                // meal.pickupOption !== 'Lunch Onsite / Breakfast Pickup'
              )
              .some((meal) => meal.pickupOption === 'Lunch Onsite')
          ? 'Cafeteria'
          : '',
    });
  }, [mealRequest]);

  // this handles the front code. Others are redundent I think.
  useEffect(() => {
    let frontCode = [];
    mealRequest.forEach((item) => {
      if (
        item.pickupOption != 'Lunch Onsite' &&
        item.pickupOption != 'Breakfast Only'
      ) {
        switch (item.meal) {
          case 'Standard':
            frontCode.push('');
            break;
          // case 'Vegetarian' && !item.pickupOption === 'Lunch Only':
          //   frontCode.push('Vt');
          //   break;
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
      pickupCodeAdd: frontCode,
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
  }, [mealRequest]);

  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDate: moment(pickupDate).format('l') });
    setShowSearch(!showSearch);
  };

  const handleDisabledDates = ({ date, view }) =>
    date.getDay() !== 1 ||
    date.getMonth() === 5 ||
    (date.getMonth() === 6 && date !== '2021-04-31');

  // meal request select
  const handleSelectChange = (
    e,
    student,
    studentName,
    schoolName,
    group,
    teacher,
    pickupOption,
    foodAllergy
  ) => {
    let i = e.target.getAttribute('data-index');

    let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
    let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at

    let input = e.target.value;
    let frontCode = '';
    let pickupOptionLO = '';
    let groupLO = '';
    switch (input) {
      // specials
      case 'Lunch Only' && code.meal === 'Vegetarian':
        // frontCode = 'Lv';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Lunch Only' && code.meal === 'Standard':
        // frontCode = 'L';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Breakfast Only':
        // frontCode = 'B';
        pickupOptionLO = 'Breakfast Only';
        break;
      case 'Vegan B': // Vegan with breakfast
        // frontCode = 'Vgb';
        pickupOptionLO = 'Breakfast and Lunch';
        break;
      case 'Gluten Free with Breakfast':
        // frontCode = 'Gfb'; // gf with breakfast
        pickupOptionLO = 'Breakfast and Lunch';
        break;
      case '2on 3off':
        // frontCode = 'H';
        pickupOptionLO = 'Two Onsite / Three Breakfast and Lunches';
        break;

      // standard options
      case 'Standard':
        // frontCode = '';
        pickupOptionLO = 'Breakfast and Lunch';
        break;
      case 'Vegetarian':
        // frontCode = 'Vt';
        pickupOptionLO = 'Breakfast and Lunch';
        break;
      case 'Vegan':
        // frontCode = 'Vg';
        pickupOptionLO = 'Lunch Only';
        break;

      // gluten dairy options
      case 'Gluten Free':
        // frontCode = 'Gf';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Standard Dairy Free':
        // frontCode = 'Df';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Gluten Free Dairy Free':
        // frontCode = 'Gfdf';
        pickupOptionLO = 'Lunch Only';
        break;

      // sesame gluten dairy combos
      case 'Gluten Sesame Free':
        // frontCode = 'Gfsm';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Sesame Dairy Free':
        // frontCode = 'Sp';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Sesame Dairy Gluten Free':
        // frontCode = 'Sp';
        pickupOptionLO = 'Lunch Only';
        break;

      // sesame options
      case 'Standard Sesame Free':
        // frontCode = 'Sm';
        pickupOptionLO = 'Breakfast and Lunch';
        break;
      case 'Vegetarian Sesame Free':
        // frontCode = 'Vtsm';
        pickupOptionLO = 'Breakfast and Lunch';
        break;
      case 'Vegan Sesame Free':
        // frontCode = 'Vgsm';
        pickupOptionLO = 'Lunch Only';
        break;

      // soy options
      case 'Standard Soy Free':
        // frontCode = 'Sy';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Vegetarian Soy Free':
        // frontCode = 'Vtsy';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Vegan Soy Free':
        // frontCode = 'Vgsy';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Gluten Soy Free':
        // frontCode = 'Gfsy';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Soy and Sesame Free':
        // frontCode = 'Sp';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Soy Dairy Free':
        // frontCode = 'Dfsy';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Soy Sesame Dairy Free':
        // frontCode = 'Sp';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Soy Sesame Gluten Free':
        // frontCode = 'Sp';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Soy Sesame Dairy Gluten Free':
        // frontCode = 'Sp';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Soy Dairy Gluten Free':
        // frontCode = 'Sp';
        pickupOptionLO = 'Lunch Only';
        break;

      // other
      case 'Standard Onsite':
        // frontCode = 'Onsite';
        pickupOptionLO = 'Lunch Onsite';
        break;
      case 'None':
        // frontCode = 'None';
        pickupOptionLO = 'None';
        // group = 'None';
        break;
      default:
        break;
    }

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
    meal.foodAllergy = foodAllergy;

    meals[i] = meal; // puts meal[i] back into mealRequest array

    setState({
      ...state,
      mealRequest: [...meals],
      buttonText: 'Submit',
      // pickupCodeAdd: codes,
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
  };

  const handleDayChange = (day) => (e) => {
    let i = e.target.getAttribute('data-index');
    let value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
    let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    meal.days[day] = value;

    meals[i] = meal; // puts meal[i] back into mealRequest array

    setState({
      ...state,
      mealRequest: [...meals],
      buttonText: 'Submit',
      // pickupCodeAdd: codes,
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
  };

  const selectMealRequest = (
    i,
    student,
    studentName,
    schoolName,
    group,
    teacher,
    pickupOption,
    foodAllergy
  ) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            // value={state.value}
            data-index={i}
            defaultValue={'Standard'}
            value={state.mealRequest[i].meal}
            onChange={(e) =>
              handleSelectChange(
                e,
                student,
                studentName,
                schoolName,
                group,
                teacher,
                pickupOption,
                foodAllergy
              )
            }
            className="form-control"
          >
            {' '}
            <option disabled value="">
              Choose an option
            </option>
            {/* <option selected value={state.mealRequest[i].meal}>
              {state.mealRequest[i].meal}
            </option> */}
            {/* {user.special.gfplus == 'true' && (
              <option value={'GlutenFree B'}>
                Gluten Free plus Vegetarian Breakfast
              </option>
            )} */}
            {user.special.gfplus == true && (
              <option value={'Gluten Free with Breakfast'}>
                Gluten Free Lunch plus Breakfast
              </option>
            )}
            {user.special.gfplus == 'true' && (
              <option value={'Gluten Free with Breakfast'}>
                Gluten Free Lunch plus Breakfast
              </option>
            )}
            {user.special.vgplus == true && (
              <option value={'Vegan B'}>Vegan Lunch plus Breakfast</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Standard'}>Standard</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Vegetarian'}>Vegetarian</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Vegan'}>Vegan</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Gluten Free'}>Gluten Free</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Gluten Free Dairy Free'}>
                Gluten Free Dairy Free
              </option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Standard Dairy Free'}>Standard Dairy Free</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Standard Sesame Free'}>
                Standard Sesame Free
              </option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Vegetarian Sesame Free'}>
                Vegetarian Sesame Free
              </option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Vegan Sesame Free'}>Vegan Sesame Free</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Sesame Dairy Free'}>Sesame Dairy Free</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Standard Soy Free'}>Standard Soy Free</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Vegetarian Soy Free'}>Vegetarian Soy Free</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Vegan Soy Free'}>Vegan Soy Free</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Soy Sesame Free'}>Soy Sesame Free</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Soy Sesame Dairy Free'}>
                Soy Sesame Dairy Free
              </option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Soy Sesame Gluten Free'}>
                Soy Sesame Gluten Free
              </option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'Soy Sesame Dairy Gluten Free'}>
                Soy Sesame Dairy Gluten Free
              </option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'2on 3off'}>
                Standard 2 Onsite / 3 Offsite Lunches plus 5 Breakfasts
              </option>
            )}
            {/* standard options */}
            {isAuth().role === 'subscriber' && // 0000
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.sesame === false &&
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.soy === false && (
                <option value={'Standard'}>Standard</option>
              )}
            {isAuth().role === 'subscriber' &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.sesame === false &&
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.soy === false && (
                <option value={'Vegetarian'}>Vegetarian</option>
              )}
            {isAuth().role === 'subscriber' &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.sesame === false &&
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.soy === false && (
                <option value={'Vegan'}>Vegan (Lunch Only)</option>
              )}
            {/* {gluten dairy options} */}
            {isAuth().role === 'subscriber' && // 0100
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === true &&
              students[i].foodAllergy.soy === false &&
              students[i].foodAllergy.sesame === false && (
                <option value={'Gluten Free'}>Gluten Free (Lunch Only)</option>
              )}
            {isAuth().role === 'subscriber' && // 1000
              students[i].foodAllergy.dairy === true &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === false &&
              students[i].foodAllergy.sesame === false && (
                <option value={'Standard Dairy Free'}>
                  Dairy Free (Lunch Only)
                </option>
              )}
            {isAuth().role === 'subscriber' && // dairy free has this option too
              students[i].foodAllergy.dairy === true &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === false &&
              students[i].foodAllergy.sesame === false && (
                <option value={'Vegan'}>Vegan (Lunch Only)</option>
              )}
            {isAuth().role === 'subscriber' && // 1100
              students[i].foodAllergy.dairy === true &&
              students[i].foodAllergy.gluten === true &&
              students[i].foodAllergy.soy === false &&
              students[i].foodAllergy.sesame === false && (
                <option value={'Gluten Free Dairy Free'}>
                  Gluten Free Dairy Free (lunch only)
                </option>
              )}
            {isAuth().role === 'subscriber' && // 0101 // add to list
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === true &&
              students[i].foodAllergy.soy === false &&
              students[i].foodAllergy.sesame === true && (
                <option value={'Gluten Sesame Free'}>
                  Gluten Sesame Free (Lunch Only)
                </option>
              )}
            {/* soy */}
            {isAuth().role === 'subscriber' && // 0010
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === true &&
              students[i].foodAllergy.sesame === false && (
                <option value={'Standard Soy Free'}>Standard Soy Free</option>
              )}
            {isAuth().role === 'subscriber' &&
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === true &&
              students[i].foodAllergy.sesame === false && (
                <option value={'Vegetarian Soy Free'}>
                  Vegetarian Soy Free
                </option>
              )}
            {isAuth().role === 'subscriber' &&
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === true &&
              students[i].foodAllergy.sesame === false && (
                <option value={'Vegan Soy Free'}>Vegan Soy Free</option>
              )}
            {isAuth().role === 'subscriber' && // 0110 // add to list
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === true &&
              students[i].foodAllergy.soy === true &&
              students[i].foodAllergy.sesame === false && (
                <option value={'Gluten Soy Free'}>Gluten Soy Free</option>
              )}
            {isAuth().role === 'subscriber' && // 0011
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === true &&
              students[i].foodAllergy.sesame === true && (
                <option value={'Soy and Sesame Free'}>
                  Soy and Sesame Free (Lunch Only)
                </option>
              )}
            {isAuth().role === 'subscriber' && // 1011 // change code elsewhere
              students[i].foodAllergy.dairy === true &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === true &&
              students[i].foodAllergy.sesame === true && (
                <option value={'Soy Sesame Dairy Free'}>
                  Dairy Soy Sesame Free (Lunch Only)
                </option>
              )}
            {isAuth().role === 'subscriber' && // 1010 // add to list
              students[i].foodAllergy.dairy === true &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === true &&
              students[i].foodAllergy.sesame === false && (
                <option value={'Soy Dairy Free'}>
                  Dairy Soy Free (Lunch Only)
                </option>
              )}
            {isAuth().role === 'subscriber' && // 0111
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === true &&
              students[i].foodAllergy.soy === true &&
              students[i].foodAllergy.sesame === true && (
                <option value={'Soy Sesame Gluten Free'}>
                  Gluten Soy and Sesame Free (Lunch Only)
                </option>
              )}
            {isAuth().role === 'subscriber' && // 1111
              students[i].foodAllergy.dairy === true &&
              students[i].foodAllergy.gluten === true &&
              students[i].foodAllergy.soy === true &&
              students[i].foodAllergy.sesame === true && (
                <option value={'Soy Sesame Dairy Gluten Free'}>
                  Gluten Dairy Soy and Sesame Free (Lunch Only)
                </option>
              )}
            {isAuth().role === 'subscriber' && // 1110 // add to list
              students[i].foodAllergy.dairy === true &&
              students[i].foodAllergy.gluten === true &&
              students[i].foodAllergy.soy === true &&
              students[i].foodAllergy.sesame === false && (
                <option value={'Soy Dairy Gluten Free'}>
                  Gluten Dairy Soy Free (lunch only)
                </option>
              )}
            {/* Sesame  */}
            {isAuth().role === 'subscriber' && // 0001
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === false &&
              students[i].foodAllergy.sesame === true && (
                <option value={'Standard Sesame Free'}>
                  Standard Sesame Free
                </option>
              )}
            {isAuth().role === 'subscriber' &&
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === false &&
              students[i].foodAllergy.sesame === true && (
                <option value={'Vegetarian Sesame Free'}>
                  Vegetarian Sesame Free
                </option>
              )}
            {isAuth().role === 'subscriber' &&
              students[i].foodAllergy.dairy === false &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === false &&
              students[i].foodAllergy.sesame === true && (
                <option value={'Vegan Sesame Free'}>Vegan Sesame Free</option>
              )}
            {isAuth().role === 'subscriber' && // 1001 // add to list
              students[i].foodAllergy.dairy === true &&
              students[i].foodAllergy.gluten === false &&
              students[i].foodAllergy.soy === false &&
              students[i].foodAllergy.sesame === true && (
                <option value={'Sesame Dairy Free'}>
                  Dairy Sesame Free (Lunch Only)
                </option>
              )}
            {isAuth().role === 'subscriber' && // 1101
              students[i].foodAllergy.dairy === true &&
              students[i].foodAllergy.gluten === true &&
              students[i].foodAllergy.soy === false &&
              students[i].foodAllergy.sesame === true && (
                <option value={'Sesame Dairy Gluten Free'}>
                  Gluten Dairy Sesame Free (Lunch Only)
                </option>
              )}
            {/* special  */}
            <option value={'None'}>None</option>
          </select>
          <div className="p-1"></div>
        </div>
      </div>
    </>
  );

  const selectOnsiteMealRequest = (
    i,
    student,
    studentName,
    schoolName,
    group,
    teacher,
    pickupOption,
    foodAllergy
  ) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            data-index={i}
            defaultValue={'Standard Onsite'}
            value={mealRequest[i].meal}
            onChange={(e) =>
              handleSelectChange(
                e,
                student,
                studentName,
                schoolName,
                group,
                teacher,
                pickupOption,
                foodAllergy
              )
            }
            className="form-control"
          >
            {' '}
            {/* <option value="">Choose an option</option> */}
            {user.special.twothree == true && (
              <option value={'2on 3off'}>
                Standard 2 Onsite / 3 Offsite Lunches plus 5 Breakfasts
              </option>
            )}
            {
              // isAuth().role === 'subscriber' &&
              <option value={'Standard Onsite'}>Standard (Onsite)</option>
            }
            {user.special.day1 == 'true' && (
              <option value={'Onsite Day 1'}>
                Onsite Lunch Monday/Wednesday Only
              </option>
            )}
            {user.special.day2 == 'true' && (
              <option value={'Onsite Day 2'}>
                Onsite Lunch Tuesday/Thursday Only
              </option>
            )}
            <option value={'None'}>None</option>
          </select>
          <div className="p-1"></div>
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

    let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
    let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    let input = e.target.value;
    let frontCode = '';

    switch (input) {
      case 'Breakfast Only':
        frontCode = 'B';
        break;
      case 'Lunch Onsite / Breakfast Pickup':
        frontCode = 'B';
        break;
      default:
        break;
    }
    code = frontCode; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    codes[i] = code;

    setState({
      ...state,
      mealRequest: [...meals],
      pickupTime: '',
      buttonText: 'Submit',
      pickupCodeAdd: codes,
      success: '',
      error: '',
    });
  };

  const selectAdminPickupOptions = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
          data-index={i}
          onChange={(e) => handlePickupOption(i, e)}
          className="form-control"
        >
          <option selected value={'Breakfast and Lunch'}>
            Breakfast and Lunch
          </option>
          <option value={'Breakfast Only'}>Breakfast Only</option>
          <option value={'Lunch Only'}>Lunch Only</option>
          <option value={'Lunch Onsite'}>Lunch Onsite</option>
          <option value={'Lunch Onsite / Breakfast Pickup'}>
            Lunch Onsite / Breakfast Pickup
          </option>
        </select>
        <div className="p-1"></div>
      </div>
    </>
  );
  const selectPickupOption = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
          defaultValue={state.mealRequest[i].pickupOption}
          // value={state.mealRequest[i].pickupOption}
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
        </select>
        <div className="p-1"></div>
      </div>
    </>
  );

  const selectPickupLunchOnlyOption = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
          defaultValue={state.mealRequest[i].pickupOption}
          value={state.mealRequest[i].pickupOption}
          data-index={i}
          onChange={(e) => handlePickupOption(i, e)}
          className="form-control"
        >
          {' '}
          <option selected value={'Lunch Only'}>
            Lunch Only
          </option>
        </select>
        <div className="p-1"></div>
      </div>
    </>
  );

  const selectNonePickupOption = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
          defaultValue={state.mealRequest[i].pickupOption}
          value={state.mealRequest[i].pickupOption}
          data-index={i}
          onChange={(e) => handlePickupOption(i, e)}
          className="form-control"
        >
          {' '}
          <option selected value={'None'}>
            None
          </option>
        </select>
        <div className="p-1"></div>
      </div>
    </>
  );

  const selectPickupLunchOnsiteBreakfastOffsiteOption = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
          defaultValue={state.mealRequest[i].pickupOption}
          value={state.mealRequest[i].pickupOption}
          data-index={i}
          onChange={(e) => handlePickupOption(i, e)}
          className="form-control"
        >
          {' '}
          <option selected value={'Lunch Onsite'}>
            Lunch Onsite
          </option>
          <option value={'Lunch Onsite / Breakfast Pickup'}>
            Lunch Onsite / Breakfast Pickup
          </option>
        </select>
        <div className="p-1"></div>
      </div>
    </>
  );

  const selectPickupLunchOnsiteBreakfastOffsiteOptionH = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
          defaultValue={state.mealRequest[i].pickupOption}
          value={state.mealRequest[i].pickupOption}
          data-index={i}
          onChange={(e) => handlePickupOption(i, e)}
          className="form-control"
        >
          {' '}
          <option value={'Lunch Onsite'}>Lunch Onsite</option>
          <option selected value={'Lunch Onsite / Breakfast Pickup'}>
            Lunch Onsite / Breakfast Pickup
          </option>
        </select>
        <div className="p-1"></div>
      </div>
    </>
  );
  const select2on3offOption = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
          defaultValue={state.mealRequest[i].pickupOption}
          value={state.mealRequest[i].pickupOption}
          data-index={i}
          onChange={(e) => handlePickupOption(i, e)}
          className="form-control"
        >
          {' '}
          {/* <option value={'Lunch Onsite'}>
            Lunch Onsite
          </option> */}
          <option selected value={'Two Onsite / Three Breakfast and Lunches'}>
            Two Onsite / Three Breakfast and Lunches
          </option>
        </select>
        <div className="p-1"></div>
      </div>
    </>
  );

  // pickup times select
  const handlePickupTimeChange = (e) => {
    setState({
      ...state,
      pickupTime: e.target.value,
      buttonText: 'Submit',
      success: '',
      error: '',
    });
  };

  const selectPickupTime = (i) => (
    <>
      <div key={i}>
        <div className="">
          <select
            type="select"
            value={pickupTime}
            data-index={i}
            onChange={(e) => handlePickupTimeChange(e)}
            className="form-control"
          >
            {' '}
            <option disabled value="">
              Choose an option
            </option>
            <option value={'7am-9am'}>7am-9am</option>
            <option value={'11am-1pm'}>11am-1pm</option>
            <option value={'4pm-6pm'}>4pm-6pm</option>
            {isAuth().role === 'admin' && (
              <option value={'Cafeteria'}>
                Student Cafeteria Lunch Onsite
              </option>
            )}
          </select>
          <div className="p-1"></div>
        </div>
      </div>
    </>
  );

  const selectPickupTimeCafeteriaOnly = (i) => (
    <>
      <div key={i}>
        <div className="">
          <select
            type="select"
            value={pickupTime}
            data-index={i}
            onChange={(e) => handlePickupTimeChange(e)}
            className="form-control"
          >
            {' '}
            <option disabled value="">
              Choose an option
            </option>
            {isAuth().role === 'admin' && (
              <option value={'7am-9am'}>7am-9am</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'11am-1pm'}>11am-1pm</option>
            )}
            {isAuth().role === 'admin' && (
              <option value={'4pm-6pm'}>4pm-6pm</option>
            )}
            <option value={'Cafeteria'}>Student Cafeteria Lunch Onsite</option>
          </select>
          <div className="p-1"></div>
        </div>
      </div>
    </>
  );

  // add meal button
  const addMeal = (
    i,
    student,
    studentName,
    schoolName,
    group,
    teacher,
    pickupOption,
    foodAllergy
  ) => {
    setState({
      ...state,
      mealRequest: [
        ...mealRequest,
        {
          meal:
            group === 'a-group' || group === 'b-group'
              ? 'Standard Onsite'
              : // soy options
              foodAllergy.dairy === false &&
                foodAllergy.gluten === false &&
                foodAllergy.soy === true &&
                foodAllergy.sesame === true
              ? 'Soy and Sesame Free'
              : foodAllergy.soy === true &&
                foodAllergy.sesame === false &&
                foodAllergy.dairy === false &&
                foodAllergy.gluten === false
              ? 'Standard Soy Free'
              : foodAllergy.soy === true &&
                foodAllergy.sesame === true &&
                foodAllergy.dairy === true &&
                foodAllergy.gluten === false
              ? 'Soy Sesame Dairy Free'
              : foodAllergy.soy === true &&
                foodAllergy.sesame === true &&
                foodAllergy.dairy === false &&
                foodAllergy.gluten === true
              ? 'Soy Sesame Gluten Free'
              : foodAllergy.soy === true &&
                foodAllergy.sesame === true &&
                foodAllergy.dairy === true &&
                foodAllergy.gluten === true
              ? 'Soy Sesame Dairy Gluten Free'
              : // gf df
              foodAllergy.soy === false &&
                foodAllergy.sesame === false &&
                foodAllergy.dairy === true &&
                foodAllergy.gluten === true
              ? 'Gluten Free Dairy Free'
              : foodAllergy.soy === false &&
                foodAllergy.sesame === false &&
                foodAllergy.dairy === true &&
                foodAllergy.gluten === false
              ? 'Standard Dairy Free'
              : foodAllergy.soy === false &&
                foodAllergy.sesame === false &&
                foodAllergy.dairy === false &&
                foodAllergy.gluten === true
              ? 'Gluten Free'
              : // sesame
              foodAllergy.soy === false &&
                foodAllergy.sesame === true &&
                foodAllergy.dairy === false &&
                foodAllergy.gluten === false
              ? 'Standard Sesame Free'
              : // gf df sesame combos
              foodAllergy.soy === false &&
                foodAllergy.sesame === true &&
                foodAllergy.dairy === false &&
                foodAllergy.gluten === true
              ? 'Gluten Sesame Free'
              : foodAllergy.soy === false &&
                foodAllergy.sesame === true &&
                foodAllergy.dairy === true &&
                foodAllergy.gluten === false
              ? 'Sesame Dairy Free'
              : foodAllergy.soy === false &&
                foodAllergy.sesame === true &&
                foodAllergy.dairy === true &&
                foodAllergy.gluten === true
              ? 'Sesame Dairy Gluten Free'
              : // else standard
                'Standard',
          student: student,
          studentName: studentName,
          lastName: user.lastName,
          schoolName: schoolName,
          group: group,
          teacher: teacher,
          pickupOption:
            group === 'a-group' || group === 'b-group'
              ? 'Lunch Onsite'
              : foodAllergy.egg === true ||
                foodAllergy.soy === true ||
                foodAllergy.dairy === true ||
                foodAllergy.gluten === true
              ? 'Lunch Only'
              : 'Breakfast and Lunch',
          foodAllergy: foodAllergy,
          parentEmail: user.email,
          parentName: user.name,
          individualPickupTime: '',
          complete: false,
          days:
          group === 'a-group'
            ? {
                sunday: false,
                monday: true,
                tuesday: false,
                wednesday: true,
                thursday: false,
                friday: false,
                saturday: false,
              }
            : group === 'b-group'
            ? {
                sunday: false,
                monday: false,
                tuesday: true,
                wednesday: false,
                thursday: true,
                friday: false,
                saturday: false,
              }
            : {
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
      pickupCodeAdd: [...pickupCodeAdd, ''],
    });
  };

  // remove meal button
  const removeMeal = (index) => {
    const list = [...state.mealRequest];
    list.splice(-1)[0];

    const list2 = [...state.pickupCodeAdd];
    list2.splice(-1)[0];
    setState({ ...state, mealRequest: list, pickupCodeAdd: list2 });
  };

  // handles lead time for orders
  let twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  const submit = () => {
    localStorage.removeItem('search-date');
    const newPickupCodeAdd = pickupCodeAdd.filter((code) => code != 'None');

    let length = mealRequest
      .filter((meal) => meal.meal != 'None')
      .filter(
        (meal) => meal.pickupOption != 'Lunch Onsite'
        // ||
        // meal.pickupOption === 'Lunch Onsite / Breakfast Pickup'
        // meal.meal === '2on 3off'
      ).length;
    // mealRequest.filter(
    //   (meal) => meal.meal != 'None' || meal.meal === 'Standard Onsite'
    // ).length -
    // mealRequest.filter(
    //   (meal) =>
    //     meal.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
    //     meal.meal === '2on 3off'
    // ).length;
    // +
    // mealRequest.filter((meal) => meal.meal === '2on 3off').length;

    let newPickupCode = '';

    isAuth().role === 'admin'
      ? (newPickupCode =
          (newPickupCodeAdd.join('') != ''
            ? newPickupCodeAdd.join('') + '-'
            : '') +
          (pickupCodeInput != '' ? pickupCodeInput : user.userCode) +
          '-0' +
          length)
      : (newPickupCode =
          (newPickupCodeAdd.join('') != ''
            ? newPickupCodeAdd.join('') + '-'
            : '') +
          user.userCode +
          '-0' +
          length);

    setState({
      ...state,
      pickupCode: newPickupCode,
      pickupCodeAdd: newPickupCodeAdd,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API}/link`,
        {
          mealRequest,
          pickupTime,
          pickupDate,
          username,
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
          username,
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

  const handleToggle = (c) => () => {
    // return the first index or -1
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }

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

  const handleCodeChange = (e) => {
    e.preventDefault;
    setState({
      ...state,
      pickupCodeInput: e.target.value.toUpperCase(),
      userCode: e.target.value.toUpperCase(),
    });
  };

  // create form
  const submitLinkForm = (student) => (
    <form
      onSubmit={isAuth().role === 'admin' ? handleAdminSubmit : handleSubmit}
    >
      {mealRequest
        .filter((meal) => meal.meal !== 'None')
        .every(
          (meal) =>
            meal.meal == 'Standard Onsite' &&
            meal.pickupOption == 'Lunch Onsite'
        ) ? (
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            Pickup at Cafeteria
          </label>
          {selectPickupTimeCafeteriaOnly()}
        </div>
      ) : (
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            Pickup Time
          </label>
          {selectPickupTime()}
        </div>
      )}

      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      <div>
        <button
          disabled={!token}
          className={'btn  ' + styles.button}
          onClick={submit}
          type="submit"
        >
          <i class="far fa-paper-plane"></i> &nbsp;&nbsp;
          {isAuth() || token ? state.buttonText : 'Login to Make Request'}
        </button>
      </div>
    </form>
  );

  return (
    <div className={styles.background}>
      <Layout>
        {loaded ? (
          <div className="col-md-6 offset-md-3 pt-4">
            <div className={styles.subcard}>
              <div className="row">
                <div className="col-md-9">
                  <span ref={calendarButton}>
                    <h4 className="text-dark">
                      Meal Request for the Week of:{' '}
                      {pickupDate && (
                        <>
                          <span
                            // ref={calendarButton}
                            onClick={() => setShowSearch(!showSearch)}
                          >
                            {moment(state.pickupDate).format('MMMM Do')}
                            &nbsp;{' '}
                            <i className="text-danger far fa-calendar-check"></i>
                          </span>
                        </>
                      )}
                    </h4>
                    {pickupDate === '' && (
                      <button
                        className={
                          'btn btn-sm btn-outline-secondary ' +
                          styles.buttonshadow
                        }
                        onClick={() => setShowSearch(!showSearch)}
                      >
                        <i class="far fa-calendar-alt"></i> &nbsp;&nbsp; Select
                        Date
                      </button>
                    )}

                    {isAuth().role === 'admin'
                      ? showSearch && (
                          <Calendar
                            onChange={(e) => onDateChange(e)}
                            tileDisabled={handleDisabledDates}
                            value={''}
                          />
                        )
                      : showSearch && (
                          <Calendar
                            onChange={(e) => onDateChange(e)}
                            tileDisabled={handleDisabledDates}
                            defaultValue={twoWeeksFromNow}
                            minDate={twoWeeksFromNow}
                            value={twoWeeksFromNow}
                          />
                        )}
                  </span>
                </div>
              </div>
              <hr />
              {/* Admin can change code */}
              {isAuth().role === 'admin' && user.userCode === 'DOOB' && (
                <div className=" form-group">
                  <input
                    type="text"
                    className=" form-control"
                    placeholder="Enter a 4 digit User Code"
                    onChange={(e) => handleCodeChange(e)}
                  />
                </div>
              )}
              {isAuth().role === 'admin' && user.userCode === 'LYF' && (
                <div className=" form-group">
                  <input
                    type="text"
                    className=" form-control"
                    placeholder="Enter a 4 digit User Code"
                    onChange={(e) => handleCodeChange(e)}
                  />
                </div>
              )}

              <div className="row">
                <div className="col-md-12">
                  {state.mealRequest.map((x, i) => {
                    return (
                      <>
                        <div>
                          <label key={i} className="text-secondary">
                            <h6>
                              {' '}
                              <b>{`${state.students[i].name}`}'s</b>{' '}
                              {state.students[i].group ===
                              'distance-learning' ? (
                                <>Curbside</>
                              ) : (
                                <>Onsite</>
                              )}{' '}
                              Meals
                            </h6>
                          </label>
                        </div>
                        <div key={i} className="">
                          {state.students[i].group === 'a-group' &&
                            selectOnsiteMealRequest(
                              i,
                              state.students[i]._id,
                              state.students[i].name,
                              state.students[i].schoolName,
                              state.students[i].group,
                              state.students[i].teacher,
                              state.students[i].pickupOption,
                              state.students[i].foodAllergy
                            )}
                          {state.students[i].group === 'b-group' &&
                            selectOnsiteMealRequest(
                              i,
                              state.students[i]._id,
                              state.students[i].name,
                              state.students[i].schoolName,
                              state.students[i].group,
                              state.students[i].teacher,
                              state.students[i].pickupOption,
                              state.students[i].foodAllergy
                            )}
                          {state.students[i].group === 'distance-learning' &&
                            selectMealRequest(
                              i,
                              state.students[i]._id,
                              state.students[i].name,
                              state.students[i].schoolName,
                              state.students[i].group,
                              state.students[i].teacher,
                              state.students[i].pickupOption,
                              state.students[i].foodAllergy
                            )}
                        </div>

                        {
                          x.meal !== '2on 3off' // put all special options here to turn off this field then put them below this to activate another select menu
                            ? isAuth().role === 'admin'
                              ? selectAdminPickupOptions()
                              : x.meal != 'None' // put option here to turn off pickup selection like for none
                              ? // ? x.meal != '2on 3off'
                                state.students[i].group === 'distance-learning'
                                ? x.meal === 'Gluten Free' ||
                                  x.meal === 'Gluten Free Dairy Free' ||
                                  x.meal === 'Standard Dairy Free' ||
                                  x.meal === 'Vegan' ||
                                  user.students[i].foodAllergy.egg === true ||
                                  user.students[i].foodAllergy.soy === true ||
                                  user.students[i].foodAllergy.dairy === true ||
                                  user.students[i].foodAllergy.gluten === true
                                  ? selectPickupLunchOnlyOption(i)
                                  : selectPickupOption(i) // if not distance learning then:
                                : selectPickupLunchOnsiteBreakfastOffsiteOption(
                                    i
                                  )
                              : // : select2on3offOption(i)
                                null
                            : null
                          // selectNonePickupOption(i)
                        }

                        {x.meal === '2on 3off' && select2on3offOption(i)}

                        {(process.browser &&
                          isAuth().role === 'admin' &&
                          x.meal === '2on 3off' &&
                          x.group === 'a-group') ||
                        (isAuth().role === 'admin' &&
                          x.meal === 'Standard Onsite' &&
                          x.group === 'a-group') ? (
                          <>
                            <hr />
                            <div className="form-control ">
                              <div className="row p-1">
                                {/* <Toggle
                                toggleKey={i}
                                dataIndex={i}
                                isOn={x.days.sunday}
                                toggleId="sunday"
                                toggleName="Sunday"
                                handleToggle={handleDayChange('sunday')}
                              ></Toggle> */}
                                <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.monday}
                                  toggleId="monday"
                                  toggleName="Monday"
                                  handleToggle={handleDayChange('monday')}
                                ></Toggle>
                                <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.tuesday}
                                  toggleId="tuesday"
                                  toggleName="Tuesday"
                                  handleToggle={handleDayChange('tuesday')}
                                ></Toggle>
                                {/* <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.wednesday}
                                  toggleId="wednesday"
                                  toggleName="Wednesday"
                                  handleToggle={handleDayChange('wednesday')}
                                ></Toggle> */}
                                {/* <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.thursday}
                                  toggleId="thursday"
                                  toggleName="Thursday"
                                  handleToggle={handleDayChange('thursday')}
                                ></Toggle>
                                <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.friday}
                                  toggleId="friday"
                                  toggleName="Friday"
                                  handleToggle={handleDayChange('friday')}
                                ></Toggle> */}
                                {/* <Toggle
                                toggleKey={i}
                                dataIndex={i}
                                isOn={x.days.saturday}
                                toggleId="saturday"
                                toggleName="Saturday"
                                handleToggle={handleDayChange('saturday')}
                              ></Toggle> */}
                              </div>
                            </div>
                          </>
                        ) : (process.browser &&
                            isAuth().role === 'admin' &&
                            x.meal === '2on 3off' &&
                            x.group === 'b-group') ||
                          (isAuth().role === 'admin' &&
                            x.meal === 'Standard Onsite' &&
                            x.group === 'b-group') ? (
                          <>
                            <hr />
                            <div className="form-control ">
                              <div className="row p-1">
                                {/* <Toggle
                                toggleKey={i}
                                dataIndex={i}
                                isOn={x.days.sunday}
                                toggleId="sunday"
                                toggleName="Sunday"
                                handleToggle={handleDayChange('sunday')}
                              ></Toggle> */}
                                {/* <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.monday}
                                  toggleId="monday"
                                  toggleName="Monday"
                                  handleToggle={handleDayChange('monday')}
                                ></Toggle> */}
                                {/* <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.tuesday}
                                  toggleId="tuesday"
                                  toggleName="Tuesday"
                                  handleToggle={handleDayChange('tuesday')}
                                ></Toggle> */}
                                <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.wednesday}
                                  toggleId="wednesday"
                                  toggleName="Wednesday"
                                  handleToggle={handleDayChange('wednesday')}
                                ></Toggle>
                                <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.thursday}
                                  toggleId="thursday"
                                  toggleName="Thursday"
                                  handleToggle={handleDayChange('thursday')}
                                ></Toggle>
                                {/* <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.friday}
                                  toggleId="friday"
                                  toggleName="Friday"
                                  handleToggle={handleDayChange('friday')}
                                ></Toggle> */}
                                {/* <Toggle
                                toggleKey={i}
                                dataIndex={i}
                                isOn={x.days.saturday}
                                toggleId="saturday"
                                toggleName="Saturday"
                                handleToggle={handleDayChange('saturday')}
                              ></Toggle> */}
                              </div>
                            </div>
                          </>
                        ) : (
                          ''
                        )}
                        <hr />
                      </>
                    );
                  })}

                  <div className="">
                    {state.mealRequest.length < state.students.length && (
                      <button
                        className={
                          'btn  btn-outline-info ' + styles.buttonshadow
                        }
                        onClick={() =>
                          state.mealRequest.map((x, i) =>
                            addMeal(
                              i,
                              state.students[`${i + 1}`]._id,
                              state.students[`${i + 1}`].name,
                              state.students[`${i + 1}`].schoolName,
                              state.students[`${i + 1}`].group,
                              state.students[`${i + 1}`].teacher,
                              state.students[`${i + 1}`].pickupOption,
                              state.students[`${i + 1}`].foodAllergy
                            )
                          )
                        }
                      >
                        <i class="fas fa-utensils"></i>
                        &nbsp;&nbsp; Show Next Student
                      </button>
                    )}

                    {state.mealRequest.length !== 1 && (
                      <button
                        className={'btn float-right ' + styles.buttonshadow}
                        onClick={() => removeMeal()}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-md-6 p-3">{submitLinkForm()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-md-6 offset-md-3 pt-4">
            <div className={styles.subcard}>
              <div className="row">
                <div className="col-md-12">
                  <h3 className="text-dark"></h3>
                  &nbsp;
                  <div className={'p-5 ' + styles.animatedBg}></div>
                  <div className={'p-3 ' + styles.animatedBg}></div>
                  <div className={'p-3 ' + styles.animatedBg}></div>
                  <div className={'p-3 ' + styles.animatedBg}></div>
                  <div className={'p-5 ' + styles.animatedBg}></div>
                  <div className={'p-3 ' + styles.animatedBg}></div>
                  <div className={'p-3 ' + styles.animatedBg}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
      <div className="p-5"></div>
      {/* <div className="p-5"></div> */}
    </div>
  );
};

Create.getInitialProps = ({ req, user }) => {
  const token = getCookie('token', req);
  return { token, user };
};

export default withUser(Create);
