import React, { useState, useEffect } from 'react';
import styles from '../styles/Pages.module.css';
import Link from 'next/link';
import Layout from '../components/Layout';
// import { isAuth } from '../helpers/auth';
import Router from 'next/router';

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    localStorage.getItem('no-students') && Router.push('/user/profile/add');
  });
  useEffect(() => {
    // window.addEventListener('load', (event) => {
    //   setLoaded(true)
    //   console.log('loaded')
    // });
    // window.onload = (event) => {
    //   setLoaded(true)
    //   console.log('page is fully loaded');
    // };
    setTimeout(() => {
      setLoaded(true);
    }, 800);
  }, []);

  // useEffect(() => {
  //   isAuth() &&
  //   user.students.length === 0 && Router.push('/user/profile/add');
  // }, []);

  function printData() {
    let divToPrint = document.getElementById('printCode');
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
      alert('Turn off your pop-up blocker to print code');
    newWin.document.close();
    newWin.print();
    setTimeout(() => {
      newWin.close();
    }, 100);
  }
  return (
    <React.Fragment>
      <Layout>
        <>
          {loaded ? (
            <div className={styles.body}>
              <div className={styles.section}>
                <div className="pt-4 pb-">
                  <h2 className={styles.h4} style={{ fontSize: '50px' }}>
                    FAQ
                  </h2>
                  <div className={'pt-3 ' + styles.columnscontainer}>
                    <div className={styles.bodyregular}>
                      <div>
                        <div
                          className={'alert-primary ' + styles.subcard2}
                          style={{ fontSize: '18px' }}
                        >
                          <b>
                            We are required by federal rule to ensure that these
                            meals are only provided to children age 18 and under
                            and that only one set of meals is provided per child
                            per day.
                          </b>
                        </div>
                        <br />
                        <br />
                        <div
                          className="text-danger p-4"
                          style={{ fontSize: '20px' }}
                        >
                          <b>
                            Please submit a meal request for EACH week that you
                            desire meals for your child. Meal requests do not
                            automatically roll over from week to week.
                          </b>
                        </div>
                        <br />
                        <br />
                        <b>Q: Why do I have to pre-order so far in advance?</b>
                        <br />
                        A: Our cafeterias receive deliveries once a week and
                        sometimes once every 2 weeks from our vendors. We want
                        to ensure that we have the supplies and ingredients we
                        need to prepare and package meals for every child who
                        needs them.
                        <br />
                        <br />
                        <b>Q: What is the cut-off time to order?</b>
                        <br />
                        A: The cut-off time is 11:59 pm on Mondays. For example,
                        if you are ordering meals for the week of May 10th, you
                        must submit a meal request before 11:59 pm on May 26th.
                        We will state the cut-off time on every menu we post.
                        <br />
                        <br />
                        <b>Q: How do I cancel a meal request?</b>
                        <br />
                        A: To cancel a meal request, please go to your Receipts
                        page and click the red Cancel button. Please carefully
                        consider if you are able to commit to picking up the
                        meals before submitting a request. We cannot get
                        reimbursed for the cost and time to produce meals if the
                        meals do not get picked up. Similarly, our staff
                        prepares onsite lunches for each child listed on the
                        lunch roster each day. Please remind your child if you
                        have requested meals for them.
                        <br />
                        <br />
                        <b>
                          Q: Is it possible to request meals for the rest of the
                          school year?
                        </b>
                        <br />
                        A: Yes, you can now pre-order for the rest of the school
                        year. Please go to the Weekly Menu page and review all
                        the menus that we have already posted. Click on the
                        yellow Meal Request button at the bottom of each week’s
                        menu to submit your request for that week.
                        <br />
                        <br />
                        <b>Q: How do I reheat the frozen meals?</b>
                        <br />
                        A: On your Receipts page, click on the Reheating
                        Instructions button toward the bottom of your receipt
                        for curbside pickup meals. You will be taken to a shared
                        Google Drive folder to access reheating instructions for
                        each week.
                        <br />
                        <br />
                        <b>
                          Q: Where do I go to pick up meals for Curbside Pickup?
                        </b>
                        <br />
                        A: Curbside pickup is at Brookside Elementary on
                        Fridays. Please be sure to display your pickup code on
                        your dashboard. When you get to the front of the line,
                        please pop or unlock your trunk so our staff can load
                        the bags into your car.
                        <br />
                        <br />
                        <b>
                          Q: I’ve requested onsite lunches for my child. Where
                          do they go to pick up their meals?
                        </b>
                        <br />
                        A: Please see below for pickup instructions at each
                        school:
                        <br />
                        <br />
                        <ul>
                          <i class="fas fa-feather-alt"></i> &nbsp;&nbsp;
                          <b>

                          BES |
                          OHES | ROES: &nbsp;
                          </b>
                          Meals will be brought to the lunch table
                          designated for your child’s class and distributed
                          directly.
                          <br />
                          <br />
                          <i class="fas fa-feather-alt"></i> &nbsp;&nbsp;
                          <b>

                          MCMS:&nbsp;
                          </b>
                          There will be TWO pick-up locations. Your child will
                          pick up their lunch at the location based on the first
                          letter of their LAST name. Your child gives
                          their name to the staff member. The staff member will
                          check off your child's name on the lunch roster and
                          hand your child their lunch.
                          <br />
                          <ul>
                            <li>A to K : Snack bar window</li>
                            <li>L to Z : Double door entry to the cafeteria</li>
                          </ul>
                          <br />
                          <i class="fas fa-feather-alt"></i> &nbsp;&nbsp;
                          <b>

                          OPHS:&nbsp; 
                          </b>
                          There will
                          be TWO tables set up outside the cafeteria. One table
                          will service students whose LAST name begins with A to
                          K; and the other L to Z. Your child will display their
                          student ID card to the staff member. The staff member
                          will check off your child's name on the lunch roster
                          and hand your child their lunch.
                          <br />
                          <br />
                          <i class="fas fa-feather-alt"></i> &nbsp;&nbsp;
                          <b>

                          OVHS:&nbsp;
                          </b>
                          Students
                          retrieve meals at the administrative office at OVHS.
                        </ul>
                        <br />
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
                <p className={'pb-4 ' + styles.bodyregular}>
                  {/* Request school meals for each student at least 2 weeks in advance. */}
                </p>
              </div>
            </div>
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
                className={'d-flex justify-content-center  ' + styles.desktop}
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
        </>
      </Layout>
      {loaded && (
        <div className={styles.footer}>
          <div
            className={
              'pt-4 d-flex justify-content-center ' + styles.sectioncontainer
            }
          >
            <div className={'text-white col-md-9 ' + styles.bodyregular}>
              <div className="p-2"></div>
              <ul style={{ fontSize: '14px' }} className={styles.lists}>
                <li>
                  <Link href="https://www.oakparkusd.org/Page/10593">
                    <a className="text-white  " target="_blank">
                      Program Info
                    </a>
                  </Link>
                </li>
                <li>
                  <div className="float-right ">
                    <Link href="https://www.oakparkusd.org/Page/1">
                      <a className="text-white  " target="_blank">
                        <img
                          src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/OPUSD+White+Lettering+(2).png"
                          loading="lazy"
                          alt=""
                          width="100"
                        />
                      </a>
                    </Link>
                  </div>
                </li>
                <li>
                  <Link href="https://www.oakparkusd.org/Page/6499">
                    <a className="text-white  " target="_blank">
                      Who is Eligible
                    </a>
                  </Link>
                </li>
                <li>
                  <a
                    className="text-white  "
                    id="mailto"
                    href="mailto:schoolmeals@opusd.org"
                    target="_blank"
                  >
                    Contact
                  </a>
                </li>
                {/* <li>
                  <Link href="https://www.oakparkusd.org/Page/1">
                    <a className="text-white  " target="_blank">
                      OPUSD
                    </a>
                  </Link>
                </li> */}
                <li>
                  <Link href="https://www.oakparkusd.org/Page/1">
                    <a className="text-white  " target="_blank">
                      FAQ
                    </a>
                  </Link>
                </li>

                {/* <li>
                  <Link href="https://www.oakparkusd.org/Page/10809">
                    <a className='text-white  ' target="_blank">Help</a>
                  </Link>
                </li> */}
                {/* <li>FAQ</li> */}
                {/* <div className="d-flex align-items-center p-3">

                Address 5801 Conifer Street, Oak Park, CA 91377 | Phone (818)
                735-3200 | Fax (818) 879-0372
                </div> */}
              </ul>
              <hr />
              <div className="p-1"></div>
              <div
                className="d-flex row justify-content-center"
                style={{ fontSize: '17px' }}
              >
                This institution is an equal opportunity provider
              </div>
              <div className="p-1"></div>
              <div
                className="d-flex row justify-content-center"
                style={{ fontSize: '10px' }}
              >
                Copyright 2021
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Home;
