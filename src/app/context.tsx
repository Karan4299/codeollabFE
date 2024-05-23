'use client'
import React, { useContext } from 'react'
import AppContext from '../context/AppContext'
import "./context.scss"

export default function Context() {
  const { loading, error } = useContext(AppContext)
  return (
    <div className='content-container'>
      {loading && <div className="loader">Loading</div>}
      {error && <div className="error-popup">{error}</div>}
      </div>
  )
}
