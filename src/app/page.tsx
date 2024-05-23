'use client'
import Link from 'next/link'
import './page.scss'
import { FieldValues, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import AppContext from '../context/AppContext'
import Context from './context'

export default function Home() {
  const { register, handleSubmit } = useForm()
  const { setLoadingData, setErrorMessage } = useContext(AppContext)
  const router = useRouter()
  const handleFormSubmit = async (formdata: FieldValues) => {
    try {
      setLoadingData(true)
      const response = await fetch('http://localhost:8080/api/join-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: formdata.roomId,
          username: formdata.username,
        }),
      })
      const statusCode = response.status

      if (!response.ok) {
        const errorData = await response.json()

        setLoadingData(false)
        throw new Error(errorData.message || 'Something went wrong')
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
      console.error('Error while joining room')
      // @ts-ignore
      setErrorMessage(err.message || 'Something went wrong')
      setTimeout(() => {
        setErrorMessage(undefined)
      }, 4000)
    }
  }
  return (
    <>
    <Context />
    <div className="home-container">
      <div className="join-container form-container">
        <h3 className="card-title">Join Room</h3>
        <form className="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" {...register('username')} />
          <label htmlFor="roomId">RoomId:</label>
          <input type="number" id="roomId" {...register('roomId')} />
          <button type="submit" className="join">
            Join
          </button>
        </form>
      </div>
      <div className="create-container form-container">
        <h3 className="card-title">Create Room</h3>
        <Link href="/admin">
          <button className="signup">Sign In (Admin)</button>
        </Link>
      </div>
    </div>
    </>
  )
}
