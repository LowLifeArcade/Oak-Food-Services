import React from 'react';
import { state, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import { isAuth, logout } from '../helpers/auth';

import styles from '../styles/Home.module.css';

// progressbar
Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const head = () => (
    <>
      {/* bootstrap */}
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
    </>
  );

  const nav = () => (
    <nav className={styles.nav}>
      <ul className={'nav nav-tabs ' + styles.nav}>
        <li className="nav-item pointer-hand">
          <Link href="/">
            <a className="nav-link text-white">Home</a>
          </Link>
        </li>

        {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          // <li className="nav-item pointer-hand">
          <Link href="/user/link/create">
            <a
              className="nav-link text-white btn btn-warning"
              style={{ borderRadius: '0px' }}
            >
              {' 📝'}
            </a>
            {/* \u{1F354} */}
          </Link>
        )}
        {process.browser && isAuth() && isAuth().role === 'admin' && (
          // <li className="nav-item pointer-hand">
          <Link href="/user/link/create">
            <a
              className="nav-link text-white btn btn-success"
              style={{ borderRadius: '0px' }}
            >
              {'🍱'}
            </a>
          </Link>
        )}

        {process.browser && !isAuth() && (
          <React.Fragment>
            <li className="nav-item ml-auto">
              <Link href="/login">
                <a className="nav-link text-white">Login</a>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/register">
                <a className="nav-link text-white">Register</a>
              </Link>
            </li>
          </React.Fragment>
        )}

        {process.browser && isAuth() && isAuth().role === 'admin' && (
          <li className="nav-item ml-auto">
            <Link href="/admin">
              <a className="nav-link text-white">Admin: {isAuth().name}</a>
            </Link>
          </li>
        )}

        {process.browser && isAuth() && isAuth().role === 'subscriber' && (
          <li className="nav-item ml-auto">
            <Link href="/user">
              <a className="nav-link text-white">User: {isAuth().name}</a>
            </Link>
          </li>
        )}

        {process.browser && isAuth() && (
          <li className="nav-item ">
            <Link href="/login">
              <a onClick={logout} className="nav-link text-white">
                Logout
              </a>
            </Link>
          </li>
        )}
      </ul>

      
    </nav>
  );

  const sideBar = () => {
      // 
  }

  return (
    <React.Fragment>
      {head()} {nav()} {sideBar()} <div className={'container pt-5 pb-2 '}>{children}</div>
    </React.Fragment>
  );
};

export default Layout;
