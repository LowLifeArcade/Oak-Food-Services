import React, { useState, useEffect } from 'react';
import styles from '../styles/Pages.module.css';
import Link from 'next/link';
import Layout from '../components/Layout';
// import { isAuth } from '../helpers/auth';
import Router from 'next/router';

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    localStorage.getItem('no-students') &&  Router.push('/user/profile/add');
  })
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
                  <h3 className={styles.h4}>Weekly OPUSD Meals Request</h3>
                  <div className={' ' + styles.columnscontainer}>
                    <div className={styles.bodyregular}>
                      Here's how it works
                    </div>
                  </div>
                </div>
                <p className={'pb-4 ' + styles.bodyregular}>
                  {/* Request school meals for each student at least 2 weeks in advance. */}
                </p>
              </div>

              <div className={styles.sectioncolumns}>
                <div className={' ' + styles.columnscontainer}>
                  <img
                    src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step1.png"
                    loading="lazy"
                    alt=""
                    class="stepimage"
                    width="300"
                  />

                  <div className={'pt-4 ' + styles.bodyregular}>
                    <b>Start a Meal Request</b>
                  </div>
                  <div className={'pb-5 ' + styles.bodyregular}>
                    Look over the &nbsp;{
                      <Link href='/menus'>
                      <a className='text-' style={{ textDecorater: 'none', color: '#419ca8' }}>
                      <i class="fas fa-columns"></i>
                      <span>&nbsp;&nbsp;</span>
                    <b>weekly menu</b>
                      </a>
                      </Link>
                    }, then start a request with one of the{' '}
                    <b>
                      yellow <i>Meal Request</i> buttons
                    </b>{' '}
                    found throughout the site.
                    {/* located either
                on your nav bar, the weekly menu, or your receipts page. */}
                  </div>
                </div>

                <div className={styles.columnscontainer}>
                  <img
                    src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step2.png"
                    loading="lazy"
                    alt=""
                    class="stepimage"
                    width="300"
                  />

                  <div className={'pt-4 ' + styles.bodyregular}>
                    <b> Make Your Selections</b>
                  </div>
                  <p className={styles.bodyregular}>
                    Select pickup date, make your{' '}
                    <b>student's meal selections</b> for the week, select a
                    pickup time, and submit your request.
                    <br />
                    <br />
                    {/* You can edit your student's cohort and allery group for differnt meal options in  <b>update profile</b>.  */}
                  </p>
                </div>

                <div className={styles.columnscontainer}>
                  <img
                    src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/step3a.png"
                    loading="lazy"
                    loading="lazy"
                    alt=""
                    class="stepimage"
                    width="300"
                  />

                  <div className={'pt-4 ' + styles.bodyregular}>
                    <b>For Onsite Requests</b>
                  </div>
                  <p className={'pb-2 ' + styles.bodyregular}>
                    You're all done! Your hybrid student is now on the lunch
                    roster for the <b>week found on your receipt</b>.
                    <br />
                    <br />
                  </p>
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

                  <div className={'pt-4 ' + styles.bodyregular}>
                    <b>For Curbside Requests</b>
                  </div>
                  <p className={'pb-5 ' + styles.bodyregular}>
                    Simply <b>print out your code</b> and drive to the{' '}
                    <b>pickup location</b> on the date and time found on your
                    receipt.
                  </p>
                </div>
                {/* <p className={'pb-2 ' + styles.bodyregular}> */}
                <h1 className={'pb-3 ' + styles.h4}> Display Code</h1>
                {/* </p> */}

                <div className={'pt-4 alert-warning ' + styles.sectionair}>
                  <div className={styles.sectioncolumns}>
                    <h3 className={'p-3 ' + styles.h4}>On Your Dashboard</h3>
                    {/* <hr className={styles.hr} /> */}
                    <b>Click Example:</b>
                    <h1 id="printCode" className="code" onClick={printData}>
                      Gf-NESS-03
                    </h1>
                    {/* <hr className={styles.hr} /> */}
                    <div className={'p-4 ' + styles.bodyregular}>
                      Print (or write out) your{' '}
                      <b>code found on your receipt</b> and display it on your
                      dashboard.
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark text float-left print"
                      onClick={printData}
                    >
                      <i class="fas fa-print"></i>
                      &nbsp;Print Code
                    </button>
                  </div>
                </div>

                <div className={'pt-5 ' + styles.bodyregular}>
                  <b> That's it! </b>
                </div>
                <p className={styles.bodyregular}>
                  Lastly, please don't forget to thank our hardworking staff as
                  they work diligently to feed our students every week.
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
              <ul className={styles.lists}>
                <li>
                  <div className="float-right ">
                    <img
                      src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/OPUSD+White+Lettering+(2).png"
                      loading="lazy"
                      alt=""
                      width="100"
                    />
                  </div>
                </li>
                <li>
                  <Link href="https://www.oakparkusd.org/Page/10593">
                    <a className="text-white  " target="_blank">
                      Program Info
                    </a>
                  </Link>
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
                <li>
                  <Link href="https://www.oakparkusd.org/Page/1">
                    <a className="text-white  " target="_blank">
                      OPUSD
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
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Home;
