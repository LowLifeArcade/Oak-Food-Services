import React, { useEffect, useRef } from 'react';
import Footer from './Footer';
import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import { isAuth, logout } from '../helpers/auth';
import styles from '../styles/Home.module.css';
// import user from '../pages/user';

// if(typeof window !== 'undefined') {
//   hydrate(window.___NEXT_DATA__.ids)
// }

// progressbar
Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  // const [loaded, setLoaded] = useState(false);
  // window.addEventListener('Click', setShowSideMenu(false));

  // document.addEventListener('DOMContentLoaded', ready);

  // function ready() {
  //   alert('DOM is ready');

  //   // image is not yet loaded (unless it was cached), so the size is 0x0
  //   // alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);
  // }

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoaded(true)
  //   }, 800);
  // }, []);
  const sideBarRef = useRef();
  const sideMenuRef = useRef()

  useEffect(() => {
    const handleClick = (event) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        // window.addEventListener('click', setShowSideMenu(false));
        setShowSidebar(false)
        // setShowSideMenu(false)
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  });

  useEffect(() => {
    const handleClick = (event) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
        // window.addEventListener('click', setShowSideMenu(false));
        // setShowSidebar(false)
        setShowSideMenu(false)
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  });

  const head = () => (
    <>
    <meta name="google" content="notranslate" />
      {/* bootstrap */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.1.1/chart.min.js" integrity="sha512-BqNYFBAzGfZDnIWSAEGZSD/QFKeVxms2dIBPfw11gZubWwKUjEgmFUtUls8vZ6xTRZN/jaXGHD/ZaxD9+fDo0A==" crossOrigin="anonymous"></script>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />
      {/* progress bar cdn */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
        integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
        crossOrigin="anonymous"
      />
      {/* <link rel="stylesheet" href="../styles/Home.module.css"/> */}

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
        crossOrigin="anonymous"
      />
    </>
  );

  const nav = () => (
    <div className={styles.noPrint}>
      <nav className={'fixed-top ' + styles.nav}>
        <ul className={'nav nav-tabs ' + styles.nav}>
          <li key="1" className="nav-item pointer-hand">
            {/* <Link href="/">
              <a className="nav-link text-white">
                <i class="fas fa-chalkboard-teacher"></i>&nbsp;
              </a>
            </Link> */}
            {/* <li> */}
              <Link href="/">
                <a
                  className={'nav-link text-white  '}
                  style={{ borderRadius: '3px' }}
                >
                  &nbsp;
                  <img
                    src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/OPUSD+White+Lettering+(2).png"
                    loading="lazy"
                    loading="lazy"
                    alt=""
                    class="stepimage"
                    width="40"
                  />
                </a>
              </Link>
            </li>
          {/* </li> */}

          

          <li className="nav-item pointer-hand">
          {process.browser && isAuth() && 
          // isAuth().role === 'subscriber' && 
          (
              <Link href="/user/link/create">
                <a
                  className="nav-link text-white btn btn-warning "
                  style={{ borderRadius: '3px' }}
                >
                  {' 📝 '}
                </a>
              </Link>
          )}
          </li>
          {/* {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li className="nav-item pointer-hand">
              <Link href="/user/link/create">
                <a
                  className="nav-link text-white btn btn-warning "
                  style={{ borderRadius: '3px' }}
                >
                  {' 🍱 '}
                </a>
              </Link>
            </li>
          )} */}

{
          // process.browser && isAuth() && isAuth().role === 'subscriber' && 
          (
            <li key="200" className="nav-item">
              <Link href="/menus">
                <a className="nav-link text-white">
                  {/* <i class="fas fa-book-open"></i> */}
                  <i class="fas fa-columns"></i>
                  <span>&nbsp;&nbsp;</span>
                  Weekly Menu{' '}
                </a>
              </Link>
            </li>
          )}

            <li key="2" className="nav-item">
          {process.browser && isAuth() &&  (
              <Link href="/user">
                <a className="nav-link text-white">
                <i class="fas fa-receipt"></i>&nbsp;&nbsp;Receipts{' '}
                </a>
              </Link>
          )}
          </li>
         
          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li className="nav-item pointer-hand">
              <Link href="/admin/link/data">
                <a className="nav-link text-white">
                  <span>&nbsp;&nbsp;</span>
                  <i class="fas fa-chart-bar"></i>&nbsp;
                  {'Order Data'}
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() 
          && isAuth().role === 'admin' && (
            <li className="nav-item pointer-hand">
              <Link href="/admin/link/list">
                <a className="nav-link text-white">
                  <i class="far fa-folder-open"></i>&nbsp;
                  {'Lists'}
                </a>
              </Link>
            </li>
          )}
          {/* {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li className="nav-item pointer-hand">
            <Link href="/admin/link/read">
              <a className="nav-link text-white">{'Receipts'}</a>
            </Link>
          </li>
        )} */}
          {process.browser && isAuth() && isAuth().role === 'admin' && isAuth().userCode === 'DOOB' && (
            <li className="nav-item pointer-hand">
              <Link href="/admin/category/create">
                <a className="nav-link text-white">
                <i class="fas fa-money-check"></i>&nbsp;&nbsp;
                  {/* <i class="fas fa-book-open"></i>&nbsp; */}
                  {'Create Menu'}
                </a>
              </Link>
            </li>
          )}

          {process.browser && isAuth() && isAuth().role === 'admin' &&  isAuth().userCode === 'LYF' && (
            <li className="nav-item pointer-hand">
              <Link href="/admin/category/create">
                <a className="nav-link text-white">
                <i class="fas fa-money-check"></i>&nbsp;&nbsp;
                  {/* <i class="fas fa-book-open"></i>&nbsp; */}
                  {'Create Menu'}
                </a>
              </Link>
            </li>
          )}

          {process.browser && !isAuth() && (
            <React.Fragment>
              <li key="3" className="nav-item ml-auto">
                <Link href="/login">
                  <a className="nav-link text-white">Login</a>
                </Link>
              </li>

              <li key="4" className="nav-item">
                <Link href="/register">
                  <a className="nav-link text-white">Register</a>
                </Link>
              </li>
            </React.Fragment>
          )}

          {/* {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li key="5" className="nav-item ml-auto">
          <Link href="/admin">
          <a className="nav-link text-white">
          Admin Dashboard: {isAuth().name}
          </a>
          </Link>
          </li>
        )} */}

          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li key="5" className="nav-item ml-auto">
              <a
              ref={sideMenuRef}
                onClick={() => setShowSideMenu(!showSideMenu)}
                className="btn nav-link text-white"
              >
                <span>Admin Dashboard: {isAuth().name}</span>
              </a>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'subscriber' && (
            <li key="6" className="nav-item ml-auto">
              <a
              ref={sideMenuRef}
                onClick={() => setShowSideMenu(!showSideMenu)}
                className="btn nav-link text-white"
              >
                <span>Dashboard: {isAuth().name}</span>
              </a>
            </li>
          )}
          {/* {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          <li key="6" className="nav-item ml-auto">
            <Link href="/user">
              <a className="nav-link text-white">Dashboard: {isAuth().name}</a>
            </Link>
          </li>
        )} */}

          {/* {process.browser && isAuth() && (
          <li key="7" className="nav-item ">
            <Link href="">
              <a onClick={logout} className="nav-link text-white">
                Logout
              </a>
            </Link>
          </li>
        )} */}
        </ul>
      </nav>
    </div>
  );

  const fakeNav = () => (
    <div className={styles.noPrint}>
      <nav className={'fixed-top ' + styles.nav}>
        <ul className={'nav nav-tabs ' + styles.nav}>
          <li key="1" className="nav-item pointer-hand">
            <Link href="/">
              <a className="nav-link text-white">
                <i class="fas fa-chalkboard-teacher"></i>
              </a>
            </Link>
          </li>

          <li className="nav-item pointer-hand">
            <Link href="/user/link/create">
              <a
                className="nav-link text-white btn btn-warning"
                style={{ borderRadius: '3px' }}
              >
                {' 📝'}
              </a>
            </Link>
          </li>

          <li key="6" className="nav-item ml-auto">
            <a className="btn nav-link text-white">
              <span>Loading...</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );

  const accordian = () => (
    <div className={styles.noPrint}>
      <div className={'fixed-top ' + styles.accordion}>
        <ul className={'nav nav-tabs ' + styles.accordion}>
          <li>
            <Link href="/">
              <a
                className={'nav-link text-white  '}
                style={{ borderRadius: '3px' }}
              >
                &nbsp;
                <img
                  src="https://oakfoods.s3.us-east-2.amazonaws.com/Food+app+images/Food+app+images/OPUSD+White+Lettering+(2).png"
                  loading="lazy"
                  loading="lazy"
                  alt=""
                  class="stepimage"
                  width="40"
                />
              </a>
            </Link>
          </li>
          <li>
            {process.browser && isAuth() && isAuth().role === 'subscriber' && (
              <Link href="/user/link/create">
                <a
                  className={'nav-link text-white btn btn-warning '}
                  style={{ borderRadius: '3px' }}
                >
                  <i class="fas fa-pencil-alt"></i>
                </a>
              </Link>
            )}
          </li>

          <li>
          {process.browser && isAuth() && isAuth().role === 'admin' && isAuth().userCode !== 'STAO' && (
            <Link href="/user/link/create">
              <a
                className="nav-link text-white btn btn-warning"
                style={{ borderRadius: '3px' }}
                >
                <i class="fas fa-pencil-alt"></i>
              </a>
            </Link>
          )}
          </li>
          &nbsp;&nbsp;
          {
          // process.browser && isAuth()&& isAuth().role === 'subscriber' && 
          process.browser &&  isAuth() && isAuth().userCode !== 'STAO' &&
          (
            <li
              key="1133"
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand "
            >
              <Link href="/menus">
                <a className="nav-link text-white">
                  {/* <i class="fas fa-book-open"></i> */}
                  <i class="fas fa-columns"></i>
                </a>
              </Link>
            </li>
          )}
          
          {process.browser && isAuth() && isAuth().role === 'admin' && isAuth().userCode !== 'STAO' && (
            <li
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/link/data">
                <a className="nav-link text-white">
                  {/* <i class="fas fa-calculator"></i> */}
                  <i class="fas fa-chart-bar"></i>
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'admin' && isAuth().userCode !== 'STAO' && (
            <li
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/link/list">
                <a className="nav-link text-white">
                  <i class="far fa-folder-open"></i>
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'admin' && isAuth().userCode === 'STAO' && (
            <li
              onClick={() => setShowSidebar(false)}
              className="nav-item  pointer-hand"
            >
              <Link href="/admin/link/list">
                <a className="nav-link text-white btn btn-warning">
                  <i class="far fa-folder-open"></i> &nbsp;&nbsp; Curbside List
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'subscriber' && (
            <li key="2" className="nav-item">
              <Link href="/user">
                <a className="nav-link text-white">
                  {/* <i class="far fa-file-alt"></i> */}
                  <i class="fas fa-receipt"></i>
                </a>
              </Link>
            </li>
          )}
         
          {process.browser && !isAuth() && (
            <React.Fragment>
              <li key="2" className="nav-item ml-auto">
                <Link href="/login">
                  <a className="nav-link text-white">Login</a>
                </Link>
              </li>

              <li key="3" className="nav-item">
                <Link href="/register">
                  <a className="nav-link text-white">Register</a>
                </Link>
              </li>
            </React.Fragment>
          )}
          {/* {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li key="4" className="nav-item ml-auto">
              <Link href="/admin/link/list">
                <a className="nav-link text-white">
                  <>
                    <i class="fas fa-user-alt"></i>
                  </>
                  &nbsp;&nbsp;

                </a>
              </Link>
            </li>
          )} */}
          {process.browser && isAuth() && (
            <li key="1" className="nav-item pointer-hand ml-auto">
              <a
                ref={sideBarRef}
                onClick={() => setShowSidebar(!showSidebar)}
                className="nav-link text-white"
              >
                <span>
                  &nbsp;<i className="fas fa-bars"></i>&nbsp;
                  {/* <i class="fas fa-hamburger"></i> */}
                </span>
              </a>
            </li>
          )}
          {/* {process.browser && isAuth() && isAuth().role === 'subscriber' && (
            <li key="5" className="nav-item ml-auto">
              <Link href="/user/profile/update">
                <a className="nav-link text-white">
                  {' '}

                  <><i class="fas fa-user-alt"></i></>&nbsp;&nbsp;
                </a>
              </Link>
            </li>
          )} */}
        </ul>
      </div>
    </div>
  );

  const sideBar = () => (
    <div className={styles.noPrint}>
      <div className={showSidebar ? styles.sidebarVisible : styles.sidebar}>
        <ul className={'sidebar list-unstyled pt-5 p-4'}>
          <span onClick={() => setShowSidebar(false)}>
            <i className="fas fa-times float-right pt-3 "></i>
          </span>

          {
            <li
              key="101"
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand pt-4"
            >
              <Link href="/">
                <a className="nav-link text-white">
                  <i class="fas fa-home"></i>&nbsp;&nbsp;&nbsp; Home
                </a>
              </Link>
            </li>
          }
          {process.browser && isAuth() && (
            <li
              key="1"
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand "
            >
              <Link href="/menus">
                <a className="nav-link text-white">
                <i class="fas fa-columns"></i>&nbsp;&nbsp;&nbsp; Weekly Menu
                </a>
              </Link>
            </li>
          )}

          {process.browser && isAuth() && isAuth().role === 'subscriber' && (
            <li
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/user/link/create">
                <a className="nav-link text-white ">
                  <i class="fas fa-pencil-alt"></i> &nbsp;&nbsp; Meal Request
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/user/link/create">
                <a className="nav-link text-white ">
                  <i class="fas fa-pencil-alt"></i> &nbsp;&nbsp;&nbsp;Meal
                  Request
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && (
            <li
              onClick={() => setShowSidebar(false)}
              key="2"
              className="nav-item"
            >
              <Link href="/user">
                <a className="nav-link text-white">
                <i class="fas fa-receipt"></i> &nbsp; &nbsp; Receipts
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'admin' && <hr />}

          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/link/data">
                <a className="nav-link text-white">
                  <i class="fas fa-calculator"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                  {'Order Data'}
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/link/list">
                <a className="nav-link text-white">
                  <i class="far fa-folder-open"></i> &nbsp;&nbsp;{'Lists'}
                </a>
              </Link>
            </li>
          )}
          {/* {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li
            onClick={() => setShowSidebar(false)}
            className="nav-item pointer-hand"
          >
            <Link href="/admin/link/read">
              <a className="nav-link text-white">
                <i class="far fa-file-alt"></i>&nbsp;&nbsp;&nbsp;
                {'  All Receipts'}
              </a>
            </Link>
          </li>
        )} */}

          {process.browser && isAuth() && isAuth().role === 'admin' && isAuth().userCode === 'DOOB' && (
            <li
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/category/create">
                <a className="nav-link text-white">
                <i class="fas fa-money-check"></i>&nbsp;&nbsp;&nbsp;
                  {/* <i class="far fa-file-word"></i>&nbsp;&nbsp;&nbsp; */}
                  {' Create Menu'}
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'admin' && isAuth().userCode === 'LYF' && (
            <li
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/category/create">
                <a className="nav-link text-white">
                <i class="fas fa-money-check"></i>&nbsp;&nbsp;&nbsp;
                  {/* <i class="far fa-file-word"></i>&nbsp;&nbsp;&nbsp; */}
                  {' Create Menu'}
                </a>
              </Link>
            </li>
          )}

          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li
              onClick={() => setShowSidebar(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/category/read">
                <a className="nav-link text-white">
                  <i class="far fa-file-word"></i>&nbsp;&nbsp;&nbsp;
                  {' Edit Menu'}
                </a>
              </Link>
            </li>
          )}

          {/* {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li
            onClick={() => setShowSideMenu(false)}
            className="nav-item pointer-hand"
          >
            <Link href="/user/profile/add">
              <a className="nav-link text-white">
                <i class="far fa-file-word"></i>&nbsp;&nbsp;&nbsp;
                {' Add Students'}
              </a>
            </Link>
          </li>
        )} */}
          <hr />

          {process.browser && !isAuth() && (
            <React.Fragment>
              <li
                onClick={() => setShowSidebar(false)}
                key="3"
                className="nav-item ml-auto"
              >
                <Link href="/login">
                  <a className="nav-link text-white">Login</a>
                </Link>
              </li>

              <li
                onClick={() => setShowSidebar(false)}
                key="4"
                className="nav-item"
              >
                <Link href="/register">
                  <a className="nav-link text-white">Register</a>
                </Link>
              </li>
            </React.Fragment>
          )}

          {
            // pageloaded &&
            process.browser && isAuth() && (
              <li
                onClick={() => setShowSidebar(false)}
                key="8"
                className="nav-item ml-auto"
              >
                <Link href="/user/profile/update">
                  <a className="nav-link text-white"> Profile Update</a>
                </Link>
              </li>
            )
          }

          {
            // pageloaded &&
            process.browser && isAuth() && (
              <li
                onClick={() => setShowSidebar(false)}
                key="7"
                className="nav-item "
              >
                <Link href="">
                  <a onClick={logout} className="nav-link text-white">
                    Logout
                  </a>
                </Link>
              </li>
            )
          }
        </ul>
      </div>
    </div>
  );

  const sideMenu = () => (
    <div className={styles.noPrint}>
      <div className={showSideMenu ? styles.sideMenuVisible : styles.sideMenu}>
        <ul className={'sidebar list-unstyled pt-5 p-4'}>
          <span onClick={() => setShowSideMenu(false)}>
            <i className="fas fa-times float-right pt-3 "></i>
          </span>

          {
            <li
              key="101"
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand pt-4"
            >
              <Link href="/">
                <a className="nav-link text-white">
                  <i class="fas fa-home"></i>&nbsp;&nbsp;&nbsp; Home
                </a>
              </Link>
            </li>
          }
          {process.browser && isAuth() && (
            <li
              key="1"
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand "
            >
              <Link href="/menus">
                <a className="nav-link text-white">
                <i class="fas fa-columns"></i>&nbsp;&nbsp;&nbsp; Weekly Menu
                </a>
              </Link>
            </li>
          )}

          {process.browser && isAuth() && isAuth().role === 'subscriber' && (
            <li
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/user/link/create">
                <a className="nav-link text-white ">
                  <i class="fas fa-pencil-alt"></i> &nbsp;&nbsp; Meal Request
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/user/link/create">
                <a className="nav-link text-white ">
                  <i class="fas fa-pencil-alt"></i> &nbsp;&nbsp;&nbsp;Meal
                  Request
                </a>
              </Link>
            </li>
          )}
          {
            // process.browser && isAuth() && isAuth().role === 'subscriber' &&
            <li
              onClick={() => setShowSideMenu(false)}
              key="2"
              className="nav-item"
            >
              <Link href="/user">
                <a className="nav-link text-white">
                  {/* <i class="far fa-file-alt"></i>  */}
                  <i class="fas fa-receipt"></i>
                  &nbsp; &nbsp; Receipts
                </a>
              </Link>
            </li>
          }
          {process.browser && isAuth() && isAuth().role === 'admin' && <hr />}

          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/link/data">
                <a className="nav-link text-white">
                  <i class="fas fa-calculator"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                  {'Order Data'}
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/link/list">
                <a className="nav-link text-white">
                  <i class="far fa-folder-open"></i> &nbsp;&nbsp;{'Lists'}
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/link/read">
                <a className="nav-link text-white">
                  <i class="far fa-file-alt"></i>&nbsp;&nbsp;&nbsp;
                  {'  All Receipts'}
                </a>
              </Link>
            </li>
          )}

          {process.browser && isAuth() && isAuth().role === 'admin' &&  isAuth().userCode === 'DOOB' && (
            <li
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/category/create">
                <a className="nav-link text-white">
                  <i class="far fa-file-word"></i>&nbsp;&nbsp;&nbsp;
                  {' Create Menu'}
                </a>
              </Link>
            </li>
          )}
          {process.browser && isAuth() && isAuth().role === 'admin' && isAuth().userCode === 'LYF'  && (
            <li
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/category/create">
                <a className="nav-link text-white">
                  <i class="far fa-file-word"></i>&nbsp;&nbsp;&nbsp;
                  {' Create Menu'}
                </a>
              </Link>
            </li>
          )}

          {process.browser && isAuth() && isAuth().role === 'admin' && (
            <li
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/admin/category/read">
                <a className="nav-link text-white">
                  <i class="far fa-file-word"></i>&nbsp;&nbsp;&nbsp;
                  {' Edit Menu'}
                </a>
              </Link>
            </li>
          )}

          {process.browser && isAuth() && isAuth().role === 'admin' && isAuth().userCode === 'DOOB' && (
            <li
              onClick={() => setShowSideMenu(false)}
              className="nav-item pointer-hand"
            >
              <Link href="/user/profile/add">
                <a className="nav-link text-white">
                  <i class="far fa-file-word"></i>&nbsp;&nbsp;&nbsp;
                  {' Add Students'}
                </a>
              </Link>
            </li>
          )}
          <hr />

          {process.browser && !isAuth() && (
            <React.Fragment>
              <li
                onClick={() => setShowSideMenu(false)}
                key="3"
                className="nav-item ml-auto"
              >
                <Link href="/login">
                  <a className="nav-link text-white">Login</a>
                </Link>
              </li>

              <li
                onClick={() => setShowSideMenu(false)}
                key="4"
                className="nav-item"
              >
                <Link href="/register">
                  <a className="nav-link text-white">Register</a>
                </Link>
              </li>
            </React.Fragment>
          )}

          {process.browser && isAuth() && (
            <li
              onClick={() => setShowSideMenu(false)}
              key="8"
              className="nav-item ml-auto"
            >
              <Link href="/user/profile/update">
                <a className="nav-link text-white"> Profile Update</a>
              </Link>
            </li>
          )}

          {process.browser && isAuth() && (
            <li
              onClick={() => setShowSideMenu(false)}
              key="7"
              className="nav-item "
            >
              <Link href="">
                <a onClick={logout} className="nav-link text-white">
                  Logout
                </a>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {head()}
      {/* {!fakeNav()} */}
      {nav()}
      {accordian()}
      {sideMenu()}
      {sideBar()} <div className={'container pt-5 '}>{children}</div>
      <Footer></Footer>
    </React.Fragment>
  );
};

export default Layout;
