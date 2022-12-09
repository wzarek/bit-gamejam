import React, { useEffect } from 'react'
import Game from '../../utils/game/Game'
import Player from '../../utils/game/Player'

const GameComponent = (props) => {
    useEffect(() => {
        let game = new Game()
        let currPlayer = new Player(game, true)
        game.addPlayer(currPlayer)
        game.startGame()
        const startGameLoop = () => {
            game.canvasContext.clearRect(0, 0, game.width, game.height)
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
