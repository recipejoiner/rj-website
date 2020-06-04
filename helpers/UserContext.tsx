import { createContext } from 'react'
import { CurrentUserLoginCheckType } from 'requests/auth'

interface ContextProps {
  setCurrentUser: (
    currentUserInfo: CurrentUserLoginCheckType | undefined
  ) => void
  currentUserInfo: CurrentUserLoginCheckType | undefined
}
const UserContext = createContext<Partial<ContextProps>>({})

export default UserContext
