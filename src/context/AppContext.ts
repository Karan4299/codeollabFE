import { createContext } from 'react'

interface AppContextProps {
  loading: boolean
  setLoadingData: (load: boolean) => void
  error: string[] | undefined
  setErrorMessage: (errorMessage: string[] | undefined) => void
}

const AppContext = createContext<AppContextProps>({
  loading: false,
  setLoadingData: (newUser) => {},
  error: undefined,
  setErrorMessage: (errorMessage: string[] | undefined) => {},
})

export default AppContext
