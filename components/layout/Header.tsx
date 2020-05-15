import * as React from 'react';
import Link from 'next/link';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  return(
    <header
      className="px-5 w-screen h-14 border-b border-gray-300"
    >
      Header here!
    </header>
  );
}

export default Header;