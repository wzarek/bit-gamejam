import React, { useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { assets } from '../../utils/game/Assets'
import Game from '../../utils/game/Game'
import Player from '../../utils/game/Player'

// const ip = 'http://156.17.72.7:3000'

// const socket = io(ip, {
//   withCredentials: false
// })

const GameComponent = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams()
  const navigate = useNavigate()

  const prevSocketId = searchParams.get('socketId') ?? ''
  
  useEffect(() => {
    // socket.emit('try-join-room', params.name, prevSocketId)
    // socket.on('try-join-room-status', ({status, message}) => {
    //   if (status == 'ERROR') {
    //     alert(message)
    //     navigate('/')
    //   } else {
    //     socket.emit('player-ready')
    //   }
    // })
    let game = new Game()
    let currPlayer = new Player(game, true, assets)
    game.addPlayer(currPlayer)
    game.startGame()
    const startGameLoop = () => {
        // game.canvasContext.clearRect(0, 0, game.width, game.height)
        game.updateCurrentPlayer()
        game.drawCurrentPlayer()
        requestAnimationFrame(startGameLoop)
    }
    startGameLoop()
  }, [])
  return (
    <div id='game-object'>
      
    </div>
  )
}

export default GameComponent
