import React from 'react'
import Game from './components/Game/GameComponent'
import { Routes, Route } from "react-router-dom"
import Home from './components/Rooms/Home'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/room/:name' element={<Game />} />
    </Routes>
  )
}

export default App

