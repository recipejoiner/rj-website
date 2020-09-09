import * as React from 'react'
import Link from 'next/link'

import AppOverlay from 'components/AppOverlay'
import UserContext from 'helpers/UserContext'
import Logo from 'components/layout/header/Logo'
import NewRecipeLink from 'components/layout/header/NewRecipeLink'
import ProfileLink from 'components/layout/header/ProfileLink'
import NotificationCenter from 'components/layout/header/NotificationCenter'
import HamburgerMenu from 'components/layout/header/HamburgerMenu'
import NavMenuMobile from 'components/layout/header/NavMenuMobile'
import NavMenuDesktop from 'components/layout/header/NavMenuDesktop'
import { CurrentUserLoginCheckType } from 'requests/auth'
import SearchOverlay from 'components/layout/header/Search'

const NOTIFICATION_ACTIVE = require('images/icons/new-notification.svg')
const NOTIFICATION = require('images/icons/notification.svg')

interface LoggedInHeaderProps {
  setMenuOpen(menuOpenStatus: boolean): void
  setScrollFreeze(scrollFreeze: boolean): void
  currentUserInfo: CurrentUserLoginCheckType
}
const LoggedInHeader: React.FC<LoggedInHeaderProps> = ({
  setMenuOpen,
  setScrollFreeze,
  currentUserInfo,
}) => {
  // Partial because the full one also calls setMenuOpen
  const [drawerOpen, setDrawerOpenPartial] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const [newNotifications, setNewNotifications] = React.useState(false)

  const setDrawerOpen = (status: boolean) => {
    setDrawerOpenPartial(status)
    setMenuOpen(status)
  }
  const [testDropdownOpen, setTestDropdownOpen] = React.useState(false)
  const closeMenus = () => {
    setDrawerOpen(false)
    setTestDropdownOpen(false)
  }

  const openSearch = () => {
    setSearchOpen(true)
    setScrollFreeze(true)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setScrollFreeze(false)
  }

  const openNotifications = () => {
    setNotificationsOpen(true)
    setScrollFreeze(true)
  }

  const closeNotifications = () => {
    setNotificationsOpen(false)
    setScrollFreeze(false)
  }

  return (
    <div>
      <header className="bg-white opacity-95 border-b border-gray-500 w-full fixed z-100 inset-x-0 top-0">
        <div className="grid grid-cols-12  relative max-w-12xl z-100 mx-auto h-14 md:h-16">
          {/* <div className="md:hidden">
            <HamburgerMenu
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              closeMenus={closeMenus}
            />
          </div> */}
          <Logo closeMenus={closeMenus} className="col-span-2 m-auto" />
          <input
            className="col-span-5 md:col-span-8 p-2 m-auto w-full outline-none border rounded"
            type="search"
            placeholder="Search"
            onFocus={openSearch}
          ></input>
          {!!searchOpen ? (
            <AppOverlay
              onExit={closeSearch}
              children={<SearchOverlay />}
              header={
                <input
                  className="col-span-5 md:col-span-8 p-2 m-auto w-full outline-none border rounded"
                  type="search"
                  placeholder="Search"
                ></input>
              }
            />
          ) : null}
          {/* <NavMenuDesktop
            closeMenus={closeMenus}
            testDropdownOpen={testDropdownOpen}
            setTestDropdownOpen={setTestDropdownOpen}
            currentUserInfo={currentUserInfo}
          /> */}
          <div className="grid grid-cols-3 col-span-5 md:col-span-2 md:gap-4 m-auto">
            <div className="">
              <ProfileLink
                closeMenus={closeMenus}
                currentUserInfo={currentUserInfo}
              />
            </div>
            <div>
              <a onClick={openNotifications}>
                <img
                  className="w-10 p-1 text-gray-900 hover:text-gray-700 fill-current"
                  src={newNotifications ? NOTIFICATION_ACTIVE : NOTIFICATION}
                />
              </a>
              <div className={`${notificationsOpen ? 'visible' : 'invisible'}`}>
                {/* <div> */}
                <AppOverlay
                  onExit={closeNotifications}
                  children={<NotificationCenter />}
                  header={<h1 className="text-2xl">Notifications</h1>}
                />
              </div>
            </div>
            <NewRecipeLink closeMenus={closeMenus} />
          </div>
          {/* The mobile navigation menu */}
          {/* <div className={`${drawerOpen ? 'block' : 'hidden'}`}>
          <NavMenuMobile
            closeMenus={closeMenus}
            testDropdownOpen={testDropdownOpen}
            setTestDropdownOpen={setTestDropdownOpen}
            currentUserInfo={currentUserInfo}
          />
        </div> */}
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
        <Link href="/signup">
          <a className="table-cell align-middle text-left w-1/3">Sign Up</a>
        </Link>
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
  setScrollFreeze(scrollFreeze: boolean): void
}

const Header: React.FC<HeaderProps> = ({ setMenuOpen, setScrollFreeze }) => {
  const { currentUserInfo } = React.useContext(UserContext)
  // console.log('in header')
  // console.log('React.useContext(UserContext)', React.useContext(UserContext))
  if (currentUserInfo) {
    return (
      <LoggedInHeader
        setScrollFreeze={setScrollFreeze}
        setMenuOpen={setMenuOpen}
        currentUserInfo={currentUserInfo}
      />
    )
  } else {
    return <NoUserHeader />
  }
}

export default Header
