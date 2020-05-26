import * as React from 'react';
import Link from 'next/link';

import UserContext from 'helpers/UserContext';
import { logout } from 'helpers/auth';
import Logo from 'components/layout/header/Logo';

interface LoggedInHeaderProps {
  setMenuOpen(menuOpenStatus: boolean): void;
  closeMenus(): void;
}
const LoggedInHeader: React.FC<LoggedInHeaderProps> = ({
  setMenuOpen,
  closeMenus
}) => {
  return(
    <header className="bg-white opacity-95 border-b border-gray-500 w-full fixed z-100 inset-x-0 top-0">
      <div className="flex items-center justify-between p-4 relative max-w-12xl mx-auto h-14">
        <button
          className="table-cell h-full align-middle text-left w-1/3"
          onClick={() => logout(false)}
        >
          log out
        </button>
        <Logo
          closeMenus={closeMenus}
        />
        <button
          className="table-cell h-full align-middle text-right w-1/3"
          onClick={() => logout(true)}
        >
          log out everywhere
        </button>
      </div>
    </header>
  )
}

interface NoUserHeaderProps {}
const NoUserHeader: React.FC<NoUserHeaderProps> = ({}) => {
  return(
    <header className="bg-white border-b border-gray-500 w-full fixed z-100 lg:z-90 inset-x-0 top-0">
      <div className="flex items-center justify-between p-4 relative max-w-12xl mx-auto h-14">
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
      </div>
    </header>
  )
}

interface HeaderProps {
	setMenuOpen(menuOpenStatus: boolean): void;
}

const Header: React.FC<HeaderProps> = ({
  setMenuOpen
}) => {
  const { isLoggedIn } = React.useContext(UserContext);
  const closeMenus = () => {
		// close all menus
  }
  if (isLoggedIn) {
    return(
      <LoggedInHeader
        setMenuOpen={setMenuOpen}
        closeMenus={closeMenus}
      />
    );
  }
  else {
    return(<NoUserHeader />);
  }
}

export default Header;
