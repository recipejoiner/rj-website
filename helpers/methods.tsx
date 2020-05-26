import React, { useEffect } from 'react';
import Router from 'next/router';

export function useEvent(event: string, handler: () => void, passive=false) {
  useEffect(() => {
    // initiate the event handler
    window.addEventListener(event, handler, passive);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener(event, handler, passive);
    };
  });
}

// cookie utilities
export function setCookie(name: string, val: string) {
  const date = new Date();

  // set expiration date to 4 weeks
  date.setTime(date.getTime() + (4 * 7 * 24 * 60 * 60 * 1000));

  // set the cookie
  document.cookie = `${name}=${val};expires=${date.toUTCString()};path=/`;
}

export function getCookieFromCookies(cookies: string, name: string) {
  const val = `; ${cookies}`;
  const parts = val.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
}

export function getCookie(name: string) {
  const val = `; ${document.cookie}`;
  const parts = val.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
}

export function deleteCookie(name: string) {
  const date = new Date();

  // set expiration date to yesterday
  date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

  // the cookie
  document.cookie = `${name}=;expires=${date.toUTCString()};path=/`;
}

export function redirectTo(path: string) {
  Router.push(path);
}

export function areLoggedIn() {
  // on first load, window will be undefined. this is what the onLoad/useEvent handler is for. 
  // on navigation, window WILL be defined, so the onLoad handler will never fire.
  const [ loggedIn, setLoggedIn] = React.useState(typeof window !== 'undefined' ? !!getCookie('UserToken') : false);
  const onLoad = () => {
    setLoggedIn(!!getCookie('UserToken'));
  };
  useEvent('load', onLoad);
  return loggedIn;
}

export function ifLoggedInRedirectTo(path: string) {
  if (areLoggedIn()) {
    redirectTo(path)
  }
}

// EXPERIMENTAL METHOD
export function ensureVarIsSet(variable: any) {
  return new Promise(function (resolve, reject) {
      (function waitForVar(){
          if (variable) {
            return resolve(variable);
          }
          setTimeout(waitForVar, 30);
      })();
  });
}
