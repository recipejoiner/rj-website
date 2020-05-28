import * as React from 'react'
import Link from 'next/link'

import UserContext from 'helpers/UserContext'
import Logo from 'components/layout/header/Logo'
import NewRecipeLink from 'components/layout/header/NewRecipeLink'
import ProfileLink from 'components/layout/header/ProfileLink'
import HamburgerMenu from 'components/layout/header/HamburgerMenu'
import NavMenuMobile from 'components/layout/header/NavMenuMobile'
import NavMenuDesktop from 'components/layout/header/NavMenuDesktop'
import { CurrentUserLoginCheckType } from 'requests/auth'

interface LoggedInHeaderProps {
  setMenuOpen(menuOpenStatus: boolean): void
  currentUserInfo: CurrentUserLoginCheckType
}
const LoggedInHeader: React.FC<LoggedInHeaderProps> = ({
  setMenuOpen,
  currentUserInfo,
}) => {
  // Partial because the full one also calls setMenuOpen
  const [drawerOpen, setDrawerOpenPartial] = React.useState(false)
  const setDrawerOpen = (status: boolean) => {
    setDrawerOpenPartial(status)
    setMenuOpen(status)
  }
  const [testDropdownOpen, setTestDropdownOpen] = React.useState(false)
  const closeMenus = () => {
    setDrawerOpen(false)
    setTestDropdownOpen(false)
  }

  return (
    <div>
      <header className="bg-white opacity-95 border-b border-gray-500 w-full fixed z-100 inset-x-0 top-0">
        <div className="flex items-center justify-between p-4 relative max-w-12xl z-100 mx-auto h-14 md:h-16">
          <div className="md:hidden">
            <HamburgerMenu
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              closeMenus={closeMenus}
            />
          </div>
          <Logo closeMenus={closeMenus} />
          <NavMenuDesktop
            closeMenus={closeMenus}
            testDropdownOpen={testDropdownOpen}
            setTestDropdownOpen={setTestDropdownOpen}
            currentUserInfo={currentUserInfo}
          />
          <div className="flex flex-row">
            <div className="hidden md:block">
              <ProfileLink
                closeMenus={closeMenus}
                currentUserInfo={currentUserInfo}
              />
            </div>
            <NewRecipeLink closeMenus={closeMenus} />
          </div>
        </div>
        {/* The mobile navigation menu */}
        <div className={`${drawerOpen ? 'block' : 'hidden'}`}>
          <NavMenuMobile
            closeMenus={closeMenus}
            testDropdownOpen={testDropdownOpen}
            setTestDropdownOpen={setTestDropdownOpen}
            currentUserInfo={currentUserInfo}
          />
        </div>
      </header>
    </div>
  )
}

interface NoUserHeaderProps {}
const NoUserHeader: React.FC<NoUserHeaderProps> = ({}) => {
  return (
    <header className="bg-white border-b border-gray-500 w-full fixed z-100 lg:z-90 inset-x-0 top-0">
      <div className="flex items-center justify-between p-4 relative max-w-12xl mx-auto h-14 md:h-16">
        <div className="table-cell align-middle w-1/3">Sign Up</div>
        <Logo closeMenus={() => null} />
        <Link href="/login">
          <a className="table-cell align-middle text-right w-1/3">Log In</a>
        </Link>
      </div>
    </header>
  )
}

interface HeaderProps {
  setMenuOpen(menuOpenStatus: boolean): void
}

const Header: React.FC<HeaderProps> = ({ setMenuOpen }) => {
  const { isLoggedIn, currentUserInfo } = React.useContext(UserContext)
  if (isLoggedIn && currentUserInfo) {
    return (
      <LoggedInHeader
        setMenuOpen={setMenuOpen}
        currentUserInfo={currentUserInfo}
      />
    )
  } else {
    return <NoUserHeader />
  }
}

export default Header
