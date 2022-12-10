import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { assets } from '../../utils/game/Assets'
import Game from '../../utils/game/Game'
import Player from '../../utils/game/Player'
import Intro from './Intro'

const ip = 'http://172.20.10.7:3000'

const socket = io(ip, {
  withCredentials: false
})

const GameComponent = (props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showIntro, setShowIntro] = useState(false)
  const [showTooltips, setShowTooltips] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const roomName = params.name
  const introDuration = 15000

  const prevSocketId = searchParams.get('socketId') ?? ''

  let game

  useEffect(() => {
    socket.emit('join-room', roomName, prevSocketId)
    socket.on('join-room-status', ({ status, message }) => {
      if (status === 'ERROR') {
        alert(message)
        navigate('/')
      } else {
        socket.emit('player-ready', roomName)
      }
    })

    socket.on('game-ready', ({ level, players }) => {
      game = new Game(socket, roomName, level)

      let playersIdCopy = [...players]

      let currentPlayer = playersIdCopy.find((player) => player === socket.id)
      let otherPlayer = playersIdCopy.find((player) => player !== socket.id)

      let playersIdSorted = []
      if (otherPlayer) playersIdSorted.push(otherPlayer)
      if (currentPlayer) playersIdSorted.push(currentPlayer)

      playersIdSorted.forEach((playerId) => {
        if (playerId === socket.id) {
          let currPlayer = new Player(playerId, game, assets, true, 64, 64)
          game.addPlayer(currPlayer)
        } else {
          let newPlayer = new Player(playerId, game, assets, false, 70, 70)
          game.addPlayer(newPlayer)
        }
      })

      setShowIntro(true)

      setTimeout(() => {
        setShowIntro(false)
        game.startGame()
        const startGameLoop = () => {
          game.playerCanvasContext.clearRect(0, 0, game.width, game.height)
          game.updateCurrentPlayer()
          game.drawPlayers()
          requestAnimationFrame(startGameLoop)
        }
        startGameLoop()
      }, introDuration)

      setShowTooltips(true)
      setTimeout(() => {
        setShowTooltips(false)
      }, 10000);
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
      <div id='game-object' className='relative mx-auto w-[960px]'>
        {
          showIntro ?
            <Intro />
            : <></>
        }
        <ToolTips visible={showTooltips} />
      </div>
    </>
  )
}

export default GameComponent
