'use client'
import React, { useState } from 'react'
import AppContext from './AppContext'

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string[] | undefined>()

  const setLoadingData = (isLoading: boolean) => {
    setLoading(isLoading)
  }

  const setErrorMessage = (errorMessage: string[] | undefined) => {
    setError(errorMessage)
  }

  return (
    <AppContext.Provider
      value={{ loading, setLoadingData, error, setErrorMessage }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default ContextProvider
