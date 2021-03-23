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
import Link from 'next/link';


const Update = ({ oldLink, token, user, _id }) => {


  // state
  // console.log('old link data from user[id]', oldLink);
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
      process.browser && 
      window.location.reload();
      
      isAuth() && isAuth().role === 'admin'
        ? Router.push('admin')
        : isAuth() && isAuth().role === 'subscriber'
        ? Router.push('user')
        : Router.push('/login');
    } catch (error) {
      console.log('ERROR LINK CATEGORY', error);
    }
  };

  

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
        <div className="p-4"></div>
        <>
        {/* {console.log('links', l)} */}
        {

       
          <div className={' p-4 alert alert-warning ' + styles.receipt}>
            <h4>
              {oldLink.orderStatus && (
                <b className="text-danger ">
                  <h2>
                    * PICKED UP *
                    <br />
                    on {moment(oldLink.updatedAt).format('MMM Do')}
                  </h2>
                  <hr />
                </b>
              )}
            </h4>

            {oldLink.mealRequest.filter(
              (l) =>
                oldLink.meal == 'Standard' ||
                oldLink.meal == 'Vegetarian' ||
                oldLink.meal == 'Gluten Free' ||
                oldLink.meal == 'Vegan' ||
                oldLink.pickupOption === 'Lunch Onsite / Breakfast Pickup'
            ).length != 0 && (
              <React.Fragment>
                <h4 className="pt-2 ">
                  PICKUP DATE
                  <br />
                  <b>{moment(oldLink.pickupDate).format('MMMM Do')}</b>
                </h4>
                Between <b className="pb-2 ">{oldLink.pickupTime} </b>
              </React.Fragment>
            )}
            <hr className={styles.hr} />
            <h3>
              {oldLink.mealRequest.filter(
                (l) =>
                oldLink.meal == 'Standard' ||
                oldLink.meal == 'Vegetarian' ||
                oldLink.meal == 'Gluten Free' ||
                oldLink.meal == 'Vegan' ||
                oldLink.pickupOption === 'Lunch Onsite / Breakfast Pickup'
              ).length != 0 ? (
                <b className="d-flex justify-content-center">{oldLink.pickupCode} </b>
              ) : (
                <b>
                  Onsite School Lunch for week of{' '}
                  {moment(oldLink.pickupDate).add(3, 'day').format('MMMM Do')}
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
                  {oldLink.mealRequest
                    .filter((l) => oldLink.meal !== 'None')
                    .map((k, i) => (
                      <>
                        <h5 className="">
                          <b>
                            {k.student === undefined
                              ? 'user deleted'
                              : oldLink.postedBy.students.filter((student) =>
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
                                  {moment(oldLink.pickupDate)
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
                                  {moment(oldLink.pickupDate)
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
                {moment(oldLink.createdAt).format('M/d/yy')} by{' '}
                {oldLink.postedBy == null ? 'user deleted' : oldLink.postedBy.name}{' '}
              </span>
            </div>

            <div className=" pb-3 pt-3">
              { (
                <Link href={`/user/link/${oldLink._id}`}>
                  <button className="btn btn-sm btn-outline-dark text float-left">
                    <i class="far fa-edit"></i> &nbsp;Edit
                  </button>
                </Link>
              )}
              <Link href="">
                <button
                  onClick={(e) => confirmDelete(e, oldLink._id)}
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
