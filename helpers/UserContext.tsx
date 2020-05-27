import { createContext } from 'react'
import { CurrentUserLoginCheckType } from 'requests/auth'

interface ContextProps {
  isLoggedIn: boolean
  setLoggedIn: (state: boolean) => void
  currentUserInfo: CurrentUserLoginCheckType | null
}
const UserContext = createContext<Partial<ContextProps>>({})

export default UserContext
