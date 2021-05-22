import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Pages.module.css';
import Link from 'next/link';
import LayoutLogin from '../components/LayoutLogin';
import moment from 'moment'
// import { isAuth } from '../helpers/auth';
import Router from 'next/router';

const Home = () => {
  const [loaded, setLoaded] = useState(true);
  useEffect(() => {
    localStorage.getItem('no-students') && Router.push('/user/profile/add');
  });

  const [timeOfDay] = useState(() => new Date().getHours() > 6 && new Date().getHours() < 19) 
  

  // TODO: refactor. It works but is messy.
  // This loads a hidden image and when it's done loading we display the actual page instead of the fake loading screen
  // const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  // const imageLoaded = () => setFirstImageLoaded(true);

  // const firstImage = useCallback((firstImageNode) => {
  //   firstImageNode && firstImageNode.addEventListener('load', imageLoaded());
  //   return () => firstImageNode.removeEventListener('load', imageLoaded());
  // }, []);

  // useEffect(() => {
  //   firstImageLoaded === false && setLoaded(false)
  //   return () => {
  //       setLoaded(true);
  //   };
  // }, [firstImageLoaded]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const firstImageCurrent = firstImage.current;
  //     firstImageCurrent &&
  //       firstImageCurrent.addEventListener('load', imageLoaded);
  //     return () => firstImageCurrent.removeEventListener('load', imageLoaded);
  //   }, 200);
  // }, []);

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

  // let desktop = true
  return (
    <React.Fragment>
      <LayoutLogin>
        <>
          {loaded ? (
            <>
              <div
                className={ 
                  timeOfDay
                  ? `${styles.skewedBg}`
                  : `${styles.skewedBgNight} `
                }
              >
                <div className={`${styles.desktop} ${styles.heroContent} `}>
                  <div class="container">
                    <div class={`${styles.hero} jumbotron`}>
                      <h1 className={` ${styles.font} display-2 pb-3`}>
                        Weekly
                        <span className={`${styles.fontTwo}`}>
                          &nbsp;OPUSD&nbsp;
                        </span>
                        Meals Request
                      </h1>

                      {/* <h1
                        className={`${styles.mobile} ${styles.fontMobile} pt-5 pb-5`}
                      >
                        Weekly
                        <span className={`${styles.fontTwo}`}>
                          &nbsp;OPUSD&nbsp;
                        </span>
                        <br />
                        Meals Request
                      </h1> */}

                      {
                        <div className={styles.desktop}>
                          <hr />
                          <hr />
                          <div>
                          <div className='float-left' >Est. 1822</div>
                            OAK PARK, CA - {moment(new Date).format('dddd MMMM DD, YYYY').toLocaleUpperCase()} - SEVEN
                            PAGES
                            <div className='float-right' >PRICE 5C</div>
                          </div>
                          <hr />
                          <hr />
                        </div>
                      }
                      <div className={`pt-4 d-flex flex-row  container`}>
                        <p className={`col text-left mx-2`}>
                          <h4 class="text-secondary pb-2 text-center">
                            Who We Are
                          </h4>
                          The Oak Park School Meals Programs are aimed at
                          providing the students of our district the best
                          nutrition options in the country. We are dedicated to
                          the mission 'Nutrition should never come second' and
                          we push the boundaries in school nutrition leading the
                          way in quality meals servicing our students.
                        </p>
                        {/* <hr style={`width: 1px`}></hr> */}
                        <p className={`col text-left mx-2`}>
                          <h4 class="text-secondary pb-2 text-center">
                            Onsite and Offsite Meals
                          </h4>
                          In these trying times, we've met the challenges by
                          providing meals both offsite during the stay at home
                          orders and onsite as schools begin to reopen. We put
                          forth the same quality we have for years during
                          distance learning by maintaing our commitment to
                          highly nutritious meals.
                          {/* Our kitchens are supplied with high quality ingrediants 
                          every day and, there for, our meals are filled with
                          nutritional value. We prepare our food daily (no packaged foods) 
                          fulfilling our mission statement 'Food prepared daily'. */}
                        </p>
                        <p className={`col text-left mx-2`}>
                          <h4 class="text-secondary pb-2 text-center">
                            Why We Do It
                          </h4>
                          The Country is in a health crisis. Measures have been
                          put in place to handle the issues we face across our
                          country and the state of California, but we here at
                          the Oak Park School District want to take a lead and
                          show our peers what can be done with a solid mission
                          statement aiming to make every meal a delightful
                          nutritious meal.
                        </p>
                      </div>
                      <p className="pt-3">
                        <Link href="/faq">
                          <a
                            className={`float-left btn ${styles.button}  btn-lg`}
                            role="button"
                          >
                            Learn More &raquo;
                          </a>
                        </Link>
                        <Link href="/register">
                          <a
                            className={`float-left btn ${
                              styles.buttonSecondary
                            } mx-4 btn-lg`}
                            href="#"
                            role="button"
                          >
                            Register Now
                          </a>
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${styles.heroContent} ${styles.mobile}`}>
                  <div class={``}>
                    <div class="container">

                      <h1
                        className={`${styles.mobile} ${styles.fontMobile} pt-5 pb-5`}
                      >
                        Weekly
                        <span className={`${styles.fontTwo}`}>
                          &nbsp;OPUSD&nbsp;
                        </span>
                        <br />
                        Meals Request
                      </h1>

                      {/* {
                        <div className={styles.desktop}>
                          <hr />
                          <div>
                            OAK PARK, CA - THURSDAY AUGUST 30, 1978 - SEVEN
                            PAGES
                          </div>
                          <hr />
                        </div>
                      } */}
                      <div className={`pt-4 d-flex flex-column  container`}>
                        <p className={`text-left pb-4`}>
                          <h4 class="text-white pb-2 text-center">
                            Who We Are
                          </h4>
                          The Oak Park School Meals Programs are aimed at
                          providing the students of our district the best
                          nutrition options in the country. We are dedicated to
                          the mission 'Nutrition should never come second' and
                          we push the boundaries in school nutrition leading the
                          way in quality meals servicing our students.
                        </p>
                        {/* <hr style={`width: 1px`}></hr> */}
                        <p className={`text-left pb-4`}>
                          <h4 class="text-white pb-2 text-center">
                            Onsite and Offsite Meals
                          </h4>
                          In these trying times, we've met the challenges by
                          providing meals both offsite during the stay at home
                          orders and onsite as schools begin to reopen. We put
                          forth the same quality we have for years during
                          distance learning by maintaing our commitment to
                          highly nutritious meals.
                          {/* Our kitchens are supplied with high quality ingrediants 
                          every day and, there for, our meals are filled with
                          nutritional value. We prepare our food daily (no packaged foods) 
                          fulfilling our mission statement 'Food prepared daily'. */}
                        </p>
                        <p className={`text-left mx-`}>
                          <h4 class="text-white pb-2 text-center">
                            Why We Do It
                          </h4>
                          The Country is in a health crisis. Measures have been
                          put in place to handle the issues we face across our
                          country and the state of California, but we here at
                          the Oak Park School District want to take a lead and
                          show our peers what can be done with a solid mission
                          statement aiming to make every meal a delightful
                          nutritious meal.
                        </p>
                      </div>
                      <p className="pt-3">
                        <div className="p-4"></div>
                        <Link href="/faq">
                          <a
                            className={`float-left btn ${styles.button}  btn-lg`}
                            role="button"
                          >
                            Learn More &raquo;
                          </a>
                        </Link>
                        <Link href="/register">
                          <a
                            className={`float-left btn ${styles.buttonSecondary} float-right btn-lg`}
                            href="#"
                            role="button"
                          >
                            Register Now
                          </a>
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.body}  `}>
                <div className={styles.section}>
                  <div className="pt-5 pb-5">
                    <div className={' ' + styles.columnscontainer}>
                      <div className="p-4"></div>
                      <div className={`${styles.desktop} `}>
                        <div
                          style={{ fontSize: '40px' }}
                          className={`d-flex justify-content-center ${styles.bodyregular} `}
                        >
                          Here's How It Works!
                        </div>
                      </div>
                      <h2 className={`pb-3 ${styles.mobile}`}>
                        Here's How It Works!
                      </h2>
                    </div>
                    <div className="p-4"></div>
                  </div>
                  <p className={'pb-4 ' + styles.bodyregular}>
                    {/* Request school meals for each student at least 2 weeks in advance. */}
                  </p>
                </div>
                
                <div className={`${styles.sectioncolumns}`}>
                  
                  <div className={' ' + styles.columnscontainer}>
                    <img
                      // ref={firstImage}
                      src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step1.png"
                      loading="lazy"
                      alt=""
                      class="stepimage"
                      width="320"
                    />

                    <div className={`pt-4 ${styles.bodyregular}`}>
                      <span>
                        <b>Start a Meal Request</b>
                      </span>
                    </div>
                    <div className={'pb-5 col-md-10 ' + styles.bodyregular}>
                      Look over the &nbsp;
                      <span>
                        {
                          <Link href="/menus">
                            <a
                              className="text-"
                              style={{
                                textDecorater: 'none',
                                color: '#419ca8',
                              }}
                            >
                              <i class="fas fa-columns"></i>
                              <span>&nbsp;&nbsp;</span>
                              <b>weekly menu</b>
                            </a>
                          </Link>
                        }
                      </span>
                      <span>
                        , then start a request with one of the{' '}
                        <b>
                          yellow <i>Meal Request</i> buttons
                        </b>{' '}
                        found throughout the site.
                      </span>
                    </div>
                  </div>

                  <div className={styles.columnscontainer}>
                    <img
                      src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step2.png"
                      loading="lazy"
                      alt=""
                      class="stepimage"
                      width="340"
                    />

                    <div className={'pt-4 ' + styles.bodyregular}>
                      <b> Make Your Selections</b>
                    </div>
                    {/* <span> */}
                      <p className={'pb-5 col-md-10 ' + styles.bodyregular}>
                        Select the school week, make your{' '}
                        <b>student's meal selections</b> for that week, select a
                        pickup time, and submit your request.
                        <br />
                        <br />
                        {/* You can edit your student's cohort and allery group for differnt meal options in  <b>update profile</b>.  */}
                      </p>
                    {/* </span> */}
                  </div>

                  <div className={styles.columnscontainer}>
                    <img
                      src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step3a.png"
                      loading="lazy"
                      loading="lazy"
                      alt=""
                      class="stepimage"
                      width="340"
                    />
                    <span>
                      <div className={'pt-4 ' + styles.bodyregular}>
                        <b>For Onsite Requests</b>
                      </div>
                    </span>
                    {/* <span> */}
                      <p className={'pb-2 col-md-10 ' + styles.bodyregular}>
                        You're all done! Your hybrid student is now on the lunch
                        roster for the <b>week found on your receipt</b>
                        .
                        <br />
                        <br />
                      </p>
                    {/* </span> */}
                  </div>
                  <div className={styles.columnscontainer}>
                    <img
                      src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step3b.png"
                      loading="lazy"
                      loading="lazy"
                      alt=""
                      class="stepimage"
                      width="340"
                    />
                    <span>
                      <div className={'pt-4 ' + styles.bodyregular}>
                        <b>For Curbside Requests</b>
                      </div>
                    </span>
                    {/* <span> */}
                      <p className={'pb-5 col-md-10 ' + styles.bodyregular}>
                        Simply <b>print out your code</b> and drive to the{' '}
                        <b>pickup location</b> on the date and time found on
                        your receipt.
                      </p>
                    {/* </span> */}
                  </div>
                  <span>
                    {/* <p className={'pb-2 ' + styles.bodyregular}> */}
                    <h1 className={'pb-3 ' + styles.h4}> Display Code</h1>
                    {/* </p> */}
                  </span>

                  <div className={'pt-4 alert-warning ' + styles.sectionair}>
                    <div className={styles.sectioncolumns}>
                      <h3 className={'p-3 ' + styles.h4}>On Your Dashboard</h3>
                      {/* <hr className={styles.hr} /> */}
                      <span>
                        <b>Click Example:</b>
                      </span>
                      <span>
                        <h1 id="printCode" className="code" onClick={printData}>
                          <div className="h6 text-center invisible">
                            example only
                          </div>
                          Gf-NESS-03
                          {/* <div className="h6 text-center invisible">example only</div> */}
                          <div className="p-2"></div>
                        </h1>
                      </span>
                      {/* <hr className={styles.hr} /> */}
                      <span>
                        <div className={'p-4 ' + styles.bodyregular}>
                          Print (or write out) your{' '}
                          <b>code found on your receipt</b> and display it on
                          your dashboard.
                        </div>
                      </span>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark text float-left print"
                        onClick={printData}
                      >
                        <span>
                          <i class="fas fa-print"></i>
                        </span>
                        <span>&nbsp;Print Code</span>
                      </button>
                    </div>
                  </div>
                          <div className="p-3"></div>
                  <div className={'pt-5 ' + styles.bodyregular}>
                  <h1 className={'pb-5 display-3 ' + styles.h4}>That's it!</h1>
                  </div>
                  {/* <span> */}
                        <h2>Lastly, </h2>
                    <p className={'pb-5 col-md-9 ' + styles.bodyregular}>
                      Please don't forget to thank our hardworking staff
                      as they work diligently to feed our students every week.
                    </p>
                  {/* </span> */}
                </div>
              </div>
            </>
          ) : (
            <>
            <div
                className={ 
                  timeOfDay
                  ? `${styles.skewedBg}`
                  : `${styles.skewedBgNight} `
                }
              >
                <div className={`${styles.desktop} ${styles.heroContent} `}>
                  <div class="container">
                  <div class={`${styles.hero} jumbotron`}>
              <img
              
                hidden
                src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step1.png"
                // loading="lazy"
                alt=""
                class="stepimage"
                width="320"
              />
              <img
              
                hidden
                src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step2.png"
                // loading="lazy"
                alt=""
                class="stepimage"
                width="320"
              />
              <img
              
                hidden
                src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step3b.png"
                // loading="lazy"
                alt=""
                class="stepimage"
                width="320"
              />
              <img
                ref={firstImage}
                hidden
                src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step3a.png"
                // loading="lazy"
                // alt=""
                // class="stepimage"
                // width="320"
              />
              <div className="container">
                
                <div className={'d-flex justify-content-center  '}>
                  {/* <div className="p-5"></div> */}
                  <div className="col">
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
                  <div className="col">
                    <div className={'p-5 ' + styles.animatedBg}>&nbsp;</div>
                    <div className="p-2"></div>
                    &nbsp;
                    <div className={styles.animatedBg}>&nbsp;</div>
                    <div className={styles.animatedBg}>&nbsp;</div>
                    <div className={styles.animatedBg}>&nbsp;</div>
                  </div>
                </div>
              </div>
              </div>
              </div>
              </div>
              </div>
              
            <div
                className={ 
                  timeOfDay
                  ? `${styles.mobile}  ${styles.skewedBg}`
                  : `${styles.mobile}  ${styles.skewedBgNight} `
                }
              >
                <div className={`${styles.mobile} ${styles.heroContent} `}>
                  <div class="container">
                  {/* <div class={`${styles.hero} jumbotron`}> */}
              <div className="container">
                
                <div className={'d-flex justify-content-center  '}>
                  {/* <div className="p-5"></div> */}
                  <div className="col">
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
                  <div className="col">
                    <div className={'p-5 ' + styles.animatedBg}>&nbsp;</div>
                    <div className="p-2"></div>
                    &nbsp;
                    <div className={styles.animatedBg}>&nbsp;</div>
                    <div className={styles.animatedBg}>&nbsp;</div>
                    <div className={styles.animatedBg}>&nbsp;</div>
                  </div>
                </div>
              </div>
              </div>
              </div>
              {/* </div> */}
              </div>
            </>
          )}
        </>
      </LayoutLogin>

      {loaded && (
        <div className={styles.footer}>
          <div
            className={
              'pt-4 d-flex justify-content-center ' + styles.sectioncontainer
            }
          >
            <div className={'text-white col-md-9 ' + styles.bodyregular}>
              <div className="p-3"></div>
              <ul style={{ fontSize: '14px' }} className={styles.lists}>
                <li>

              <h5>Business Links</h5>
              <div className="p-2"></div>
                </li>
                <li>
                  <Link href="https://www.oakparkusd.org/Page/10593">
                    <a className="text-white  " target="_blank">
                      Program Info <i class="fas fa-external-link-alt"></i>
                    </a>
                  </Link>
                </li>
                <li className="my-2">
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
                <li className="my-2">
                  <Link href="https://www.oakparkusd.org/Page/6499">
                    <a className="text-white  " target="_blank">
                      Who is Eligible <i class="fas fa-external-link-alt"></i>
                    </a>
                  </Link>
                </li>
                <li className="my-2">
                  <a
                    className="text-white  "
                    id="mailto"
                    href="mailto:schoolmeals@opusd.org"
                    target="_blank"
                  >
                    Contact <i class="fas fa-external-link-alt"></i>
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
                  <Link href="/faq">
                    <a className="text-white  ">FAQ</a>
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
