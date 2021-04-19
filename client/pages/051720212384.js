import React, { useState, useEffect } from 'react';
import styles from '../styles/Pages.module.css';
import Link from 'next/link';
import Layout from '../components/Layout';
// import { isAuth } from '../helpers/auth';
import Router from 'next/router';
import moment from 'moment';


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

  return (
    <React.Fragment>
      <Layout>
        <>
          <h2 className='pt-5'>Late Order for Week of May 17th</h2>
          <br />
          Click to place late order. (You must be logged in)
          <br />
          <br />
          <Link href="/user/late_order/create">
            <a>
              <button
                className={'btn btn-outline-secondary'}
                onClick={(e) =>
                  localStorage.setItem(
                    'search-date',
                    JSON.stringify(moment('05/17/2021').format('l'))
                  )
                }
              >
                Late Order
              </button>
            </a>
          </Link>
        </>
      </Layout>
    </React.Fragment>
  );
};

export default Home;
