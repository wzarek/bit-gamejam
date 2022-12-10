import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { assets } from '../../utils/game/Assets'
import Game from '../../utils/game/Game'
import Player from '../../utils/game/Player'
import Intro from './Intro'
import ToolTips from './ToolTips'

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

      let currentPlayer = playersIdCopy.indexOf(socket.id)
      let otherPlayer = currentPlayer === 0 ? 1 : 0

      let playersIdSorted = []
      if (otherPlayer !== -1) playersIdSorted.push(playersIdCopy[otherPlayer])
      if (currentPlayer !== -1) playersIdSorted.push(playersIdCopy[currentPlayer])
      console.log(currentPlayer, otherPlayer)

      playersIdSorted.forEach((playerId) => {
        if (playerId === socket.id) {
          let respawns = level.respawns[currentPlayer].split(" ")
          let currPlayer = new Player(playerId, game, level, assets, true, respawns[0] * 64, respawns[1] *64)
          game.addPlayer(currPlayer)
        } else {
          let respawns = level.respawns[otherPlayer].split(" ")
          let newPlayer = new Player(playerId, game, level, assets, false, respawns[0] * 64, respawns[1] * 64)
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

        setShowTooltips(true)
        setTimeout(() => {
          setShowTooltips(false)
        }, 10000);
      }, introDuration)
    })

    socket.on('next-level', ({level, roomName}) => {
      game.destroy()
      alert('welcome to next lvl')
      game = new Game(socket, roomName, level)
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
      <div id='game-object' className='relative mx-auto w-[962px] h-[642px] overflow-hidden'>
        {
          showIntro ?
            <Intro />
            : <></>
        }
        {
          showTooltips ?
          <ToolTips message='To play the game use the arrow keys to move, spacebar to damage, e to interact, mouse to use abilities' />
          : <></>
        }
      </div>
    </>
  )
}

export default GameComponent
