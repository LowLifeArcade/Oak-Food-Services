import React from 'react';
import styles from '../styles/Pages.module.css';
import Layout from '../components/Layout';

const Home = () => {
  function printData() {
    let divToPrint = document.getElementById('printCode');
    let css = 'body { display: flex; flex-direction: column; align-items: center; justify-content: center;  } @page { size: landscape } .code { font-size: 10rem;}',
      head =  document.createElement('head'),
      style = document.createElement('style');

    // style.type = 'text/css';
    // style.media = 'print';

    style.appendChild(document.createTextNode(css));
    head.appendChild(style);

    let newWin = window.open('');
    newWin.document.write(head.outerHTML, divToPrint.outerHTML);
      newWin.document.close();
      newWin.print();
      setTimeout(() => {
        
        newWin.close();
      }, 100);
    // }, 300);
  }
  return (
    <React.Fragment>
      <Layout>
        <div className={styles.body}>
          <div className={styles.section}>
            <div className="pt-4 pb-">

            <h3 className={ styles.h4}>Your Weekly Request</h3>
            <div className={' ' + styles.columnscontainer}>

            <div className={styles.bodyregular}>

            here's how it works
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
                src="https://assets-global.website-files.com/5ea378188ad6b602798e00b8/601b98df30b50cf0c32f46b0_Group%20341.png"
                loading="lazy"
                alt=""
                class="stepimage"
                width="300"
              />

              <div className={styles.bodyregular}>
                <b>Start a Meal Request</b>
              </div>
              <div className={'pb-5 ' + styles.bodyregular}>
                Look over the menu, then use one of the{' '}
                <b>
                  yellow <i>Meal Request</i> buttons
                </b>{' '}
                found throughout the site to start a request.
                {/* located either
                on your nav bar, the weekly menu, or your receipts page. */}
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
                <b> Make Your Selections</b>
              </div>
              <p className={styles.bodyregular}>
                Select pickup date, make your <b>student's meal selections</b> for the week, select a pickup time, and
                submit your request.
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
                <b>For Onsite Requests</b>
              </div>
              <p className={'pb-2 ' + styles.bodyregular}>
                You're all done! Your hybrid student is now on the lunch roster
                for the <b>week found on your receipt</b>.
                <br />
                <br />
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
                <b>For Curbside Requests</b>
              </div>
              <p className={'pb-2 ' + styles.bodyregular}>
                Simply <b>print out your code</b> and drive to the <b>pickup location</b> on the date and time
                found on your receipt.
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
                <h1 id="printCode" className='code' onClick={printData}>
                  Gf-NESS-03
                </h1>
                {/* <hr className={styles.hr} /> */}
                <div className={'p-4 ' + styles.bodyregular}>
                  Print (or write out) your <b>code found on your receipt</b> and
                  display it on your dashboard.
                </div>
                <button type="button" className="btn btn-sm btn-outline-dark text float-left print" onClick={printData}>
              <i class="fas fa-print"></i>
              &nbsp;Print Code</button>
              </div>
            </div>

            <div className={'pt-5 ' + styles.bodyregular}>
              <b> That's it! </b>
            </div>
            <p className={styles.bodyregular}>
              Lastly, please don't forget to thank our hardworking staff as they
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
