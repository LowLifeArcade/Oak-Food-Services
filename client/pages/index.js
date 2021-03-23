import React, { useEffect, useState } from 'react';
import styles from '../styles/Pages.module.css';
import axios from 'axios';
import { API } from '../config';
import Layout from '../components/Layout';
import Link from 'next/link';
import moment from 'moment';
import renderHTML from 'react-render-html';
import Router from 'next/router';
import { isAuth } from '../helpers/auth';

// refactor this into the admin only view
const Home = ({ categories }) => {
  // move all of this CODE to admin page
  // const [popular, setPopular] = useState([]);

  // useEffect(() => {
  //   loadPopular();
  // }, []);

  // const loadPopular = async () => {
  //   const response = await axios.get(`${API}/link/popular`);
  //   setPopular(response.data);
  // };
  // console.log(popular);

  // useEffect(() => {
  //   // setTimeout(() => {

  //   // }, 500);
  //   !isAuth() && Router.push('/login') ;
  // }, [])

  // const handleClick = async (linkId) => {
  //   // e.preventDefault();
  //   const response = await axios.put(`${API}/click-count`, { linkId });
  //   // loadPopular();
  // };

  // const listOfLinks = () =>
  //   popular.map((l, i) => (
  //     <div key={i} className="row alert alert-secondary p2">
  //       {/* {console.log(l)} */}
  //       <div className="col-md-8" onClick={() => handleClick(l._id)}>
  //         <a href={l.url} target="_blank">
  //           <h5 className="pt-2">{l.title}</h5>
  //           <h6 className="pt-2 text-dnger" style={{ fontSize: '12px' }}>
  //             {l.url}
  //           </h6>
  //         </a>
  //         <div className="col-md-4 pt-2">
  //           <span className="pull-right">
  //             {moment(l.createdAt).fromNow()} by
  //             {l.postedBy.name}
  //             {/* {console.log('trying to find name', l)} */}
  //           </span>
  //         </div>
  //         <div className="col-md-12">
  //           <span className="badge text-dark">
  //             {l.type} {l.medium}{' '}
  //           </span>
  //           {l.categories.map((c, i) => (
  //             <span  className="badge text-success">
  //               {c.name}{' '}
  //             </span>
  //           ))}
  //           <span className="badge text-secondary pull-right">
  //             {l.clicks} clicks{' '}
  //           </span>
  //         </div>
  //       </div>
  //     </div>
  //   ));
  // CODE for admin /

  return (
    <React.Fragment>
      <Layout>
        <div className={styles.body}>
          <div className={styles.section}>
            {/* <div className={styles.sectioncontainer}> */}
              <h3 className={styles.h4}>Here's how it works</h3>
              <p className={'pb-3 ' + styles.bodyregular}>
                Make a request for your student(s) for <b>Onsite</b> or{' '}
                <b>Curbside</b> at least two weeks in advance.
              </p>
            {/* </div> */}
          </div>

          <div className={styles.sectioncolumns}>
            <div className={' ' + styles.columnscontainer}>
              <img
                src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601b98df30b50cf0c32f46b0_Group%20341.png"
                loading="lazy"
                alt=""
                class="stepimage"
                width="300"
              />

              <div className={styles.bodyregular}>
                <b> Use the Meal Request icons</b>
              </div>
              <div className={styles.bodyregular}>
                After looking over the menu, use the Meal Request buttons located on your navagation bar, your menu
                page, and your receipts page.
              </div>
            </div>

            <div className={styles.columnscontainer}>
              <img
                src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601b98e2cdd21687761d118f_Group%20342.png"
                loading="lazy"
                alt=""
                class="stepimage"
                width="300"
              />

              <div className={styles.bodyregular}>
                <b> Pickup Your Request</b>
              </div>
              <p className={styles.bodyregular}>
                Make your selections and look over your receipt. If it's an
                Onsite request, you're all done! Your child simply goes to
                school and is on the cafeteria list for free meals for the week
                on your receipt.
              </p>
            </div>

            <div className={styles.columnscontainer}>
              <img
                src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601b98e5f3402d2b78c91286_Group%20343.png"
                loading="lazy"
                loading="lazy"
                alt=""
                class="stepimage"
                width="300"
              />

              <div className={styles.bodyregular}>
                <b> Pickup Your Request</b>
              </div>
              <p className={'pb-5 ' + styles.bodyregular}>
                If it's a <b>Curbside</b> order you simply take your virutal
                receipt to the pickup location at OPHS and on the date found on
                your receipt. Put the order code somewhere visible on yoru
                dashboard or show them the order receipt on your phone through
                your car window.
              </p>
            </div>

            <div className={'pt-4 ' + styles.sectionair}>
              <div className={styles.sectioncolumns}>
                <h3 className={styles.h4}>Show your code</h3>
                <b>Exampe:</b>
                <h2>Gf-NESS-03</h2>
                <div className={'p-5 ' + styles.bodyregular}>
                  Show the code or your receipt with the code to the staff as
                  you drive up.
                </div>
              </div>
            </div>

            <div className={'pt-5 ' + styles.bodyregular}>
              <b> That's it! </b>
            </div>
            <p className={styles.bodyregular}>
              Lastly, please don't forget to thank the hardworking staff as they
              work diligently to feed our students every week.
            </p>
          </div>
        </div>

        {/* <link
          href="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/css/hopps-io.30393950f.min.css"
          rel="stylesheet"
          type="text/css"
        /> */}

        {/* 
        <div class="section white">
          <div class="sectioncontainer w-container">
            <h1 class="h4 centered">
              It&#x27;s like the Genius Bar, but for marketing.
            </h1>
            <p class="bodyregular centered">
              Tell us your problem, wait 3 minutes, and solve it in real-time
              with a specialist
            </p>

            <div class="sectioncolumns marginvertical w-row">
              <div class="columncontainer centeredvertical w-col w-col-4 w-col-stack">
                <img
                  src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601b98df30b50cf0c32f46b0_Group%20341.png"
                  loading="lazy"
                  alt=""
                  class="stepimage"
                />
                <div class="bodyregular centered bold howitworks">
                  Pick Facebook Ads
                  <br />
                </div>
                <div class="bodyregular centered howitworks bottommargin">
                  (and give details)
                </div>
              </div>

              <div class="columncontainer centeredvertical w-col w-col-4 w-col-stack">
                <img
                  src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601b98e2cdd21687761d118f_Group%20342.png"
                  loading="lazy"
                  alt=""
                  class="stepimage"
                />
                <div class="bodyregular centered bold howitworks">
                  Wait 3 minutes for our AI to match
                  <br />
                </div>
                <div class="bodyregular centered howitworks bottommargin">
                  (we find you the best FB ads expert)
                </div>
              </div>
              <div class="columncontainer centeredvertical w-col w-col-4 w-col-stack">
                <img
                  src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601b98e5f3402d2b78c91286_Group%20343.png"
                  loading="lazy"
                  alt=""
                  class="stepimage"
                />
                <div class="bodyregular centered bold howitworks">
                  Start 1:1 screen-share and solve
                  <br />
                </div>
                <div class="bodyregular centered howitworks bottommargin">
                  Expert walks you through solution
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section air">
          <div class="sectioncontainer w-container">
            <div
              data-duration-in="300"
              data-duration-out="100"
              class="tabs nomargintabs w-tabs"
            >
              <div class="tabcontent transparent w-tab-content">
                <div data-w-tab="Instant" class="w-tab-pane w--tab-active">
                  <div class="sectioncolumns topaligned w-row">
                    <div class="columncontainer centered w-col w-col-5 w-col-small-5">
                      <div
                        data-w-id="03062937-df52-cc58-5bc2-cc741f1d51c0"
                        data-animation-type="lottie"
                        data-src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/6001f29322ccc30d80b0d20c_Real%20Time%20Help.json"
                        data-loop="1"
                        data-direction="1"
                        data-autoplay="1"
                        data-is-ix2-target="0"
                        data-renderer="svg"
                        data-default-duration="4"
                        data-duration="0"
                        class="lottie-animation negativemargin"
                      ></div>
                    </div>

                    <div class="columncontainer w-col w-col-7 w-col-small-7">
                      <div class="tabdiv topmargin">
                        <h2 class="h6">Instant help</h2>
                        <p class="bodyregular">
                          No more booking appointments or waiting. We connect
                          you with a top tier expert faster than anything else.
                          Get unstuck quicker than you can call an Uber.
                        </p>
                        <div class="applinkdiv rightaligned">
                          <a
                            href="https://app.hopps.io/session/create"
                            class="applink"
                          >
                            Start Your Free 1:1 Session
                          </a>
                          <img
                            src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5fd9bf56837da37943b00f65_Arrow.png"
                            loading="lazy"
                            alt=""
                            class="applinkarrow"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-w-tab="Screen-Shares" class="w-tab-pane">
                  <div class="sectioncolumns topaligned w-row">
                    <div class="columncontainer nopadding centered w-col w-col-5 w-col-small-small-stack">
                      <div
                        data-w-id="03062937-df52-cc58-5bc2-cc741f1d51a0"
                        data-animation-type="lottie"
                        data-src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5ffc915f5845dbf9ec609445_headeranim.json"
                        data-loop="1"
                        data-direction="1"
                        data-autoplay="1"
                        data-is-ix2-target="0"
                        data-renderer="svg"
                        data-default-duration="6.566666666666666"
                        data-duration="0"
                        class="lottie-animation margin20"
                      ></div>
                    </div>
                    <div class="columncontainer w-col w-col-7 w-col-small-small-stack">
                      <div class="tabdiv topmargin">
                        <h2 class="h6">Do everything with screen-shares.</h2>
                        <p class="bodyregular">
                          Why screen-shares? So our experts can walk you through
                          the solution by showing you exactly how things should
                          be done.
                          <br />‍<br />
                          Whether it&#x27;s setting up a new integration or
                          helping you build out a cold new leads list,
                          there&#x27;s nothing better than doing it yourself as
                          someone guides you.
                          <br />
                        </p>
                        <div class="applinkdiv rightaligned">
                          <a
                            href="https://app.hopps.io/session/create"
                            class="applink"
                          >
                            Start Your Free 1:1 Session
                          </a>
                          <img
                            src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5fd9bf56837da37943b00f65_Arrow.png"
                            loading="lazy"
                            alt=""
                            class="applinkarrow"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-w-tab="AI-Driven Matching" class="w-tab-pane">
                  <div class="sectioncolumns topaligned w-row">
                    <div class="columncontainer centered w-col w-col-5 w-col-small-5">
                      <div
                        data-w-id="03062937-df52-cc58-5bc2-cc741f1d51b2"
                        data-animation-type="lottie"
                        data-src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5ff30aeda97d9be114e15076_36341-find-people.json"
                        data-loop="1"
                        data-direction="1"
                        data-autoplay="1"
                        data-is-ix2-target="0"
                        data-renderer="svg"
                        data-default-duration="3.3333333333333335"
                        data-duration="0"
                        class="lottie-animation-3"
                      ></div>
                    </div>
                    <div class="columncontainer w-col w-col-7 w-col-small-7">
                      <div class="tabdiv topmargin">
                        <h2 class="h6">Instant matches to top talent</h2>
                        <p class="bodyregular">
                          Our AI-model looks at your session request, industry,
                          company and target customer to match you with a
                          US-based expert who understands your needs.
                          <br />
                          <br />
                          If you are trying to market chocolate locally or work
                          on a sales strategy to target B2B finance companies,
                          we will get you the right expert to help.
                        </p>
                        <div class="applinkdiv rightaligned">
                          <a
                            href="https://app.hopps.io/session/create"
                            class="applink"
                          >
                            Start Your Free 1:1 Session
                          </a>
                          <img
                            src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5fd9bf56837da37943b00f65_Arrow.png"
                            loading="lazy"
                            alt=""
                            class="applinkarrow"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-w-tab="Rewatch" class="w-tab-pane">
                  <div class="sectioncolumns topaligned w-row">
                    <div class="columncontainer centered w-col w-col-5 w-col-small-5">
                      <div
                        data-w-id="03062937-df52-cc58-5bc2-cc741f1d51cb"
                        data-animation-type="lottie"
                        data-src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/6001f2f64262b90c069488cc_data.json"
                        data-loop="1"
                        data-direction="1"
                        data-autoplay="1"
                        data-is-ix2-target="0"
                        data-renderer="svg"
                        data-default-duration="3.48"
                        data-duration="0"
                      ></div>
                    </div>
                    <div class="columncontainer w-col w-col-7 w-col-small-7">
                      <div class="tabdiv topmargin">
                        <h2 class="h6">Rewatch and get insights</h2>
                        <p class="bodyregular">
                          Rewatch your session and get the entire session
                          transcript, actions items, followups and questions as
                          soon as you finish. <br />
                          <br />
                          It&#x27;s like having someone taking notes for you.
                        </p>
                        <div class="applinkdiv rightaligned">
                          <a
                            href="https://app.hopps.io/session/create"
                            class="applink"
                          >
                            Start Your Free 1:1 Session
                          </a>
                          <img
                            src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5fd9bf56837da37943b00f65_Arrow.png"
                            loading="lazy"
                            alt=""
                            class="applinkarrow"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-w-tab="Never Overpay" class="w-tab-pane">
                  <div class="sectioncolumns topaligned w-row">
                    <div class="columncontainer nopadding centered w-col w-col-5 w-col-small-6">
                      <div
                        data-w-id="03062937-df52-cc58-5bc2-cc741f1d51d9"
                        data-animation-type="lottie"
                        data-src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/6001edfd22ccc367aeb0afd6_transparent%20pricing.json"
                        data-loop="1"
                        data-direction="1"
                        data-autoplay="1"
                        data-is-ix2-target="0"
                        data-renderer="svg"
                        data-default-duration="2.55"
                        data-duration="0"
                      ></div>
                    </div>
                    <div class="columncontainer w-col w-col-7 w-col-small-6">
                      <div class="tabdiv topmargin">
                        <h2 class="h6">Easy, startup-friendly pricing</h2>
                        <p class="bodyregular">
                          Sessions are charged by the minute, only for the time
                          that you need help. There are no minimums, hidden
                          fees, long term commitments or contracts.
                        </p>
                        <div class="applinkdiv rightaligned">
                          <a
                            href="https://app.hopps.io/session/create"
                            class="applink"
                          >
                            Start Your Free 1:1 Session
                          </a>
                          <img
                            src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5fd9bf56837da37943b00f65_Arrow.png"
                            loading="lazy"
                            alt=""
                            class="applinkarrow"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section white">
          <div class="_1200container nopadding centered w-container">
            <div class="equalcolumns margintop w-row">
              <div class="columncontainer w-col w-col-3 w-col-stack">
                <a
                  href="/marketing/channel-strategy"
                  class="fullheightlink w-inline-block"
                >
                  <div class="categoriescard">
                    <div class="platformtitlediv">
                      <img
                        src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5ff18040fdd5f766651a9881_strategy.png"
                        loading="lazy"
                        width="178"
                        sizes="50px"
                        srcset="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5ff18040fdd5f766651a9881_strategy-p-500.png 500w, https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5ff18040fdd5f766651a9881_strategy.png 512w"
                        alt=""
                        class="categoryicon"
                      />
                      <h1 class="platformtitles">Channel Strategy</h1>
                    </div>
                    <h4 class="bodyregular centered">
                      Plan your marketing strategies, funnels and setups with
                      experienced strategists.{' '}
                    </h4>
                    <div class="platformbuttondiv">
                      <div class="arrowbutton">
                        <div class="text-block">Learn More</div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div class="columncontainer w-col w-col-3 w-col-stack">
                <a
                  href="/marketing/digital-advertising"
                  class="fullheightlink w-inline-block"
                >
                  <div class="categoriescard">
                    <div class="platformtitlediv">
                      <img
                        src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5fe2c00b3b7e457bf0b258de_Group%20491.png"
                        loading="lazy"
                        width="178"
                        alt=""
                        class="categoryicon"
                      />
                      <h2 class="platformtitles">Digital Advertising</h2>
                    </div>
                    <h4 class="bodyregular centered">
                      Advertise on the most trafficked and popular platforms in
                      the world like Facebook and LinkedIn.
                    </h4>
                    <div class="platformbuttondiv">
                      <div class="arrowbutton">
                        <div class="text-block">Learn More</div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div class="columncontainer w-col w-col-3 w-col-stack">
                <a
                  href="/marketing/automation"
                  class="fullheightlink w-inline-block"
                >
                  <div class="categoriescard">
                    <div class="platformtitlediv">
                      <img
                        src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5fd3969aac1c8fdeaba47292_Group%20483.png"
                        loading="lazy"
                        width="178"
                        alt=""
                        class="categoryicon"
                      />
                      <h1 class="platformtitles">Automation and CRM</h1>
                    </div>
                    <h4 class="bodyregular centered">
                      Learn how to use tools like HubSpot to gather all of your
                      data in one place for analysis and decisions.
                    </h4>
                    <div class="platformbuttondiv">
                      <div class="arrowbutton">
                        <div class="text-block">Learn More</div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div class="columncontainer w-col w-col-3 w-col-stack">
                <a
                  href="/marketing/digital-advertising"
                  class="fullheightlink w-inline-block"
                >
                  <div class="categoriescard">
                    <div class="platformtitlediv">
                      <img
                        src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5ffc97a682e1bec8be0770c1_analytics.png"
                        loading="lazy"
                        width="178"
                        alt=""
                        class="categoryicon"
                      />
                      <h1 class="platformtitles">Analytics</h1>
                    </div>
                    <h4 class="bodyregular centered">
                      Tie together your data and setup the right goals to learn
                      from customer behavior and funnels.
                    </h4>
                    <div class="platformbuttondiv">
                      <div class="arrowbutton">
                        <div class="text-block">Learn More</div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="section air">
          <div class="sectioncontainer w-container">
            <div class="sectioncolumns w-row">
              <div
                data-w-id="4fe951cd-8d05-313f-b3b2-9e2f28778fd5"
                class="columncontainer rightaligned w-col w-col-6"
              >
                <img
                  src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601a77c4d334e37b72daa566_Header.png"
                  loading="lazy"
                  sizes="(max-width: 479px) 100vw, (max-width: 767px) 75vw, (max-width: 991px) 291.1875px, 449.984375px"
                  srcset="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601a77c4d334e37b72daa566_Header-p-500.png 500w, https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601a77c4d334e37b72daa566_Header-p-800.png 800w, https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601a77c4d334e37b72daa566_Header.png 902w"
                  alt=""
                  class="getfreeimage"
                />
              </div>
              <div
                data-w-id="4fe951cd-8d05-313f-b3b2-9e2f28778fe1"
                class="columncontainer w-col w-col-6"
              >
                <h2 class="h4 leftaligned">Get your first session free.</h2>
                <div class="bodyregular leftaligned">
                  We are so confident in the help and value of our experts that
                  you don&#x27;t even have to enter in a credit card. See for
                  yourself why we are the top choice for getting marketing help.
                </div>
                <div class="applinkdiv rightaligned">
                  <a href="https://app.hopps.io/session/create" class="applink">
                    Start Your Free 1:1 Session
                  </a>
                  <img
                    src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5fd9bf56837da37943b00f65_Arrow.png"
                    loading="lazy"
                    alt=""
                    class="applinkarrow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="section lowtonopadding">
            <div class="sectioncontainer w-container">
              <div class="footerinnerdiv">
                <div class="logodiv">
                  <img
                    src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/5fcfcc222d9137f2b1972fd0_Frame.png"
                    alt=""
                    class="footer-logo"
                  />
                  <div class="legal-text">© 2021 ARL Technologies, Inc.</div>
                </div>
                <div class="linksdiv">
                  <div class="footer-column">
                    <a
                      href="/"
                      aria-current="page"
                      class="footer-link w--current"
                    >
                      Home
                    </a>
                    <a href="/how-it-works" class="footer-link">
                      How It Works
                    </a>
                    <a href="/about" class="footer-link">
                      Company
                    </a>
                    <a href="/contact" class="footer-link">
                      Contact
                    </a>
                  </div>
                  <div class="footer-column"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      

        */}
      </Layout>
      <div className={styles.footer}>
        <div className={'pt-4 ' + styles.sectioncontainer}>
          <div className={'text-white ' + styles.bodyregular}>
            <ul className={styles.lists}>
              <li>School Info</li>
              <li>Contact</li>
              <li>Help</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
  //   const listCategories = () =>
  //     categories
  //       .slice(0)
  //       .reverse()
  //       .map((c, i) => (
  //         <>
  //         <div className="">

  //           <div
  //           key={i}
  //             // className={'col-md-12 pt-2'}
  //             style={{
  //               // color: 'grey',
  //               border: '1px solid grey',
  //               // padding: '10px',
  //               boxShadow: '4px 3px 7px 2px rgba(0,0,0,0.2)',
  //               // borderRadius: '8px',
  //               // borderBlock: '5px',
  //             }}
  //             className="bg-white"
  //           >
  //             <Link

  //               href={`/links/${c.slug}`}
  //               style={{ textDecoration: 'none' }}
  //             >
  //               <a
  //                 style={{
  //                   color: 'grey',
  //                   textDecoration: 'none'
  //                   // border: '1px solid grey',
  //                   // padding: '10px',
  //                   // boxShadow: '10px 2px 10px 4px rgba(0,0,0,0.2)',
  //                   // borderRadius: '8px',
  //                   // borderBlock: '5px',
  //                 }}
  //               >
  //                 <div className="p-4">

  //                       <h3 className="font-weight-bold ">{c.name}</h3>
  //                       <hr />
  //                       <div
  //                       // className="lead alert alert-seconary pt-4"
  //                       // className={'col-md-12 pt-2'}

  //                       >
  //                         {renderHTML(c.content || '')}
  //                       </div>
  //                       <div className="">
  //                         {c.image && (
  //                           <img
  //                             src={c.image.url}
  //                             alt={c.name}
  //                             style={{ width: '280px', maxHeight: 'auto' }}
  //                           />
  //                         )}
  //                         <div className="">
  //                           {/* <h3>{c.name}</h3> {c.createdAt} */}
  //                           Posted {moment(c.createdAt).format('MMMM Do YYYY')}
  //                           {/* {popular.map((l, i) => l.postedBy.name)} */}
  //                           {/* {c.username} */}
  //                         </div>

  //                   </div>
  //                 </div>
  //               </a>
  //             </Link>
  //           </div>
  //           <div className="p-2"></div>
  //           </div>

  //         </>
  //       ));
  //   return (
  //     <div key={2000} className={styles.background} >

  //     <div className={styles.mobilehome}>

  //     <Layout>
  //       {/* <div className=" pt-4">
  //         <div className="">
  //         <h3 className="font-weight-bold">Your Food Feed</h3>
  //         </div>
  //       </div> */}

  //       <div key={1000} className=" row flex-column justify-content-center pt-3 ">
  //         {listCategories()}
  //       </div>

  //       {/* <div className="row pt-5">
  //         <h2 className="font-weight-bold pb-3">Trending</h2>
  //         <div className="col-md-12 overflow-hidden">{listOfLinks()}</div>
  //       </div> */}
  //     </Layout>
  //       </div>
  //     </div>
  //   );
  // };
  // // all above for admin only view OR this will be the available food orders and people click request

  // Home.getInitialProps = async () => {
  //   const response = await axios.get(`${API}/categories`);
  //   return {
  //     categories: response.data,
  //   };
};

export default Home;
