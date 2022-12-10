import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import Room from './Room'
import { io } from 'socket.io-client'

const ip = 'http://156.17.72.7:3000'

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
    if (nameValue == '' || nameValue == null || regex.test(nameValue)) {
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
        if (roomsRes == undefined || !roomsRes) roomsRes = []
        setRooms(roomsRes)
      })

    socket.on('create-room-status', ({ status, message, name }) => {
      if (status == "OK") {
        navigate(`/room/${name}?socketId=${socket.id}`)
      }
    })
  }, [])

  return (
    <div className='w-4/5 mx-auto'>
      <h1 className='text-xl font-bold text-center my-5'>Welcome to The Avengineers!</h1>
      <section className='flex flex-row justify-evenly'>
        <div className='flex flex-col justify-between items-center border-2 p-5 w-1/5'>
          <h2 className='mb-5 font-semibold'>Create a room</h2>
          <form className='flex flex-col justify-center' onSubmit={(e) => submitCreateRoom(e)}>
            <div className='flex flex-row items-center'>
              <label htmlFor="roomName">room name:</label>
              <input ref={nameRef} className='w-20 border-2 p-1' type="text" placeholder='name' required />
            </div>
            <label htmlFor="roomVisibility">room visibility:</label>
            <div className='flex flex-row items-center'>
              <input ref={visibilityPrivRef} type='radio' value='private' name='roomVisibility' defaultChecked /> private
              <input ref={visibilityPubRef} type='radio' value='public' name='roomVisibility' /> public
            </div>
            <button className='bg-slate-500 mt-2 rounded-lg p-1'>create a room</button>
          </form>
        </div>
        <div className='flex flex-col justify-between items-center border-2 p-5 w-1/5'>
          <h2 className='mb-5 font-semibold'>Join a room</h2>
          <div>
            {
              rooms.length == 0 ?
                'no rooms availaialbne'
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
