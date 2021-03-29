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
              Make a meal request for your student(s) at least two weeks in
              advance.
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
                <b> Use the Meal Request button</b>
              </div>
              <div className={styles.bodyregular}>
                Use one of the <b>yellow Meal Request buttons</b> located either
                on your nav bar, the weekly menu, or your receipts page.
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
                <b> Make Your Request</b>
              </div>
              <p className={styles.bodyregular}>
                <b>Make your selections </b>for each student and hit submit.
                Meal options available depend on allergies and cohort.
                <br />
                <br />
                {/* You can edit your student's cohort and allery group for differnt meal options in  <b>update profile</b>.  */}
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
              <b>If it's an Onsite request</b> , your child is now on the cafeteria list for free
                meals of the <b>week indicated on your receipt</b>.
                <br />
                <br />
                <b>If it's a Curbside request</b> you simply take your virutal
                receipt to the <b>pickup location at OPHS</b> on the date found
                on your receipt.
              </p>
            </div>

            <div className={'pt-4 ' + styles.sectionair}>
              <div className={styles.sectioncolumns}>
                <h3 className={styles.h4}>Show your code</h3>
                <b>Exampe:</b>
                <h2>Gf-NESS-03</h2>
                <div className={'p-5 ' + styles.bodyregular}>
                  Show the code or your receipt to the staff as you drive up.
                </div>
              </div>
            </div>

            <div className={'pb-5 ' + styles.bodyregular}>
              <p>
              NOTE: For the most efficient service, <b>print or write out the order code found on your receipt</b> and display it somewhere visible on your dashboard. Or show them the virtual order receipt from your phone through your car window.
              </p>
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
