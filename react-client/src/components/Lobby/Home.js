import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import Room from './Room'
import { io } from 'socket.io-client'
import config from '../../utils/config'

const ip = config.ip

const socket = io(ip, {
  withCredentials: false
})

const Home = () => {
  const [rooms, setRooms] = useState([])
  const nameRef = useRef()
  const visibilityPrivRef = useRef()
  const visibilityPubRef = useRef()
  const navigate = useNavigate()

  const submitCreateRoom = (e) => {
    e.preventDefault()
    let regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    let nameValue = nameRef.current.value
    if (nameValue === '' || nameValue === null || regex.test(nameValue)) {
      alert('Wrong name! Do not use special characters nor spaces.')
      return
    }

    let isPublic = visibilityPubRef.current.checked

    socket.emit('create-room', nameValue, isPublic)
  }

  useEffect(() => {
    fetch(`${ip}/rooms`).then((res) => res.json())
      .then((resJSON) => {
        let roomsRes = resJSON?.rooms
        if (roomsRes === undefined || !roomsRes) roomsRes = []
        setRooms(roomsRes)
      })

    socket.on('create-room-status', ({ status, message, name }) => {
      if (status === "OK") {
        navigate(`/room/${name}?socketId=${socket.id}`)
      }
    })
  }, [])

  return (
    <div className='w-4/5 mx-auto text-sm'>
      <h1 className='text-2xl font-bold text-center my-10'>Welcome to The Avengineers!</h1>
      <section className='flex flex-row justify-evenly'>
        <div className='flex flex-col justify-between items-evenly border-2 p-16 w-1/3 home-bg-section'>
          <h2 className='mb-5 font-semibold text-lg'>Create a room</h2>
          <form className='flex flex-col justify-center' onSubmit={(e) => submitCreateRoom(e)}>
            <div className='flex flex-row items-center justify-between'>
              <label htmlFor="roomName">room name:</label>
              <input ref={nameRef} className='w-20 border-2 p-1 text-black' type="text" placeholder='name' required />
            </div>
            <label className='mt-3' htmlFor="roomVisibility">room visibility:</label>
            <div className='flex flex-row items-center justify-between'>
              <div>
                <input ref={visibilityPrivRef} type='radio' value='private' name='roomVisibility' id='roomVisibilityPrivate' />
                <label htmlFor="roomVisibilityPrivate">private</label>
              </div>
              <div>
                <input ref={visibilityPubRef} type='radio' value='public' name='roomVisibility' id='roomVisibilityPublic' defaultChecked />
                <label htmlFor="roomVisibilityPublic">public</label>
              </div>
            </div>
            <button className='bg-slate-500 mt-10 rounded-lg p-1 hover:bg-black hover:text-white duration-150'>create a room</button>
          </form>
        </div>
        <div className='flex flex-col justify-between items-evenly border-2 p-16 w-1/3 home-bg-section'>
          <h2 className='mb-5 font-semibold text-lg'>Join a room</h2>
          <div className='h-40'>
            {
              rooms.length === 0 ?
                <span className='text-red-500 font-semibold text-lg'>no rooms available</span>
                :
                rooms.map((room) => (
                  <Room key={room.name} name={room.name} />
                ))
            }
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
