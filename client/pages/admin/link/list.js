import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import styles from '../../../styles/Home.module.css';
import axios from 'axios';
import Link from 'next/link';
// import renderHTML from 'react-render-html';
import { API } from '../../../config';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CSVLink } from 'react-csv';
// import { getCookie, isAuth } from '../../../helpers/auth';

// token, links, totalLinks, linksLimit, linkSkip
const Requests = ({ token }) => {
  // const [allLinks, setAllLinks] = useState(links);
  const [completeDate, setCompleteDate] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showStatus, setShowStatus] = useState(true);
  // const [orderType, setOrderType] = useState(false)
  // const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  // const [size, setSize] = useState(totalLinks);
  const [loadmeals, setLoadmeals] = useState(false);
  const [orderStatus, setOrderStatus] = useState(Boolean);
  const [state, setState] = useState({
    pickupDateLookup: moment(new Date()).format('l'),
    // pickupDateLookup: moment(new Date()).format('l'),
    loadedUsers: [],
    orderStatusArray: [],
    allMealsArray: [],
    // loadMeals: false,
    search: '',
    orderType: 'Pickup',
    linksByDateFiltered: [],
    searchByStatus: '',
    searchBySchool: '',
    searchByGroup: '',
    searchPickupTime: '',
    searchByTeacher: '', // this will return everything because it's empty
    searchByTeacher2: 'filter', // used to defualt to a searchword that wouldn't return anything
    searchByTeacher3: 'filter', // used to defualt to a searchword that wouldn't return anything
    searchByTeacher4: 'filter', // used to defualt to a searchword that wouldn't return anything
    ageGroup1: '',
    ageGroup2: '',
    ageGroup3: '',
    ageGroup4: '',
    error: '',
    success: '',
  });
  const [linksByDate, setLinksByDate] = useState([]);
  const [allMealsArray, setAllMealsArray] = useState([]);
  // const [linksByDateFiltered, setLinksByDateFiltered] = useState([]);
  const {
    orderType,
    // allMealsArray,
    searchBySchool,
    searchByGroup,
    searchByTeacher,
    searchByTeacher2,
    searchByTeacher3,
    searchByTeacher4,
    ageGroup1,
    ageGroup2,
    ageGroup3,
    ageGroup4,
    linksByDateFiltered,
    pickupDateLookup,
    loadedUsers,
    searchByStatus,
    orderStatusArray,
    searchPickupTime,
    search,
  } = state;

  useEffect(() => {
    // setLoadmeals(!loadmeals);
    loadUsers();
    handleDateChange(pickupDateLookup);
  }, []);

  useEffect(() => {
    orderType === 'Onsite' ? setShowStatus(false) : setShowStatus(true);
  }, [orderType]);

  useEffect(() => {
    let allMealsArray2 = [];
    linksByDate.map((r, i) =>
      r.mealRequest.map((meal) => allMealsArray2.push(meal))
    );
    setAllMealsArray(allMealsArray2.filter((meal) => meal.meal !== 'None'));
  }, [linksByDate]);

  const loadUsers = async () => {
    const response = await axios.get(`${API}/user-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setState({ ...state, loadedUsers: response.data });
  };
  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDateLookup: moment(pickupDate).format('l') });
    handleDateChange(pickupDate);
    setShowSearch(!showSearch);
  };

  // useEffect(() => {
  //   setLinksByDateFiltered(
  //     linksByDate
  //     .filter((l) => l.pickupTime.includes(searchPickupTime))
  //     .filter((l) => l.pickupTime != 'Cafeteria')
  //     .filter((l) => l.orderStatus.toString().includes(searchByStatus))
  //     .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
  //     );
  //     compileOrderStatusArray(pickupDateLookup);
  // }, [searchByStatus, searchPickupTime, search])

  const handleDateChange = async (pickupDate) => {
    const pickupDateLookup = moment(pickupDate).format('l');
    const response = await axios.post(
      `${API}/links-by-date`,
      { pickupDateLookup },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLinksByDate(response.data);

    compileOrderStatusArray(pickupDate);
  };

  const compileOrderStatusArray = (pickupDate) => {
    // let linkArray = [];
    // linksByDate.map((l, i) => linkArray.push(l.orderStatus));

    setState({
      ...state,
      // searchPickupTime: '',
      linksByDateFiltered: linksByDate,
      pickupDateLookup: pickupDate,
      // orderStatusArray: linkArray,
    });
  };

  // const pushAllMeals = () => {
  //   // let allMealsArray = [];
  //   // linksByDate.map((r, i) =>
  //   //   r.mealRequest.map((meal) => allMealsArray.push(meal))
  //   // );
  //   setState({...state, allMealsArray: linksByDate.map((r, i) =>
  //     r.mealRequest.map((meal) => allMealsArray.push(meal))
  //   )})
  // };
  console.log('individual meals array', allMealsArray);
  console.log('linksbydate meals array', linksByDate);

  // const compileOrderStatusArrayOnSearch = () => {
  //   let linkArray = [];
  //   linksByDate
  //     .filter((l) => l.pickupTime.includes(searchPickupTime))
  //     .filter((l) => l.pickupTime != 'Cafeteria')
  //     .filter((l) => l.orderStatus.toString().includes(searchByStatus))
  //     .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
  //     .map((l, i) => linkArray.push(l.orderStatus));
  //   setState({
  //     ...state,
  //     // searchPickupTime: '',

  //     orderStatusArray: linkArray,
  //   });
  // };

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;

  let twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 12);

  // useEffect(() => {
  //   compileOrderStatusArrayOnSearch()

  // }, [search, searchByStatus, searchPickupTime])

  const handleSearch = (name, search, searchPickupTime, searchByStatus) => (
    e
  ) => {
    // handleLinksByDateFiltered(search, searchPickupTime, searchByStatus)
    // listOfLinksSearch(search, searchPickupTime, searchByStatus)
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
    });
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

  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete >', slug);
    let answer = window.confirm('WARNING! Confirm delete.');
    if (answer) {
      handleDelete(id);
    }
  };

  // const csvListOfLinks = (search) =>
  //   linksByDate
  //     // .filter(l => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
  //     // .filter((l) => l.pickupDate === pickupDateLookup);
  let csvOffsiteData = []
useEffect(() => {
  let allergiesList = []
  let newList = []

  csvOffsiteData = linksByDate
  .filter((l) => l.pickupTime.includes(searchPickupTime))
  .filter((l) => l.pickupTime != 'Cafeteria')
  .filter((l) => l.orderStatus.toString().includes(searchByStatus))
  .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()));

  // csvOffsiteData = csvOffsiteData.map((l,i) => {
      
  //   allergiesList = l.mealRequest.map((x) => {
  //       x.foodAllergy.map((allergy) => {
  //         if(allergy === true) {
  //           allergy.key
  //         }  
  //       })
  //   })
  //   allergy = {... allergiesList[i]}
  //   allergiesList.allergy = newList
  //   console.log(newList)
  // })
  
}, [linksByDate])
  
  const csvOnsiteData = allMealsArray
    .filter((l) => l.group != 'distance-learning')
    .filter(
      (l, i) =>
        l.teacher.includes(searchByTeacher) ||
        l.teacher.includes(searchByTeacher2) ||
        l.teacher.includes(searchByTeacher3) ||
        l.teacher.includes(searchByTeacher4)
    )
    .filter((l, i) => l.group.includes(searchByGroup))
    .filter((l, i) => l.schoolName.includes(searchBySchool));

  const onsiteHeaders = [
    { label: 'School Name', key: 'schoolName' },
    { label: 'Student Name', key: 'studentName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Teacher', key: 'teacher' },
    { label: 'Group', key: 'group' },
    { label: 'Food Allergy', key: 'foodAllergy' },
    { label: 'Complete', key: 'complete' },
    // { label: 'First Name', key: 'postedBy.name' },
    // { label: 'Last Name', key: 'postedBy.lastName' },
    // { label: 'Email', key: 'postedBy.email' },
    // { label: 'Students', key: 'postedBy.students[0].name' },
    // { label: 'Teacher', key: 'postedBy.students[0].teacher.name' },
  ];

  const pickupHeaders = [
    { label: 'Code', key: 'pickupCode' },
    { label: 'Pickup Time', key: 'pickupTime' },
    { label: 'Pickup Date', key: 'pickupDate' },
    { label: 'First Name', key: 'postedBy.name' },
    { label: 'Last Name', key: 'postedBy.lastName' },
    // { label: 'First Name', key: 'postedBy.name' },
    // { label: 'Last Name', key: 'postedBy.lastName' },
    // { label: 'Email', key: 'postedBy.email' },
    // { label: 'Students', key: 'postedBy.students[0].name' },
    // { label: 'Teacher', key: 'postedBy.students[0].teacher.name' },
  ];
  // console.log('requests by date', linksByDate);
  // const csvData = csvListOfLinks(state.pickupDateLookup);
  // console.log('csvdata',csvListOfLinks(state.pickupDateLookup))

  // const confirmComplete = (e, l) => {
  //   e.preventDefault();
  //   // console.log('delete >', slug);
  //   let answer = '';
  //   l.orderStatus === 'false'
  //     ? (answer = window.confirm('Mark this order as not completed?'))
  //     : (answer = window.confirm('Mark this order as not completed?'));
  //   if (answer) {
  //     changeOrderStatus(e, l);
  //     // console.log(orderStatus);
  //     handleComplete(id, orderStatus);
  //   }
  // };

  const handleComplete = async (id, orderStatus, mealRequest) => {
    // console.log('order status', orderStatus);
    // console.log('id', id);

    try {
      const response = await axios.put(
        `${API}/link/admin/complete/${id}`,
        { orderStatus, mealRequest },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('MEAL COMPLETE SUCCESS', response);
      // process.browser
      // orderStatus === true ? process.browser && window.confirm('Order is complete') : null;
      // setState({...state, })
    } catch (error) {
      console.log('ERROR MEAL CATEGORY', error.response.data.error);
    }
  };

  const handleIndividualComplete = async (id, orderStatus, mealRequest) => {
    // console.log('order status', orderStatus);
    // console.log('id', id);

    try {
      const response = await axios.put(
        `${API}/link/admin/complete/${id}`,
        { orderStatus, mealRequest },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('MEAL COMPLETE SUCCESS', response);
      // process.browser
      // orderStatus === true ? process.browser && window.confirm('Order is complete') : null;
      // setState({...state, })
    } catch (error) {
      console.log('ERROR MEAL CATEGORY', error.response.data.error);
    }
  };

  // const handleIndividualOrderStatusChange = (e, request) => {
  //   let orders = [...request.mealRequest]

  //   orders.forEach((mealRequest) => {
  //     if(mealRequest.group === 'distant-learning'){
  //       mealRequest.complete = true
  //     }
  //   })
  //   console.log('orders array', orders)
  //   return orders
  // };

  const changeOrderStatus = (e, mealRequest) => {
    // e.preventDefault();
    const id = e.target.getAttribute('data-index');
    // const i = e.target.getAttribute('data-index')

    let requests = [...linksByDate];
    let requestById = '';
    for (let i = 0; i < requests.length; i++) {
      if (requests[i]._id === id) requestById = requests[i];
    }

    let request = { ...requestById };
    // let request = { ...requests[i] };
    let answer = '';
    // console.log('request',requestById)
    // requests[i] = request;

    request.orderStatus === false
      ? (answer = window.confirm('Mark this order as completed?'))
      : (answer = window.confirm('Mark this order as not completed?'));
    if (answer) {
      request.orderStatus =
        e.target.type === 'checkbox' ? e.target.checked : e.target.value;

      //         // handles orderStatusArray
      //       let statuses = [...state.orderStatusArray];
      //       let status = { ...statuses[id] };
      //       status = request.orderStatus;
      // console.log(answer)
      //       statuses[id] = status;

      // handle mealRequest status
      // request.orderStatus = answer
      for (let i = 0; i < requests.length; i++) {
        if (requests[i]._id === id) requests[i] = request;
      }
      console.log(requests);
      // requests[id] = request;

      // handles individual meals orderstatus for every mealrequest
      requests.forEach((mealRequest) => {
        if (mealRequest.group === 'distance-learning') {
          mealRequest.complete = request.orderStatus;
        }
      });
      console.log(request);
      handleIndividualComplete(
        request._id,
        request.orderStatus,
        request.mealRequest
      );
      setLinksByDate(requests);
      // setState({ ...state, orderStatusArray: statuses });
    }
  };

  const changeIndividualOrderStatus = (e, mealRequest) => {
    // e.preventDefault();
    const id = e.target.getAttribute('data-index');
    // const i = e.target.getAttribute('data-index')

    let requests = [...allMealsArray];
    let requestById = '';
    for (let i = 0; i < requests.length; i++) {
      if (requests[i]._id === id) requestById = requests[i];
    }

    let request = { ...requestById };
    // let request = { ...requests[i] };
    let answer = '';
    // console.log('request',requestById)
    // requests[i] = request;

    request.complete === false
      ? (answer = window.confirm('Mark this order as completed?'))
      : (answer = window.confirm('Mark this order as not completed?'));
    if (answer) {
      request.complete =
        e.target.type === 'checkbox' ? e.target.checked : e.target.value;

      //         // handles orderStatusArray
      //       let statuses = [...state.orderStatusArray];
      //       let status = { ...statuses[id] };
      //       status = request.orderStatus;
      // console.log(answer)
      //       statuses[id] = status;

      // handle mealRequest status
      // request.orderStatus = answer

      // putting request back into shallow copy
      for (let i = 0; i < requests.length; i++) {
        if (requests[i]._id === id) requests[i] = request;
      }
      // console.log(requests);
      // requests[id] = request;

      // handles individual meals orderstatus for every mealrequest
      requests.forEach((mealRequest) => {
        if (mealRequest.group === 'distance-learning') {
          mealRequest.complete = request.orderStatus;
        }
      });
      console.log(request);
      handleComplete(request._id, request.complete, request.mealRequest);
      setAllMealsArray(requests);
      // setState({ ...state, orderStatusArray: statuses });
    }
  };

  // const pickupTimeChecker = (l) => (
  //   l.pickupTime.includes(searchPickupTime)
  // )
  // console.log(searchByStatus)

  // const listOfLinksSearch = (search, searchPickupTime, searchByStatus) => {
  //   let linkArray = [];
  //   linksByDate
  //     .filter((l) => l.pickupTime.includes(searchPickupTime))
  //     .filter((l) => l.pickupTime != 'Cafeteria')
  //     .filter((l) => l.orderStatus.toString().includes(searchByStatus))
  //     .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
  //     .map((l, i) => linkArray.push(l.orderStatus),

  //     // console.log('array search',i)
  //     )
  //     ;
  //   setState({
  //     ...state,
  //     // searchPickupTime: '',

  //     orderStatusArray: linkArray,
  //   });
  // }
  // console.log('after search', orderStatusArray)

  // const handleLinksByDateFiltered = (search, searchPickupTime, searchByStatus) => {
  //   let linkArray = []
  //   linksByDate
  //   .filter((l) => l.pickupTime.includes(searchPickupTime))
  //   .filter((l) => l.pickupTime != 'Cafeteria')
  //   .filter((l) => l.orderStatus.toString().includes(searchByStatus))
  //   .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
  //   .map((l,i) => linkArray.push(l))
  //   setState({
  //     ...state,
  //     // searchPickupTime: '',

  //     linksByDateFiltered: linkArray,
  //   });
  // }

  const listOfLinks = (search, searchPickupTime, searchByStatus) => (
    // linksByDate
    //   .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
    //   // .filter((l) => l.pickupDate === pickupDateLookup)
    //   .map((l, i) =>
    //     setState({ ...state, orderStatusArray: [...l.orderStatus] })
    //   );
    <table className="table table-striped">
      <thead>
        <tr>
          {/* <th scope="col">#</th> */}
          <th scope="col">Code</th>
          <th scope="col">Student Info</th>
          {/* <th scope="col">date</th> */}
          {showStatus && <th scope="col">Status</th>}
        </tr>
      </thead>
      <tbody>
        {linksByDate
          .filter((l) => l.pickupTime.includes(searchPickupTime))
          .filter((l) => l.pickupTime != 'Cafeteria')
          .filter((l) => l.orderStatus.toString().includes(searchByStatus))
          .filter((l) =>
            l.pickupCode.toLowerCase().includes(search.toLowerCase())
          )
          .map((l, i) => (
            <>
              <tr key={i}>
                {/* <th scope="col">1</th> */}

                  <td >
                <Link  href={`/user/receipt/${l._id}`}>
                    
                  <a className="text-dark">
                    {l.pickupCode}
                    
                  </a>
                </Link>
                    </td>
                <td>
                  {/* {console.log('order status', l.orderStatus)} */}
                  {l.postedBy === null
                    ? 'user deleted'
                    : l.postedBy.students.map((s) => (
                        <>
                          {s.name} {s.schoolName} {','}{' '}
                        </>
                      ))}
                </td>
                {showStatus && (
                  <td>
                    <input
                      data-index={l._id}
                      type="checkbox"
                      onChange={(e) => changeOrderStatus(e, l)}
                      // checked={orderStatusArray[i]}
                      checked={l.orderStatus}
                    ></input>
                    {/* {console.log('l',l)} */}
                  </td>
                )}
              </tr>
            </>
          ))}
      </tbody>
    </table>
  );

  const listOfOnsiteLinks = (search, searchPickupTime, searchByStatus) => (
    // linksByDate
    //   .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
    //   // .filter((l) => l.pickupDate === pickupDateLookup)
    //   .map((l, i) =>
    //     setState({ ...state, orderStatusArray: [...l.orderStatus] })
    //   );
    <table className="table table-striped">
      <thead>
        <tr>
          {/* <th scope="col">#</th> */}
          {/* <th scope="col">Code</th> */}
          <th scope="col">Student</th>
          <th scope="col">Teacher</th>
          <th scope="col">School</th>
          <th scope="col">Group</th>
          {showStatus && <th scope="col">Status</th>}
        </tr>
      </thead>
      <tbody>
        {/* {console.log('before filters array',allMealsArray[0].schoolName)} */}
        {allMealsArray
          // .filter((l) => l.pickupTime.includes(searchPickupTime))
          .filter((l) => l.group != 'distance-learning')
          // .filter((l, i) => l.teacher.includes(searchByTeacher))
          .filter(
            (l, i) =>
              // l.group != 'distance-learning' &&
              l.teacher.includes(searchByTeacher) ||
              l.teacher.includes(searchByTeacher2) ||
              l.teacher.includes(searchByTeacher3) ||
              l.teacher.includes(searchByTeacher4)
          )
          // .filter((l, i) => l.teacher.includes(searchByTeacher2))
          // .filter((l, i) => l.teacher.includes(searchByTeacher3))
          // .filter((l, i) => l.teacher.includes(searchByTeacher4))
          .filter((l, i) => l.group.includes(searchByGroup))
          .filter((l, i) => l.schoolName.includes(searchBySchool))
          // .filter((l) => l.complete.toString().includes(searchByStatus))

          .map((l, i) => (
            <>
              {console.log(l)}
              <tr key={i}>
                {/* <th scope="col">1</th> */}
                <td>
                  {/* {console.log('order status', l.orderStatus)} */}
                  {l.postedBy === null
                    ? 'user deleted'
                    : l.studentName + ' ' + l.lastName}
                </td>
                <td>{l.postedBy === null ? 'user deleted' : l.teacher}</td>
                <td>{l.schoolName === null ? 'user deleted' : l.schoolName}</td>
                <td>
                  {l.postedBy === null
                    ? 'None'
                    : l.group === 'a-group'
                    ? 'A'
                    : l.group === 'b-group'
                    ? 'B'
                    : l.group}
                </td>
                {showStatus && (
                  <td>
                    <input
                      data-index={l._id}
                      type="checkbox"
                      onChange={(e) => changeIndividualOrderStatus(e, l)}
                      checked={l.complete}
                    ></input>
                  </td>
                )}
              </tr>
            </>
          ))}
      </tbody>
    </table>
  );

  // linksByDate
  // .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
  // // .filter((l) => l.pickupDate === pickupDateLookup)
  // .map((l, i) => setState({...state, orderStatusArray: [...l.orderStatus]}))

  // const listOfLinks = (search) =>
  //   linksByDate
  //     .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
  //     // .filter((l) => l.pickupDate === pickupDateLookup)
  //     .map((l, i) => (
  //       <>
  //         <div
  //           key={i}
  //           className={
  //             l.orderStatus === false
  //               ? 'p-4 alert  alert-warning ' + styles.subcard
  //               : 'p-4 alert  alert-secondary ' + styles.subcard
  //           }
  //         >
  //           {/* {console.log(l.orderStatus)} */}
  //           <h4 className="pt-1 pb-1">
  //             Request for <b>{moment(l.pickupDate).format('MMM Do')}</b>
  //           </h4>
  //           <h4>
  //             <b>Code: {l.pickupCode}</b>
  //             {/* {console.log(typeof(l.pickupCode))} */}
  //           </h4>
  //           <p></p>
  //           <div className="p-2">
  //             {/* <a href={l.url} target="_blank"> */}
  //             <h5 className="pb-1">
  //               {l.mealRequest.length} weekly meal
  //               {l.mealRequest.length > 1 && 's'}:<p></p>
  //               <div className="p-3">
  //                 {l.mealRequest.map((l, i) => (
  //                   <h6 className="">
  //                     Meal {`${i + 1} `} - {l.meal}{' '}
  //                   </h6>
  //                 ))}
  //               </div>
  //             </h5>
  //             {/* order status {l.orderStatus === false ? <h4>incomplete</h4> : <h4>complete</h4>} */}
  //             <h2 className=" " style={{ fontSize: '16px' }}>
  //               Pickup for your order is between <b>{l.pickupTime} </b> on
  //               Friday
  //             </h2>
  //             {/* </a> */}
  //           </div>
  //           <div className="pt-1 ">
  //             <span className="">
  //               {' '}
  //               {moment(l.createdAt).fromNow()} by{' '}
  //               {l.postedBy == null ? 'user deleted' : l.postedBy.name}{' '}
  //             </span>
  //           </div>

  //           <div className=" pb-3 pt-3">
  //             <Link href="">
  //               <button
  //                 onClick={(e) => confirmDelete(e, l._id)}
  //                 className="badge text-danger btn btn-outline-warning "
  //               >
  //                 Delete
  //               </button>
  //             </Link>
  //             {/* {
  //               <Link href={`/link/admin/${l._id}`}>
  //                 <button className="badge btn btn-outline-warning text float-left">
  //                   Edit Request
  //                 </button>
  //               </Link>
  //             } */}
  //             {/* {console.log(orderStatus)} */}
  //             {l.orderStatus === false ? (
  //               <Link href="">
  //                 <button
  //                   onClick={(e) => confirmComplete(e, l._id)}
  //                   className="text-grey btn btn-warning float-right"
  //                 >
  //                   Complete Order?
  //                 </button>
  //               </Link>
  //             ) : (
  //               <h4 className="pt-3">
  //                 <b>Completed on {moment(l.updatedAt).format('MMM Do')}</b>
  //               </h4>
  //             )}
  //             {/* <Link href="">
  //               <button
  //                 onClick={(e) => confirmDelete(e, l._id)}
  //                 className="badge text-danger btn btn-outline-warning float-right"
  //               >
  //                 Delete
  //               </button>
  //             </Link> */}
  //             {l.orderStatus === false && <div className="pb-4"></div>}
  //           </div>
  //         </div>
  //       </>
  //     ));

  // const loadMore = async () => {
  //   let toSkip = skip + limit;

  //   const response = await axios.post(
  //     `${API}/links`,
  //     {
  //       skip: toSkip,
  //       limit,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   setAllLinks([...allLinks, ...response.data]);
  //   // console.log(...response.data);
  //   // console.log('allLinks', allLinks);
  //   // console.log('response.data.links.length', response.data.links.length);
  //   setSize(response.data.length);
  //   setSkip(toSkip);
  // };

  const addBESTeacher = (teacherGroup) => (
    <>
      <div key={17} className="">
        <div className="">
          <select
            type="select"
            // value={state.value}
            // data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={handleSearch(teacherGroup)}
            className="btn btn-sm btn-outline-primary"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Teacher
            </option>
            ,<option value="k-annino/lee">K - Annino/Lee</option>
            <option value="k-milbourn">K - Milbourn</option>
            <option value="1st-hirano">1st - Hirano</option>
            <option value="1st-morrow">1st - Morrow</option>
            <option value="2nd-watson">2nd - Watson</option>
            <option value="2nd-gerin">2nd - Gerin</option>
            <option value="3rd-squire">3rd - Squire</option>
            <option value="3rd-altman">3rd - Altman</option>
            <option value="3rd-rosenblum">3rd - Rosenblum</option>
            <option value="4th-keane">4th - Keane</option>
            <option value="4th-farlow">4th - Farlow</option>
            <option value="5th-stephens">5th - Stephens</option>
            <option value="5th-becker">5th - Becker</option>
            <option value="5th-powers">5th - Powers</option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
        </div>
      </div>
    </>
  );

  const addOHESTeacher = (teacherGroup) => (
    <>
      <div key={16} className="">
        <div className="">
          <select
            type="select"
            // value={state.value}
            // data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={handleSearch(teacherGroup)}
            className="btn  btn-sm btn-outline-primary"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Teacher
            </option>
            ,<option value="k-sloan">K - Sloan</option>
            <option value="k-foy">K - Foy</option>
            <option value="1st-aaronson">1st - Aaronson</option>
            <option value="1st-bretzing">1st - Bretzing</option>
            <option value="2nd-lieberman">2nd - Lieberman</option>
            <option value="2nd-ruben">2nd - Ruben</option>
            <option value="3rd-arnold">3rd - Arnold</option>
            <option value="4th-lockrey">4th - Lockrey</option>
            <option value="4th-farlow">4th - Farlow</option>
            <option value="4th-chobanian">4th - Chobanian</option>
            <option value="5th-bailey">5th - Bailey</option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
        </div>
      </div>
    </>
  );

  const addROESTeacher = (teacherGroup) => (
    <>
      <div key={15} className="">
        <div className="">
          <select
            type="select"
            // value={state.value}
            // data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={handleSearch(teacherGroup)}
            className="btn  btn-sm btn-outline-primary"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Teacher
            </option>
            ,<option value="k-lobianco">K - LoBianco</option>
            <option value="1st-bird">1st - Bird</option>
            <option value="1st-ewing">1st - Ewing</option>
            <option value="1st-holland">1st - Holland</option>
            <option value="2nd-mcdowell">2nd - McDowell</option>
            <option value="2nd-share">2nd - Share</option>
            <option value="3rd-cantillon">3rd - Cantillon</option>
            <option value="3rd-strong">3rd - Strong</option>
            <option value="4th-duffy">4th - Duffy</option>
            <option value="4th-matthews">4th - Matthews</option>
            <option value="5th-bodily">5th - Bodily</option>
            <option value="5th-cass">5th - Cass</option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
        </div>
      </div>
    </>
  );
  const addMCMSTeacher = (teacherGroup) => (
    <>
      <div key={14} className="">
        <div className="">
          <select
            type="select"
            // value={state.value}
            // data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={handleSearch(teacherGroup)}
            className=" btn  btn-sm btn-outline-primary"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="6th-grade">6th grade </option>
            <option value="7th-grade">7th grade </option>
            <option value="8th-grade">8th grade </option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
        </div>
      </div>
    </>
  );

  const addOPHSTeacher = (teacherGroup) => (
    <>
      <div key={13} className="">
        <div className="">
          <select
            type="select"
            // value={state.value}
            // data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={handleSearch(teacherGroup)}
            className=" btn  btn-sm btn-outline-primary"
            required
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="9th-grade">9th grade</option>
            <option value="10th-grade">10th grade </option>
            <option value="11th-grade">11th grade </option>
            <option value="12th-grade">12th grade </option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
        </div>
      </div>
    </>
  );

  const addOODTeacher = (teacherGroup) => (
    <>
      <div key={12} className="">
        <div className="">
          <select
            type="select"
            // value={state.value}
            // data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={handleSearch(teacherGroup)}
            className=" btn  btn-sm btn-outline-primary"
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="9th-grade">9th grade</option>
            <option value="10th-grade">10th grade </option>
            <option value="11th-grade">11th grade </option>
            <option value="12th-grade">12th grade </option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
        </div>
      </div>
    </>
  );
  const addNONTeacher = (teacherGroup) => (
    <>
      <div key={11} className="">
        <div className="">
          <select
            type="select"
            // value={state.value}
            // data-index={i}
            // defaultValue={''}
            // defaultValue={state.mealRequest[0].meal}
            onChange={handleSearch(teacherGroup)}
            className=" btn  btn-sm btn-outline-primary"
          >
            {' '}
            <option selected disabled value="">
              Choose Grade Level
            </option>
            ,<option value="9th-grade">9th grade</option>
            <option value="10th-grade">10th grade </option>
            <option value="11th-grade">11th grade </option>
            <option value="12th-grade">12th grade </option>
            {/* {x.schoolName === 'BES' && state.loadedTeachers.map((g, i) => {
              return <option value={g._id}>{g.name}</option>;
              // return <option value={g._id}>{g.name}</option>;
            })} */}
          </select>
        </div>
      </div>
    </>
  );

  const resetSearch = () => {
    setState({
      ...state,
      searchByGroup: '',
      searchBySchool: '',
      searchByTeacher: '',
      searchByTeacher2: 'filter',
      searchByTeacher3: 'filter',
      searchByTeacher4: 'filter',
      searchPickupTime: '',
    });
  };

  const handleObjectAgeChange = (ageGroup) => (e) => {
    // let i = e.target.getAttribute('data-index');
    // let ageSearch = age +` ${ i}`

    setState({
      ...state,
      [ageGroup]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Register',
    });
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8 pt-4">
          <h3>
            Meal Lists for{' '}
            {pickupDateLookup &&
              moment(state.pickupDateLookup).format('MMM Do')}{' '}
          </h3>
          <div className="lead alert alert-seconary pb-3">
            <div className="form-group">
              {showSearch && (
                <Calendar
                  onChange={(e) => onDateChange(e)}
                  tileDisabled={handleDisabledDates}
                  // defaultValue={moment(new Date()).format('l')}
                  value={new Date()}
                  // value={state.pickupDateLookup}
                  // selectedValue={defaultValue}
                  // tileDisabled={(date, view) =>
                  //   yesterday.some(date =>
                  //      moment().isAfter(yesterday)
                  //   )}
                  // minDate={handlePastDate}
                  // minDate={twoWeeksFromNow}
                  // minDate={new Date().getDate() + 14}

                  // value={''}
                />
              )}
              <button
                className="btn btn-sm btn-outline-dark"
                onClick={() => setShowSearch(!showSearch)}
              >
                <i className="far fa-calendar-alt"></i> &nbsp;&nbsp; Select Date
              </button>

              {orderType === 'Onsite' ? (
                <CSVLink
                  className="float-right"
                  headers={onsiteHeaders}
                  data={csvOnsiteData}
                >
                  Download csv
                </CSVLink>
              ) : (
                <CSVLink
                  className="float-right"
                  headers={pickupHeaders}
                  data={csvOffsiteData}
                >
                  Download csv
                </CSVLink>
              )}
              {/* <CSVLink className="float-right" data={csvData} headers={headers}>
                Download csv
              </CSVLink> */}

              <br />
              <br />
              <input
                className="form-control pb-4"
                onChange={handleSearch(
                  'search',
                  state.search,
                  searchPickupTime,
                  searchByStatus
                )}
                value={state.search}
                type="text"
                className="form-control"
                placeholder="Search requests by pickup code"
              ></input>
              <br />
              {orderType === 'Pickup' && (
                <button
                  className="btn  btn-outline-secondary fas fa-car-side"
                  onClick={handleSearch('orderType')}
                  value="Onsite"
                >
                  &nbsp; Curbside
                </button>
              )}
              {orderType === 'Onsite' && (
                <button
                  className="btn btn-outline-secondary fas fa-school"
                  onClick={handleSearch('orderType')}
                  value="Pickup"
                >
                  &nbsp; Onsite
                </button>
              )}
              {/* <select
                className="btn btn-outline-primary"
                onChange={handleSearch('orderType')}
              >
                <option value="Pickup">Pickup</option>
                <option value="Onsite">Onsite</option>
              </select> */}
              {orderType === 'Pickup' && (
                <select
                  className="btn btn-sm btn-outline-primary"
                  onChange={handleSearch(
                    'searchPickupTime',
                    state.search,
                    searchPickupTime,
                    searchByStatus
                  )}
                  value={state.searchPickupTime}
                  type="text"
                  // className="form-control"
                  id=""
                >
                  <option disabled value="">
                    Time
                  </option>
                  <option value="7am-9am">7-9am</option>
                  <option value="11am-1pm">11-1pm</option>
                  <option value="4pm-6pm">4-6pm</option>
                  {/* <option value="Cafeteria">Onsite</option> */}
                </select>
              )}
              {orderType === 'Pickup' && (
                <button
                  className=" btn btn-sm btn-outline-primary"
                  onClick={() => setShowStatus(!showStatus)}
                >
                  Show Status
                </button>
              )}
              {orderType === 'Pickup' && showStatus && (
                <select
                  className="btn btn-sm btn-outline-primary"
                  onChange={handleSearch(
                    'searchByStatus',
                    state.search,
                    searchPickupTime,
                    searchByStatus
                  )}
                  value={state.searchByStatus}
                  type="text"
                  // className="form-control"
                  id=""
                >
                  <option disabled value="0">
                    Status
                  </option>
                  <option value="">All</option>
                  <option value={false}>Open</option>
                  <option value={true}>Closed</option>
                </select>
              )}
              {orderType === 'Onsite' && (
                <select
                  className="btn btn-sm btn-outline-primary"
                  onChange={handleSearch(
                    'searchBySchool',
                    state.search,
                    searchPickupTime,
                    searchByStatus
                  )}
                  value={state.searchBySchool}
                  type="text"
                  // className="form-control"
                  id=""
                >
                  <option value="">Choose School</option>
                  <option value="BES">Brookside Elementary School</option>
                  <option value="OHES">Oak Hills Elementary School</option>
                  <option value="ROES">Red Oak Elementary School</option>
                  <option value="MCMS">Medea Creek Middle School</option>
                  <option value="OPHS">Oak Park High School</option>
                  <option value="OVHS">Oak View High School</option>
                  <option value="NON">Non OPUSD</option>
                </select>
              )}
              {orderType === 'Onsite' && (
                <select
                  className="btn btn-sm btn-outline-primary"
                  onChange={handleSearch(
                    'searchByGroup',
                    state.search,
                    searchPickupTime,
                    searchByStatus
                  )}
                  value={state.searchByGroup}
                  type="text"
                  // className="form-control"
                  id=""
                >
                  <option value="">Cohort A & B</option>
                  <option value="a-group">Cohort A</option>
                  <option value="b-group">Cohort B</option>
                </select>
              )}

              {orderType === 'Onsite' && (
                <>
                  {
                    <div key={2} className="">
                      {searchBySchool === 'BES' &&
                        addBESTeacher('searchByTeacher')}
                      {searchBySchool === 'OHES' &&
                        addOHESTeacher('searchByTeacher')}
                      {searchBySchool === 'ROES' &&
                        addROESTeacher('searchByTeacher')}
                      {searchBySchool === 'MCMS' &&
                        addMCMSTeacher('searchByTeacher')}
                      {searchBySchool === 'OPHS' &&
                        addOPHSTeacher('searchByTeacher')}
                      {searchBySchool === 'OVHS' &&
                        addOPHSTeacher('searchByTeacher')}
                      {searchBySchool === 'NON' &&
                        addNONTeacher('searchByTeacher')}
                    </div>
                  }

                  {searchByTeacher != '' && (
                    <div key={3} className="">
                      {searchBySchool === 'BES' &&
                        addBESTeacher('searchByTeacher2')}
                      {searchBySchool === 'OHES' &&
                        addOHESTeacher('searchByTeacher2')}
                      {searchBySchool === 'ROES' &&
                        addROESTeacher('searchByTeacher2')}
                      {searchBySchool === 'MCMS' &&
                        addMCMSTeacher('searchByTeacher2')}
                      {searchBySchool === 'OPHS' &&
                        addOPHSTeacher('searchByTeacher2')}
                      {searchBySchool === 'OVHS' &&
                        addOPHSTeacher('searchByTeacher2')}
                      {searchBySchool === 'NON' &&
                        addNONTeacher('searchByTeacher2')}
                    </div>
                  )}

                  {searchByTeacher2 != 'filter' && (
                    <div key={4} className="">
                      {searchBySchool === 'BES' &&
                        addBESTeacher('searchByTeacher3')}
                      {searchBySchool === 'OHES' &&
                        addOHESTeacher('searchByTeacher3')}
                      {searchBySchool === 'ROES' &&
                        addROESTeacher('searchByTeacher3')}
                      {searchBySchool === 'MCMS' &&
                        addMCMSTeacher('searchByTeacher3')}
                      {searchBySchool === 'OPHS' &&
                        addOPHSTeacher('searchByTeacher3')}
                      {searchBySchool === 'OVHS' &&
                        addOPHSTeacher('searchByTeacher3')}
                      {searchBySchool === 'NON' &&
                        addNONTeacher('searchByTeacher3')}
                    </div>
                  )}

                  {searchByTeacher3 != 'filter' && (
                    <div key={5} className="">
                      {searchBySchool === 'BES' &&
                        addBESTeacher('searchByTeacher4')}
                      {searchBySchool === 'OHES' &&
                        addOHESTeacher('searchByTeacher4')}
                      {searchBySchool === 'ROES' &&
                        addROESTeacher('searchByTeacher4')}
                      {searchBySchool === 'MCMS' &&
                        addMCMSTeacher('searchByTeacher4')}
                      {searchBySchool === 'OPHS' &&
                        addOPHSTeacher('searchByTeacher4')}
                      {searchBySchool === 'OVHS' &&
                        addOPHSTeacher('searchByTeacher4')}
                      {searchBySchool === 'NON' &&
                        addNONTeacher('searchByTeacher4')}
                    </div>
                  )}
                </>
              )}
              {/* {orderType === 'Onsite' && (
                <div key={2} className="">
                  {searchBySchool === 'BES' && addBESTeacher('searchByTeacher2')}
                  {searchBySchool === 'OHES' && addOHESTeacher('searchByTeacher2')}
                  {searchBySchool === 'ROES' && addROESTeacher('searchByTeacher2')}
                  {searchBySchool === 'MCMS' && addMCMSTeacher('searchByTeacher2')}
                  {searchBySchool === 'OPHS' && addOPHSTeacher('searchByTeacher2')}
                  {searchBySchool === 'OVHS' && addOPHSTeacher('searchByTeacher2')}
                  {searchBySchool === 'NON' && (addNONTeacher('searchByTeacher2')
                    // <div className="form-group pt-1">
                    //   <input

                    //     data-index={4}
                    //     onChange={handleObjectAgeChange('ageGroup4')}
                    //     // onChange={handleChange({student: 'name'})}
                    //     type="text"
                    //     className="form-control "
                    //     placeholder="Age"
                    //     required={true}
                    //   />
                    // </div>
                  )}
                </div>
              )}
              {orderType === 'Onsite' && (
                <div key={2} className="">
                  {searchBySchool === 'BES' && addBESTeacher('searchByTeacher3')}
                  {searchBySchool === 'OHES' && addOHESTeacher('searchByTeacher3')}
                  {searchBySchool === 'ROES' && addROESTeacher('searchByTeacher3')}
                  {searchBySchool === 'MCMS' && addMCMSTeacher('searchByTeacher3')}
                  {searchBySchool === 'OPHS' && addOPHSTeacher('searchByTeacher3')}
                  {searchBySchool === 'OVHS' && addOPHSTeacher('searchByTeacher3')}
                  {searchBySchool === 'NON' && (addNONTeacher('searchByTeacher3')
                    // <div className="form-group pt-1">
                    //   <input

                    //     data-index={4}
                    //     onChange={handleObjectAgeChange('ageGroup4')}
                    //     // onChange={handleChange({student: 'name'})}
                    //     type="text"
                    //     className="form-control "
                    //     placeholder="Age"
                    //     required={true}
                    //   />
                    // </div>
                  )}
                </div>
              )}
              {orderType === 'Onsite' && (
                <div key={2} className="">
                  {searchBySchool === 'BES' && addBESTeacher('searchByTeacher4')}
                  {searchBySchool === 'OHES' && addOHESTeacher('searchByTeacher4')}
                  {searchBySchool === 'ROES' && addROESTeacher('searchByTeacher4')}
                  {searchBySchool === 'MCMS' && addMCMSTeacher('searchByTeacher4')}
                  {searchBySchool === 'OPHS' && addOPHSTeacher('searchByTeacher4')}
                  {searchBySchool === 'OVHS' && addOPHSTeacher('searchByTeacher4')}
                  {searchBySchool === 'NON' && (addNONTeacher('searchByTeacher4')
                    // <div className="form-group pt-1">
                    //   <input

                    //     data-index={4}
                    //     onChange={handleObjectAgeChange('ageGroup4')}
                    //     // onChange={handleChange({student: 'name'})}
                    //     type="text"
                    //     className="form-control "
                    //     placeholder="Age"
                    //     required={true}
                    //   />
                    // </div>
                  )}
                </div>
              )} */}

              <div className="p-2"></div>

              <button
                className=" btn text-white btn-sm btn-warning"
                onClick={() => resetSearch()}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      <br />

      {/* <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Student Info</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody> */}

      {/* {listOfLinksSearch(state.search, searchPickupTime, searchByStatus)} */}
      {orderType === 'Pickup'
        ? listOfLinks(state.search, searchPickupTime, searchByStatus)
        : listOfOnsiteLinks(state.search, searchPickupTime, searchByStatus)}
      {/* </tbody>
      </table> */}
      {/* <div className="row">
        <div className="col-md-12">{listOfLinks(state.search)}</div>
      </div> */}

      {/* i can probably remove loadmeals as each date should have lots of data there already to stop infinite scroll from overloading */}
      {/* {loadmeals && (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={size > 0 && size >= limit}
          loader={
            <div className="loader" key={0}>
              <img src="/static/images/loading.gif" alt="loading..." />
            </div>
          }
        >

          <div className="row">
            <div className="col-md-12">{listOfLinks(state.search)}</div>
          </div>
        </InfiniteScroll>
      )} */}
    </Layout>
  );
};

// Requests.getInitialProps = async ({ req }) => {

//   let skip = 0;
//   let limit = 2;

//   const token = getCookie('token', req);

//   const response = await axios.post(
//     `${API}/links`,
//     {
//       skip,
//       limit,
//     },
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   return {
//     links: response.data,
//     totalLinks: response.data.length,
//     linksLimit: limit,
//     linkSkip: skip,
//     token,
//   };

// };

Requests.getInitialProps = async ({ req, user }) => {
  const token = getCookie('token', req);

  const dateLookup = moment(new Date()).format('l');
  const response = await axios.post(
    `${API}/links-by-date`,
    { dateLookup },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // pickupDate: pickupDateLookup,
  let initRequests = response.data;
  return { initRequests };
};

export default withAdmin(Requests);
