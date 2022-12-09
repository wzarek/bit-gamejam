import React from 'react'
import Room from './components/Rooms/Room'

const Home = () => {
  return (
    <div className='w-4/5 mx-auto'>
      <h1 className='text-lg font-bold text-center my-5'>Welcome to ... !</h1>
      <section className='flex flex-row justify-evenly'>
        <div className='flex flex-col justify-between border-2 p-5'>
          <h2>Create a room</h2>
          <div className='h-2/5'>
            <button>create a room</button>
          </div>
        </div>
        <div className='flex flex-col justify-between border-2 p-5'>
          <h2>Join a room</h2>
          <div>
            <Room name="asda" />
            <Room name="wqeq" />
            <Room name="1231" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
