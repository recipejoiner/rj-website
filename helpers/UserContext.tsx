import { createContext } from 'react'
import { CurrentUserLoginCheckType } from 'requests/auth'

interface UserContextProps {
  setCurrentUser: (
    currentUserInfo: CurrentUserLoginCheckType | undefined
  ) => void
  currentUserInfo: CurrentUserLoginCheckType | undefined
}

const UserContext = createContext<Partial<UserContextProps>>({})

export default UserContext
