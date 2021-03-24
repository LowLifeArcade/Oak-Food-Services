import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { API } from '../config';
import Layout from '../components/Layout';
import Link from 'next/link';
import moment from 'moment';
import renderHTML from 'react-render-html';
import Router from 'next/router';
// import { isAuth } from '../helpers/auth';

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

  const listCategories = () =>
    categories
      .slice(0)
      .reverse()
      .map((c, i) => (
        <>
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
                    color: 'grey',
                    textDecoration: 'none',
                    // border: '1px solid grey',
                    // padding: '10px',
                    // boxShadow: '10px 2px 10px 4px rgba(0,0,0,0.2)',
                    // borderRadius: '8px',
                    // borderBlock: '5px',
                  }}
                >
                  <div className="p-4">
                    <h3 className="font-weight-bold ">{c.name}</h3>
                    <hr />
                    <div
                    // className="lead alert alert-seconary pt-4"
                    // className={'col-md-12 pt-2'}
                    >
                      {renderHTML(c.content || '')}
                    </div>
                    <div className="">
                      {c.image && (
                        <img
                          src={c.image.url}
                          alt={c.name}
                          style={{ width: '280px', maxHeight: 'auto' }}
                        />
                      )}
                      <div className="">
                        {/* <h3>{c.name}</h3> {c.createdAt} */}
                        Posted {moment(c.createdAt).format('MMMM Do YYYY')}
                        {/* {popular.map((l, i) => l.postedBy.name)} */}
                        {/* {c.username} */}
                        {
                        // process.browser && isAuth().role === 'admin' && 
                        (
                          <div className="">
                            {/* <Link href={`/admin/category/${c.slug}`}>
                              <button className="badge btn btn-sm btn-outline-warning  mb-1 float-right">
                                Update
                              </button>
                            </Link>
                            &nbsp; */}
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
        </>
      ));
  return (
    <div key={2000} className={styles.background}>
      <div className={styles.mobilehome}>
        <Layout>
          {/* <div className=" pt-4">
        <div className="">
        <h3 className="font-weight-bold">Your Food Feed</h3>
        </div>
      </div> */}

          <div
            key={1000}
            className=" row flex-column justify-content-center pt-3 "
          >
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
