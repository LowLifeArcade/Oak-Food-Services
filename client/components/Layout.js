import React, { Component } from 'react';
import { state, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import { isAuth, logout } from '../helpers/auth';

import styles from '../styles/Home.module.css';
import { normalizeUnits } from 'moment';

// progressbar
Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  // const [modalShow, setModalShow] = React.useState(false);

  const head = () => (
    <>
      {/* bootstrap */}
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        // href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
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

  // const  MyVerticallyCenteredModal =(props)=> {
  //   return (
  //     <Modal
  //       {...props}
  //       size="lg"
  //       aria-labelledby="contained-modal-title-vcenter"
  //       centered
  //     >
  //       <Modal.Header closeButton>
  //         <Modal.Title id="contained-modal-title-vcenter">
  //           Modal heading
  //         </Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <h4>Centered Modal</h4>
  //         <p>
  //           Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
  //           dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
  //           consectetur ac, vestibulum at eros.
  //         </p>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button onClick={props.onHide}>Close</Button>
  //       </Modal.Footer>
  //     </Modal>
  //   );
  // }

  const nav = () => (
    <nav className={'fixed-top ' + styles.nav}>
      <ul className={'nav nav-tabs ' + styles.nav}>
        <li key="1" className="nav-item pointer-hand">
          <Link href="/">
            <a className="nav-link text-white">Home</a>
          </Link>
        </li>

        {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          <li className="nav-item pointer-hand">
          <Link href="/user/link/create">
            <a
              className="nav-link text-white btn btn-warning"
              style={{ borderRadius: '0px' }}
            >
              {' 📝'}
            </a>
            {/* \u{1F354} */}
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li className="nav-item pointer-hand">
          <Link href="/user/link/create">
            <a
              className="nav-link text-white btn btn-success"
              style={{ borderRadius: '0px' }}
            >
              {'🍱'}
            </a>
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          <li key="2" className="nav-item">
            <Link href="/user">
              <a className="nav-link text-white">Receipts </a>
            </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li className="nav-item pointer-hand">
          <Link href="/admin/link/data">
            <a className="nav-link text-white">{'Order Data'}</a>
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li className="nav-item pointer-hand">
          <Link href="/admin/link/list">
            <a className="nav-link text-white">{'Lists'}</a>
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li className="nav-item pointer-hand">
          <Link href="/admin/link/read">
            <a className="nav-link text-white">{'Receipts'}</a>
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li className="nav-item pointer-hand">
          <Link href="/admin/category/create">
            <a className="nav-link text-white">{'Create Menu'}</a>
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

        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li key="5" className="nav-item ml-auto">
            <Link href="/admin">
              <a className="nav-link text-white">
                Admin Dashboard: {isAuth().name}
              </a>
            </Link>
          </li>
        )}

        {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          <li key="6" className="nav-item ml-auto">
            <Link href="/user">
              <a className="nav-link text-white">Dashboard: {isAuth().name}</a>
            </Link>
          </li>
        )}
        {/* {process.browser && isAuth() && isAuth().role === 'superUser' && (
          <li key='6' className="nav-item ml-auto">
            <Link href="/user">
              <a className="nav-link text-white">S-User: {isAuth().name}</a>
            </Link>
          </li>
        )} */}

        {process.browser && isAuth() && (
          <li key="7" className="nav-item ">
            <Link href="">
              <a
                onClick={logout}
                className="nav-link text-white"
                // data-toggle={() => setModalShow(true)}
              >
                Logout
              </a>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );

  const accordian = () => (
    <accordion className={'fixed-top ' + styles.accordion}>
      <ul className={'nav nav-tabs ' + styles.accordion}>
        <li key="1" className="nav-item pointer-hand">
          {/* <Link href=""> */}
            <a className="nav-link text-white">
              {/* {'🏠'} */}
              {/* <button className="nav-btn open-btn" > */}
              <span onClick={() => setShowSidebar(!showSidebar)} >

                <i className="fas fa-bars"></i>
              </span>
              {/* </button> */}
              </a>
          {/* </Link> */}
        </li>

        {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          // <li className="nav-item pointer-hand">
          <Link href="/user/link/create">
            <a
              className="nav-link text-white btn btn-warning"
              style={{ borderRadius: '0px' }}
            >
              {/* {' 📝'} */}
              <i class="fas fa-pencil-alt"></i>
            </a>
            {/* \u{1F354} */}
          </Link>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          // <li className="nav-item pointer-hand">
          <Link href="/admin/link/list">
            <a
              className="nav-link text-white btn btn-warning"
              style={{ borderRadius: '0px' }}
            >
              {/* {'📝'} */}
              <i class="fas fa-pencil-alt"></i>
            </a>
          </Link>
        )}
        {/* 
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          // <li className="nav-item pointer-hand">
          <Link href="/admin/link/data">
            <a
            className="nav-link text-white"
            >
              {'Order Data'}
            </a>
          </Link>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          // <li className="nav-item pointer-hand">
          <Link href="/admin/link/list">
            <a
            className="nav-link text-white"
            >
              {'Lists'}
            </a>
          </Link>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          // <li className="nav-item pointer-hand">
          <Link href="/admin/link/read">
            <a
            className="nav-link text-white"
            >
              {'Receipts'}
            </a>
          </Link>
        )} */}

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

        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li key="4" className="nav-item ml-auto">
            <Link href="/admin">
              <a className="nav-link text-white">Admin: {isAuth().name}</a>
            </Link>
          </li>
        )}

        {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          <li key="5" className="nav-item ml-auto">
            <Link href="/user">
              <a className="nav-link text-white"> {isAuth().name}'s Receipts</a>
            </Link>
          </li>
        )}

        {/* {process.browser && isAuth() && (
          <li key="6" className="nav-item ">
            <Link href="/login">
              <a onClick={logout} className="nav-link text-white">
                {'✖️'}
                <i className="fas fa-times"></i>
              </a>
            </Link>
          </li>
        )} */}
      </ul>
    </accordion>
  );

  const sideBar = () => (
    <div 
    // style={{ display: showSidebar ? 'None': 'Block' }}
    className={showSidebar ?  styles.sidebarVisible : styles.sidebar }
    >
      <ul className={'sidebar list-unstyled pt-5 p-4'}>
        <span onClick={() => setShowSidebar(false)} >
        <i className="fas fa-times float-right pt-3 "></i>
        </span>
        


        <li key="1" onClick={() => setShowSidebar(false)} className="nav-item pointer-hand pt-4">
          <Link href="/" >
            <a className="nav-link text-white">
            <i class="fas fa-home"></i>&nbsp;&nbsp;&nbsp; Home
            </a>
          </Link>
        </li>
        <li key="1" onClick={() => setShowSidebar(false)} className="nav-item pointer-hand ">
          <Link href="/" >
            <a className="nav-link text-white">
            <i class="fas fa-book-open"></i>&nbsp;&nbsp;&nbsp; Menu
            </a>
          </Link>
        </li>

        {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          <li onClick={() => setShowSidebar(false)} className="nav-item pointer-hand">
          <Link href="/user/link/create">
            <a
              className="nav-link text-white "
              // style={{ borderRadius: '0px' }}
            >
              {/* {' 📝'} */}
              <i class="fas fa-pencil-alt"></i> &nbsp;&nbsp; Meal Request
            </a>
            {/* \u{1F354} */}
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li onClick={() => setShowSidebar(false)} className="nav-item pointer-hand">
          <Link href="/user/link/create">
            <a
              className="nav-link text-white "
              // style={{ borderRadius: '0px' }}
            >
              {/* {'🍱'} */}
              <i class="fas fa-pencil-alt"></i> &nbsp;&nbsp;&nbsp;Meal Request

              
            </a>
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          <li onClick={() => setShowSidebar(false)} key="2" className="nav-item">
            <Link href="/user">
              <a className="nav-link text-white">
              <i class="far fa-file-alt"></i> &nbsp; &nbsp; Receipts 
                </a>
            </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li onClick={() => setShowSidebar(false)} className="nav-item pointer-hand">
          <Link href="/admin/link/data">
            <a className="nav-link text-white">
            <i class="fas fa-calculator"></i>&nbsp;&nbsp;&nbsp;&nbsp;{'Order Data'}</a>
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li onClick={() => setShowSidebar(false)} className="nav-item pointer-hand">
          <Link href="/admin/link/list">
            <a className="nav-link text-white">
            <i class="far fa-folder-open"></i> &nbsp;&nbsp;{ 'Lists'}
              </a>
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li onClick={() => setShowSidebar(false)} className="nav-item pointer-hand">
          <Link href="/admin/link/read">
            <a className="nav-link text-white">
            <i class="far fa-file-alt"></i>&nbsp;&nbsp;&nbsp;{'   Receipts'}</a>
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li onClick={() => setShowSidebar(false)} className="nav-item pointer-hand">
          <Link href="/admin/category/create">
            <a className="nav-link text-white">
            <i class="far fa-file-word"></i>&nbsp;&nbsp;&nbsp;{' Create Menu'}</a>
          </Link>
          </li>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li onClick={() => setShowSidebar(false)} className="nav-item pointer-hand">
          <Link href="/admin/category/read">
            <a className="nav-link text-white">
            <i class="far fa-file-word"></i>&nbsp;&nbsp;&nbsp;{' Edit Menu'}</a>
          </Link>
          </li>
        )}

        {process.browser && !isAuth() && (
          <React.Fragment>
            <li onClick={() => setShowSidebar(false)} key="3" className="nav-item ml-auto">
              <Link href="/login">
                <a className="nav-link text-white">Login</a>
              </Link>
            </li>

            <li onClick={() => setShowSidebar(false)} key="4" className="nav-item">
              <Link href="/register">
                <a className="nav-link text-white">Register</a>
              </Link>
            </li>
          </React.Fragment>
        )}

        {/* {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li onClick={() => setShowSidebar(false)} key="5" className="nav-item ml-auto">
            <Link href="/admin">
              <a className="nav-link text-white">
                {isAuth().name}'s Admin Dashboard
              </a>
            </Link>
          </li>
        )} */}

        {/* {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          <li onClick={() => setShowSidebar(false)} key="6" className="nav-item ml-auto">
            <Link href="/user">
              <a className="nav-link text-white"> {isAuth().name}'s Dashboard</a>
            </Link>
          </li>
        )} */}
        {(
          <li onClick={() => setShowSidebar(false)} key="8" className="nav-item ml-auto">
            <Link href="/user/profile/update">
              <a className="nav-link text-white"> Profile Update</a>
            </Link>
          </li>
        )}
        {/* {process.browser && isAuth() && isAuth().role === 'superUser' && (
          <li key='6' className="nav-item ml-auto">
            <Link href="/user">
              <a className="nav-link text-white">S-User: {isAuth().name}</a>
            </Link>
          </li>
        )} */}

        {process.browser && isAuth() && (
          <li onClick={() => setShowSidebar(false)} key="7" className="nav-item ">
            <Link href="">
              <a
                onClick={logout}
                className="nav-link text-white"
                // data-toggle={() => setModalShow(true)}
              >
                Logout
              </a>
            </Link>
          </li>
        )}
      </ul>
      <hr/>
    </div>
  );

  return (
    
    <React.Fragment>
      {/* <Component> */}
      {head()} {nav()} {accordian()} {sideBar()}{' '}
      <div className={'container pt-5 '}>{children}</div>
      {/* <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      /> */}
      {/* </Component> */}
    </React.Fragment>
  );
};

export default Layout;
