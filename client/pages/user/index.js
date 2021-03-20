import styles from '../../styles/Home.module.css';
import React, { useEffect } from 'react';
import axios from 'axios';
import { API } from '../../config';
import { getCookie } from '../../helpers/auth';
import withUser from '../withUser';
import Link from 'next/link';
import moment from 'moment';
import Router from 'next/router';

import Layout from '../../components/Layout';

const User = ({ user, token, l, userLinks }) => {
  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete >', slug);
    let answer = window.confirm(
      'ATENTION! Please cancel at least a week in advance of pickup date if possible.'
    );
    if (answer) {
      window.confirm('Request is cancelled. No further action required.');
      handleDelete(id);
    }
  };

  useEffect(() => {
    // console.log('students!', user.students);
    user.students.length === 0 && Router.push('/user/profile/add');
  }, []);

  const handleDelete = async (id) => {
    // console.log('delete link', id)
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('LINK DELETE SUCCESS', response);
      Router.replace('/user');
    } catch (error) {
      console.log('ERROR DELETING LINK', error);
    }
  };
  {
    console.log('pages user index', userLinks.mealRequest);
  }
  const listOfLinks = () =>
    userLinks.map((l, i) => (
      <>
        {/* {console.log('links', l)} */}
        {
          <div key={i} className={' p-4 alert alert-warning ' + styles.receipt}>
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
              <React.Fragment>
                <h4 className="pt-2 ">
                  PICKUP DATE
                  <br />
                  <b>{moment(l.pickupDate).format('MMMM Do')}</b>
                </h4>
                Between <b className="pb-2 ">{l.pickupTime} </b>
              </React.Fragment>
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
                <b className="d-flex justify-content-center">{l.pickupCode} </b>
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
              <b className="text-danger">on your dashboard </b>or show from your
              phone to the server
            </h6>
            <p></p>
            <div className="p-2">
              <h5 className="pb-1">
                {/* {l.mealRequest.filter((l)=> l.meal !== 'None').length} weekly meal */}
                {/* {l.mealRequest.filter((l)=> l.meal !== 'None').length > 1 && 's'}:<p></p> */}

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
                        ) : k.group === 'a-group' || k.group === 'b-group' ? (
                          k.pickupOption ===
                          'Lunch Onsite / Breakfast Pickup' ? (
                            <>
                              <div className="p-1">
                                <div className="pb-2 ">Curbside Breakfast </div>
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
                              <div className="p-2" style={{ fontSize: '16px' }}>
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
              {/* {console.log(l.mealRequest)} */}
              {/* {l.pickupTime === 'Cafeteria' ? null : (
                <h2 className=" " style={{ fontSize: '16px' }}>
                  Pickup is between <b>{l.pickupTime} </b> on Friday. Please
                  print out or write out your code and display your{' '}
                  <b >CODE on your dashboard</b>.
                </h2>
              )} */}
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
        }
      </>
    ));

  return (
    <div
    // className={styles.background}
    >
      <Layout>
        {/* <div className=""> */}

        <h2 className=" pt-3">
          {user.name}'s Meal Requests{' '}
          {/* <span className="text-danger"> /{user.role}</span>{' '} */}
        </h2>
        {/* </div> */}
        <hr />
        <div className="p-1">
          <div className="">
            {/* <ul className="nav flex-column"> */}
            {/* <li className="nav-item"> */}
            <Link href="/user/profile/update">
              <a className="nav-item">Update profile</a>
            </Link>
            {/* <br/>
          <Link href="/user/profile/add">
            <a className="nav-item">Add students</a>
          </Link> */}
            {/* </li> */}
            {/* <li className="nav-item p-4"> */}
            <Link href="/user/link/create">
              <button className={'btn float-right ' + styles.button}>
                <i class="fas fa-pencil-alt"></i>
                &nbsp;&nbsp; Submit a Request
              </button>
            </Link>
            {/* </li> */}
            {/* </ul> */}
          </div>
        </div>
        <br />
        <div className={'d-flex justify-content-center  ' + styles.desktop}>
          <div className={'col-md-6  justify-content-center ' + styles.desktop}>
            <br />

            <div className="pb-3">
              <br />
              {listOfLinks()}
            </div>
          </div>
        </div>

        <div class={'' + styles.mobile}>
          <div className="flex-column justify-content-center ">
            <br />
            {/* <h2>Your Meal Requests</h2> */}
            {/* <div className="col-md-5 p-3  alert alert-warning flex-column align-items-center rounded"> */}
            <div className="pb-3">
              <br />
              {listOfLinks()}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default withUser(User);
