'use client'
import React, { useContext, useEffect } from 'react'
import AppContext from '../context/AppContext'
import "./context.scss"

export default function Context() {
  const { loading, error, setErrorMessage } = useContext(AppContext)
  useEffect(() => {

    setTimeout(() => {
        setErrorMessage(undefined)
      }, 5000)
  }, [loading, setErrorMessage])
  return (
    <div className='content-container'>
      {loading && <div className="loader">Loading</div>}
      {error && <div className='error-container'>{
        error.map((err, index) => {
            return <div key={index} className="error-popup">{err}</div>
        })
      }</div>}
      </div>
  )
}
