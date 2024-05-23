'use client'
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Context from "../context"
import './style.scss'
import { Socket, io } from 'socket.io-client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Header = ({ onLeave }: { onLeave: () => void }) => {
  return (
    <div className="header-container">
      <div className="header-left">COTEXT</div>
      <div className="header-right">
        <button onClick={onLeave}>Leave</button>
      </div>
    </div>
  )
}

enum ButtonState {
  EXPAND = 'expand',
  COLLAPSE = 'collapse',
}

export default function Room() {
  const [socket, setSocket] = useState<Socket<any, any>>()

  const router = useRouter()
  const [buttonState, setButtonState] = useState<ButtonState>(
    ButtonState.EXPAND,
  )
  const [users, setUsers] = useState<String[]>([])
  const [textareaValue, setTextareaValue] = useState<string>('')

  useEffect(() => {
    const socket = io('http://localhost:8080') // Connect to your Socket.IO server
    setSocket(socket)

    socket.on('connect', () => {
      console.log('Connected to server')
    })

    setSocket(socket)
    socket.on('disconnect', () => {
      socket.emit('leaveRoom', {
        roomId: localStorage.getItem('roomId'),
        username: localStorage.getItem('roomUsername'),
      })
    })

    socket.on('message', (message) => {
      setTextareaValue(message)
    })

    socket.on('welcomeMessage', (msg) => {
      console.log(msg)
    })

    socket.on('userJoined', (msg) => {
      setUsers((users) => msg.allUsers)
    })

    socket.on('joinedRoom', (msg) => {
      setUsers((users) => msg.allUsers)
    })
    socket.on('leftRoom', (msg) => {
      setUsers((users) => msg.allUsers)
    })

    socket.on('error', (msg) => {
      router.push('/')
    })

    socket.emit('joinRoom', {
      roomId: localStorage.getItem('roomId'),
      username: localStorage.getItem('roomUsername'),
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  if (!socket) return <div>...Loading</div>

  const handleLeaveRoom = () => {
    socket.emit('leaveRoom', {
      roomId: localStorage.getItem('roomId'),
      username: localStorage.getItem('roomUsername'),
    })
    router.push('/')
  }

  const handleCollapse = () => {
    if (buttonState === ButtonState.EXPAND) {
      setButtonState(ButtonState.COLLAPSE)
      return
    }

    setButtonState(ButtonState.EXPAND)
  }

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (socket) {
      socket.emit('sendMessage', {
        roomId: localStorage.getItem('roomId'),
        message: event.target.value,
        username: localStorage.getItem('roomUsername'),
      })
    }
    setTextareaValue(event.target.value)
  }

  return (
    <>
    <Context />
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100svh',
        backgroundColor: 'red',
        flexDirection: 'column',
      }}
    >
      <Header onLeave={handleLeaveRoom} />
      <div className="editor-container">
        <textarea
          rows={30}
          cols={130}
          value={textareaValue}
          onChange={handleTextareaChange}
          id="editor-id"
        ></textarea>
        <div className={`users-container ${buttonState}`}>
          {buttonState === ButtonState.COLLAPSE && (
            <div className="user-count">{users.length}</div>
          )}
          <div className="users-first users-card">
            <p>Collaborators</p>
            <p className={`dropbutton ${buttonState}`} onClick={handleCollapse}>
              <Image
                src={`/${buttonState}.png`}
                alt="Description of your image"
                width={20}
                height={20}
              />
            </p>
          </div>
          {users.map((user, index) => {
            return (
              <div className="users-card" key={index}>
                <Image src={`/user.png`} alt="user" width={20} height={20} />
                <p key={index}>{user}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    </>
  )
}
