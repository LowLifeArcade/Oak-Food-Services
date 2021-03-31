// imports
import styles from '../../../styles/Home.module.css';
import moment from 'moment';
import Router from 'next/router';
import Layout from '../../../components/Layout';
import withUser from '../../withUser';
import { isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import axios from 'axios';
import Link from 'next/link';

const Update = ({ oldLink, token, user, _id }) => {
  const confirmDelete = (e, id) => {
    e.preventDefault();
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
      process.browser && window.location.reload();

      isAuth() && isAuth().role === 'admin'
        ? Router.push('admin')
        : isAuth() && isAuth().role === 'subscriber'
        ? Router.push('user')
        : Router.push('/login');
    } catch (error) {
      console.log('ERROR LINK CATEGORY', error);
    }
  };

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
    newWin.document.close();
    newWin.print();
    setTimeout(() => {
      newWin.close();
    }, 100);
    // }, 300);
  }

  const receipt = (oldLink, confirmDelete) => {
    return (
      <>
        {
          // <div className={' p-4 alert alert-warning ' + styles.receipt}>
          <div
            key={242}
            className={
              (oldLink && oldLink.orderStatus === true) ||
              moment(oldLink.pickupDate).format('MDD').toString() <
                moment(new Date()).format('MDD').toString()
                ? 'p-4 alert  alert-secondary ' + styles.subcard // active order
                : 'p-4 alert  alert-warning ' + styles.subcard // completed order
            }
          >
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
              {moment(oldLink.pickupDate).format('MDD').toString() <
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
            {console.log('old link', oldLink)}
            {oldLink.mealRequest.filter(
              (l) =>
                // l.meal == 'Standard' ||
                // l.meal == 'Vegetarian' ||
                // l.meal == 'Gluten Free' ||
                // l.meal == 'Vegan' ||
                // l.meal == 'Standard DF' ||
                // l.meal == 'GlutenFree DF' ||
                l.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
                l.pickupOption === 'Lunch Only' ||
                l.pickupOption === 'Breakfast and Lunch'
            ).length != 0 && (
              <>
                <h4 className="pt-2 ">
                  PICKUP DATE
                  <br />
                  <b>{moment(oldLink.pickupDate).format('MMMM Do')}</b>
                </h4>
                Between <b className="pb-2 ">{oldLink.pickupTime} </b>
              </>
            )}
            <hr className={styles.hr} />
            <h3>
              {oldLink.mealRequest.filter(
                (l) =>
                  // l.meal == 'Standard' ||
                  // l.meal == 'Vegetarian' ||
                  // l.meal == 'Gluten Free' ||
                  // l.meal == 'Vegan' ||
                  // l.meal == 'Standard DF' ||
                  // l.meal == 'GlutenFree DF' ||
                  l.pickupOption === 'Lunch Onsite / Breakfast Pickup' ||
                  l.pickupOption === 'Lunch Only' ||
                  l.pickupOption === 'Breakfast and Lunch'
              ).length != 0 ? (
                <b
                  id="printCode"
                  onClick={oldLink.orderStatus === false &&
                    moment(oldLink.pickupDate).format('MDD').toString() >
                    moment(new Date()).format('MDD').toString() ? printData : null}
                  className="code d-flex justify-content-center"
                >
                  {oldLink.pickupCode}{' '}
                </b>
              ) : (
                <b>
                  Onsite School Lunch for week of{' '}
                  {moment(oldLink.pickupDate).add(3, 'day').format('MMMM Do')}
                </b>
              )}
            </h3>
            <hr className={styles.hr} />
            <h6>
              Pick up is at <b className="text">Brookside Elemenery</b>. Display
              the above code <b className="text-danger">on your dashboard </b>or
              show from your phone.
            </h6>
            <p></p>
            <div className="p-2">
              <h5 className="pb-1">
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
                              Curbside: {k.meal}{' '}
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
            </div>
            <div className="pt-1 ">
              <span className="">
                {' '}
                {moment(oldLink.createdAt).format('M/d/yy')} by{' '}
                {oldLink.postedBy == null
                  ? 'user deleted'
                  : oldLink.postedBy.name}{' '}
              </span>
            </div>

            <div className={' pb-3 pt-3 ' + styles.noPrint}>
              {
                // l.postedBy.students[i] === undefined ? null :
                oldLink.orderStatus === false &&
                  moment(oldLink.pickupDate).format('MDD').toString() >
                    moment(new Date()).format('MDD').toString() && (
                    <Link href={`/user/link/${oldLink._id}`}>
                      <button className="btn btn-sm btn-outline-dark text float-left">
                        <i class="far fa-edit"></i> &nbsp;Edit
                      </button>
                    </Link>
                  )
              }
              <span>&nbsp;&nbsp;</span>
              {oldLink.orderStatus === false &&
                moment(oldLink.pickupDate).format('MDD').toString() >
                  moment(new Date()).format('MDD').toString() && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark text  print"
                    onClick={printData}
                  >
                    <i class="fas fa-print"></i>
                    &nbsp;Print Code
                  </button>
                )}
              {oldLink.orderStatus === false &&
                moment(oldLink.pickupDate).format('MDD').toString() >
                  moment(new Date()).format('MDD').toString() && (
                  <Link href="">
                    <button
                      onClick={(e) => confirmDelete(e, oldLink._id)}
                      className="text-white btn btn-sm btn-danger float-right"
                    >
                      Cancel
                    </button>
                  </Link>
                )}
              <div className="pb-4"></div>
            </div>
            {/* <div className=" pb-3 pt-3">
                {
                  <Link href={`/user/link/${oldLink._id}`}>
                    <button className="btn btn-sm btn-outline-dark text float-left">
                      <i class="far fa-edit"></i> &nbsp;Edit
                    </button>
                  </Link>
                }
                <Link href="">
                  <button
                    onClick={(e) => confirmDelete(e, oldLink._id)}
                    className="text-white btn btn-sm btn-danger float-right"
                  >
                    Cancel
                  </button>
                </Link>
                <div className="pb-4"></div>
              </div> */}
          </div>
        }
      </>
    );
  };

  return (
    <div className={styles.background}>
      <Layout>
        <div className={styles.printReceipt}>
          <div className={'p-4 '}></div>
          {/* <div className={'d-flex justify-content-center  ' }> */}
          <div className={'d-flex justify-content-center   '}>
            {/* <div className={"flex-column justify-content-center " + styles.mobile}> */}
            {receipt(oldLink, confirmDelete)}
          </div>
          {/* </div> */}
          {/* </div> */}
        </div>
      </Layout>
    </div>
  );
};

Update.getInitialProps = async ({ req, token, query, user }) => {
  const response = await axios.get(`${API}/link/${query.id}`);
  return { oldLink: response.data, token, user };
};

export default withUser(Update);
