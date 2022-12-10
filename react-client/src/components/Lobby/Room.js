import React from 'react'
import { useNavigate } from "react-router-dom"

const Room = (props) => {
  const navigate = useNavigate()

  return (
    <button className='bg-slate-500 mt-2 rounded-lg p-1' onClick={() => navigate(`/room/${props.name}`)}>
      {props.name}
    </button>
  )
}

export default Room
