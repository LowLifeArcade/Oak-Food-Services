// imports
import styles from '../../../styles/Home.module.css';
import moment from 'moment';
import Router from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import withUser from '../../withUser';
import { getCookie, isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import axios from 'axios';

const Update = ({ oldLink, token, user, _id }) => {
  // state
  // console.log('old link data from user[id]', oldLink);
  const [state, setState] = useState({
    // mealRequest: oldLink.mealRequest,
    // mealRequest: [
    //   {
    //     meal: 'Standard',
    //   },
    // ],
    // students: oldLink.students,
    mealRequest: oldLink.mealRequest,
    orderStatus: false,
    pickupTime: oldLink.pickupTime,
    pickupOption: oldLink.pickupOption,
    pickupDate: oldLink.pickupDate,
    pickupCodeInput: oldLink.postedBy.userCode,
    buttonText: 'Update',
    // userCode: oldLink.postedBy.userCode,
    pickupCode: '', // fix. this doesn't work.
    pickupCodeAdd: [],
    // pickupCodeAdd: oldLink.pickupCodeAdd,
    mealWeek: oldLink.pickupWeek,
    success: '',
    error: '',
    students: user.students,
  });

  const {
    pickupCodeInput,
    pickupOption,
    // userCode,
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

  // const username = user.username;
  // const userCode = user.userCode
  const [showSearch, setShowSearch] = useState(false);
  console.log('mealRequest', mealRequest);

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
    setTimeout(() => {
    // let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
    // let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    let frontCode = [];
    // let mereq = [{ meal: 'Vegetarian' }];
    // for (const mealObj in mereq) {
    // for (const meal of mealObj) {
    // console.log(mealObj);
    mealRequest.forEach((item) => {
      if (item.pickupOption != 'Lunch Only' && item.pickupOption != 'Breakfast Only' ) {
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
    // let newPickupCode =
    //   frontCode.join('') + '-' + user.userCode + '-0' + mealRequest.length;

    setState({
      ...state,
      buttonText: 'Update',
      // pickupCode: newPickupCode,
      pickupCodeAdd: frontCode,
      success: '',
      error: '',
    }); //puts ...mealRequest with new meal back into mealRequest: []
  },100)

  }, [mealRequest]);

  // console.log(user.students);
  // load categories when component mounts useing useEffect
  // load categories when component mounts useing useEffect
  useEffect(() => {
    loadCategories();
    success === 'Your request was updated'
      ? isAuth().role === 'admin'
        ? setTimeout(() => {
            Router.push('/admin/link/read');
          }, 2000)
        : setTimeout(() => {
            Router.push('/user');
          }, 2000)
      : // : Router.push('');:
        null;
    return () => clearTimeout();
  }, [success]);

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
    switch (input) {
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
      case 'Standard Onsite':
        frontCode = 'Onsite';
        pickupOptionLO = state.mealRequest[i].pickupOption;
        break;
      case 'None':
        frontCode = 'None';
        pickupOptionLO = 'None';
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
      buttonText: 'Request',
      // pickupCode: newPickupCode,
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

  // // meal request select
  // const handleSelectChange = (
  //   e,
  //   student,
  //   studentName,
  //   schoolName,
  //   group,
  //   teacher,
  //   foodAllergy
  // ) => {
  //   let i = e.target.getAttribute('data-index');
  //   {
  //     // console.log(i);
  //   }

  //   let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
  //   let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
  //   meal.meal = e.target.value;
  //   meal.student = student;
  //   meal.studentName = studentName;
  //   meal.group = group;
  //   meal.teacher = teacher;
  //   meal.schoolName = schoolName; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
  //   meals[i] = meal; // puts meal[i] back into mealRequest array
  //   // console.log(meal)
  //   // meal.meal === 'Vegetarian' ? console.log('vege') : console.log('standard')

  //   let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
  //   let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at

  //   // console.log(pickupCodeAdd)

  //   let input = e.target.value;
  //   let frontCode = '';
  //   switch (input) {
  //     case 'Vegetarian':
  //       frontCode = 'Vt';
  //       // console.log('vege')
  //       break;
  //     case 'Vegan':
  //       frontCode = 'Vg';
  //       // console.log('vegan')
  //       break;
  //     case 'GlutenFree':
  //       frontCode = 'Gf';
  //       // console.log('gf')
  //       break;
  //     case 'Standard':
  //       frontCode = '';
  //     // console.log('gf')
  //     case 'None':
  //       frontCode = 'None';
  //       // console.log('gf')
  //       break;

  //     default:
  //       break;
  //   }
  //   // console.log(frontCode)

  //   code = frontCode; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
  //   codes[i] = code;
  //   // console.log(codes)
  //   let length = mealRequest.length;

  //   // move some of this code somewhere else where it doesn't have to change only when user does a meal name change
  //   // let newFrontCode = codes
  //   let newPickupCode = codes.join('') + '-' + user.userCode + '-0' + length;

  //   // if(student[i]==='Group A') {

  //   // }

  //   setState({
  //     ...state,
  //     mealRequest: [...meals],
  //     buttonText: 'Update',
  //     pickupCode: newPickupCode,
  //     pickupCodeAdd: codes,
  //     success: '',
  //     error: '',
  //   }); //puts ...mealRequest with new meal back into mealRequest: []
  //   // setState({...state,
  //   //   mealRequest: [...mealRequest, {meal: e.target.value}]});
  //   // console.log(e.target.getAttribute("data-index"))
  //   // setState({...state, pickupCode: user.userCode})
  //   // console.log(codes)
  // };
  // console.log(state.pickupCodeAdd)
  // console.log(pickupCodeAdd);

  // const selectMealRequest = (
  //   i,
  //   student,
  //   studentName,
  //   schoolName,
  //   group,
  //   teacher
  // ) => (
  //   <>
  //     <div key={i} className="form-group">
  //       <div className="">
  //         <select
  //           type="select"
  //           // value={state.value}
  //           data-index={i}
  //           defaultValue={mealRequest[i].meal}
  //           // defaultValue={state.mealRequest[0].meal}
  //           onChange={(e) =>
  //             handleSelectChange(
  //               e,
  //               student,
  //               studentName,
  //               schoolName,
  //               group,
  //               teacher
  //             )
  //           }
  //           className="form-control"
  //         >
  //           {' '}
  //           <option value="">Choose an option</option>
  //           <option value={'Standard'}>Standard</option>
  //           <option value={'Vegetarian'}>Vegetarian</option>
  //           <option value={'Vegan'}>Vegan (lunch only)</option>
  //           <option value={'GlutenFree'}>Gluten Free (lunch only)</option>
  //           <option value={'None'}>None</option>
  //         </select>
  //         <div className="p-2"></div>
  //       </div>
  //     </div>
  //   </>
  // );

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
            <option value={'Standard'}>Standard</option>
            <option value={'Vegetarian'}>Vegetarian</option>
            <option value={'Vegan'}>Vegan (lunch only)</option>
            <option value={'GlutenFree'}>Gluten Free (lunch only)</option>
            <option value={'None'}>None</option>
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  // // pickup options(all, breakfast only, lunch only) select
  // const handlePickupOption = (e) => {
  //   setState({
  //     ...state,
  //     pickupOption: e.target.value,
  //     buttonText: 'Update',
  //     success: '',
  //     error: '',
  //   });
  // };

  // pickup options(all, breakfast only, lunch only) select
  const handlePickupOption = (i, e) => {
    let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
    let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    meal.pickupOption = e.target.value;

    meals[i] = meal;

    // let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
    // let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at
    // let input = e.target.value;
    // let frontCode = '';

    // switch (input) {
    //   // case 'Lunch Only' && code.meal === 'Vegetarian':
    //   //   frontCode = 'Vtl';
    //   //   break;
    //   // case 'Lunch Only' && code.meal === 'Standard':
    //   //   frontCode = 'Sl';
    //   //   break;
    //   case 'Breakfast Only':
    //     frontCode = 'B';
    //     break;
    //   case 'Lunch Onsite / Breakfast Pickup':
    //     frontCode = 'B';
    //     break;
    //   default:
    //     break;
    // }
    // code = frontCode; // let meal is mealRequest: [...meal[i]] basically and meal.meal is {meal[i]: e.target.value} which i can't just write sadly
    // codes[i] = code;

    setState({
      ...state,
      mealRequest: [...meals],
      buttonText: 'Request',
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

  // const selectPickupOption = (i) => (
  //   <>
  //     <div key={i} className="form-group">
  //       <div className="">
  //         <select
  //           type="select"
  //           // defaultValue={state.pickupOption.value}
  //           // value='Breakfast and Lunch'
  //           data-index={i}
  //           onChange={(e) => handlePickupOption(e)}
  //           className="form-control"
  //         >
  //           {' '}
  //           <option selected value={'Breakfast and Lunch'}>
  //             Breakfast and Lunch
  //           </option>
  //           <option value={'Breakfast Only'}>Breakfast Only</option>
  //           <option value={'Lunch Only'}>Lunch Only</option>
  //         </select>
  //         <div className="p-2"></div>
  //       </div>
  //     </div>
  //   </>
  // );

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
            <option value={'Cafeteria'}>Student Cafeteria Lunch Only</option>
          </select>
          <div className="p-2"></div>
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
          <div className="p-2"></div>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({title, url, categories, type, medium})
    // const toAddCode = user.userCode
    // const newCode = user.userCode + '_0' + toString(mealRequest.length)

    // let NewPickupCode = pickupCodeAdd + pickupCode

    // pickupCode = NewPickupCode
    // newCodeMaker()
    // console.log(pickupCode)

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
        {
          mealRequest,
          pickupTime,
          pickupDate,
          // username,
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
        success: 'Your request was updated',
        buttonText: 'Updated',
      });
      // .then(Router.push('/user'))
    } catch (error) {
      console.log('LINK SUBMIT ERROR', error);
      setState({
        ...state,
        // error: error.response.data.error
        error: 'some error',
      });
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
    console.log(
      mealRequest,
      // pickupOption,
      pickupTime,
      pickupDate,
      // username,
      pickupCode,
      pickupCodeAdd,
      orderStatus
    );
    let dynamicUpdateUrl;
    if (isAuth() && isAuth().role === 'admin') {
      dynamicUpdateUrl = `${API}/link/admin/${oldLink._id}`;
    } else {
      dynamicUpdateUrl = `${API}/link/${oldLink._id}`;
    }
    console.log(pickupCode);
    try {
      const response = await axios.post(
        `${API}/mock-link`,
        dynamicUpdateUrl,
        {
          mealRequest,
          // pickupOption,
          pickupTime,
          pickupDate,
          // username,
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
      // .then(Router.push('/user'))
    } catch (error) {
      console.log('LINK SUBMIT ERROR', error);
      setState({ ...state, error: 'update error' });
    }
  };
  console.log('pickup code add', pickupCodeAdd);
  const submit = () => {
    // mealRequest.forEach((meal) => {
    //     if(meal.meal === 'None'){
    //       // delete meal
    //       console.log(meal)
    //       mealRequest.splice(meal,1)
    //     }
    // })

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

  const handleCodeChange = (e) => {
    e.preventDefault;
    setState({
      ...state,
      pickupCodeInput: e.target.value.toUpperCase(),
    });
  };
  // console.log(pickupCodeInput)

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
            // value={state.value}
            data-index={i}
            defaultValue={mealRequest[i].meal}
            // value={mealRequest[i].meal}
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
            <option disabled value={''}>
              Choose a meal
            </option>
            <option value={'Standard Onsite'}>Standard (Onsite)</option>
            <option value={'None'}>None</option>
          </select>
          <div className="p-2"></div>
        </div>
      </div>
    </>
  );

  const selectPickupLunchOnsiteBreakfastOffsiteOption = (i) => (
    <>
      <div key={i} className="form-group">
        {/* <div className=""> */}
        <select
          type="select"
          // defaultValue={state.mealRequest[i].pickupOption}
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
        <div className="p-2"></div>
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
          // defaultValue={state.mealRequest[i].pickupOption}
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
        <div className="p-2"></div>
        {/* </div> */}
      </div>
    </>
  );
  console.log('meal req', mealRequest);
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
        <div className="p-2"></div>
        {/* </div> */}
      </div>
    </>
  );

  const selectPickupOption = (i) => (
    <>
      <div key={i} className="form-group">
        {/* <div className=""> */}
        <select
          type="select"
          // defaultValue={state.mealRequest[i].pickupOption}
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
        <div className="p-2"></div>
        {/* </div> */}
      </div>
    </>
  );

  // create form
  const submitLinkForm = () => (
    <form
      onSubmit={isAuth().role === 'admin' ? handleSubmit : handleSubmit}
      // onSubmit={isAuth().role === 'admin' ? handleAdminSubmit : handleSubmit}
    >
      {/* <div className="form-group">
        <label htmlFor="" className="text-muted">
          Meal Options
        </label>
        {selectPickupOption()}
      </div> */}

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
          className="btn btn-outline-warning"
          onClick={submit}
          type="submit"
        >
          {isAuth() || token ? state.buttonText : 'Login to Make Request'}
        </button>

        {/* <button
          disabled={!token}
          className="btn btn-outline-danger float-right"
          onClick={(e) => confirmDelete(e, oldLink._id)}
        >
          {isAuth() || token ? 'Delete' : 'Login to Make Request'}
        </button> */}
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
                <h3>
                  Meal Request for:{' '}
                  {pickupDate && moment(oldLink.pickupDate).format('MMM Do')}{' '}
                </h3>
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
                <br />
                {/* // <input
                  // type="date"
                  // defaultValue={moment(state.pickupDate).format(
                    //   'dddd, MMMM Do '
                    //   )}
                  //   /> */}

                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  Select Date
                </button>

                <br />
                {/* {`${moment(state.pickupDate).format('dddd, MMMM Do ')}`}{' '} */}
                <br />
              </div>
            </div>

            {isAuth().role === 'admin' && (
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
                      {isAuth().role != 'admin' ? (
                        <h6 className="p-2">
                          <label
                            key={i}
                            className="form-check-label text-muted"
                          >
                            {/* Select Meal # {`${i + 1}`}  */}
                            Select meal for {`${user.students[i].name}`}
                          </label>
                        </h6>
                      ) : (
                        <h6 className="p-2">
                          <label
                            key={i}
                            className="form-check-label text-muted"
                          >
                            {/* Select Meal # {`${i + 1}`}  */}
                            Select meal for student # {`${i + 1}`}
                          </label>
                        </h6>
                      )}
                      {/* {console.log(x)}
                    {console.log(mealRequest)} */}

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
                          ? x.meal === 'GlutenFree' || x.meal === 'Vegan'
                            ? selectPickupLunchOnlyOption(i)
                            : selectPickupOption(i)
                          : selectPickupLunchOnsiteBreakfastOffsiteOption(i)
                        : selectNonePickupOption(i)}
                    </>
                  );
                })}

                <div className="">
                  {state.mealRequest.length < state.students.length && (
                    <button
                      className="btn btn-warning"
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
                      Add Meal
                    </button>
                  )}

                  {state.mealRequest.length !== 1 && (
                    <button
                      className="btn btn-warning float-right"
                      onClick={() => removeMeal()}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* {console.log(mealRequest)} */}
              </div>
              <div className="col-md p-3">
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

Update.getInitialProps = async ({ req, token, query, user }) => {
  const response = await axios.get(`${API}/link/${query.id}`);
  return { oldLink: response.data, token, user };
  // const token = getCookie('token', req);
  // return { token, user };
  // const response = await axios.get(`${API}/link/${query.id}`);
  // // const token = getCookie('token', req);
  // return { oldLink: response.data, token, user};
  // // return { token, user };
};

export default withUser(Update);
// export default withUser(Create)
