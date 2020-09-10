import * as React from 'react'
import Link from 'next/link'

import AppOverlay from 'components/AppOverlay'
import UserContext from 'helpers/UserContext'
import ScreenContext from 'helpers/ScreenContext'
import Logo from 'components/layout/header/Logo'
import NewRecipeLink from 'components/layout/header/NewRecipeLink'
import ProfileLink from 'components/layout/header/ProfileLink'
import NotificationCenter from 'components/layout/header/NotificationCenter'
import { CurrentUserLoginCheckType } from 'requests/auth'
import SearchOverlay from 'components/layout/header/Search'

const NOTIFICATION_ACTIVE = require('images/icons/new-notification.svg')
const NOTIFICATION = require('images/icons/notification.svg')

interface LoggedInHeaderProps {
  currentUserInfo: CurrentUserLoginCheckType
}
const LoggedInHeader: React.FC<LoggedInHeaderProps> = ({ currentUserInfo }) => {
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [newNotifications, setNewNotifications] = React.useState(false)
  const { notificationsOpen, setNotificationsState } = React.useContext(
    ScreenContext
  )

  const openSearch = () => {
    setSearchOpen(true)
  }

  const closeSearch = () => {
    setSearchOpen(false)
  }

  const openNotifications = () => {
    console.log('opening notes')
    setNotificationsState ? setNotificationsState(true) : console.log('ooops')
  }

  const closeNotifications = () => {
    setNotificationsState ? setNotificationsState(false) : null
  }

  return (
    <div>
      <header className="bg-white opacity-95 border-b border-gray-500 w-full fixed z-100 inset-x-0 top-0">
        <div className="grid grid-cols-12  relative max-w-12xl z-100 mx-auto h-14 md:h-16">
          <Logo className="col-span-2 m-auto" />
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

          <div className="grid grid-cols-3 col-span-5 md:col-span-2 md:gap-4 m-auto">
            <div className="">
              <ProfileLink currentUserInfo={currentUserInfo} />
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
                  header={<h1 className="text-2xl">Notifications Center</h1>}
                />
              </div>
            </div>
            <NewRecipeLink />
          </div>
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
        <Logo />
        <Link href="/login">
          <a className="table-cell align-middle text-right w-1/3">Log In</a>
        </Link>
      </div>
    </header>
  )
}

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { currentUserInfo } = React.useContext(UserContext)

  if (currentUserInfo) {
    return <LoggedInHeader currentUserInfo={currentUserInfo} />
  } else {
    return <NoUserHeader />
  }
}

export default Header
