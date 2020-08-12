import { createContext } from 'react'

interface ScreenContextProps {
  setScrollFreezeState: (scrollFreezeState: boolean) => void
}
const ScreenContext = createContext<Partial<ScreenContextProps>>({})

export default ScreenContext
