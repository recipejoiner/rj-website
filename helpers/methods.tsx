import { useEffect } from 'react';

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
