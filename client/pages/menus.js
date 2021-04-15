import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { API } from '../config';
import Layout from '../components/Layout';
import Link from 'next/link';
import moment from 'moment';
import renderHTML from 'react-render-html';
import Router from 'next/router';
import { isAuth } from '../helpers/auth';

// refactor this into the admin only view
const Menus = ({ categories }) => {
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

  let twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 13);

  const listCategories = () =>
    categories
      .slice(0)
      .reverse()
      .sort((a, b) => Date.parse(a.pickupWeek) - Date.parse(b.pickupWeek))
      .map((c, i) => (
        <>
          {/* {console.log(moment(new Date()).subtract(13, 'day').format('l'))} */}
          {moment(c.pickupWeek).format('l') >
            moment(new Date()).subtract(13, 'day').format('l') && (
            <div className="">
              <div
                key={i}
                // className={'col-md-12 pt-2'}
                style={{
                  // color: 'grey',
                  border: '1px solid grey',
                  // padding: '10px',
                  boxShadow: '4px 3px 7px 2px rgba(0,0,0,0.2)',
                  // borderRadius: '8px',
                  // borderBlock: '5px',
                }}
                className="bg-white"
              >
                <Link
                  href={`/links/${c.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <a
                    style={{
                      color: '#444444',
                      textDecoration: 'none',
                      // border: '1px solid grey',
                      // padding: '10px',
                      // boxShadow: '10px 2px 10px 4px rgba(0,0,0,0.2)',
                      // borderRadius: '8px',
                      // borderBlock: '5px',
                    }}
                  >
                    <div className="p-2"></div>
                    <div className="p-3">
                      {c.menu.length === 0 && (
                        <h3 className="font-weight-bold ">{c.name}</h3>
                      )}
                      {c.menu.length > 0 && (
                        <h3 className="font-weight-bold ">
                          Menus for Week of{' '}
                          {moment(c.pickupWeek).format('MMMM Do')}
                        </h3>
                      )}
                      <hr />

                      <div style={{ color: '#419ca8' }} className={'pt-1'}>
                        <b>
                          Meal requests must be made by 11:59pm{' '}
                          {moment(c.pickupWeek)
                            .subtract(14, 'day')
                            .format('MMMM Do')}
                        </b>
                      </div>
                            <div className="p-1"></div>
                      <hr/>
                      <div className="alert-seconary pt-3">
                        {c.menu.length > 0 && <h4>Curbside Pickup</h4>}
                        <div className="p-1"></div>
                        <table
                          className="table table-sm table-striped table-bordered "
                          style={{ fontSize: '10px' }}
                        >
                          {c.menu.length > 0 && (
                            <thead>
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Breakfast</th>
                                <th scope="col">Lunch</th>
                                <th scope="col">Vegetarian Lunch</th>
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {c.menu.map((l, i) => (
                              <>
                                <tr key={i}>
                                  <td>
                                    <b>{l.row1}</b>
                                  </td>
                                  <td>{l.row2}</td>
                                  <td>{l.row3}</td>
                                  <td>{l.row4}</td>
                                </tr>
                              </>
                            )) || ''}
                          </tbody>
                        </table>

                        <br />
                        {c.menu2.length > 0 && (
                          <h5>BES | OHES | ROES | MCMS</h5>
                        )}
                        <div className="p-1"></div>
                        <table
                          className="table table-sm table-striped table-bordered "
                          style={{ fontSize: '10px' }}
                        >
                          {c.menu2.length > 0 && (
                            <thead>
                              <tr>
                                {/* <th scope="col">Secondary</th> */}
                                <th scope="col">Monday/Wednesday</th>
                                <th scope="col">Tuesday/Thursday</th>
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {c.menu2.map((l, i) => (
                              <>
                                <tr key={i}>
                                  <td>{l.row1}</td>
                                  <td>{l.row2}</td>
                                  {/* <td>{l.row3}</td> */}
                                </tr>
                              </>
                            )) || ''}
                          </tbody>
                        </table>

                        <br />
                        {c.menu3.length > 0 && <h5>OPHS</h5>}
                        <div className="p-1"></div>
                        <table
                          className="table table-sm table-striped table-bordered "
                          style={{ fontSize: '10px' }}
                        >
                          {c.menu3.length > 0 && (
                            <thead>
                              <tr>
                                <th scope="col">Monday</th>
                                <th scope="col">Tuesday</th>
                                <th scope="col">Wednesday</th>
                                <th scope="col">Thursday</th>
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {c.menu3.map((l, i) => (
                              <>
                                <tr key={i}>
                                  <td>{l.row1}</td>
                                  <td>{l.row2}</td>
                                  <td>{l.row3}</td>
                                  <td>{l.row4}</td>
                                </tr>
                              </>
                            )) || ''}
                          </tbody>
                        </table>
                      </div>

                      <div className={' '}>{renderHTML(c.content || '')}</div>

                      <div className="">
                        <div className="pb-2">
                          {c.image && (
                            <img
                              src={c.image.url}
                              alt={c.name}
                              style={{ width: '280px', maxHeight: 'auto' }}
                            />
                          )}
                        </div>

                        <div className="pb-3">
                          {/* <h3>{c.name}</h3> {c.createdAt} */}
                          Posted {moment(c.createdAt).format('MMMM Do YYYY')}
                          {/* {popular.map((l, i) => l.postedBy.name)} */}
                          {/* {c.username} */}
                          {isAuth()
                            ? c.menu.length > 0 &&
                              new Date() < twoWeeksFromNow && (
                                <Link href="/user/link/create">
                                  <button
                                    className={
                                      'btn float-right ' + styles.button
                                    }
                                    onClick={(e) =>
                                      localStorage.setItem(
                                        'search-date',
                                        JSON.stringify(
                                          moment(c.pickupWeek).format('l')
                                        )
                                      )
                                    }
                                  >
                                    <i class="fas fa-pencil-alt"></i>
                                    &nbsp; Request
                                  </button>
                                </Link>
                              )
                            : c.menu.length > 0 &&
                              new Date() < twoWeeksFromNow && (
                                <Link href="/login">
                                  <button
                                    className={
                                      'btn float-right ' + styles.button
                                    }
                                    onClick={(e) =>
                                      localStorage.setItem(
                                        'search-date',
                                        JSON.stringify(
                                          moment(c.pickupWeek).format('l')
                                        )
                                      )
                                    }
                                  >
                                    <i class="fas fa-pencil-alt"></i>
                                    &nbsp; Request
                                  </button>
                                </Link>
                              )}
                          {process.browser &&
                            isAuth() &&
                            isAuth().role === 'admin' && (
                              <div className="">
                                <Link href={`/admin/category/${c.slug}`}>
                                  <button className="badge btn btn-sm btn-outline-warning mb-1 float-right">
                                    Edit
                                  </button>
                                </Link>
                                &nbsp;
                                {/* <button
                onClick={(e) => confirmDelete(e, category.slug)}
                className="badge btn btn-sm btn-outline-danger "
              >
                Delete
              </button> */}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
              <div className="p-2"></div>
            </div>
          )}
        </>
      ));
  return (
    <div className={styles.background}>
      <div className={styles.mobilehome}>
        <Layout>
          {/* <div className=" pt-4">
        <div className="">
        <h3 className="font-weight-bold">Your Food Feed</h3>
        </div>
      </div> */}

          <div className=" row flex-column justify-content-center pt-3 ">
            {listCategories()}
          </div>

          {/* <div className="row pt-5">
        <h2 className="font-weight-bold pb-3">Trending</h2>
        <div className="col-md-12 overflow-hidden">{listOfLinks()}</div>
      </div> */}
        </Layout>
      </div>
    </div>
  );
};
// all above for admin only view OR this will be the available food orders and people click request

Menus.getInitialProps = async () => {
  const response = await axios.get(`${API}/categories`);
  return {
    categories: response.data,
  };
};

export default Menus;
