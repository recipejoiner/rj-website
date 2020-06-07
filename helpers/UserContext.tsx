import { createContext } from 'react'
import { CurrentUserLoginCheckType } from 'requests/auth'

interface ContextProps {
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
const UserContext = createContext<Partial<ContextProps>>({})

export default UserContext
