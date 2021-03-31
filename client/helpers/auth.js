import cookie from 'js-cookie';
import Router from 'next/router';

// set in cookie
export const setCookie = (key, value) => {
  let now = new Date();
  now.setTime(now.getTime() + 1 * 3600 * 1000);

  if (process.browser) {
    // if window.
    cookie.set(key, value, {
      expires: 1,
    });
  }
  console.log('jwt expires in ', now.toUTCString())
};

// remove from cookie
export const removeCookie = (key) => {
  if (process.browser) {
    // if window.
    cookie.remove(key);
  }
};

export const getCookie = (key, req) => {
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

export const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  let token = req.headers.cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!token) {
    return undefined;
  }
  let tokenValue = token.split('='[1]);
  return tokenValue;
};

// set in localstorage
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from local storage
export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

// authenticate user by passing data to cookie and localstorage during signin
export const authenticate = (response, next) => {
  setCookie('token', response.data.token);
  setLocalStorage('user', response.data.user);
  next();
};

// access user info from localstorage
export const isAuth = () => {
  if (process.browser) {
    const cookieChecked = getCookie('token');
    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      } else {
        return false;
      }
    }
  }
};

export const logout = () => {
  let answer = window.confirm('Logout Now?');
  if (answer) {
    setTimeout(() => {
      removeCookie('token');
      removeLocalStorage('user');
      Router.push('/login');
    }, 700);
  }
};
export const autoLogout = () => {
  removeCookie('token');
  removeLocalStorage('user');
  Router.push('/login');
};

export const updateUser = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem('user')) {
      let auth = JSON.parse(localStorage.getItem('user'));
      auth = user;
      localStorage.setItem('user', JSON.stringify(auth));
      next();
    }
  }
};
