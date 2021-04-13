import styles from '../../styles/Home.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../../config';
import withUser from '../withUser';
import Link from 'next/link';
import moment from 'moment';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { isAuth } from '../../helpers/auth';

const User = ({ user, token, l, userLinks }) => {
  const [loaded, setLoaded] = useState(false);
  console.log('userLinks', userLinks);
  console.log(
    'userLinks',
    userLinks.sort(
      (a, b) => Date.parse(b.pickupDate) - Date.parse(a.pickupDate)
    )
  );

  // const orderByDateUserLinks = userLinks.filter

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 800);
  }, []);

  const confirmDelete = (e, id) => {
    e.preventDefault();
    let answer = window.confirm(
      'ATENTION! Please cancel at least a week in advance of pickup date if possible.'
    );
    if (answer) {
      window.confirm('Request is cancelled. No further action required.');
      handleDelete(id);
    }
  };

  function printData(e) {
    let id = e.target.getAttribute('data-index');
    let divToPrint = document.getElementById(id);
    let css =
        'body { display: flex; flex-direction: column; align-items: center; justify-content: center;  } @page { size: landscape } .code { font-size: 10rem;}',
      head = document.createElement('head'),
      style = document.createElement('style');
    

    // style.type = 'text/css';
    // style.media = 'print';

    style.appendChild(document.createTextNode(css));
    head.appendChild(style);

    let newWin = window.open('');
    newWin.document.write(head.outerHTML, divToPrint.outerHTML);
    if (newWin == null || typeof newWin == 'undefined')
      alert(
        'Turn off your pop-up blocker to print code'
      );
    newWin.document.close();
    newWin.print();
    setTimeout(() => {
      newWin.close();
    }, 100);
    // }, 300);
  }

  useEffect(() => {
    !isAuth() && Router.push('/');
    user.students.length === 0 && Router.push('/user/profile/add');
  }, []);

  const handleDelete = async (id) => {
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

  const listOfLinks = () =>
    userLinks
      .sort((a, b) => Date.parse(a.pickupDate) - Date.parse(b.pickupDate))
      .map((l, i) => (
        <>
          {
            <Link href={`/user/receipt/${l._id}`}>
              <a style={{ textDecoration: 'none' }}>
                <div
                  key={i}
                  className={
                    l.orderStatus === true ||
                    moment(l.pickupDate).format('MDD').toString() <
                      moment(new Date()).format('MDD').toString()
                      ? 'p-4 alert  alert-secondary ' + styles.subcard // active order
                      : 'p-4 alert  alert-warning ' + styles.subcard // completed order
                  }
                >
                  {/* {console.log(
              'date comparison',
              moment(l.pickupDate).format('MDD').toString() <
                moment(new Date()).format('MDD').toString()
            )} */}
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
                    {moment(l.pickupDate).format('MDD').toString() <
                      moment(new Date()).format('MDD').toString() && (
                      <b className="text-danger ">
                        <h2>
                          * EXPIRED *
                          <br />
                          {/* on {moment(l.updatedAt).format('MMM Do')} */}
                        </h2>
                        <hr />
                      </b>
                    )}
                  </h4>

                  {l.mealRequest.filter(
                    (l) =>
                      l.meal == 'Standard' ||
                      l.meal == 'Vegetarian' ||
                      l.meal == 'Gluten Free' ||
                      l.meal == 'Vegan' ||
                      l.meal == 'Standard Dairy Free' ||
                      l.meal == 'GlutenFree Dairy Free' ||
                      l.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
                      l.pickupOption === 'Lunch Only' ||
                      l.pickupOption === 'Breakfast and Lunch'
                  ).length != 0 && (
                    <React.Fragment>
                      {/* <h4 className="pt-2 ">
                      CURBSIDE PICKUP
                      <br />
                      ON: {' '}
                      <b>
                        {moment(l.pickupDate)
                          .subtract(3, 'day')
                          .format('MMMM Do')}
                      </b>
                    </h4>
                    Between <b className="pb-2 ">{l.pickupTime} </b> */}
                      <h3 className="pt-2 d-flex justify-content-center ">
                        CURBSIDE PICKUP
                      </h3>
                      <h4>
                        <div className="d-flex justify-content-center">
                          {/* {'On '} */}
                          <b>
                            {'On ' +
                              moment(l.pickupDate)
                                .subtract(3, 'day')
                                .format('MMMM Do')}
                          </b>
                        </div>
                      </h4>
                      <span className="d-flex justify-content-center ">
                        <b className="pb-2 ">{'Between ' + l.pickupTime} </b>
                      </span>
                    </React.Fragment>
                  )}
                  <hr className={styles.hr} />

                  <h3>
                    {l.mealRequest.filter(
                      (l) =>
                        l.meal == 'Standard' ||
                        l.meal == 'Vegetarian' ||
                        l.meal == 'GlutenFree' ||
                        l.meal == 'Vegan' ||
                        l.meal == 'Standard DF' ||
                        l.meal == 'GlutenFree DF' ||
                        l.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
                        l.pickupOption === 'Lunch Only' ||
                        l.pickupOption === 'Breakfast and Lunch'
                    ).length != 0 ? (
                      <b
                        id={`${i}+printCode`}
                        data-index={`${i}+printCode`}
                        onClick={
                          l.orderStatus === false &&
                          moment(l.pickupDate).format('MDD').toString() >
                            moment(new Date()).format('MDD').toString()
                            ? (e) => printData(e)
                            : null
                        }
                        className="code d-flex justify-content-center"
                      >
                        {l.pickupCode}{' '}
                      </b>
                    ) : (
                      <b>
                        Onsite School Lunch for Week of{' '}
                        {moment(l.pickupDate).format('MMMM Do')}
                        {/* {moment(l.pickupDate).add(3, 'day').format('MMMM Do')} */}
                      </b>
                    )}
                  </h3>

                  <hr className={styles.hr} />
                  {l.mealRequest.filter(
                    (l) =>
                      l.meal == 'Standard' ||
                      l.meal == 'Vegetarian' ||
                      l.meal == 'GlutenFree' ||
                      l.meal == 'Vegan' ||
                      l.meal == 'Standard DF' ||
                      l.meal == 'GlutenFree DF' ||
                      l.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
                      l.pickupOption === 'Lunch Only' ||
                      l.pickupOption === 'Breakfast and Lunch'
                  ).length != 0 && (
                    <h6>
                      Pickup is at <b className="text">Brookside Elementary</b>.
                      Display the above code{' '}
                      <b className="text-danger">on your dashboard </b>or show
                      from your phone.
                    </h6>
                  )}
                  <p></p>
                  {/* fix something here */}
                  <div className="">
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
                                            // .add(3, 'day')
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
                                            // .add(3, 'day')
                                            .format('MMMM Do')}
                                          *
                                        </div>
                                      </div>
                                    </>
                                  )
                                ) : (
                                  <>
                                    <div className="p-1">
                                      Curbside: {k.meal}{' '}
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
                      {
                        // l.postedBy.students[i] === undefined ? null :
                        l.orderStatus === false &&
                          moment(l.pickupDate).format('MDD').toString() >
                            moment(new Date())
                              .add(2, 'day')
                              .format('MDD')
                              .toString() && (
                            <Link href={`/user/link/${l._id}`}>
                              <button className="btn btn-sm btn-outline-dark text float-left">
                                <i class="far fa-edit"></i> &nbsp;Edit
                              </button>
                            </Link>
                          )
                      }
                      <span>&nbsp;&nbsp;</span>
                      {
                        // l.postedBy.students[i] === undefined ? null :
                        l.orderStatus === false &&
                          l.mealRequest.filter(
                            (l) =>
                              l.meal == 'Standard' ||
                              l.meal == 'Vegetarian' ||
                              l.meal == 'GlutenFree' ||
                              l.meal == 'Vegan' ||
                              l.meal == 'Standard DF' ||
                              l.meal == 'GlutenFree DF' ||
                              l.pickupOption ===
                                'Lunch Onsite / Breakfast Pickup' ||
                              l.pickupOption === 'Lunch Only' ||
                              l.pickupOption === 'Breakfast and Lunch'
                          ).length != 0 &&
                          moment(l.pickupDate).format('MDD').toString() >
                            moment(new Date()).format('MDD').toString() && (
                            <a>
                              <button
                                type="button"
                                // ref={printEl}
                                className="btn btn-sm btn-outline-dark text  print"
                                data-index={`${i}+printCode`}
                                onClick={(e) => printData(e)}
                              >
                                <i class="fas fa-print"></i>
                                &nbsp;Print Code
                              </button>
                            </a>
                          )
                      }
                      {l.orderStatus === false &&
                        moment(l.pickupDate).format('MDD').toString() >
                          moment(new Date()).format('MDD').toString() && (
                          <Link href="">
                            <button
                              onClick={(e) => confirmDelete(e, l._id)}
                              className="text-white btn btn-sm btn-danger float-right"
                            >
                              Cancel
                            </button>
                          </Link>
                        )}
                      <div className="pb-4"></div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          }
        </>
      ));

  return (
    <div>
      <Layout>
        <div>
          <h2 className=" pt-3">{user.name}'s Meal Requests </h2>
          <hr />
          <div className="p-1">
            <div className="">
              <Link href="/user/profile/update">
              <button className={'btn btn-outline-secondary ' }>
              <i class="fas fa-user-alt"></i>
                  &nbsp;&nbsp; Profile Update
                </button>
                {/* <a className="nav-item">Profile Update</a> */}
              </Link>

              <Link href="/user/link/create">
                <button className={'btn float-right ' + styles.button}>
                  <i class="fas fa-pencil-alt"></i>
                  &nbsp;&nbsp; Request
                </button>
              </Link>
            </div>
          </div>
          <br />

          <div className={'d-flex justify-content-center  ' + styles.desktop}>
            <div
              className={'col-md-5  justify-content-center ' + styles.desktop}
            >
              <br />

              <div className="pb-3">
                <br />
              </div>

              {loaded ? (
                listOfLinks()
              ) : (
                <>
                  <div className={'d-flex justify-content-center  '}>
                    <div className="col-md-12">
                      <div className="p-2"></div>
                      &nbsp;
                      <div className={' p-5 ' + styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                    </div>
                  </div>
                  <div className="p-4"></div>

                  <div
                    className={
                      'd-flex justify-content-center  ' + styles.desktop
                    }
                  >
                    <div className="col-md-12">
                      <div className={'p-5 ' + styles.animatedBg}>&nbsp;</div>
                      <div className="p-2"></div>
                      &nbsp;
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div class={'' + styles.mobile}>
          <div className="flex-column justify-content-center ">
            <br />
            <div className="pb-3">
              <br />
              {loaded ? (
                listOfLinks()
              ) : (
                <>
                  <div className={'d-flex justify-content-center  '}>
                    <div className="col-md-8">
                      <div className="p-2"></div>
                      &nbsp;
                      <div className={' p-5 ' + styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                    </div>
                  </div>
                  <div className="p-4"></div>

                  <div
                    className={
                      'd-flex justify-content-center  ' + styles.desktop
                    }
                  >
                    <div className="col-md-8">
                      <div className={'p-5 ' + styles.animatedBg}>&nbsp;</div>
                      <div className="p-2"></div>
                      &nbsp;
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                      <div className={styles.animatedBg}>&nbsp;</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default withUser(User);
