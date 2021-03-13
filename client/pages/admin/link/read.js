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
import Router from 'next/router'

const Links = ({ token, links, totalLinks, linksLimit, linkSkip }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [completeDate, setCompleteDate] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);
  const [loadmeals, setLoadmeals] = useState(false);
  const [orderStatus, setOrderStatus] = useState(true);
  const [state, setState] = useState({
    pickupDateLookup: moment(new Date()).format('l'),
    // loadMeals: false,
    search: '',
    error: '',
    success: '',
  });

  // useEffect(() => {

  //     setLoadmeals(!loadMeals)
  // }, [])

  console.log('all links', allLinks);

  const { pickupDateLookup, loadMeals } = state;
  // const handleClick = async (linkId) => {
  //   const response = await axios.put(`${API}/click-count`, { linkId });
  //   loadUpdatedLinks();
  // };

  // const loadUpdatedLinks = async () => {
  //   const response = await axios.post(`${API}/category/${query.slug}`);
  //   setAllLinks(response.data.links);
  // };

  const confirmComplete = (e, id) => {
    e.preventDefault();
    // console.log('delete >', slug);
    let answer = window.confirm('Mark this order as completed?');
    if (answer) {
      setCompleteDate(new Date());
      setOrderStatus(true);
      console.log(orderStatus);
      handleComplete(id, orderStatus);
    }
  };
  // const confirmDelete = (e, id) => {
  //   e.preventDefault();
  //   // console.log('delete >', slug);
  //   let answer = window.confirm('WARNING! Delete this order?.');
  //   if (answer) {
  //     handleDelete(id);
  //   }
  // };

  const handleSearch = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
    });
  };

  const handleComplete = async (id, orderStatus) => {
    console.log(orderStatus);

    try {
      const response = await axios.put(
        `${API}/link/admin/complete/${id}`,
        { orderStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('MEAL COMPLETE SUCCESS', response);
      // process.browser
      process.browser && Router.push('/admin/link/read')
      window.location.reload();
      window.confirm('Order is complete');
    } catch (error) {
      console.log('ERROR MEAL CATEGORY', error.response.data.error);
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
      process.browser && Router.push('/admin/link/read')
      // window.location.reload();
    } catch (error) {
      console.log('ERROR LINK CATEGORY', error);
    }
  };

  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete >', slug);
    let answer = window.confirm('WARNING! Confirm delete of food request as admin.');
    if (answer) {
      window.confirm('Food request has been deleted' )
      handleDelete(id);
    }
  };

  // const handleDelete = async (id) => {
  //   // console.log('delete link', id)
  //   try {
  //     const response = await axios.delete(`${API}/link/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log('LINK DELETE SUCCESS', response);
  //     Router.replace('/user');
  //   } catch (error) {
  //     console.log('ERROR DELETING LINK', error.response.data.error);
  //   }
  // };

  // const csvListOfLinks = (search) =>
  //   allLinks
  //     // .filter(l => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
  //     .filter((l) => l.pickupDate === pickupDateLookup);

  const listOfLinks = (search) =>
    allLinks
      .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
      .filter((l) => l.pickupDate === pickupDateLookup)
      .map((l, i) => (
        <>
          <div
            key={i}
            className={
              l.orderStatus === false
                ? 'p-4 alert  alert-warning '+ styles.subcard
                : 'p-4 alert  alert-secondary ' + styles.subcard
            }
          >
            {/* {console.log(l.orderStatus)} */}
            <h4 className="pt-1 pb-1">
              Request for <b>{moment(l.pickupDate).format('MMM Do')}</b>
            </h4>
            <h4>
              <b>Code: {l.pickupCode}</b>
              {/* {console.log(typeof(l.pickupCode))} */}
            </h4>
            <p></p>
            <div className="p-2">
              <h5 className="pb-1">
                {l.mealRequest.filter((l)=> l.meal !== 'None').length} weekly meal
                {l.mealRequest.filter((l)=> l.meal !== 'None').length > 1 && 's'}:<p></p>
                <div className="p-3">
                  {l.mealRequest.filter((l)=> l.meal !== 'None').map((k, i) => (
                    <h6 className="">
                      {console.log(k)}
                      {/* Meal {`${i + 1} `} - for  */}
                      {k.student === undefined ? (
                        'user deleted'
                      ) : k.group === 'a-group' ||
                        k.group === 'b-group' ? (
                        k.pickupOption === 'Lunch Onsite / Breakfast Pickup' ? (
                          <>
                            <b>2 onsite meals and </b>
                            <br />
                            <b>5 pickup breakfast meals</b>{' '}
                          </>
                        ) : (
                          <b>2 onsite meals </b>
                        )
                      ) : (
                        <b>5 pickup {k.meal} meals </b>
                      )}
                      <br></br>
                      {k.student === undefined
                        ? 'user deleted'
                        : l.postedBy.students.filter((student) =>
                            student._id.includes(k.student)
                          ) &&
                          k.studentName +
                            ' - ' +
                            k.group}
                      {/* {console.log(i,l.postedBy.students[i]._id)} */}
                      {/* {console.log('meal req',k.meal)} */}
                      <hr />
                    </h6>
                  ))}
                </div>
              </h5>
              {/* {console.log(l.mealRequest)} */}
              {l.pickupTime === 'Cafeteria' ?  <h2 className=" " style={{ fontSize: '16px' }}>
                Pickup is on campus at the student <b>{l.pickupTime} </b> during school hours
              </h2> : <h2 className=" " style={{ fontSize: '16px' }}>
                Pickup for your order is between <b>{l.pickupTime} </b> on
                Friday 
              </h2>}
            </div>
            <div className="pt-1 ">
              <span className="">
                {' '}
                {moment(l.createdAt).fromNow()} by{' '}
                {l.postedBy == null ? 'user deleted' : l.postedBy.name}{' '}
              </span>
            </div>

            <div className=" pb-3 pt-3">
            <Link href="">
            <button
              onClick={(e) => confirmDelete(e, l._id)}
              className="badge text-danger btn btn-outline-warning "
            >
              Delete
            </button>
          </Link>
              {
                <Link href={`/user/link/${l._id}`}>
                  <button className="badge btn btn-outline-warning text float-left">
                    Edit Request
                  </button>
                </Link>
              }
              {/* {console.log(orderStatus)} */}
              {l.orderStatus === false ? (
                <Link href="">
                  <button
                    onClick={(e) => confirmComplete(e, l._id)}
                    className="text-grey btn btn-warning float-right"
                  >
                    Complete Order?
                  </button>
                </Link>
              ) : (
                <h4 className="pt-3">
                  <b>Completed on {moment(l.updatedAt).format('MMM Do')}</b>
                </h4>
              )}
              {/* <Link href="">
                <button
                  onClick={(e) => confirmDelete(e, l._id)}
                  className="badge text-danger btn btn-outline-warning float-right"
                >
                  Delete
                </button>
              </Link> */}
              {l.orderStatus === false && <div className="pb-4"></div>}
            </div>
          </div>
        </>
      ));

  const loadMore = async () => {
    let toSkip = skip + limit;

    const response = await axios.post(
      `${API}/links`,
      {
        skip: toSkip,
        limit,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAllLinks([...allLinks, ...response.data]);
    // console.log(...response.data);
    // console.log('allLinks', allLinks);
    // console.log('response.data.links.length', response.data.links.length);
    setSize(response.data.length);
    setSkip(toSkip);
  };

  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDateLookup: moment(pickupDate).format('l') });
    setShowSearch(!showSearch);
    setLoadmeals(!loadMeals);
  };
  //  const defaultDate = (pickupDate) => {
  //   setState({ ...state, pickupDateLookup: moment(pickupDate).format('l') });
  //   setShowSearch(!showSearch);
  // };

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;

  let twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 12);

  // const csvData = csvListOfLinks(state.pickupDateLookup);
  // // console.log('csvdata',csvListOfLinks(state.pickupDateLookup))

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
              {/* <CSVLink className="float-right" data={csvData}>
                Download csv
              </CSVLink> */}

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

      {/* i can probably remove loadmeals as each date should have lots of data there already to stop infinite scroll from overloading */}
      {loadmeals && (
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
          {/* <div className="col-md-8">{listOfLinks()}</div> */}
          <div className="row">
            <div className="col-md-12">{listOfLinks(state.search)}</div>
          </div>
        </InfiniteScroll>
      )}
    </Layout>
  );
};

Links.getInitialProps = async ({ req }) => {
  let skip = 0;
  let limit = 2;

  const token = getCookie('token', req);

  const response = await axios.post(
    `${API}/links`,
    {
      skip,
      limit,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return {
    links: response.data,
    totalLinks: response.data.length,
    linksLimit: limit,
    linkSkip: skip,
    token,
  };
};

export default withAdmin(Links);
