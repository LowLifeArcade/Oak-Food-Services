import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { showErrorMessage, showSuccessMessage } from '../helpers/alerts';
import { API } from '../config';
import { withRouter } from 'next/router';
import Layout from '../components/Layout';
import Router from 'next/router';

const ActivateAccount = ({ router }) => {
  const [state, setState] = useState({
    name: '',
    token: '',
    buttonText: 'Activate Account',
    success: '',
    error: '',
  });
  const { name, token, buttonText, success, error } = state;

  // useEffect(() => {
  //   let token = router.query.id;
  //   if (token) {
  //     const { name } = jwt.decode(token);
  //     setState({ ...state, name, token });
  //   }
  // }, [router]);

  // useEffect(() => {
  //   success === 'Registration successful. Please login.'
  //     ? setTimeout(() => {
  //         Router.push('/login');
  //       }, 2000)
  //     : console.log("it's fine");
  //   return () => clearTimeout();
  // }, [success]);

  // const clickSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log('activate account');
  //   setState({ ...state, buttonText: 'Activating' });

  //   try {
  //     const response = await axios.post(`${API}/register/activate`, { token });
  //     console.log('account activate response', response);
  //     setState({
  //       ...state,
  //       token: '',
  //       buttonText: 'Activated!',
  //       success: response.data.message,
  //     });
  //   } catch (error) {
  //     setState({
  //       ...state,
  //       buttonText: 'Activation Failed',
  //       error: error.response.data.error,
  //     });
  //   }
  // };

  return (
    <Layout>
      <div className="row">
        {/* <div className="p-5"></div> */}
        <div className="p-4 pt-5 col-md-8 offset-md-2">
          <h2>Hello, {name}, click on the button to activate your account.</h2> 
          <h6 className='pt-4 p-2 text-muted'>
          On your first login, please register your participating students. You can modify this information in <i>Profile Update</i>.
          </h6>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <button
            className="btn btn-outline-warning"
            // onClick={clickSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);


// import { useState, useEffect, useRef } from 'react';
// import Router from 'next/router';
// import styles from '../../../styles/Home.module.css';
// // components and helpers
// import Layout from '../../../components/Layout';
// import AdminPanel from '../../../components/AdminPanel';
// import AddMeal from '../../../components/AddMeal';
// import AdminCode from '../../../components/AdminCode';
// import SelectMealRequest from '../../../components/SelectMealRequest';
// import SelectPickupOption from '../../../components/SelectPickupOption';
// import SelectPickupTime from '../../../components/SelectPickupTime';
// import SubmitButton from '../../../components/SubmitButton';
// import RemoveMeal from '../../../components/RemoveMeal';
// import SelectDaysPanel from '../../../components/SelectDaysPanel';
// import MealRequestStudent from '../../../components/MealRequestStudent';
// import FakeMealRequestForm from '../../../components/FakeMealRequestForm';
// import MealRequestCalanderPanel from '../../../components/MealRequestCalanderPanel';
// import { getCookie, isAuth } from '../../../helpers/auth';
// import withUser from '../../withUser';
// import { API } from '../../../config';
// // dependencies
// import axios from 'axios';
// import moment from 'moment';
// // import Calendar from 'react-calendar';
// // import 'react-calendar/dist/Calendar.css';

// const Create = ({ token, user }) => {
//   const [loaded, setLoaded] = useState(false);
//   const [state, setState] = useState({
//     mealRequest: [
//       {
//         // FIXME: refactor into own state object for mealRequest
//         meal:
//           user.students[0].group === 'a-group' ||
//           user.students[0].group === 'b-group'
//             ? 'Standard Onsite'
//             : user.students[0].foodAllergy.dairy === false &&
//               user.students[0].foodAllergy.gluten === false &&
//               user.students[0].foodAllergy.soy === true &&
//               user.students[0].foodAllergy.sesame === true
//             ? 'Soy and Sesame Free'
//             : user.students[0].foodAllergy.soy === false &&
//               user.students[0].foodAllergy.sesame === false &&
//               user.students[0].foodAllergy.dairy === true &&
//               user.students[0].foodAllergy.gluten === true
//             ? 'Gluten Free Dairy Free'
//             : user.students[0].foodAllergy.soy === false &&
//               user.students[0].foodAllergy.sesame === false &&
//               user.students[0].foodAllergy.dairy === true &&
//               user.students[0].foodAllergy.gluten === false
//             ? 'Standard Dairy Free'
//             : user.students[0].foodAllergy.soy === false &&
//               user.students[0].foodAllergy.sesame === false &&
//               user.students[0].foodAllergy.dairy === false &&
//               user.students[0].foodAllergy.gluten === true
//             ? 'Gluten Free'
//             : user.students[0].foodAllergy.soy === true &&
//               user.students[0].foodAllergy.sesame === false &&
//               user.students[0].foodAllergy.dairy === false &&
//               user.students[0].foodAllergy.gluten === false
//             ? 'Standard Soy Free'
//             : user.students[0].foodAllergy.soy === false &&
//               user.students[0].foodAllergy.sesame === true &&
//               user.students[0].foodAllergy.dairy === false &&
//               user.students[0].foodAllergy.gluten === false
//             ? 'Standard Sesame Free'
//             : user.students[0].foodAllergy.soy === true &&
//               user.students[0].foodAllergy.sesame === true &&
//               user.students[0].foodAllergy.dairy === true &&
//               user.students[0].foodAllergy.gluten === false
//             ? 'Soy Sesame Dairy Free'
//             : user.students[0].foodAllergy.soy === true &&
//               user.students[0].foodAllergy.sesame === true &&
//               user.students[0].foodAllergy.dairy === false &&
//               user.students[0].foodAllergy.gluten === true
//             ? 'Soy Sesame Gluten Free'
//             : user.students[0].foodAllergy.soy === true &&
//               user.students[0].foodAllergy.sesame === true &&
//               user.students[0].foodAllergy.dairy === true &&
//               user.students[0].foodAllergy.gluten === true
//             ? 'Soy Sesame Dairy Gluten Free'
//             : 'Standard',
//         student: user.students[0]._id,
//         studentName: user.students[0].name,
//         lastName: user.lastName,
//         schoolName: user.students[0].schoolName,
//         group: user.students[0].group,
//         teacher: user.students[0].teacher,
//         pickupOption:
//           user.students[0].group === 'a-group' ||
//           user.students[0].group === 'b-group'
//             ? 'Lunch Onsite'
//             : user.students[0].foodAllergy.egg === true ||
//               user.students[0].foodAllergy.soy === true ||
//               user.students[0].foodAllergy.dairy === true ||
//               user.students[0].foodAllergy.gluten === true
//             ? 'Lunch Only'
//             : 'Breakfast and Lunch',
//         foodAllergy: user.students[0].foodAllergy,
//         parentEmail: user.email,
//         parentName: user.name,
//         individualPickupTime: '',
//         complete: false,
//         days:
//           user.students[0].group === 'a-group' // a group is monday and tuesday
//             ? {
//                 sunday: false,
//                 monday: true, // a
//                 tuesday: true, // a
//                 wednesday: false,
//                 thursday: false,
//                 friday: false,
//                 saturday: false,
//               }
//             : user.students[0].group === 'b-group' // b group is wednesday and thursday
//             ? {
//                 sunday: false,
//                 monday: false,
//                 tuesday: false,
//                 wednesday: true, // b
//                 thursday: true, // b
//                 friday: false,
//                 saturday: false,
//               }
//             : {
//                 // default is offsite
//                 sunday: false,
//                 monday: false,
//                 tuesday: false,
//                 wednesday: false,
//                 thursday: false,
//                 friday: false,
//                 saturday: false,
//               },
//       },
//     ],
//     orderStatus: false,
//     userCode: user.userCode,
//     pickupCode: user.userCode + '-01',
//     pickupCodeInput: '',
//     pickupCodeAdd: [''],
//     pickupDate: localStorage.getItem('search-date')
//       ? moment(JSON.parse(localStorage.getItem('search-date'))).format('l')
//       : '',
//     pickupTime: '',
//     mealWeek: '',
//     buttonText: 'Submit',
//     success: '',
//     error: '',
//     students: user.students,
//   });
//   const {
//     pickupCode,
//     orderStatus,
//     userCode,
//     pickupCodeInput,
//     students,
//     pickupCodeAdd,
//     pickupDate,
//     mealRequest,
//     pickupTime,
//     success,
//     error,
//   } = state;

//   // displays loading form for n seconds
//   useEffect(() => {
//     setTimeout(() => {
//       setLoaded(true);
//     }, 600);
//   }, []);

//   // reroutes if not signed in
//   useEffect(() => {
//     !isAuth() && Router.push('/');
//   });

//   // reads date into local storage
//   useEffect(() => {
//     const data = localStorage.getItem('search-date');
//     if (data) {
//       try {
//         handleDateChange(JSON.parse(data));
//       } catch (error) {
//         setState({ ...state, error: error });
//       }
//       localStorage.removeItem('search-date');
//     }
//   }, []);

//   // sets default pickupTime as onsite 'Cafeteria' if all meals are onsite meals
//   useEffect(() => { // TODO: refactor into helper or component 
//     setState({
//       ...state,
//       pickupTime:
//         isAuth().role === 'admin'
//           ? '11am-1pm'
//           : mealRequest
//               .filter((meal) => meal.meal !== 'None')
//               .every((meal) => meal.meal === 'Standard Onsite') &&
//             mealRequest
//               .filter((meal) => meal.meal !== 'None')
//               .some((meal) => meal.pickupOption === 'Lunch Onsite')
//           ? 'Cafeteria'
//           : '',
//     });
//   }, [mealRequest]);

//   // Generates pickup code TODO: reafactor into helper or component 
//   useEffect(() => {
//     let frontCode = [];
//     mealRequest.forEach((item) => {
//       if (
//         item.pickupOption != 'Lunch Onsite' &&
//         item.pickupOption != 'Breakfast Only'
//       ) {
//         switch (item.meal) {
//           case 'Standard': // TODO add if statement to handle L instead of blank
//             frontCode.push('');
//             break;
//           // case 'Vegetarian' && !item.pickupOption === 'Lunch Only':
//           //   frontCode.push('Vt');
//           //   break;
//           // I can probably handle all vegetarian cases in the case statement with if statements
//           case 'Vegan':
//             frontCode.push('Vg');
//             break;
//           case 'Vegan B':
//             frontCode.push('Vgb');
//             break;
//           case 'Gluten Free':
//             frontCode.push('Gf');
//             break;
//           case 'Gluten Free with Breakfast':
//             frontCode.push('Gfb');
//             break;
//           case 'Standard Dairy Free':
//             frontCode.push('Df');
//             break;
//           case 'Gluten Free Dairy Free':
//             frontCode.push('Gfdf');
//             break;
//           case 'Standard Sesame Free':
//             frontCode.push('Sm');
//             break;
//           case 'Vegetarian Sesame Free':
//             frontCode.push('Vtsm');
//             break;
//           case 'Vegan Sesame Free':
//             frontCode.push('Vgsm');
//             break;
//           case 'Standard Soy Free':
//             frontCode.push('Sy');
//             break;
//           case 'Vegetarian Soy Free':
//             frontCode.push('Vtsy');
//             break;
//           case 'Vegan Soy Free':
//             frontCode.push('Vgsy');
//             break;
//           case 'Soy and Sesame Free':
//             frontCode.push('Sp');
//             break;
//           case 'Soy Sesame Dairy Free':
//             frontCode.push('Sp');
//             break;
//           case 'Soy Sesame Gluten Free':
//             frontCode.push('Sp');
//             break;
//           case 'Soy Sesame Dairy Gluten Free':
//             frontCode.push('Sp');
//             break;
//           case '2on 3off':
//             frontCode.push('H');
//             break;
//           default:
//             break;
//         }
//       }
//     });

//     mealRequest.forEach((item) => {
//       switch (item.pickupOption) {
//         case 'Breakfast Only':
//           frontCode.push('B');
//           break;
//         case 'Lunch Onsite / Breakfast Pickup':
//           frontCode.push('B');
//           break;
//         default:
//           break;
//       }
//       item.pickupOption === 'Lunch Only' && item.meal === 'Standard'
//         ? frontCode.push('L')
//         : null;
//       item.pickupOption === 'Lunch Only' && item.meal === 'Vegetarian'
//         ? frontCode.push('Lv')
//         : null;
//       item.pickupOption === 'Breakfast and Lunch' && item.meal === 'Vegetarian'
//         ? frontCode.push('Vt')
//         : null;
//     });
//     let newPickupCode =
//       frontCode.join('') + '-' + user.userCode + '-0' + mealRequest.length;

//     setState({
//       ...state,
//       buttonText: 'Submit',
//       pickupCode: newPickupCode,
//       pickupCodeAdd: frontCode, // FIXME: i don't think i need this
//       success: '',
//       error: '',
//     });
//   }, [mealRequest]);

//   // // Calendar
//   // const [showSearch, setShowSearch] = useState(false);
//   // const calendarButton = useRef();

//   // // shows and hides calendar
//   // useEffect(() => {
//   //   const handleClick = (event) => {
//   //     if (
//   //       calendarButton.current &&
//   //       !calendarButton.current.contains(event.target)
//   //     ) {
//   //       setShowSearch(false);
//   //     }
//   //   };
//   //   document.addEventListener('click', handleClick);
//   //   return () => document.removeEventListener('click', handleClick);
//   // });

//   // // changes pickup date
//   // const onDateChange = (pickupDate) => {
//   //   setState({ ...state, pickupDate: moment(pickupDate).format('l') });
//   //   setShowSearch(!showSearch);
//   // };

//   // // disabled dates on calendar
//   // const handleDisabledDates = ({ date, view }) =>
//   //   date.getDay() !== 1 ||
//   //   date.getMonth() === 5 ||
//   //   (date.getMonth() === 6 && date !== '2021-04-31');

//   // // handles lead time for orders
//   // let twoWeeksFromNow = new Date();
//   // twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

//   // handles meal selection and pickupOption aka meal types (breakfast only, lunch only, breakfast and lunch etc)
//   // const handleSelectChange = (e) => {
//   //   let i = e.target.getAttribute('data-index');

//   //   // let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
//   //   // let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at

//   //   let input = e.target.value;
//   //   // let frontCode = '';
//   //   let pickupOptionLO = '';
//   //   // let groupLO = '';
//   //   switch (input) {
//   //     // specials
//   //     case 'Lunch Only' && code.meal === 'Vegetarian':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Lunch Only' && code.meal === 'Standard':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Breakfast Only':
//   //       pickupOptionLO = 'Breakfast Only';
//   //       break;
//   //     case 'Vegan B': // Vegan with breakfast
//   //       pickupOptionLO = 'Breakfast and Lunch';
//   //       break;
//   //     case 'Gluten Free with Breakfast':
//   //       pickupOptionLO = 'Breakfast and Lunch';
//   //       break;
//   //     case '2on 3off':
//   //       pickupOptionLO = 'Two Onsite / Three Breakfast and Lunches';
//   //       break;

//   //     // standard options
//   //     case 'Standard':
//   //       pickupOptionLO = 'Breakfast and Lunch';
//   //       break;
//   //     case 'Vegetarian':
//   //       pickupOptionLO = 'Breakfast and Lunch';
//   //       break;
//   //     case 'Vegan':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;

//   //     // gluten dairy options
//   //     case 'Gluten Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Standard Dairy Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Gluten Free Dairy Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;

//   //     // sesame gluten dairy combos
//   //     case 'Gluten Sesame Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Sesame Dairy Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Sesame Dairy Gluten Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;

//   //     // sesame options
//   //     case 'Standard Sesame Free':
//   //       pickupOptionLO = 'Breakfast and Lunch';
//   //       break;
//   //     case 'Vegetarian Sesame Free':
//   //       pickupOptionLO = 'Breakfast and Lunch';
//   //       break;
//   //     case 'Vegan Sesame Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;

//   //     // soy options
//   //     case 'Standard Soy Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Vegetarian Soy Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Vegan Soy Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Gluten Soy Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Soy and Sesame Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Soy Dairy Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Soy Sesame Dairy Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Soy Sesame Gluten Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Soy Sesame Dairy Gluten Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;
//   //     case 'Soy Dairy Gluten Free':
//   //       pickupOptionLO = 'Lunch Only';
//   //       break;

//   //     // other
//   //     case 'Standard Onsite':
//   //       pickupOptionLO = 'Lunch Onsite';
//   //       break;
//   //     case 'None':
//   //       pickupOptionLO = 'None';
//   //       break;
//   //     default:
//   //       break;
//   //   }

//   //   // code = frontCode;
//   //   // codes[i] = code;

//   //   let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
//   //   let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
//   //   meal.meal = e.target.value; // handles actual meal selected
//   //   meal.pickupOption = pickupOptionLO;

//   //   meals[i] = meal; // puts meal[i] back into mealRequest array

//   //   setState({
//   //     ...state,
//   //     mealRequest: [...meals],
//   //     buttonText: 'Submit',
//   //     success: '',
//   //     error: '',
//   //   });
//   // };

//   // for toggle panel
//   // const handleDayChange = (day) => (e) => {
//   //   let i = e.target.getAttribute('data-index');
//   //   let value =
//   //     e.target.type === 'checkbox' ? e.target.checked : e.target.value;

//   //   let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
//   //   let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
//   //   meal.days[day] = value;

//   //   meals[i] = meal; // puts meal[i] back into mealRequest array

//   //   setState({
//   //     ...state,
//   //     mealRequest: [...meals],
//   //     buttonText: 'Submit',
//   //     // pickupCodeAdd: codes,
//   //     success: '',
//   //     error: '',
//   //   }); //puts ...mealRequest with new meal back into mealRequest: []
//   // };

//   // const selectMealRequest = (i) => (
//   //   <>
//   //     <div key={i} className="form-group">
//   //       <div className="">
//   //         <select
//   //           type="select"
//   //           data-index={i}
//   //           defaultValue={'Standard'}
//   //           value={state.mealRequest[i].meal}
//   //           onChange={(e) => handleSelectChange(e)}
//   //           className="form-control"
//   //         >
//   //           {' '}
//   //           <option disabled value="">
//   //             Choose an option
//   //           </option>
//   //           {isAuth().role === 'admin' && ( // admin options
//   //             <>
//   //               <option value={'Standard'}>Standard</option>
//   //               <option value={'Standard Onsite'}>Standard Onsite</option>
//   //               <option value={'Vegetarian'}>Vegetarian</option>
//   //               <option value={'Vegan'}>Vegan</option>
//   //               <option value={'Gluten Free'}>Gluten Free</option>
//   //               <option value={'Gluten Free Dairy Free'}>
//   //                 Gluten Free Dairy Free
//   //               </option>
//   //               <option value={'Standard Dairy Free'}>
//   //                 Standard Dairy Free
//   //               </option>
//   //               <option value={'Standard Sesame Free'}>
//   //                 Standard Sesame Free{' '}
//   //               </option>
//   //               <option value={'Vegetarian Sesame Free'}>
//   //                 Vegetarian Sesame Free
//   //               </option>
//   //               <option value={'Vegan Sesame Free'}>Vegan Sesame Free</option>
//   //               <option value={'Sesame Dairy Free'}>Sesame Dairy Free</option>
//   //               <option value={'Standard Soy Free'}>Standard Soy Free</option>
//   //               <option value={'Vegetarian Soy Free'}>
//   //                 Vegetarian Soy Free
//   //               </option>
//   //               <option value={'Vegan Soy Free'}>Vegan Soy Free</option>
//   //               <option value={'Soy Sesame Free'}>Soy Sesame Free</option>
//   //               <option value={'Soy Sesame Dairy Free'}>
//   //                 Soy Sesame Dairy Free
//   //               </option>
//   //               <option value={'Soy Sesame Gluten Free'}>
//   //                 Soy Sesame Gluten Free
//   //               </option>
//   //               <option value={'Soy Sesame Dairy Gluten Free'}>
//   //                 Soy Sesame Dairy Gluten Free
//   //               </option>
//   //               <option value={'2on 3off'}>
//   //                 Standard 2 Onsite / 3 Offsite Lunches plus 5 Breakfasts
//   //               </option>
//   //             </>
//   //           )}
//   //           {isAuth().role === 'subscriber' && // 0000              students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.sesame === false &&
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.soy === false && (
//   //               <option value={'Standard'}>Standard</option>
//   //             )}
//   //           {isAuth().role === 'subscriber' &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.sesame === false &&
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.soy === false && (
//   //               <option value={'Vegetarian'}>Vegetarian</option>
//   //             )}
//   //           {isAuth().role === 'subscriber' &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.sesame === false &&
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.soy === false && (
//   //               <option value={'Vegan'}>Vegan (Lunch Only)</option>
//   //             )}
//   //           {/* {gluten dairy options} */}
//   //           {isAuth().role === 'subscriber' && // 0100
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === true &&
//   //             students[i].foodAllergy.soy === false &&
//   //             students[i].foodAllergy.sesame === false && (
//   //               <option value={'Gluten Free'}>Gluten Free (Lunch Only)</option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 1000
//   //             students[i].foodAllergy.dairy === true &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === false &&
//   //             students[i].foodAllergy.sesame === false && (
//   //               <option value={'Standard Dairy Free'}>
//   //                 Dairy Free (Lunch Only)
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // dairy free has this option too
//   //             students[i].foodAllergy.dairy === true &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === false &&
//   //             students[i].foodAllergy.sesame === false && (
//   //               <option value={'Vegan'}>Vegan (Lunch Only)</option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 1100
//   //             students[i].foodAllergy.dairy === true &&
//   //             students[i].foodAllergy.gluten === true &&
//   //             students[i].foodAllergy.soy === false &&
//   //             students[i].foodAllergy.sesame === false && (
//   //               <option value={'Gluten Free Dairy Free'}>
//   //                 Gluten Free Dairy Free (lunch only)
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 0101 // add to list
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === true &&
//   //             students[i].foodAllergy.soy === false &&
//   //             students[i].foodAllergy.sesame === true && (
//   //               <option value={'Gluten Sesame Free'}>
//   //                 Gluten Sesame Free (Lunch Only)
//   //               </option>
//   //             )}
//   //           {/* soy */}
//   //           {isAuth().role === 'subscriber' && // 0010
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === true &&
//   //             students[i].foodAllergy.sesame === false && (
//   //               <option value={'Standard Soy Free'}>Standard Soy Free</option>
//   //             )}
//   //           {isAuth().role === 'subscriber' &&
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === true &&
//   //             students[i].foodAllergy.sesame === false && (
//   //               <option value={'Vegetarian Soy Free'}>
//   //                 Vegetarian Soy Free
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' &&
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === true &&
//   //             students[i].foodAllergy.sesame === false && (
//   //               <option value={'Vegan Soy Free'}>Vegan Soy Free</option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 0110 // add to list
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === true &&
//   //             students[i].foodAllergy.soy === true &&
//   //             students[i].foodAllergy.sesame === false && (
//   //               <option value={'Gluten Soy Free'}>Gluten Soy Free</option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 0011
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === true &&
//   //             students[i].foodAllergy.sesame === true && (
//   //               <option value={'Soy and Sesame Free'}>
//   //                 Soy and Sesame Free (Lunch Only)
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 1011 // change code elsewhere
//   //             students[i].foodAllergy.dairy === true &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === true &&
//   //             students[i].foodAllergy.sesame === true && (
//   //               <option value={'Soy Sesame Dairy Free'}>
//   //                 Dairy Soy Sesame Free (Lunch Only)
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 1010 // add to list
//   //             students[i].foodAllergy.dairy === true &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === true &&
//   //             students[i].foodAllergy.sesame === false && (
//   //               <option value={'Soy Dairy Free'}>
//   //                 Dairy Soy Free (Lunch Only)
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 0111
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === true &&
//   //             students[i].foodAllergy.soy === true &&
//   //             students[i].foodAllergy.sesame === true && (
//   //               <option value={'Soy Sesame Gluten Free'}>
//   //                 Gluten Soy and Sesame Free (Lunch Only)
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 1111
//   //             students[i].foodAllergy.dairy === true &&
//   //             students[i].foodAllergy.gluten === true &&
//   //             students[i].foodAllergy.soy === true &&
//   //             students[i].foodAllergy.sesame === true && (
//   //               <option value={'Soy Sesame Dairy Gluten Free'}>
//   //                 Gluten Dairy Soy and Sesame Free (Lunch Only)
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 1110 // add to list
//   //             students[i].foodAllergy.dairy === true &&
//   //             students[i].foodAllergy.gluten === true &&
//   //             students[i].foodAllergy.soy === true &&
//   //             students[i].foodAllergy.sesame === false && (
//   //               <option value={'Soy Dairy Gluten Free'}>
//   //                 Gluten Dairy Soy Free (lunch only)
//   //               </option>
//   //             )}
//   //           {/* Sesame  */}
//   //           {isAuth().role === 'subscriber' && // 0001
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === false &&
//   //             students[i].foodAllergy.sesame === true && (
//   //               <option value={'Standard Sesame Free'}>
//   //                 Standard Sesame Free
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' &&
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === false &&
//   //             students[i].foodAllergy.sesame === true && (
//   //               <option value={'Vegetarian Sesame Free'}>
//   //                 Vegetarian Sesame Free
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' &&
//   //             students[i].foodAllergy.dairy === false &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === false &&
//   //             students[i].foodAllergy.sesame === true && (
//   //               <option value={'Vegan Sesame Free'}>Vegan Sesame Free</option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 1001 // add to list
//   //             students[i].foodAllergy.dairy === true &&
//   //             students[i].foodAllergy.gluten === false &&
//   //             students[i].foodAllergy.soy === false &&
//   //             students[i].foodAllergy.sesame === true && (
//   //               <option value={'Sesame Dairy Free'}>
//   //                 Dairy Sesame Free (Lunch Only)
//   //               </option>
//   //             )}
//   //           {isAuth().role === 'subscriber' && // 1101
//   //             students[i].foodAllergy.dairy === true &&
//   //             students[i].foodAllergy.gluten === true &&
//   //             students[i].foodAllergy.soy === false &&
//   //             students[i].foodAllergy.sesame === true && (
//   //               <option value={'Sesame Dairy Gluten Free'}>
//   //                 Gluten Dairy Sesame Free (Lunch Only)
//   //               </option>
//   //             )}
//   //           {user.special.gfplus == true && ( // special options
//   //             <option value={'Gluten Free with Breakfast'}>
//   //               Gluten Free Lunch plus Breakfast
//   //             </option>
//   //           )}
//   //           {user.special.gfplus == 'true' && (
//   //             <option value={'Gluten Free with Breakfast'}>
//   //               Gluten Free Lunch plus Breakfast
//   //             </option>
//   //           )}
//   //           {user.special.vgplus == true && (
//   //             <option value={'Vegan B'}>Vegan Lunch plus Breakfast</option>
//   //           )}
//   //           <option value={'None'}>None</option>
//   //         </select>
//   //         <div className="p-1"></div>
//   //       </div>
//   //     </div>
//   //   </>
//   // );

//   // const handleRequestChange = (name) => (e) => {
//   //   setState({
//   //     ...state,
//   //     [name]: e.target.value,
//   //     error: '',
//   //     success: '',
//   //     buttonText: 'Register',
//   //   });
//   // };

//   // callback for AdminPanel component
//   // const handleAdminPanelChange = (name) => (e) => {
//   //   let i = e.target.getAttribute('data-index');

//   //   let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
//   //   let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
//   //   meal[name] = e.target.value;

//   //   meals[i] = meal; // puts meal[i] back into mealRequest array

//   //   setState({
//   //     ...state,
//   //     mealRequest: [...meals],
//   //     buttonText: 'Submit',
//   //     success: '',
//   //     error: '',
//   //   }); //puts ...mealRequest with new meal back into mealRequest: []
//   // };

//   // const adminPanel = (i, x) => (
//   //   <div key={i} className="form-group">
//   //     <div className="pb-2">
//   //       <h4>ADMIN PANEL for student number {`${i + 1}`} </h4>
//   //       <input
//   //         data-index={i}
//   //         // key={i}
//   //         type="text"
//   //         className="form-control"
//   //         placeholder="Student Name"
//   //         onChange={handleAdminPanelChange('studentName')}
//   //       />
//   //     </div>

//   //     <div className="pb-2">
//   //       <select
//   //         data-index={i}
//   //         // key={i}
//   //         type="text"
//   //         className="form-control"
//   //         placeholder="Student School"
//   //         onChange={handleAdminPanelChange('schoolName')}
//   //       >
//   //         <option value="">Choose School</option>
//   //         <option value="DK">Preschool</option>
//   //         <option value="BES">BES</option>
//   //         <option value="OHES">OHES</option>
//   //         <option value="ROES">ROES</option>
//   //         <option value="MCMS">MCMS</option>
//   //         <option value="OPHS">OPHS</option>
//   //         <option value="OVHS">OVHS</option>
//   //         <option value="OPIS">OPIS</option>
//   //         <option value="NON">Non OPUSD </option>
//   //       </select>
//   //     </div>

//   //     {/* TODO pb-2 div */}
//   //     <div className="pb-2">
//   //       <select
//   //         data-index={i}
//   //         // key={i}
//   //         type="text"
//   //         className="form-control"
//   //         placeholder="Cohort"
//   //         defaultValue={x.group}
//   //         onChange={handleAdminPanelChange('group')}
//   //       >
//   //         <option value="">Choose Cohort</option>
//   //         <option value="distance-learning">Distance</option>
//   //         <option value="a-group">A Cohort</option>
//   //         <option value="b-group">B Cohort</option>
//   //       </select>
//   //     </div>

//   //     {x.group != 'distance-learning' && (
//   //       <select
//   //         data-index={i}
//   //         // key={i}
//   //         type="text"
//   //         className="form-control"
//   //         placeholder="Cohort"
//   //         onChange={handleAdminPanelChange('teacher')}
//   //       >
//   //         <option value="">Choose Teacher</option>
//   //         <option value="k-annino/lee">K - Annino/Lee</option>
//   //         <option value="k-milbourn">K - Milbourn</option>
//   //         <option value="k-sloan">K - Sloan</option>
//   //         <option value="k-foy">K - Foy</option>
//   //         <option value="k-lobianco">K - LoBianco</option>
//   //         <option value="1st-hirano">1st - Hirano</option>
//   //         <option value="1st-morrow">1st - Morrow</option>
//   //         <option value="1st-aaronson">1st - Aaronson</option>
//   //         <option value="1st-bretzing">1st - Bretzing</option>
//   //         <option value="1st-bird">1st - Bird</option>
//   //         <option value="1st-ewing">1st - Ewing</option>
//   //         <option value="1st-holland">1st - Holland</option>
//   //         <option value="2nd-watson">2nd - Watson</option>
//   //         <option value="2nd-gerin">2nd - Gerin</option>
//   //         <option value="2nd-lieberman">2nd - Lieberman</option>
//   //         <option value="2nd-ruben">2nd - Ruben</option>
//   //         <option value="2nd-mcdowell">2nd - McDowell</option>
//   //         <option value="2nd-share">2nd - Share</option>
//   //         <option value="3rd-squire">3rd - Squire</option>
//   //         <option value="3rd-altman">3rd - Altman</option>
//   //         <option value="3rd-rosenblum">3rd - Rosenblum</option>
//   //         <option value="3rd-cantillon">3rd - Cantillon</option>
//   //         <option value="3rd-strong">3rd - Strong</option>
//   //         <option value="3rd-arnold">3rd - Arnold</option>
//   //         <option value="4th-keane">4th - Keane</option>
//   //         <option value="4th-farlow">4th - Farlow</option>
//   //         <option value="4th-lockrey">4th - Lockrey</option>
//   //         <option value="4th-chobanian">4th - Chobanian</option>
//   //         <option value="4th-duffy">4th - Duffy</option>
//   //         <option value="4th-matthews">4th - Matthews</option>
//   //         <option value="5th-stephens">5th - Stephens</option>
//   //         <option value="5th-becker">5th - Becker</option>
//   //         <option value="5th-powers">5th - Powers</option>
//   //         <option value="5th-bailey">5th - Bailey</option>
//   //         <option value="5th-bodily">5th - Bodily</option>
//   //         <option value="5th-cass">5th - Cass</option>
//   //         <option value="6th-grade">6th </option>
//   //         <option value="7th-grade">7th </option>
//   //         <option value="8th-grade">8th </option>
//   //         <option value="9th-grade">9th</option>
//   //         <option value="10th-grade">10th </option>
//   //         <option value="11th-grade">11th </option>
//   //         <option value="12th-grade">12th </option>
//   //       </select>
//   //     )}
//   //     <hr/>
//   //   </div>
//   // );

//   // const selectOnsiteMealRequest = (i) => (
//   //   <>
//   //     <div key={i} className="form-group">
//   //       <div className="">
//   //         <select
//   //           type="select"
//   //           data-index={i}
//   //           defaultValue={'Standard Onsite'}
//   //           value={mealRequest[i].meal}
//   //           onChange={(e) => handleSelectChange(e)}
//   //           className="form-control"
//   //         >
//   //           {' '}
//   //           {/* <option value="">Choose an option</option> */}
//   //           {user.special.twothree == true && (
//   //             <option value={'2on 3off'}>
//   //               Standard 2 Onsite / 3 Offsite Lunches plus 5 Breakfasts
//   //             </option>
//   //           )}
//   //           {
//   //             // isAuth().role === 'subscriber' &&
//   //             <option value={'Standard Onsite'}>Standard (Onsite)</option>
//   //           }
//   //           {user.special.day1 == 'true' && (
//   //             <option value={'Onsite Day 1'}>
//   //               Onsite Lunch Monday/Wednesday Only
//   //             </option>
//   //           )}
//   //           {user.special.day2 == 'true' && (
//   //             <option value={'Onsite Day 2'}>
//   //               Onsite Lunch Tuesday/Thursday Only
//   //             </option>
//   //           )}
//   //           <option value={'None'}>None</option>
//   //         </select>
//   //         <div className="p-1"></div>
//   //       </div>
//   //     </div>
//   //   </>
//   // );

//   // const handlePickupOption = (i, e) => {
//   //   // handles pickup options (all, breakfast only, lunch only) select
//   //   let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
//   //   let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
//   //   meal.pickupOption = e.target.value;

//   //   meals[i] = meal;

//   //   let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
//   //   let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at
//   //   let input = e.target.value;
//   //   let frontCode = ''; // TODO refactor and get rid of this random variable

//   //   switch (input) {
//   //     case 'Breakfast Only':
//   //       frontCode = 'B';
//   //       break;
//   //     case 'Lunch Onsite / Breakfast Pickup':
//   //       frontCode = 'B';
//   //       break;
//   //     default:
//   //       break;
//   //   }
//   //   code = frontCode;
//   //   codes[i] = code;

//   //   setState({
//   //     ...state,
//   //     mealRequest: [...meals],
//   //     pickupTime: '',
//   //     buttonText: 'Submit',
//   //     pickupCodeAdd: codes,
//   //     success: '',
//   //     error: '',
//   //   });
//   // };

//   // TODO : refactor all of these pickupOption functions into a component

//   // const selectAdminPickupOptions = (i) => (
//   //   <>
//   //     {console.log()}
//   //     <div key={i} className="form-group">
//   //       <select
//   //         type="select"
//   //         data-index={i}
//   //         defaultValue={state.mealRequest[i].pickupOption}
//   //         value={state.mealRequest[i].pickupOption}
//   //         onChange={(e) => handlePickupOption(i, e)}
//   //         className="form-control"
//   //       >
//   //         <option selected value={'Breakfast and Lunch'}>
//   //           Breakfast and Lunch
//   //         </option>
//   //         <option value={'Breakfast Only'}>Breakfast Only</option>
//   //         <option value={'Lunch Only'}>Lunch Only</option>
//   //         <option value={'Lunch Onsite'}>Lunch Onsite</option>
//   //         <option value={'Lunch Onsite / Breakfast Pickup'}>
//   //           Lunch Onsite / Breakfast Pickup
//   //         </option>
//   //       </select>
//   //       <div className="p-1"></div>
//   //     </div>
//   //   </>
//   // );
//   // const selectPickupOption = (i) => (
//   //   <>
//   //     <div key={i} className="form-group">
//   //       <select
//   //         type="select"
//   //         defaultValue={state.mealRequest[i].pickupOption}
//   //         // value={state.mealRequest[i].pickupOption}
//   //         data-index={i}
//   //         onChange={(e) => handlePickupOption(i, e)}
//   //         className="form-control"
//   //       >
//   //         {' '}
//   //         <option selected value={'Breakfast and Lunch'}>
//   //           Breakfast and Lunch
//   //         </option>
//   //         <option value={'Breakfast Only'}>Breakfast Only</option>
//   //         <option value={'Lunch Only'}>Lunch Only</option>
//   //       </select>
//   //       <div className="p-1"></div>
//   //     </div>
//   //   </>
//   // );

//   // const selectPickupLunchOnlyOption = (i) => (
//   //   <>
//   //     <div key={i} className="form-group">
//   //       <select
//   //         type="select"
//   //         defaultValue={state.mealRequest[i].pickupOption}
//   //         value={state.mealRequest[i].pickupOption}
//   //         data-index={i}
//   //         onChange={(e) => handlePickupOption(i, e)}
//   //         className="form-control"
//   //       >
//   //         {' '}
//   //         <option selected value={'Lunch Only'}>
//   //           Lunch Only
//   //         </option>
//   //       </select>
//   //       <div className="p-1"></div>
//   //     </div>
//   //   </>
//   // );

//   // const selectNonePickupOption = (i) => (
//   //   <>
//   //     <div key={i} className="form-group">
//   //       <select
//   //         type="select"
//   //         defaultValue={state.mealRequest[i].pickupOption}
//   //         value={state.mealRequest[i].pickupOption}
//   //         data-index={i}
//   //         onChange={(e) => handlePickupOption(i, e)}
//   //         className="form-control"
//   //       >
//   //         {' '}
//   //         <option selected value={'None'}>
//   //           None
//   //         </option>
//   //       </select>
//   //       <div className="p-1"></div>
//   //     </div>
//   //   </>
//   // );

//   // const selectPickupLunchOnsiteBreakfastOffsiteOption = (i) => (
//   //   <>
//   //     <div key={i} className="form-group">
//   //       <select
//   //         type="select"
//   //         defaultValue={state.mealRequest[i].pickupOption}
//   //         value={state.mealRequest[i].pickupOption}
//   //         data-index={i}
//   //         onChange={(e) => handlePickupOption(i, e)}
//   //         className="form-control"
//   //       >
//   //         {' '}
//   //         <option selected value={'Lunch Onsite'}>
//   //           Lunch Onsite
//   //         </option>
//   //         <option value={'Lunch Onsite / Breakfast Pickup'}>
//   //           Lunch Onsite / Breakfast Pickup
//   //         </option>
//   //       </select>
//   //       <div className="p-1"></div>
//   //     </div>
//   //   </>
//   // );

//   // const selectPickupLunchOnsiteBreakfastOffsiteOptionH = (i) => (
//   //   <>
//   //     <div key={i} className="form-group">
//   //       <select
//   //         type="select"
//   //         defaultValue={state.mealRequest[i].pickupOption}
//   //         value={state.mealRequest[i].pickupOption}
//   //         data-index={i}
//   //         onChange={(e) => handlePickupOption(i, e)}
//   //         className="form-control"
//   //       >
//   //         {' '}
//   //         <option value={'Lunch Onsite'}>Lunch Onsite</option>
//   //         <option selected value={'Lunch Onsite / Breakfast Pickup'}>
//   //           Lunch Onsite / Breakfast Pickup
//   //         </option>
//   //       </select>
//   //       <div className="p-1"></div>
//   //     </div>
//   //   </>
//   // );
//   // const select2on3offOption = (i) => (
//   //   <>
//   //     <div key={i} className="form-group">
//   //       <select
//   //         type="select"
//   //         defaultValue={state.mealRequest[i].pickupOption}
//   //         value={state.mealRequest[i].pickupOption}
//   //         data-index={i}
//   //         onChange={(e) => handlePickupOption(i, e)}
//   //         className="form-control"
//   //       >
//   //         {' '}
//   //         {/* <option value={'Lunch Onsite'}>
//   //           Lunch Onsite
//   //         </option> */}
//   //         <option selected value={'Two Onsite / Three Breakfast and Lunches'}>
//   //           Two Onsite / Three Breakfast and Lunches
//   //         </option>
//   //       </select>
//   //       <div className="p-1"></div>
//   //     </div>
//   //   </>
//   // );

//   // pickup times select
//   // const handlePickupTimeChange = (e) => {
//   //   setState({
//   //     ...state,
//   //     pickupTime: e.target.value,
//   //     buttonText: 'Submit',
//   //     success: '',
//   //     error: '',
//   //   });
//   // };

//   // TODO refactor all of these pickupTime functions
//   // const selectPickupTime = (i) => (
//   //   <>
//   //     <div key={i}>
//   //       <div className="">
//   //         <select
//   //           type="select"
//   //           value={pickupTime}
//   //           data-index={i}
//   //           onChange={(e) => handlePickupTimeChange(e)}
//   //           className="form-control"
//   //         >
//   //           {' '}
//   //           <option disabled value="">
//   //             Choose an option
//   //           </option>
//   //           <option value={'7am-9am'}>7am-9am</option>
//   //           <option value={'11am-1pm'}>11am-1pm</option>
//   //           <option value={'4pm-6pm'}>4pm-6pm</option>
//   //           {isAuth().role === 'admin' && (
//   //             <option value={'Cafeteria'}>
//   //               Student Cafeteria Lunch Onsite
//   //             </option>
//   //           )}
//   //         </select>
//   //         <div className="p-1"></div>
//   //       </div>
//   //     </div>
//   //   </>
//   // );

//   // const selectPickupTimeCafeteriaOnly = (i) => (
//   //   <>
//   //     <div key={i}>
//   //       <div className="">
//   //         <select
//   //           type="select"
//   //           value={pickupTime}
//   //           data-index={i}
//   //           onChange={(e) => handlePickupTimeChange(e)}
//   //           className="form-control"
//   //         >
//   //           {' '}
//   //           <option disabled value="">
//   //             Choose an option
//   //           </option>
//   //           {isAuth().role === 'admin' && (
//   //             <option value={'7am-9am'}>7am-9am</option>
//   //           )}
//   //           {isAuth().role === 'admin' && (
//   //             <option value={'11am-1pm'}>11am-1pm</option>
//   //           )}
//   //           {isAuth().role === 'admin' && (
//   //             <option value={'4pm-6pm'}>4pm-6pm</option>
//   //           )}
//   //           <option value={'Cafeteria'}>Student Cafeteria Lunch Onsite</option>
//   //         </select>
//   //         <div className="p-1"></div>
//   //       </div>
//   //     </div>
//   //   </>
//   // );

//   // add meal button TODO : refactor to component
//   // const addMeal = (
//   //   i,
//   //   student,
//   //   studentName,
//   //   schoolName,
//   //   group,
//   //   teacher,
//   //   pickupOption,
//   //   foodAllergy
//   // ) => {
//   //   setState({
//   //     ...state,
//   //     mealRequest: [
//   //       ...mealRequest,
//   //       {
//   //         meal:
//   //           group === 'a-group' || group === 'b-group'
//   //             ? 'Standard Onsite'
//   //             : // soy options
//   //             foodAllergy.dairy === false &&
//   //               foodAllergy.gluten === false &&
//   //               foodAllergy.soy === true &&
//   //               foodAllergy.sesame === true
//   //             ? 'Soy and Sesame Free'
//   //             : foodAllergy.soy === true &&
//   //               foodAllergy.sesame === false &&
//   //               foodAllergy.dairy === false &&
//   //               foodAllergy.gluten === false
//   //             ? 'Standard Soy Free'
//   //             : foodAllergy.soy === true &&
//   //               foodAllergy.sesame === true &&
//   //               foodAllergy.dairy === true &&
//   //               foodAllergy.gluten === false
//   //             ? 'Soy Sesame Dairy Free'
//   //             : foodAllergy.soy === true &&
//   //               foodAllergy.sesame === true &&
//   //               foodAllergy.dairy === false &&
//   //               foodAllergy.gluten === true
//   //             ? 'Soy Sesame Gluten Free'
//   //             : foodAllergy.soy === true &&
//   //               foodAllergy.sesame === true &&
//   //               foodAllergy.dairy === true &&
//   //               foodAllergy.gluten === true
//   //             ? 'Soy Sesame Dairy Gluten Free'
//   //             : // gf df
//   //             foodAllergy.soy === false &&
//   //               foodAllergy.sesame === false &&
//   //               foodAllergy.dairy === true &&
//   //               foodAllergy.gluten === true
//   //             ? 'Gluten Free Dairy Free'
//   //             : foodAllergy.soy === false &&
//   //               foodAllergy.sesame === false &&
//   //               foodAllergy.dairy === true &&
//   //               foodAllergy.gluten === false
//   //             ? 'Standard Dairy Free'
//   //             : foodAllergy.soy === false &&
//   //               foodAllergy.sesame === false &&
//   //               foodAllergy.dairy === false &&
//   //               foodAllergy.gluten === true
//   //             ? 'Gluten Free'
//   //             : // sesame
//   //             foodAllergy.soy === false &&
//   //               foodAllergy.sesame === true &&
//   //               foodAllergy.dairy === false &&
//   //               foodAllergy.gluten === false
//   //             ? 'Standard Sesame Free'
//   //             : // gf df sesame combos
//   //             foodAllergy.soy === false &&
//   //               foodAllergy.sesame === true &&
//   //               foodAllergy.dairy === false &&
//   //               foodAllergy.gluten === true
//   //             ? 'Gluten Sesame Free'
//   //             : foodAllergy.soy === false &&
//   //               foodAllergy.sesame === true &&
//   //               foodAllergy.dairy === true &&
//   //               foodAllergy.gluten === false
//   //             ? 'Sesame Dairy Free'
//   //             : foodAllergy.soy === false &&
//   //               foodAllergy.sesame === true &&
//   //               foodAllergy.dairy === true &&
//   //               foodAllergy.gluten === true
//   //             ? 'Sesame Dairy Gluten Free'
//   //             : // else standard
//   //               'Standard',
//   //         student: student,
//   //         studentName: studentName,
//   //         lastName: user.lastName,
//   //         schoolName: schoolName,
//   //         group: group,
//   //         teacher: teacher,
//   //         // sets default pickupOption when adding meal
//   //         pickupOption:
//   //           group === 'a-group' || group === 'b-group'
//   //             ? 'Lunch Onsite'
//   //             : foodAllergy.egg === true ||
//   //               foodAllergy.soy === true ||
//   //               foodAllergy.dairy === true ||
//   //               foodAllergy.gluten === true
//   //             ? 'Lunch Only'
//   //             : 'Breakfast and Lunch',
//   //         foodAllergy: foodAllergy,
//   //         parentEmail: user.email,
//   //         parentName: user.name,
//   //         individualPickupTime: '',
//   //         complete: false,
//   //         // unused but will use for coming school year potentially
//   //         days:
//   //           group === 'a-group'
//   //             ? {
//   //                 sunday: false,
//   //                 monday: true, // a
//   //                 tuesday: true, // a
//   //                 wednesday: false,
//   //                 thursday: false,
//   //                 friday: false,
//   //                 saturday: false,
//   //               }
//   //             : group === 'b-group'
//   //             ? {
//   //                 sunday: false,
//   //                 monday: false,
//   //                 tuesday: false,
//   //                 wednesday: true, // b
//   //                 thursday: true, // b
//   //                 friday: false,
//   //                 saturday: false,
//   //               }
//   //             : {
//   //                 sunday: false,
//   //                 monday: false,
//   //                 tuesday: false,
//   //                 wednesday: false,
//   //                 thursday: false,
//   //                 friday: false,
//   //                 saturday: false,
//   //               },
//   //       },
//   //     ],
//   //     pickupCodeAdd: [...pickupCodeAdd, ''],
//   //   });
//   // };

//   // remove meal button
//   // const removeMeal = (index) => {
//   //   const list = [...state.mealRequest];
//   //   list.splice(-1)[0];

//   //   const list2 = [...state.pickupCodeAdd];
//   //   list2.splice(-1)[0];
//   //   setState({ ...state, mealRequest: list, pickupCodeAdd: list2 });
//   // };

//   // const submit = () => {
//   //   localStorage.removeItem('search-date');
//   //   const newPickupCodeAdd = pickupCodeAdd.filter((code) => code != 'None');

//   //   let length = mealRequest
//   //     .filter((meal) => meal.meal != 'None')
//   //     .filter((meal) => meal.pickupOption != 'Lunch Onsite').length;

//   //   let newPickupCode = '';

//   //   isAuth().role === 'admin'
//   //     ? (newPickupCode =
//   //         (newPickupCodeAdd.join('') != ''
//   //           ? newPickupCodeAdd.join('') + '-'
//   //           : '') +
//   //         (pickupCodeInput != '' ? pickupCodeInput : user.userCode) +
//   //         '-0' +
//   //         length)
//   //     : (newPickupCode =
//   //         (newPickupCodeAdd.join('') != ''
//   //           ? newPickupCodeAdd.join('') + '-'
//   //           : '') +
//   //         user.userCode +
//   //         '-0' +
//   //         length);

//   //   setState({
//   //     ...state,
//   //     pickupCode: newPickupCode,
//   //     pickupCodeAdd: newPickupCodeAdd,
//   //   });
//   // };

//   // const handleToggle = (c) => () => {
//   //   // return the first index or -1
//   //   const clickedCategory = categories.indexOf(c);
//   //   const all = [...categories];

//   //   if (clickedCategory === -1) {
//   //     all.push(c);
//   //   } else {
//   //     all.splice(clickedCategory, 1);
//   //   }

//   //   setState({ ...state, categories: all, success: '', error: '' });
//   // };

//   // // category checkboxes
//   // const showCategories = () => {
//   //   return (
//   //     loadedCategories &&
//   //     loadedCategories.map((c, i) => (
//   //       <li className="list-unstyled" key={c._id}>
//   //         <input
//   //           type="checkbox"
//   //           onChange={handleToggle(c._id)}
//   //           className="mr-2"
//   //         />
//   //         <label htmlFor="" className="form-check-label">
//   //           {c.name}
//   //         </label>
//   //       </li>
//   //     ))
//   //   );
//   // };

//   // const handleCodeChange = (e) => {
//   //   e.preventDefault;
//   //   setState({
//   //     ...state,
//   //     pickupCodeInput: e.target.value.toUpperCase(),
//   //     userCode: e.target.value.toUpperCase(),
//   //   });
//   // };

//   // create form
//   // const submitLinkForm = () => (
//   //   <div className="col-md-6 p-3">
//   //     {mealRequest
//   //       .filter((meal) => meal.meal !== 'None')
//   //       .every(
//   //         (meal) =>
//   //           meal.meal == 'Standard Onsite' &&
//   //           meal.pickupOption == 'Lunch Onsite'
//   //       ) ? (
//   //       <div className="form-group">
//   //         <label htmlFor="" className="text-muted">
//   //           Pickup at Cafeteria
//   //         </label>
//   //         {selectPickupTimeCafeteriaOnly()}
//   //         {pickupTime != 'Cafeteria' &&
//   //           setState({
//   //             // quick fix but deservers a refactor and figure out a better solution
//   //             ...state,
//   //             pickupTime: 'Cafeteria',
//   //           })}
//   //       </div>
//   //     ) : (
//   //       <div className="form-group">
//   //         <label htmlFor="" className="text-muted">
//   //           Pickup Time
//   //         </label>
//   //         {selectPickupTime()}
//   //       </div>
//   //     )}
//   //     {/* TODO : refactor into submit component */}
//   //     <form
//   //       onSubmit={isAuth().role === 'admin' ? handleAdminSubmit : handleSubmit}
//   //     >
//   //       {success && showSuccessMessage(success)}
//   //       {error && showErrorMessage(error)}
//   //       <div>
//   //         <button
//   //           disabled={!token}
//   //           className={'btn  ' + styles.button}
//   //           onClick={submit}
//   //           type="submit"
//   //         >
//   //           <i class="far fa-paper-plane"></i> &nbsp;&nbsp;
//   //           {isAuth() || token ? state.buttonText : 'Login to Make Request'}
//   //         </button>
//   //       </div>
//   //     </form>
//   //   </div>
//   // );

//   // const adminCode = () => (
//   //   <div className=" form-group">
//   //     <input
//   //       type="text"
//   //       className=" form-control"
//   //       value={pickupCodeInput}
//   //       placeholder="Enter a 4 digit User Code test"
//   //       onChange={(e) => handleCodeChange(e)}
//   //     />
//   //   </div>
//   // );

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         `${API}/link`,
//         {
//           mealRequest,
//           pickupTime,
//           pickupDate,
//           // username, // don't think i need this
//           pickupCode,
//           pickupCodeAdd,
//           orderStatus,
//           userCode,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setState({
//         ...state,
//         success: 'Request was created',
//         error: '',
//       });

//       isAuth().role === 'admin'
//         ? setTimeout(() => {
//             Router.push('/user');
//           }, 2000)
//         : setTimeout(() => {
//             Router.push('/user');
//           }, 2000);

//       return () => clearTimeout();
//     } catch (error) {
//       console.log('LINK SUBMIT ERROR', error);
//       setState({ ...state, error: error.response.data.error });
//     }
//   };

//   const handleAdminSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         `${API}/mock-link`,
//         {
//           mealRequest,
//           pickupTime,
//           pickupDate,
//           // username, // don't think i need this
//           pickupCode,
//           pickupCodeAdd,
//           orderStatus,
//           userCode,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       // reset state
//       setState({
//         ...state,
//         success: 'Admin request was created',
//         error: '',
//       });

//       isAuth().role === 'admin'
//         ? setTimeout(() => {
//             Router.push('/user');
//           }, 2000)
//         : setTimeout(() => {
//             Router.push('/user');
//           }, 2000);
//     } catch (error) {
//       console.log('LINK SUBMIT ERROR', error);
//       setState({ ...state, error: error.response.data.error });
//     }
//   };

//   return (
//     <div className={styles.background}>
//       <Layout>
//         {loaded ? (
//           <div className="col-md-6 offset-md-3 pt-4">
//             <div className={styles.subcard}>
//               <MealRequestCalanderPanel
//                 pickupDate={pickupDate}
//                 auth={isAuth()}
//                 state={state}
//                 setState={setState}
//               />
//               {/* <div className="row">
//                 <div className="col-md-9">
//                   <span ref={calendarButton}>
//                     <h4 className="text-dark">
//                       Meal Request for the Week of:{' '}
//                       {pickupDate && (
//                         <>
//                           <span onClick={() => setShowSearch(!showSearch)}>
//                             {moment(state.pickupDate).format('MMMM Do')}
//                             &nbsp;{' '}
//                             <i className="text-danger far fa-calendar-check"></i>
//                           </span>
//                         </>
//                       )}
//                     </h4>
//                     {pickupDate === '' && (
//                       <button
//                         className={
//                           'btn btn-sm btn-outline-secondary ' +
//                           styles.buttonshadow
//                         }
//                         onClick={() => setShowSearch(!showSearch)}
//                       >
//                         <i class="far fa-calendar-alt"></i> &nbsp;&nbsp; Select
//                         Date
//                       </button>
//                     )}

//                     {isAuth().role === 'admin'
//                       ? showSearch && (
//                           <Calendar
//                             onChange={(e) => onDateChange(e)}
//                             tileDisabled={handleDisabledDates}
//                             value={''}
//                           />
//                         )
//                       : showSearch && (
//                           <Calendar
//                             onChange={(e) => onDateChange(e)}
//                             tileDisabled={handleDisabledDates}
//                             defaultValue={twoWeeksFromNow}
//                             minDate={twoWeeksFromNow}
//                             value={twoWeeksFromNow}
//                           />
//                         )}
//                   </span>
//                 </div>
//               </div> */}

//               <hr />
//               {/* Admin can change code */}
//               {/* {(isAuth().role === 'admin' && isAuth().userCode === 'DOOB') ||
//               (isAuth().role === 'admin' && isAuth().userCode === 'LYF')
//                 ? adminCode()
//                 : null} */}
//               <AdminCode
//                 state={state}
//                 setState={setState}
//                 auth={isAuth()}
//                 pickupCodeInput={pickupCodeInput}
//               />

//               <div className="row">
//                 <div className="col-md-12">
//                   {state.mealRequest.map((x, i) => {
//                     return (
//                       <>
//                         {/* <div>
//                           <label key={i} className="text-secondary">
//                             {isAuth().role != 'admin' && (
//                               <h6>
//                                 {' '}
//                                 <b>{`${state.students[i].name}`}'s</b>{' '}
//                                 {state.students[i].group ===
//                                 'distance-learning' ? (
//                                   <>Curbside</>
//                                 ) : (
//                                   <>Onsite</>
//                                 )}{' '}
//                                 Meals
//                               </h6>
//                             )}
//                           </label>
//                         </div> */}
//                         <MealRequestStudent
//                           i={i}
//                           state={state}
//                           auth={isAuth()}
//                         />
//                         <AdminPanel
//                           index={i}
//                           meal={x}
//                           setState={setState}
//                           state={state}
//                           auth={isAuth()}
//                         />
//                         <SelectMealRequest
//                           i={i}
//                           user={user}
//                           meal={state.mealRequest[i].meal}
//                           student={students[i]}
//                           state={state}
//                           setState={setState}
//                         />
//                         <SelectPickupOption
//                           i={i}
//                           x={x}
//                           state={state}
//                           setState={setState}
//                           auth={isAuth()}
//                           user={user}
//                         />
//                         <SelectDaysPanel
//                           i={i}
//                           x={x}
//                           auth={isAuth()}
//                           state={state}
//                           setState={setState}
//                         />
//                         {/* {x.meal !== '2on 3off'
//                           ? isAuth().role === 'admin'
//                             ? selectAdminPickupOptions(i)
//                             : x.meal != 'None'
//                             ? state.students[i].group === 'distance-learning'
//                               ? x.meal === 'Gluten Free' ||
//                                 x.meal === 'Gluten Free Dairy Free' ||
//                                 x.meal === 'Standard Dairy Free' ||
//                                 x.meal === 'Vegan' ||
//                                 user.students[i].foodAllergy.egg === true ||
//                                 user.students[i].foodAllergy.soy === true ||
//                                 user.students[i].foodAllergy.dairy === true ||
//                                 user.students[i].foodAllergy.gluten === true
//                                 ? selectPickupLunchOnlyOption(i)
//                                 : selectPickupOption(i) // if not distance learning then:
//                               : selectPickupLunchOnsiteBreakfastOffsiteOption(i)
//                             : null
//                           : null}
//                         {x.meal === '2on 3off' && select2on3offOption(i)} */}

//                         {
//                           // Toggles for onsite days
//                         }
//                         {/* {(process.browser &&
//                           isAuth().role === 'admin' &&
//                           x.meal === '2on 3off' &&
//                           x.group === 'a-group') ||
//                         (isAuth().role === 'admin' &&
//                           x.meal === 'Standard Onsite' &&
//                           x.group === 'a-group') ? (
//                           <>
//                             <hr />
//                             <div className="form-control ">
//                               <div className="row p-1">
//                                 {/* <Toggle
//                                 toggleKey={i}
//                                 dataIndex={i}
//                                 isOn={x.days.sunday}
//                                 toggleId="sunday"
//                                 toggleName="Sunday"
//                                 handleToggle={handleDayChange('sunday')}
//                               ></Toggle> 
//                                 <Toggle
//                                   toggleKey={i}
//                                   dataIndex={i}
//                                   isOn={x.days.monday}
//                                   toggleId="monday"
//                                   toggleName="Monday"
//                                   handleToggle={handleDayChange('monday')}
//                                 ></Toggle>
//                                 <Toggle
//                                   toggleKey={i}
//                                   dataIndex={i}
//                                   isOn={x.days.tuesday}
//                                   toggleId="tuesday"
//                                   toggleName="Tuesday"
//                                   handleToggle={handleDayChange('tuesday')}
//                                 ></Toggle>
//                                 {/* <Toggle
//                                   toggleKey={i}
//                                   dataIndex={i}
//                                   isOn={x.days.wednesday}
//                                   toggleId="wednesday"
//                                   toggleName="Wednesday"
//                                   handleToggle={handleDayChange('wednesday')}
//                                 ></Toggle> 
//                                 {/* <Toggle
//                                   toggleKey={i}
//                                   dataIndex={i}
//                                   isOn={x.days.thursday}
//                                   toggleId="thursday"
//                                   toggleName="Thursday"
//                                   handleToggle={handleDayChange('thursday')}
//                                 ></Toggle>
//                                 <Toggle
//                                   toggleKey={i}
//                                   dataIndex={i}
//                                   isOn={x.days.friday}
//                                   toggleId="friday"
//                                   toggleName="Friday"
//                                   handleToggle={handleDayChange('friday')}
//                                 ></Toggle> 
//                                 {/* <Toggle
//                                 toggleKey={i}
//                                 dataIndex={i}
//                                 isOn={x.days.saturday}
//                                 toggleId="saturday"
//                                 toggleName="Saturday"
//                                 handleToggle={handleDayChange('saturday')}
//                               ></Toggle> 
//                               </div>
//                             </div>
//                           </>
//                         ) : (process.browser &&
//                             isAuth().role === 'admin' &&
//                             x.meal === '2on 3off' &&
//                             x.group === 'b-group') ||
//                           (isAuth().role === 'admin' &&
//                             x.meal === 'Standard Onsite' &&
//                             x.group === 'b-group') ? (
//                           <>
//                             <hr />
//                             <div className="form-control ">
//                               <div className="row p-1">
//                                 {/* <Toggle
//                                 toggleKey={i}
//                                 dataIndex={i}
//                                 isOn={x.days.sunday}
//                                 toggleId="sunday"
//                                 toggleName="Sunday"
//                                 handleToggle={handleDayChange('sunday')}
//                               ></Toggle> 
//                                 {/* <Toggle
//                                   toggleKey={i}
//                                   dataIndex={i}
//                                   isOn={x.days.monday}
//                                   toggleId="monday"
//                                   toggleName="Monday"
//                                   handleToggle={handleDayChange('monday')}
//                                 ></Toggle> 
//                                 {/* <Toggle
//                                   toggleKey={i}
//                                   dataIndex={i}
//                                   isOn={x.days.tuesday}
//                                   toggleId="tuesday"
//                                   toggleName="Tuesday"
//                                   handleToggle={handleDayChange('tuesday')}
//                                 ></Toggle> 
//                                 <Toggle
//                                   toggleKey={i}
//                                   dataIndex={i}
//                                   isOn={x.days.wednesday}
//                                   toggleId="wednesday"
//                                   toggleName="Wednesday"
//                                   handleToggle={handleDayChange('wednesday')}
//                                 ></Toggle>
//                                 <Toggle
//                                   toggleKey={i}
//                                   dataIndex={i}
//                                   isOn={x.days.thursday}
//                                   toggleId="thursday"
//                                   toggleName="Thursday"
//                                   handleToggle={handleDayChange('thursday')}
//                                 ></Toggle>
//                                 {/* <Toggle
//                                   toggleKey={i}
//                                   dataIndex={i}
//                                   isOn={x.days.friday}
//                                   toggleId="friday"
//                                   toggleName="Friday"
//                                   handleToggle={handleDayChange('friday')}
//                                 ></Toggle> 
//                                 {/* <Toggle
//                                 toggleKey={i}
//                                 dataIndex={i}
//                                 isOn={x.days.saturday}
//                                 toggleId="saturday"
//                                 toggleName="Saturday"
//                                 handleToggle={handleDayChange('saturday')}
//                               ></Toggle> 
//                               </div>
//                             </div>
//                           </>
//                         ) : (
//                           ''
//                         )} */}
//                         <hr />
//                       </>
//                     );
//                   })}
//                   <div>
//                     <AddMeal
//                       state={state}
//                       setState={setState}
//                       user={user}
//                       mealRequest={mealRequest}
//                       pickupCodeAdd={pickupCodeAdd}
//                     />
//                     <RemoveMeal state={state} setState={setState} />
//                     {/* {state.mealRequest.length !== 1 && (
//                       <button
//                         className={'btn float-right ' + styles.buttonshadow}
//                         onClick={() => removeMeal()}
//                       >
//                         Remove
//                       </button>
//                     )} */}
//                   </div>
//                 </div>
//                 <div className="col-md-6 p-3">
//                   <SelectPickupTime
//                     auth={isAuth()}
//                     mealRequest={mealRequest}
//                     state={state}
//                     setState={setState}
//                     pickupTime={pickupTime}
//                   />
//                   <SubmitButton
//                     auth={isAuth()}
//                     userCode={user.userCode}
//                     success={success}
//                     error={error}
//                     mealRequest={mealRequest}
//                     handleAdminSubmit={handleAdminSubmit}
//                     handleSubmit={handleSubmit}
//                     pickupCodeAdd={pickupCodeAdd}
//                     pickupCodeInput={pickupCodeInput}
//                     state={state}
//                     setState={setState}
//                     token={token}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <FakeMealRequestForm />
//         )}
//       </Layout>
//       <div className="p-5"></div>
//     </div>
//   );
// };

// Create.getInitialProps = ({ req, user }) => {
//   const token = getCookie('token', req);
//   return { token, user };
// };

// export default withUser(Create);
