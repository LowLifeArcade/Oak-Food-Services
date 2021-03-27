import { useState } from 'react';
import Layout from '../../../components/Layout';
import styles from '../../../styles/Home.module.css';
import axios from 'axios';
import Link from 'next/link';
import { API } from '../../../config';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Router from 'next/router';

const Links = ({ token, links, totalLinks, linksLimit, linkSkip }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [completeDate, setCompleteDate] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);
  // const [loadmeals, setLoadmeals] = useState(false);
  const [orderStatus, setOrderStatus] = useState(true);
  const [state, setState] = useState({
    pickupDateLookup: moment(new Date()).format('l'),
    search: '',
    error: '',
    success: '',
  });

  const { pickupDateLookup, loadMeals } = state;

  const confirmComplete = (e, id) => {
    e.preventDefault();
    let answer = window.confirm('Mark this order as completed?');
    if (answer) {
      setCompleteDate(new Date());
      setOrderStatus(true);
      console.log(orderStatus);
      handleComplete(id, orderStatus);
    }
  };

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
      process.browser && Router.push('/admin/link/read');
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
      process.browser && Router.push('/admin/link/read');
      // window.location.reload();
    } catch (error) {
      console.log('ERROR LINK CATEGORY', error);
    }
  };

  const confirmDelete = (e, id) => {
    e.preventDefault();
    let answer = window.confirm(
      'WARNING! Confirm delete of food request as admin.'
    );
    if (answer) {
      window.confirm('Food request has been deleted');
      handleDelete(id);
    }
  };

  const listOfLinks = (search) => {
    allLinks
    .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
    .filter((l) => l.pickupDate === pickupDateLookup)
    .map((l, i) => (
      <>
      {console.log('pickup date', l.pickupDate, pickupDateLookup)}
       <div className="p-2">hi</div>
       </>
    ))}

  const listOfLinkss = (search) =>
    allLinks
      .filter((l) => l.pickupCode.toLowerCase().includes(search.toLowerCase()))
      .filter((l) => l.pickupDate === pickupDateLookup)
      .map((l, i) => (
        <>
        {console.log('pickup date', l.pickupDate, pickupDateLookup)}
          <div className={'d-flex justify-content-center  ' + styles.desktop}>
            <div
              className={'col-md-6  justify-content-center ' + styles.desktop}
            >
              <div
                key={i}
                className={
                  l.orderStatus === false
                    ? 'p-4 alert  alert-warning ' + styles.subcard
                    : 'p-4 alert  alert-secondary ' + styles.subcard
                }
              >
                <h4>
                  {l.orderStatus && (
                    <b className="text-danger ">
                      <h2>
                        * PICKED UP *
                        <br />
                        on {moment(l.updatedAt).format('MMM Do')}
                      </h2>
                      <hr />
                    </b>
                  )}
                </h4>
                {console.log('meals', l)}
                {l.mealRequest.filter(
                  (l) =>
                    l.meal == 'Standard' ||
                    l.meal == 'Vegetarian' ||
                    l.meal == 'Gluten Free' ||
                    l.meal == 'Vegan' ||
                    l.pickupOption === 'Lunch Onsite / Breakfast Pickup'
                ).length != 0 && (
                  <>
                    <h4 className="pt-2 ">
                      PICKUP DATE
                      <br />
                      <b>{moment(l.pickupDate).format('MMMM Do')}</b>
                    </h4>
                    Between <b className="pb-2 ">{l.pickupTime} </b>
                  </>
                )}
                <hr className={styles.hr} />
                <h3>
                  {l.mealRequest.filter(
                    (l) =>
                      l.meal == 'Standard' ||
                      l.meal == 'Vegetarian' ||
                      l.meal == 'Gluten Free' ||
                      l.meal == 'Vegan' ||
                      l.pickupOption === 'Lunch Onsite / Breakfast Pickup'
                  ).length != 0 ? (
                    <b className="d-flex justify-content-center">
                      {l.pickupCode}{' '}
                    </b>
                  ) : (
                    <b>
                      Onsite School Lunch for week of{' '}
                      {moment(l.pickupDate).add(3, 'day').format('MMMM Do')}
                    </b>
                  )}
                </h3>
                <hr className={styles.hr} />
                <h6>
                  Display the above code{' '}
                  <b className="text-danger">on your dashboard </b>or show from
                  your phone to the server
                </h6>
                <p></p>
                <div className="p-2">
                  <h5 className="pb-1">
                    <div className="p-3">
                      {l.mealRequest
                        .filter((l) => l.meal !== 'None')
                        .map((k, i) => (
                          <>
                            <h5 className="">
                              <b>
                                {k.student === undefined
                                  ? 'user deleted'
                                  : l.postedBy.students.filter((student) =>
                                      student._id.includes(k.student)
                                    ) && k.studentName}
                                :
                              </b>
                              <br></br>
                            </h5>
                            {k.student === undefined ? (
                              'user deleted'
                            ) : k.group === 'a-group' ||
                              k.group === 'b-group' ? (
                              k.pickupOption ===
                              'Lunch Onsite / Breakfast Pickup' ? (
                                <>
                                  <div className="p-1">
                                    <div className="pb-2 ">
                                      Curbside Breakfast{' '}
                                    </div>
                                    <div
                                      className="p-2"
                                      style={{ fontSize: '16px' }}
                                    >
                                      PLUS:
                                      <br />
                                      *Onsite Lunches{' '}
                                      {k.group === 'b-group'
                                        ? '- B'
                                        : k.group === 'a-group'
                                        ? '- A'
                                        : ''}
                                      *
                                      <br />
                                      *Week of{' '}
                                      {moment(l.pickupDate)
                                        .add(3, 'day')
                                        .format('MMMM Do')}
                                      *
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="p-1">
                                    Onsite Lunches
                                    <br />
                                    <div
                                      className="p-2"
                                      style={{ fontSize: '16px' }}
                                    >
                                      *
                                      {k.group === 'b-group'
                                        ? 'Cohort B'
                                        : k.group === 'a-group'
                                        ? 'Cohort A'
                                        : ''}
                                      * <br />
                                      *Week of{' '}
                                      {moment(l.pickupDate)
                                        .add(3, 'day')
                                        .format('MMMM Do')}
                                      *
                                    </div>
                                  </div>
                                </>
                              )
                            ) : (
                              <>
                                <div className="p-1">
                                  Curbside {k.meal}{' '}
                                  <div
                                    className="p-2"
                                    style={{ fontSize: '16px' }}
                                  >
                                    TYPE:
                                    <br />
                                    {k.pickupOption}
                                  </div>
                                </div>
                              </>
                            )}
                            <hr />
                          </>
                        ))}
                    </div>
                  </h5>
                </div>
                <div className="pt-1 ">
                  <span className="">
                    {' '}
                    {moment(l.createdAt).format('M/d/yy')} by{' '}
                    {l.postedBy == null ? 'user deleted' : l.postedBy.name}{' '}
                  </span>
                </div>

                <div className=" pb-3 pt-3">
                  {l.postedBy.students[i] === undefined ? null : (
                    <Link href={`/user/link/${l._id}`}>
                      <button className="btn btn-sm btn-outline-dark text float-left">
                        <i class="far fa-edit"></i> &nbsp;Edit
                      </button>
                    </Link>
                  )}
                  <Link href="">
                    <button
                      onClick={(e) => confirmDelete(e, l._id)}
                      className="text-white btn btn-sm btn-danger float-right"
                    >
                      Cancel
                    </button>
                  </Link>
                  <div className="pb-4"></div>
                </div>
              </div>
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
console.log('res length', response.data.length)
    setAllLinks([...allLinks, ...response.data]);
    setSize(response.data.length);
    setSkip(toSkip);
  };

  // change date
  const onDateChange = (pickupDate) => {
    setState({ ...state, pickupDateLookup: moment(pickupDate).format('l') });
    setShowSearch(!showSearch);
    // setLoadmeals(!loadMeals);
  };

  const handleDisabledDates = ({ date, view }) => date.getDay() !== 5;

  let twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 12);

  return (
    <Layout>
      <div className="row d-flex justify-content-center">
        <div className="col-md-6 pt-4">
          <h3>
            Meal Receipts for{' '}
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
                  value={''}
                />
              )}
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowSearch(!showSearch)}
              >
                Select Date
              </button>
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
            </div>
          </div>
        </div>
      </div>

      <br />

      {/* i can probably remove loadmeals as each date should have lots of data there already to stop infinite scroll from overloading */}
      {
      // loadmeals && 
      (
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
      )
      }
    </Layout>
  );
};

// Links.getInitialProps = async ({ req }) => {
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
Links.getInitialProps = async ({ req }) => {
  let skip = 0;
  let limit = 2;

  const token = getCookie('token', req);

  const dateLookup = moment(new Date()).format('l');
  const response = await axios.post(
    `${API}/links-by-date`,
    { dateLookup },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  let initRequests = response.data;
  return {
    links: response.data,
    totalLinks: response.data.length,
    linksLimit: limit,
    linkSkip: skip,
    token,
    initRequests,
  };
};

export default withAdmin(Links);
