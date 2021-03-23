import styles from '../../../styles/Home.module.css';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { getCookie, isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import axios from 'axios';
import withUser from '../../withUser';
import moment from 'moment';
import Router from 'next/router';
// import Datepicker from '../../../components/Datepicker';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Create = ({ token, user }) => {
  const username = user.username;
  // const userCode = user.userCode
  const [showSearch, setShowSearch] = useState(false);
  // const [orderStatus, setOrderStatus] = useState(true)

  // state
  const [state, setState] = useState({
    mealRequest: [
      {
        meal:
          user.students[0].group === 'a-group' ||
          user.students[0].group === 'b-group'
            ? 'Standard Onsite'
            : user.students[0].foodAllergy.dairy === true
            ? 'Standard DF'
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
            ? 'Lunch Only'
            : 'Breakfast and Lunch',
        foodAllergy: user.students[0].foodAllergy,
        parentEmail: user.email,
        parentName: user.name,
        individualPickupTime: '',
        complete: false,
      },
    ],
    orderStatus: false,
    pickupCode: user.userCode + '-01',
    pickupCodeInput: '',
    pickupCodeAdd: [''],
    pickupDate: '', //moment("2021-02-16").format('MM dd'), // get a state.pickupDate from a get request maybe from a created menu
    // pickupOption: 'Breakfast and Lunch',
    pickupTime: '',
    // pickupTime: isAuth().role === 'admin' ? '11am-1pm' : mealRequest[1].group === 'b-group' ? 'Cafeteria' : '',
    mealWeek: '',
    buttonText: 'Submit',
    // title: '',
    // url: '',
    // categories: [],
    // loadedCategories: [],
    success: '',
    error: '',
    students: user.students,
    // type: '',
    // medium: '',
  });
  const {
    studentName,
    onsiteMealRequest,
    pickupCode,
    foodAllergy,
    orderStatus,
    pickupCodeInput,
    students,
    pickupCodeAdd,
    pickupDate,
    mealRequest,
    // pickupOption,
    pickupTime,
    title,
    url,
    // categories,
    // loadedCategories,
    success,
    error,
    type,
    medium,
  } = state;

  // console.log('pickup info before', pickupTime);
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
              .every((meal) => meal.meal === 'Standard Onsite') &&
            mealRequest
              .filter(
                (meal) => meal.meal !== 'None'
                // meal.pickupOption !== 'Lunch Onsite / Breakfast Pickup'
              )
              .some((meal) => meal.pickupOption === 'Lunch Only')
          ? 'Cafeteria'
          : '',
    });
  }, [mealRequest]);

  useEffect(() => {
    // let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
    // let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    let frontCode = [];
    // let mereq = [{ meal: 'Vegetarian' }];
    // for (const mealObj in mereq) {
    // for (const meal of mealObj) {
    // console.log(mealObj);
    mealRequest.forEach((item) => {
      if (
        item.pickupOption != 'Lunch Only' &&
        item.pickupOption != 'Breakfast Only'
      ) {
        switch (item.meal) {
          case 'Vegetarian':
            frontCode.push('Vt');
            // console.log('vege')
            break;
          case 'Standard':
            frontCode.push('');
            // console.log('gf')
            break;
          case 'Vegan':
            frontCode.push('Vg');
            // console.log('vegan')
            break;
          case 'GlutenFree':
            frontCode.push('Gf');
            // console.log('gf')
            break;
          case 'Standard DF':
            frontCode.push('Df');
            break;
          case 'GlutenFree DF':
            frontCode.push('Gfdf');
            break;

          default:
            break;
        }
      }
      switch (item.meal) {
        case 'Vegan':
          frontCode.push('Vg');
          // console.log('vegan')
          break;
        case 'GlutenFree':
          frontCode.push('Gf');
          // console.log('gf')
          break;

        default:
          break;
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
      console.log('item meal', item.meal);
      console.log('item pickup option', item.pickupOption);
    });
    // }
    // code = frontCode; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    // codes[i] = code;
    console.log('use effect front code', frontCode);
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

  console.log('meal request', mealRequest);
  // load categories when component mounts useing useEffect
  // useEffect(() => {
  //   // const timer = setTimeout()
  //   // loadCategories();
  //   // loadStudents()
  //   //  Router.push('user')
  //   isAuth().role === 'admin'
  //     ? success === 'Request was created'
  //       ? setTimeout(() => {
  //           Router.push('/admin');
  //         }, 2000)
  //       : Router.push('')
  //     : success === 'Request was created' &&
  //       setTimeout(() => {
  //         Router.push('/user');
  //       }, 2000);

  //   return () => clearTimeout();
  // }, [success]);

  // useEffect(() => {
  //     // if mealRequest.student.id === cohort a || cohort b
  //     // const onsiteMealRequest =  {mealRequest: mealRequest.meal, student: mealRequest.student, complete: false }
  //     setState({...state,
  //       mealRequest1: {mealRequest: mealRequest[0].meal, student: mealRequest[0].student, complete: false },
  //     })
  // }, [mealRequest[0]])

  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDate: moment(pickupDate).format('l') });
    setShowSearch(!showSearch);
  };

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;
  // date.getDay() !== 2

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

    let input = e.target.value;
    let frontCode = '';
    let pickupOptionLO = '';
    let groupLO = '';
    switch (input) {
      case 'Lunch Only' && code.meal === 'Vegetarian':
        frontCode = 'Lv';
        break;
      case 'Lunch Only' && code.meal === 'Standard':
        frontCode = 'Sl';
        break;
      case 'Breakfast Only':
        frontCode = 'B';
      case 'Vegetarian':
        frontCode = 'Vt';
        pickupOptionLO = state.mealRequest[i].pickupOption;
        break;
      case 'Vegan':
        frontCode = 'Vg';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'GlutenFree':
        frontCode = 'Gf';
        pickupOptionLO = 'Lunch Only';
        break;
      case 'Standard':
        frontCode = '';
        pickupOptionLO = state.mealRequest[i].pickupOption;
        break;
      case 'Standard DF':
        frontCode = 'Df';
        pickupOptionLO = state.mealRequest[i].pickupOption;
        break;
      case 'GlutenFree DF':
        frontCode = 'Gfdf';
        pickupOptionLO = state.mealRequest[i].pickupOption;
        break;
      case 'Standard Onsite':
        frontCode = 'Onsite';
        pickupOptionLO = state.mealRequest[i].pickupOption;
        break;
      case 'None':
        frontCode = 'None';
        pickupOptionLO = 'None';
        group = 'None';
        // console.log('gf')
        break;

      default:
        break;
    }
    // console.log(frontCode)

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
      // pickupCode: newPickupCode,
      // pickupOption: meal.meal === 'None' ? 'None': meal.group === 'a-group' || meal.group === 'b-group' ? 'Lunch Only': 'Breakfast and Lunch',
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
  // console.log(user)
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
            {state.mealRequest[i].foodAllergy.dairy === true ? (
              <option value={'Standard DF'}>
                Standard Dairy Free (lunch only)
              </option>
            ) : (
              state.mealRequest[i].foodAllergy.gluten === false && (
                <option value={'Standard'}>Standard</option>
              )
            )}
            {state.mealRequest[i].foodAllergy.dairy !== true && (
              <option value={'Vegetarian'}>Vegetarian</option>
            )}
            <option value={'Vegan'}>Vegan (lunch only)</option>
            {state.mealRequest[i].foodAllergy.gluten === true ? (
              state.mealRequest[i].foodAllergy.dairy === true ? (
                <option value={'GlutenFree DF'}>
                  Gluten Free Dairy Free(lunch only)
                </option>
              ) : (
                <option value={'GlutenFree'}>Gluten Free (lunch only)</option>
              )
            ) : null}
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
            // value={state.value}
            data-index={i}
            defaultValue={'Standard Onsite'}
            value={mealRequest[i].meal}
            // defaultValue={state.mealRequest[0].meal}
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
            <option value={'Standard Onsite'}>Standard (Onsite)</option>
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
      // case 'Lunch Only' && code.meal === 'Vegetarian':
      //   frontCode = 'Vtl';
      //   break;
      // case 'Lunch Only' && code.meal === 'Standard':
      //   frontCode = 'Sl';
      //   break;
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
      buttonText: 'Submit',
      pickupCodeAdd: codes,
      success: '',
      error: '',
    });
  };

  const selectPickupOption = (i) => (
    <>
      <div key={i} className="form-group">
        {/* <div className=""> */}
        <select
          type="select"
          defaultValue={state.mealRequest[i].pickupOption}
          value={state.mealRequest[i].pickupOption}
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
          {/* <option value={'Breakfast Distance Lunch Onsite'}>
            Breakfast (Distance)/Lunch (Onsite)
          </option> */}
        </select>
        <div className="p-1"></div>
        {/* </div> */}
      </div>
    </>
  );

  const selectPickupLunchOnlyOption = (i) => (
    <>
      <div key={i} className="form-group">
        {/* <div className=""> */}
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
        {/* </div> */}
      </div>
    </>
  );

  const selectNonePickupOption = (i) => (
    <>
      <div key={i} className="form-group">
        {/* <div className=""> */}
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
        {/* </div> */}
      </div>
    </>
  );

  const selectPickupLunchOnsiteBreakfastOffsiteOption = (i) => (
    <>
      <div key={i} className="form-group">
        {/* <div className=""> */}
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
          <option value={'Lunch Onsite / Breakfast Pickup'}>
            Lunch Onsite / Breakfast Pickup
          </option>
        </select>
        <div className="p-1"></div>
        {/* </div> */}
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
            <option value={'7am-9am'}>7am-9am</option>
            <option value={'11am-1pm'}>11am-1pm</option>
            <option value={'4pm-6pm'}>4pm-6pm</option>
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
            <option value={'Cafeteria'}>Student Cafeteria Lunch Only</option>
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
              : 'Standard',
          student: student,
          studentName: studentName,
          lastName: user.lastName,
          schoolName: schoolName,
          group: group,
          teacher: teacher,
          pickupOption:
            group === 'a-group' || group === 'b-group'
              ? 'Lunch Only'
              : 'Breakfast and Lunch',
          foodAllergy: foodAllergy,
          parentEmail: user.email,
          parentName: user.name,
          individualPickupTime: '',
          complete: false,
        },
      ],
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
  // console.log(pickupCodeAdd)

  const submit = () => {
    // make shallow copy of individual meals and add pickuptime to each OR map or something like that

    // mealRequest.forEach((meal) => {
    //     if(meal.meal === 'None'){
    //       // delete meal
    //       console.log(meal)
    //       mealRequest.splice(meal,1)
    //     }
    // })

    // this code bellow deletes the none meal from the order. But it was messing up the update function as it shifted data in the array.
    // const mealRequestNew = mealRequest.filter((meal) => meal.meal != 'None');

    const newPickupCodeAdd = pickupCodeAdd.filter((code) => code != 'None');

    let length =
      mealRequest.filter((meal) => meal.meal != 'None').length -
      mealRequest.filter((meal) => meal.meal === 'Standard Onsite').length +
      mealRequest.filter(
        (meal) => meal.pickupOption === 'Lunch Onsite / Breakfast Pickup'
      ).length;

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
      // mealRequest: mealRequestNew,
      pickupCodeAdd: newPickupCodeAdd,
    });
  };

  console.log(mealRequest);
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
        },
        // { title, url, categories, type, medium },
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
            Router.push('/admin');
          }, 2000)
        : setTimeout(() => {
            Router.push('/user');
          }, 2000);

      return () => clearTimeout();
      // .then(Router.push('/user'))
    } catch (error) {
      console.log('LINK SUBMIT ERROR', error);
      setState({ ...state, error: error.response.data.error });
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    // console.table({title, url, categories, type, medium})
    // const toAddCode = user.userCode
    // const newCode = user.userCode + '_0' + toString(mealRequest.length)

    // let NewPickupCode = pickupCodeAdd + pickupCode

    // pickupCode = NewPickupCode
    // newCodeMaker()
    console.log(pickupCode);
    try {
      const response = await axios.post(
        `${API}/mock-link`,
        {
          mealRequest,
          // pickupOption,
          pickupTime,
          pickupDate,
          username,
          pickupCode,
          pickupCodeAdd,
          orderStatus,
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
        success: 'Request was created',
        error: '',
      });

      isAuth().role === 'admin'
        ? setTimeout(() => {
            Router.push('/admin/link/read');
          }, 2000)
        : setTimeout(() => {
            Router.push('/user');
          }, 2000);
      // .then(Router.push('/user'))
    } catch (error) {
      // console.log('LINK SUBMIT ERROR', error);
      setState({ ...state, error: error.response.data.error });
    }
  };

  // const handleURLChange = async (e) => {
  //   setState({ ...state, url: e.target.value, error: '', success: '' });
  // };

  // const handleTypeClick = (e) => {
  //   setState({ ...state, type: e.target.value, success: '', error: '' });
  // };

  // const handleMediumClick = (e) => {
  //   setState({ ...state, medium: e.target.value, success: '', error: '' });
  // };

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

  const handleCodeChange = (e) => {
    e.preventDefault;
    setState({
      ...state,
      pickupCodeInput: e.target.value.toUpperCase(),
    });
  };
  console.log(pickupCodeInput);

  // create form
  const submitLinkForm = (student) => (
    <form
      onSubmit={isAuth().role === 'admin' ? handleAdminSubmit : handleSubmit}
      // onSubmit={isAuth().role === 'admin' ? handleAdminSubmit : handleSubmit}
    >
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
      </div> */}
      {/* <div className="form-group">
        <label htmlFor="" className="text-muted">
          Meal Options
        </label>
        {selectPickupOption()}
      </div> */}
      {/* {console.log('add meal',mealRequest)} */}
      {mealRequest
        .filter((meal) => meal.meal !== 'None')
        .every(
          (meal) =>
            meal.meal == 'Standard Onsite' && meal.pickupOption == 'Lunch Only'
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
                <h3 className="text-dark">
                  Meal Request For:{' '}
                  {pickupDate && (
                    <span onClick={() => setShowSearch(!showSearch)}>
                      {moment(state.pickupDate).format('MMMM Do')}
                    </span>
                  )}
                </h3>
                {pickupDate === '' && (
                  <button
                    className={'btn btn-sm  ' + styles.buttonshadow}
                    onClick={() => setShowSearch(!showSearch)}
                  >
                    <i class="far fa-calendar-alt"></i> &nbsp;&nbsp; Select Date
                  </button>
                )}
                {isAuth().role === 'admin'
                  ? showSearch && (
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
                    )
                  : showSearch && (
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

                {/* // <input
                  // type="date"
                  // defaultValue={moment(state.pickupDate).format(
                    //   'dddd, MMMM Do '
                    //   )}
                  //   /> */}

                {/* {`${moment(state.pickupDate).format('dddd, MMMM Do ')}`}{' '} */}
              </div>
            </div>
            <hr />
            {isAuth().role === 'admin' && (
              <div className=" form-group">
                <input
                  type="text"
                  // value={user.userCode}
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
                            <b>{`${state.students[i].name}`}'s</b> meal
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
                      {x.meal != 'None'
                        ? state.students[i].group === 'distance-learning'
                          ? x.meal === 'GlutenFree' ||
                            x.meal === 'GlutenFree DF' ||
                            x.meal === 'Standard DF' ||
                            x.meal === 'Vegan'
                            ? selectPickupLunchOnlyOption(i)
                            : selectPickupOption(i)
                          : selectPickupLunchOnsiteBreakfastOffsiteOption(i)
                        : selectNonePickupOption(i)}
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
                      &nbsp;&nbsp; Next Student
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
                  {/* {console.log(mealRequest)} */}
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

Create.getInitialProps = ({ req, user }) => {
  const token = getCookie('token', req);
  return { token, user };
};

export default withUser(Create);
// export default withUser(Create)
