import { createContext } from 'react'
import { CurrentUserLoginCheckType } from 'requests/auth'

interface UserContextProps {
  setCurrentUser: (
    currentUserInfo: CurrentUserLoginCheckType | undefined
  ) => void
  currentUserInfo: CurrentUserLoginCheckType | undefined
  modalOpen: boolean
  setModalState: (
    modalOpenStatus: boolean,
    modalTitle?: string,
    modalChildren?: React.ReactNode
  ) => void
}

const UserContext = createContext<Partial<UserContextProps>>({})

export default UserContext
