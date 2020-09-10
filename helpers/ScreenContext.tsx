import { createContext } from 'react'

interface ScreenContextProps {
  setNotificationsState: (notificationsState: boolean) => void
  setModalState: (
    modalOpenStatus: boolean,
    modalTitle?: string,
    modalChildren?: React.ReactNode
  ) => void
  notificationsOpen: boolean
  modalOpen: boolean
}
const ScreenContext = createContext<Partial<ScreenContextProps>>({})

export default ScreenContext
