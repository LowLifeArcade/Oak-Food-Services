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

// token, links, totalLinks, linksLimit, linkSkip
const Requests = ({ token }) => {
  // const [allLinks, setAllLinks] = useState(links);
  const [completeDate, setCompleteDate] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  // const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  // const [size, setSize] = useState(totalLinks);
  const [loadmeals, setLoadmeals] = useState(false);
  const [orderStatus, setOrderStatus] = useState(Boolean);
  const [state, setState] = useState({
    pickupDateLookup: moment(new Date()).format('l'),
    loadedUsers: [],
    // loadMeals: false,
    search: '',
    error: '',
    success: '',
  });
  const [linksByDate, setLinksByDate] = useState([]);
  const { pickupDateLookup, loadedUsers } = state;

  useEffect(() => {
    handleDateChange(pickupDateLookup);
    setLoadmeals(!loadmeals);
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const response = await axios.get(`${API}/user-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setState({ ...state, loadedUsers: response.data });
  };
  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDateLookup: moment(pickupDate).format('l') });
    // console.log(pickupDateLookup);
    handleDateChange(pickupDate);
    setShowSearch(!showSearch);
    // setLoadmeals(!loadMeals);
    // return {
    //   linksByDate: response.data,
    //   // links: response.data,
    //   totalLinksByDate: response.data.length,
    //   // token,
    // };
  };

  const handleDateChange = async (pickupDate) => {
    const pickupDateLookup = moment(pickupDate).format('l');
    const response = await axios.post(
      `${API}/links-by-date`,
      { pickupDateLookup },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLinksByDate(response.data);
  };
  // console.log('linksbydate', linksByDate);

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;

  let twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 12);

  const handleSearch = (name) => (e) => {
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

  const csvListOfLinks = (search) =>
    linksByDate
      // .filter(l => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
      .filter((l) => l.pickupDate === pickupDateLookup);

  const csvData = linksByDate;
  const headers = [
    { label: 'Code', key: 'pickupCode' },
    { label: 'First Name', key: 'postedBy.name' },
    { label: 'Last Name', key: 'postedBy.lastName' },
    { label: 'Email', key: 'postedBy.email' },
    { label: 'Students', key: 'postedBy.students[0].name' },
    { label: 'Teacher', key: 'postedBy.students[0].teacher.name' },
  ];
  // console.log('requests by date', linksByDate);
  // const csvData = csvListOfLinks(state.pickupDateLookup);
  // console.log('csvdata',csvListOfLinks(state.pickupDateLookup))

  const confirmComplete = (e, l) => {
    e.preventDefault();
    // console.log('delete >', slug);
    let answer = '';
    l.orderStatus === 'false'
      ? (answer = window.confirm('Mark this order as not completed?'))
      : (answer = window.confirm('Mark this order as not completed?'));
    if (answer) {
      changeOrderStatus(e, l);
      // console.log(orderStatus);
      handleComplete(id, orderStatus);
    }
  };

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
    let i = e.target.getAttribute('data-index');

    let requests = [...linksByDate];
    let request = { ...requests[i] };
    let answer = '';

    requests[i] = request;

    request.orderStatus === false
      ? (answer = window.confirm('Mark this order as completed?'))
      : (answer = window.confirm('Mark this order as not completed?'));
    if (answer) {
      request.orderStatus =
        e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      // handleIndividualOrderStatusChange(e, request);
      // let orders = [...request.mealRequest]

      request.mealRequest.forEach((mealRequest) => {
        if (mealRequest.group === 'distant-learning') {
          mealRequest.complete = request.orderStatus;
        }
      });
      // console.log(request.mealRequest.complete)
      // console.log('request indvidual', mealRequest.group);
      // request.mealRequest = orders
      handleComplete(request._id, request.orderStatus, request.mealRequest);
      setLinksByDate(requests);
      // console.log('request check', request.orderStatus);
    }
  };

  const listOfLinks = (search) =>
    linksByDate
      .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
      // .filter((l) => l.pickupDate === pickupDateLookup)
      .map((l, i) => (
        <>
          <tr key={i}>
            {/* <th scope="col">1</th> */}
            <td>{l.pickupCode}</td>
            <td>
              {l.postedBy.students.map((s) => (
                <>
                  {s.name} {s.schoolName} {','}{' '}
                </>
              ))}
            </td>
            {/* <td>{moment(l.pickupDate).format('MMM Do')}</td> */}
            <td>
              <input
                data-index={i}
                type="checkbox"
                onChange={(e) => changeOrderStatus(e, l)}
                defaultChecked={l.orderStatus}
                //  checked={linksByDate[i]}
              ></input>
            </td>
          </tr>
        </>
      ));

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

  return (
    <Layout>
      <div className="row">
        <div className="col-md-8 pt-4">
          <h3>
            Meal Request for{' '}
            {pickupDateLookup &&
              moment(state.pickupDateLookup).format('MMM Do')}{' '}
          </h3>
          <div className="lead alert alert-seconary pb-3">
            <div className="form-group">
              {showSearch && (
                <Calendar
                  onChange={(e) => onDateChange(e)}
                  tileDisabled={handleDisabledDates}
                  defaultValue={new Date()}
                  // selectedValue={defaultValue}
                  // tileDisabled={(date, view) =>
                  //   yesterday.some(date =>
                  //      moment().isAfter(yesterday)
                  //   )}
                  // minDate={handlePastDate}
                  // minDate={twoWeeksFromNow}
                  // minDate={new Date().getDate() + 14}

                  value={''}
                />
              )}
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowSearch(!showSearch)}
              >
                Select Date
              </button>
              <CSVLink className="float-right" data={csvData} headers={headers}>
                Download csv
              </CSVLink>

              <br />
              <br />
              <input
                className="form-control"
                onChange={handleSearch('search')}
                value={state.search}
                type="text"
                className="form-control"
                placeholder="Search requests by pickup code"
              ></input>
              {/* {renderHTML(category.content || '')} */}
            </div>
          </div>
        </div>
      </div>
      <br />

      <table className="table table-striped">
        <thead>
          <tr>
            {/* <th scope="col">#</th> */}
            <th scope="col">Code</th>
            <th scope="col">Student Info</th>
            {/* <th scope="col">date</th> */}
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>{listOfLinks(state.search)}</tbody>
      </table>
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

export default withAdmin(Requests);
