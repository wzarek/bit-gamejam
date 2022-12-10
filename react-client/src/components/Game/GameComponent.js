import React, { useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { assets } from '../../utils/game/Assets'
import Game from '../../utils/game/Game'
import Player from '../../utils/game/Player'

const ip = 'http://156.17.72.7:3000'

const socket = io(ip, {
  withCredentials: false
})

const GameComponent = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams()
  const navigate = useNavigate()
  const roomName = params.name

  const prevSocketId = searchParams.get('socketId') ?? ''

  let game

  useEffect(() => {
    socket.emit('join-room', roomName, prevSocketId)
    socket.on('join-room-status', ({ status, message }) => {
      if (status == 'ERROR') {
        alert(message)
        navigate('/')
      } else {
        socket.emit('player-ready', roomName)
      }
    })

    socket.on('game-ready', ({ level, players }) => {
      game = new Game(socket, roomName)

      players.forEach((playerId) => {
        if (playerId == socket.id) {
          let currPlayer = new Player(playerId, game, assets, true, 100, 100)
          game.addPlayer(currPlayer)
        } else {
          let newPlayer = new Player(playerId, game, assets, false, 70, 70)
          game.addPlayer(newPlayer)
        }
      })
      console.log(level)
      game.startGame()
      const startGameLoop = () => {
        game.canvasContext.clearRect(0, 0, game.width, game.height)
        game.updateCurrentPlayer()
        game.drawPlayers()
        requestAnimationFrame(startGameLoop)
      }
      startGameLoop()
    })

    socket.on('move-player', ({ socketId, position }) => {
      let playerToMove = game.getPlayer(socketId)
      if (!playerToMove) return
      playerToMove.movePlayer(position)
    })
  }, [])
  return (
    <>
      <h1>Room {roomName}</h1>
      <div id='game-object'>

      </div>
    </>
  )
}

export default GameComponent
