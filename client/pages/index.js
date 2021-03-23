import React from 'react';
import styles from '../styles/Pages.module.css';
import Layout from '../components/Layout';

const Home = () => {

  return (
    <React.Fragment>
      <Layout>
        <div className={styles.body}>
          <div className={styles.section}>
              <h3 className={styles.h4}>Here's how it works</h3>
              <p className={'pb-3 ' + styles.bodyregular}>
                Make a request for your student(s) for <b>Onsite</b> or{' '}
                <b>Curbside</b> at least two weeks in advance.
              </p>
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
};

export default Home;
