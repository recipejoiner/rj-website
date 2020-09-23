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
import SearchCenter from 'components/layout/header/SearchCenter'

const NOTIFICATION_ACTIVE = require('images/icons/new-notification.svg')
const NOTIFICATION = require('images/icons/notification.svg')
const SEARCH = require('images/icons/search.svg')

interface LoggedInHeaderProps {
  currentUserInfo: CurrentUserLoginCheckType
}
const LoggedInHeader: React.FC<LoggedInHeaderProps> = ({ currentUserInfo }) => {
  const { searchOpen, setSearchState } = React.useContext(ScreenContext)
  const [newNotifications, setNewNotifications] = React.useState(false)
  const { notificationsOpen, setNotificationsState } = React.useContext(
    ScreenContext
  )
  const { searchQuery } = React.useContext(ScreenContext)

  const toggleSearch = () => {
    let state = searchOpen
    resetPage()
    setSearchState ? setSearchState(!state) : null
  }
  const toggleNotifications = () => {
    let state = notificationsOpen
    resetPage()
    setNotificationsState ? setNotificationsState(!state) : null
  }

  const resetPage = () => {
    setSearchState ? setSearchState(false) : null
    setNotificationsState ? setNotificationsState(false) : null
  }

  return (
    <div>
      <header className="bg-white border-b border-gray-500 w-full fixed z-100 inset-x-0 top-0">
        <div className="flex justify-between align-middle relative max-w-12xl z-100 mx-auto h-14 p-1">
          <div onClick={resetPage}>
            <Logo />
          </div>
          <div>
            <a onClick={toggleSearch}>
              <img
                className="h-12 p-2 text-gray-900 hover:text-gray-700 fill-current"
                src={SEARCH}
              />
            </a>
            {!!searchOpen ? (
              <AppOverlay
                children={<SearchCenter query={searchQuery} />}
                header={<h1 className="text-2xl">Search</h1>}
              />
            ) : null}
          </div>
          <NewRecipeLink />
          <div>
            <a onClick={toggleNotifications}>
              <img
                className="h-12 p-2 text-gray-900 hover:text-gray-700 fill-current"
                src={newNotifications ? NOTIFICATION_ACTIVE : NOTIFICATION}
              />
            </a>
            <div className={`${notificationsOpen ? 'visible' : 'invisible'}`}>
              {/* <div> */}
              <AppOverlay
                children={<NotificationCenter />}
                header={<h1 className="text-2xl">Notifications</h1>}
              />
            </div>
          </div>
          <ProfileLink currentUserInfo={currentUserInfo} />
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
