import { createContext } from 'react'

interface ScreenContextProps {
  setNotificationsState: (notificationsState: boolean) => void
  setSearchState: (searchState: boolean, query?: string) => void
  setModalState: (
    modalOpenStatus: boolean,
    modalTitle?: string,
    modalChildren?: React.ReactNode
  ) => void
  notificationsOpen: boolean
  searchOpen: boolean
  searchQuery: string
  modalOpen: boolean
}
const ScreenContext = createContext<Partial<ScreenContextProps>>({})

export default ScreenContext
