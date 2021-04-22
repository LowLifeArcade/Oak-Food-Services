// imports
import styles from '../../../styles/Home.module.css';
import moment from 'moment';
import Router from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import withUser from '../../withUser';
import { isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import axios from 'axios';

const Update = ({ oldLink, token, user, _id }) => {
  const [state, setState] = useState({
    mealRequest: oldLink.mealRequest,
    pickupTime: oldLink.pickupTime,
    pickupOption: oldLink.pickupOption,
    pickupDate: oldLink.pickupDate,
    pickupCodeInput: oldLink.postedBy.userCode,
    orderStatus: false,
    buttonText: 'Update',
    pickupCode: '', // fix. this doesn't work.
    pickupCodeAdd: [],
    userCode: oldLink.userCode,
    mealWeek: oldLink.pickupWeek,
    success: '',
    error: '',
    students: user.students,
  });

  const {
    userCode,
    pickupCodeInput,
    pickupOption,
    pickupTime,
    orderStatus,
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

  // console.log('meal requests', mealRequest);
  const [showSearch, setShowSearch] = useState(false);

  // useEffect(() => {
  //   setState({
  //     ...state,
  //     pickupTime:
  //       isAuth().role === 'admin'
  //         ? '11am-1pm'
  //         : mealRequest
  //             .filter((meal) => meal.meal !== 'None')
  //             .every((meal) => meal.meal === 'Standard Onsite') &&
  //           mealRequest
  //             .filter((meal) => meal.meal !== 'None')
  //             .some((meal) => meal.pickupOption === 'Lunch Onsite')
  //         ? 'Cafeteria'
  //         : '',
  //   });
  // }, [mealRequest]);
  useEffect(() => {
    !isAuth() && Router.push('/');
  });

  // checks to see if parent has changed students allergy or group in update profile and applied changes here.
  useEffect(() => {
    setTimeout(() => {
      let someArray = [];

      mealRequest.map((request, index) => {
        let meals = [...mealRequest];
        let meal = { ...meals[index] };

        // if allergies or group has changed we run the switch case to apply default selections on the form
        if (!user.students[index]) {
          meal.studentName = 'Student Deleted';
          meal.pickupOption = 'deleted';
          meal.meal = 'deleted';
        } else {
          if (
            meal.studentName !== user.students[index].name ||
            meal.foodAllergy.soy !== students[index].foodAllergy.soy ||
            meal.foodAllergy.sesame !== students[index].foodAllergy.sesame ||
            meal.foodAllergy.dairy !== students[index].foodAllergy.dairy ||
            meal.foodAllergy.gluten !== students[index].foodAllergy.gluten ||
            meal.foodAllergy.egg !== students[index].foodAllergy.egg ||
            meal.group !== students[index].group
          ) {
            meal.foodAllergy = students[index].foodAllergy;
            meal.group = students[index].group;
            meal.studentName = students[index].name;

            if (
              students[index] &&
              students[index].group === 'distance-learning'
            ) {
              switch (true) {
                case meal.group === 'a-group' || meal.group === 'b-group':
                  meal.meal = 'Lunch Onsite';
                  meal.pickupOption = 'Lunch Only';
                  break;
                case meal.group === 'distance-learning':
                  (meal.meal =
                    //soy
                    user.students[index].foodAllergy.dairy === false &&
                    user.students[index].foodAllergy.gluten === false &&
                    user.students[index].foodAllergy.soy === true &&
                    user.students[index].foodAllergy.sesame === true
                      ? 'Soy and Sesame Free'
                      : user.students[index].foodAllergy.soy === true &&
                        user.students[index].foodAllergy.sesame === false &&
                        user.students[index].foodAllergy.dairy === true &&
                        user.students[index].foodAllergy.gluten === true
                      ? 'Soy Dairy Gluten Free'
                      : user.students[index].foodAllergy.soy === true &&
                        user.students[index].foodAllergy.sesame === false &&
                        user.students[index].foodAllergy.dairy === false &&
                        user.students[index].foodAllergy.gluten === false
                      ? 'Standard Soy Free'
                      : user.students[index].foodAllergy.soy === true &&
                        user.students[index].foodAllergy.sesame === false &&
                        user.students[index].foodAllergy.dairy === false &&
                        user.students[index].foodAllergy.gluten === true
                      ? 'Gluten Soy Free'
                      : user.students[index].foodAllergy.soy === true &&
                        user.students[index].foodAllergy.sesame === true &&
                        user.students[index].foodAllergy.dairy === true &&
                        user.students[index].foodAllergy.gluten === false
                      ? 'Soy Sesame Dairy Free'
                      : user.students[index].foodAllergy.soy === true &&
                        user.students[index].foodAllergy.sesame === false &&
                        user.students[index].foodAllergy.dairy === true &&
                        user.students[index].foodAllergy.gluten === false
                      ? 'Soy Dairy Free'
                      : user.students[index].foodAllergy.soy === true &&
                        user.students[index].foodAllergy.sesame === true &&
                        user.students[index].foodAllergy.dairy === false &&
                        user.students[index].foodAllergy.gluten === true
                      ? 'Soy Sesame Gluten Free'
                      : user.students[index].foodAllergy.soy === true &&
                        user.students[index].foodAllergy.sesame === true &&
                        user.students[index].foodAllergy.dairy === true &&
                        user.students[index].foodAllergy.gluten === true
                      ? 'Soy Sesame Dairy Gluten Free'
                      : // dairy and gluten
                      user.students[index].foodAllergy.soy === false &&
                        user.students[index].foodAllergy.sesame === false &&
                        user.students[index].foodAllergy.dairy === true &&
                        user.students[index].foodAllergy.gluten === true
                      ? 'Gluten Free Dairy Free'
                      : user.students[index].foodAllergy.soy === false &&
                        user.students[index].foodAllergy.sesame === false &&
                        user.students[index].foodAllergy.dairy === true &&
                        user.students[index].foodAllergy.gluten === false
                      ? 'Standard Dairy Free'
                      : user.students[index].foodAllergy.soy === false &&
                        user.students[index].foodAllergy.sesame === false &&
                        user.students[index].foodAllergy.dairy === false &&
                        user.students[index].foodAllergy.gluten === true
                      ? 'Gluten Free'
                      : // sesame
                      user.students[index].foodAllergy.soy === false &&
                        user.students[index].foodAllergy.sesame === true &&
                        user.students[index].foodAllergy.dairy === false &&
                        user.students[index].foodAllergy.gluten === false
                      ? 'Standard Sesame Free'
                      : // sesame gluten dairy combos
                      user.students[index].foodAllergy.soy === false &&
                        user.students[index].foodAllergy.sesame === true &&
                        user.students[index].foodAllergy.dairy === true &&
                        user.students[index].foodAllergy.gluten === false
                      ? 'Sesame Dairy Free'
                      : user.students[index].foodAllergy.soy === false &&
                        user.students[index].foodAllergy.sesame === true &&
                        user.students[index].foodAllergy.dairy === false &&
                        user.students[index].foodAllergy.gluten === true
                      ? 'Sesame Gluten Free'
                      : user.students[index].foodAllergy.soy === false &&
                        user.students[index].foodAllergy.sesame === true &&
                        user.students[index].foodAllergy.dairy === true &&
                        user.students[index].foodAllergy.gluten === true
                      ? 'Sesame Dairy Gluten Free'
                      : 'Standard'),
                    (meal.pickupOption = 'Breakfast and Lunch');
                  break;

                // soy disabled these don't do anything
                case students[index].foodAllergy.sesame &&
                  students[index].foodAllergy.soy &&
                  students[index].foodAllergy.dairy &&
                  students[index].foodAllergy.gluten:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Soy Sesame Dairy Gluten Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.sesame &&
                  students[index].foodAllergy.soy &&
                  students[index].foodAllergy.gluten:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Soy Sesame Gluten Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.sesame &&
                  students[index].foodAllergy.soy &&
                  students[index].foodAllergy.dairy:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Soy Sesame Dairy Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.sesame &&
                  students[index].foodAllergy.soy:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Soy and Sesame Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.soy &&
                  students[index].foodAllergy.sesame:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Gluten Soy Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.soy &&
                  students[index].foodAllergy.dairy:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Soy Dairy Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.soy &&
                  students[index].foodAllergy.gluten:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Soy and Sesame Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.soy:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Standard Soy Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;

                // single allergy
                case students[index].foodAllergy.dairy:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Standard Dairy Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.gluten:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Gluten Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.sesame:
                  meal.pickupOption = 'Breakfast and Lunch';
                  meal.meal = 'Standard Sesame Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;

                // combo allergies
                case students[index].foodAllergy.gluten &&
                  students[index].foodAllergy.sesame:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Gluten Sesame Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.dairy &&
                  students[index].foodAllergy.sesame:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Sesame Dairy Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.sesame &&
                  students[index].foodAllergy.gluten:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Sesame Gluten Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.dairy &&
                  students[index].foodAllergy.gluten:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Gluten Free Dairy Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case students[index].foodAllergy.dairy &&
                  students[index].foodAllergy.dairy &&
                  students[index].foodAllergy.gluten:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Sesame Dairy Gluten Free';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;

                // standard stuff (no egg just no breakfast)
                case students[index].foodAllergy.egg:
                  meal.pickupOption = 'Lunch Only';
                  meal.meal = 'Standard';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                case !students[index].foodAllergy.sesame ||
                  !students[index].foodAllergy.dairy ||
                  !students[index].foodAllergy.gluten ||
                  !students[index].foodAllergy.egg ||
                  !students[index].foodAllergy.soy:
                  meal.pickupOption = 'Breakfast and Lunch';
                  meal.meal = 'Standard';
                  meal.foodAllergy = students[index].foodAllergy;
                  meal.name = user.students[index];
                  break;
                default:
                  break;
              }
            } else {
              meal.pickupOption = 'Lunch Onsite';
              meal.name = user.students[index];
            }
          }
        }

        someArray.push(meal);
      });
      setState({
        ...state,
        mealRequest: [...someArray],
      });

      return () => {
        cleanup;
      };
    }, 200);
  }, []);

  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDate: moment(pickupDate).format('l') });
    setShowSearch(!showSearch);
  };

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;

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

    // console.log(pickupCodeAdd)

    // This only handles the pickup option right now
    let input = e.target.value;
    let frontCode = '';
    let pickupOptionLO = '';
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
        frontCode = 'Onsite';
        pickupOptionLO = 'Lunch Onsite';
        break;
      case 'None':
        frontCode = 'None';
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
      buttonText: 'Update',
      // pickupCode: newPickupCode,
      // pickupCodeAdd: codes,
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
  };

  // console.log('meal requests', mealRequest);
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
            defaultValue={state.mealRequest[i].meal}
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
            {/* {user.special.twothree == true && (
              <option value={'2on 3off'}>
                Standard 2 Onsite / 3 Offsite Lunches plus 5 Breakfasts
              </option>
            )} */}
            {/* {user.special.vtplus == 'true' && (
              <option value={'GlutenFree B'}>
                Gluten Free plus Vegetarian Breakfast
              </option>
            )} */}
            {user.special.gfplus == 'true' && (
              <option value={'Gluten Free with Breakfast'}>
                Gluten Free Lunch plus Breakfast
              </option>
            )}
            {user.special.gfplus == true && (
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
              <option value={'2on 3off'}>Standard 2 on 3 off</option>
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

  // pickup options(all, breakfast only, lunch only) select
  const handlePickupOption = (i, e) => {
    let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
    let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    meal.pickupOption = e.target.value;

    meals[i] = meal;

    setState({
      ...state,
      mealRequest: [...meals],
      buttonText: 'Update',
      pickupTime: '',
      // pickupCodeAdd: codes,
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

  const selectAdminPickupOptions = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
          // defaultValue={state.mealRequest[i].pickupOption}
          // value={state.mealRequest[i].pickupOption}
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

  const selectPickupTime = (i) => (
    <>
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            value={pickupTime}
            data-index={i}
            onChange={(e) => handlePickupTimeChange(e)}
            className="form-control"
          >
            {' '}
            <option value="">Choose an option</option>
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
      <div key={i} className="form-group">
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
              <option value="">Choose an option</option>
            )}
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
          complete: false,
        },
      ],
      pickupCodeAdd: [...pickupCodeAdd, ''],
    });
  };

  // remove meal button
  const removeMeal = () => {
    const list = [...state.mealRequest];
    list.splice(-1)[0];

    const list2 = [...state.pickupCodeAdd];
    list2.splice(-1)[0];
    setState({ ...state, mealRequest: list, pickupCodeAdd: list2 });
  };

  // handles lead time for orders
  let twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 12);

  const handleSubmit = async (e) => {
    // console.log(
    //   'submitted data',
    //   mealRequest,
    //   pickupTime,
    //   pickupDate,
    //   // username,
    //   pickupCode,
    //   pickupCodeAdd,
    //   orderStatus
    // );
    e.preventDefault();
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
        {
          mealRequest,
          pickupTime,
          pickupDate,
          // username,
          pickupCode,
          pickupCodeAdd,
          orderStatus,
          userCode,
        },
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

      isAuth().role === 'admin'
        ? setTimeout(() => {
            Router.push('/user');
          }, 2000)
        : setTimeout(() => {
            Router.push('/user');
          }, 2000);

      return () => clearTimeout();
      // .then(Router.push('/user'))
    } catch (error) {
      console.log('LINK SUBMIT ERROR', error);
      setState({
        ...state,
        // error: error.response.data.error
        error: error.response.data.error,
      });
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    // console.log(
    //   mealRequest,
    //   pickupTime,
    //   pickupDate,
    //   pickupCode,
    //   pickupCodeAdd,
    //   orderStatus
    // );
    let dynamicUpdateUrl;
    if (isAuth() && isAuth().role === 'admin') {
      dynamicUpdateUrl = `${API}/link/admin/${oldLink._id}`;
    } else {
      dynamicUpdateUrl = `${API}/link/${oldLink._id}`;
    }
    try {
      const response = await axios.post(
        `${API}/mock-link`,
        dynamicUpdateUrl,
        {
          mealRequest,
          pickupTime,
          pickupDate,
          pickupCode,
          pickupCodeAdd,
          orderStatus,
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
        success: 'Request was created',
        error: '',
      });
      // .then(Router.push('/user'))
    } catch (error) {
      console.log('LINK SUBMIT ERROR', error);
      setState({ ...state, error: 'update error' });
    }
  };

  console.log(
    'length',
    mealRequest
      .filter((meal) => meal.meal != 'None')
      .filter(
        (meal) =>
          meal.pickupOption != 'Lunch Onsite' ||
          meal.pickupOption === 'Lunch Onsite / Breakfast Pickup' 
          // meal.meal === '2on 3off'
      ).length
    // -
    // mealRequest.filter(
    //   (meal) => meal.pickupOption === 'Lunch Onsite / Breakfast Pickup'
    // ).length +
    // mealRequest.filter((meal) => meal.meal === '2on 3off').length
  );

  const submit = () => {
    // const mealRequestNew = mealRequest.filter((meal) => meal.meal != 'None');
    // frontCodeRunner()

    // this handles the front code. The useEffect is redundent I think.

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
          case 'Vegan':
            frontCode.push('Vg');
            break;
          // case 'Vegetarian':
          // // case 'Vegetarian' && item.pickupOption != 'Lunch Only':
          //   frontCode.push('Vt');
          //   break;

          // specials
          case 'Vegan B':
            frontCode.push('Vgb');
            break;
          case 'Gluten Free with Breakfast':
            frontCode.push('Gfb');
            break;
          case '2on 3off':
            frontCode.push('H');
            break;

          // gluten dairy options
          case 'Gluten Free':
            frontCode.push('Gf');
            break;
          case 'Standard Dairy Free':
            frontCode.push('Df');
            break;
          case 'Gluten Free Dairy Free':
            frontCode.push('Gfdf');
            break;

          // gf df sesame combos
          case 'Gluten Sesame Free':
            frontCode.push('Gfsm');
            break;
          case 'Sesame Dairy Free':
            frontCode.push('Sp');
            break;
          case 'Sesame Dairy Gluten Free':
            frontCode.push('Sp');
            break;

          // sesame options
          case 'Standard Sesame Free':
            frontCode.push('Sm');
            break;
          case 'Vegetarian Sesame Free':
            frontCode.push('Vtsm');
            break;
          case 'Vegan Sesame Free':
            frontCode.push('Vgsm');
            break;

          // soy options
          case 'Standard Soy Free':
            frontCode.push('Sy');
            break;
          case 'Vegetarian Soy Free':
            frontCode.push('Vtsy');
            break;
          case 'Vegan Soy Free':
            frontCode.push('Vgsy');
            break;
          case 'Gluten Soy Free':
            frontCode.push('Gfsy');
            break;
          case 'Soy and Sesame Free':
            frontCode.push('Sp');
            break;
          case 'Soy Dairy Free':
            frontCode.push('Dfsy');
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
          case 'Soy Dairy Gluten Free':
            frontCode.push('Sp');
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

    const newPickupCodeAdd = frontCode.filter((code) => code != 'None');
    // const newPickupCodeAdd = pickupCodeAdd.filter((code) => code != 'None');

    let length = mealRequest
      .filter((meal) => meal.meal != 'None')
      .filter(
        (meal) =>
          meal.pickupOption != 'Lunch Onsite' ||
          meal.pickupOption === 'Lunch Onsite / Breakfast Pickup' 
          // meal.meal === '2on 3off'
      ).length;
    // mealRequest.filter(
    //   (meal) => meal.meal != 'None' || meal.meal === 'Standard Onsite'
    // ).length -
    // mealRequest.filter(
    //   (meal) => meal.pickupOption === 'Lunch Onsite / Breakfast Pickup'
    // ).length +
    // mealRequest.filter((meal) => meal.meal === '2on 3off').length;

    // let length =
    //   mealRequest.filter((meal) => meal.meal != 'None').length -
    //   mealRequest.filter((meal) => meal.meal === 'Standard Onsite').length +
    //   mealRequest.filter(
    //     (meal) => meal.pickupOption === 'Lunch Onsite / Breakfast Pickup' || meal.meal ==='2on 3off'
    //   ).length;

    // let newFrontCode = codes
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

  const handleCodeChange = (e) => {
    e.preventDefault;
    setState({
      ...state,
      pickupCodeInput: e.target.value.toUpperCase(),
      userCode: e.target.value.toUpperCase(),
    });
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
            defaultValue={mealRequest[i].meal}
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
            <option disabled value={''}>
              Choose a meal
            </option>
            {user.special.twothree == true && (
              <option value={'2on 3off'}>
                Standard 2 Onsite / 3 Offsite Lunches plus 5 Breakfasts
              </option>
            )}
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
            <option value={'Standard Onsite'}>Standard (Onsite)</option>
            <option value={'None'}>None</option>
          </select>
          <div className="p-1"></div>
        </div>
      </div>
    </>
  );

  const selectPickupLunchOnsiteBreakfastOffsiteOption = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
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

  const selectPickupLunchOnlyOption = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
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

  const selectPickupOption = (i) => (
    <>
      <div key={i} className="form-group">
        <select
          type="select"
          value={state.mealRequest[i].pickupOption}
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

  // create form
  const submitLinkForm = () => (
    <form onSubmit={isAuth().role === 'admin' ? handleSubmit : handleSubmit}>
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
          className={'btn ' + styles.button}
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
        <div className="col-md-6 offset-md-3 pt-4">
          <div className={styles.subcard}>
            <div className="row">
              <div className="col-md-12">
                {/* <h3>
                  Meal Request for:{' '}
                  {pickupDate && (
                    <span onClick={() => setShowSearch(!showSearch)}>
                      {moment(oldLink.pickupDate).format('MMMM Do')}
                    </span>
                  )}
                </h3> */}
                <h4 className="text-secondary">
                  Meal Request for the Week of:{' '}
                  {pickupDate && (
                    <>
                      <span
                        // ref={calanderButton}
                        onClick={() => setShowSearch(!showSearch)}
                      >
                        {moment(state.pickupDate).format('MMMM Do')}
                        &nbsp;{' '}
                        <i className="text-warning far fa-calendar-check"></i>
                      </span>
                    </>
                  )}
                </h4>
                {pickupDate === '' && (
                  <button
                    className={'btn btn-sm  ' + styles.buttonshadow}
                    onClick={() => setShowSearch(!showSearch)}
                  >
                    <i class="far fa-calendar-alt"></i> &nbsp;&nbsp; Select Date
                  </button>
                )}
              </div>
            </div>
            <hr />
            {/* Admin code */}
            {isAuth().role === 'admin' &&  
              (user.userCode === 'DOOB' && (
                <div className=" form-group">
                  <input
                    type="text"
                    defaultValue={oldLink.postedBy.userCode}
                    className=" form-control"
                    placeholder="Enter a 4 digit User Code"
                    onChange={(e) => handleCodeChange(e)}
                  />
                </div>
              ))}
            {isAuth().role === 'admin' &&  
              (user.userCode === 'LYF' && (
                <div className=" form-group">
                  <input
                    type="text"
                    defaultValue={oldLink.postedBy.userCode}
                    className=" form-control"
                    placeholder="Enter a 4 digit User Code"
                    onChange={(e) => handleCodeChange(e)}
                  />
                </div>
              ))}


            <div className="row">
              <div className="col-md-12">
                {state.mealRequest.map((x, i) => {
                  return (
                    <>
                      {isAuth().role != 'admin' ? (
                        <div>
                          <label key={i} className="text-secondary">
                            <h6>
                              {' '}
                              <b>
                                {state.students[i]
                                  ? `${state.students[i].name}`
                                  : 'Student Deleted'}
                                's
                              </b>{' '}
                              {state.students[i] &&
                              state.students[i].group ===
                                'distance-learning' ? (
                                <>Curbside</>
                              ) : (
                                <>Onsite</>
                              )}{' '}
                              Meals
                            </h6>
                          </label>
                        </div>
                      ) : (
                        <h6 className="p-2">
                          <label
                            key={i}
                            className="form-check-label text-muted"
                          >
                            Select meal for student # {`${i + 1}`}
                          </label>
                        </h6>
                      )}

                      <div key={i} className="">
                        {students[i] &&
                          students[i].group === 'a-group' &&
                          selectOnsiteMealRequest(
                            i,
                            students[i]._id,
                            students[i].name,
                            students[i].schoolName,
                            students[i].group,
                            students[i].teacher,
                            students[i].pickupOption,
                            students[i].foodAllergy
                          )}
                        {students[i] &&
                          students[i].group === 'b-group' &&
                          selectOnsiteMealRequest(
                            i,
                            students[i]._id,
                            students[i].name,
                            students[i].schoolName,
                            students[i].group,
                            students[i].teacher,
                            students[i].pickupOption,
                            students[i].foodAllergy
                          )}
                        {students[i] &&
                          students[i].group === 'distance-learning' &&
                          selectMealRequest(
                            i,
                            students[i]._id,
                            students[i].name,
                            students[i].schoolName,
                            students[i].group,
                            students[i].teacher,
                            students[i].pickupOption,
                            students[i].foodAllergy
                          )}
                        {/* {console.log('student i before changing meal', students[i])} */}
                      </div>
                      {/* {isAuth().role === 'admin'
                        ? selectAdminPickupOptions()
                        : x.meal != 'None'
                        ? students[i].group === 'distance-learning'
                          ? x.meal === 'GlutenFree' || x.meal === 'Vegan'
                            ? selectPickupLunchOnlyOption(i)
                            : selectPickupOption(i)
                          : selectPickupLunchOnsiteBreakfastOffsiteOption(i)
                        : null} */}
                      {
                        x.meal !== '2on 3off'
                          ? isAuth().role === 'admin'
                            ? selectAdminPickupOptions()
                            : x.meal != 'None' && x.meal != 'deleted'
                            ? students[i] &&
                              students[i].group === 'distance-learning' &&
                              x.meal != '2on 3off'
                              ? x.meal === 'GlutenFree' ||
                                x.meal === 'Gluten Free Dairy Free' ||
                                x.meal === 'Standard Dairy Free' ||
                                x.meal === 'Vegan' ||
                                user.students[i].foodAllergy.egg === true ||
                                user.students[i].foodAllergy.soy === true ||
                                user.students[i].foodAllergy.dairy === true ||
                                user.students[i].foodAllergy.gluten === true
                                ? selectPickupLunchOnlyOption(i)
                                : selectPickupOption(i)
                              : selectPickupLunchOnsiteBreakfastOffsiteOption(i)
                            : null
                          : null
                        // selectNonePickupOption(i)
                      }
                      {x.meal === '2on 3off' && select2on3offOption(i)}
                      <hr />
                    </>
                  );
                })}

                <div className="">
                  {state.mealRequest.length < state.students.length && (
                    <button
                      className={'btn  btn-outline-info ' + styles.buttonshadow}
                      onClick={() =>
                        state.mealRequest.map((x, i) =>
                          addMeal(
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
              <div className="col-md p-3">{submitLinkForm()}</div>
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
};

export default withUser(Update);
