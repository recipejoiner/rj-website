import * as React from 'react';
import Link from 'next/link';

import UserContext from 'helpers/UserContext';
import { logout } from 'helpers/auth';

interface LoggedInHeaderProps {}
const LoggedInHeader: React.FC<LoggedInHeaderProps> = ({}) => {
  return(
    <React.Fragment>
      <button
        className="table-cell h-full align-middle w-1/3"
        onClick={() => logout(false)}
      >
        log out
      </button>
      <h2 className="table-cell align-middle w-1/3">
        <img
          className="h-10 m-auto"
          src={require('images/logos/rj-logo-outline-nobg.svg')}
        />
      </h2>
      <Link
        href="/login"
      >
      <button
        className="table-cell h-full align-middle text-right w-1/3"
        onClick={() => logout(true)}
      >
        log out everywhere
      </button>
      </Link>
    </React.Fragment>
  )
}

interface NoUserHeaderProps {}
const NoUserHeader: React.FC<NoUserHeaderProps> = ({}) => {
  return(
    <React.Fragment>
      <div
        className="table-cell align-middle w-1/3"
      >
        Sign Up
      </div>
      <h2 className="table-cell align-middle w-1/3">
        <img
          className="h-10 m-auto"
          src={require('images/logos/rj-logo-outline-nobg.svg')}
        />
      </h2>
      <Link
        href="/login"
      >
      <a
        className="table-cell align-middle text-right w-1/3"
      >
        Log In
      </a>
      </Link>
    </React.Fragment>
  )
}

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  const { isLoggedIn } = React.useContext(UserContext);
  return(
    <div>
      <header
        className="px-5 w-screen h-14 border-b border-gray-300 table text-gray-900 flex-row justify-between content-center font-light lowercase tracking-wide text-sm fixed z-50 inset-x-0 top-0"
      >
        { isLoggedIn ?
          <LoggedInHeader />
        :
          <NoUserHeader />
        }
      </header>
      <div className="bg-white opacity-95 w-screen h-14 fixed z-40 inset-x-0 top-0"/>
    </div>
  );
}

export default Header;