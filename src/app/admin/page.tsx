'use client'
import React, { useContext } from 'react'
import './style.scss'
import { FieldValues, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import AppContext from '../../context/AppContext'
import Context from '../context'
import CustomError from '@/types/CustomClasses'

export default function Admin() {
  const { register, handleSubmit } = useForm()
  const router = useRouter()
  const { setErrorMessage, setLoadingData } = useContext(AppContext)

  const handleFormSubmit = async (formdata: FieldValues) => {
    try {
      setLoadingData(true)
      const response = await fetch(
        'https://codeollabapi.kbairagi.com/api/create-room',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Setting Content-Type header
          },
          body: JSON.stringify(formdata),
        },
      )
      const statuCode = response.status

      if (!response.ok) {
        setLoadingData(false)
        throw new CustomError(
          JSON.parse(response.statusText) || ['Something went wrong'],
          statuCode,
        )
      }

      const contentType = response.headers.get('Content-Type')
      let responseData

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }

      setLoadingData(false)
      localStorage.setItem('roomId', formdata.roomId)
      localStorage.setItem('roomUsername', formdata.username)
      router.push('/room')
    } catch (err) {
      setLoadingData(false)

      // @ts-ignore
      setErrorMessage(err.messages || ['Something went wrong'])
    }
  }
  return (
    <>
      <Context />
      <div className="admin-main">
        <form className="admin-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <label htmlFor="username"> Username: </label>
          <input type="text" id="username" {...register('username')} />
          <label htmlFor="password"> Password: </label>
          <input type="text" id="password" {...register('password')} />
          <label htmlFor="roomId"> RoomId: </label>
          <input type="number" id="roomId" {...register('roomId')} />
          <label htmlFor="secretKey">Secret Key:</label>
          <input type="text" id="secretKey" {...register('secretKey')} />
          <button type="submit">Create Room</button>
        </form>
      </div>
    </>
  )
}
