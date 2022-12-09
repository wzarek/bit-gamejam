import React, { useEffect } from 'react'
import Game from '../../utils/game/Game'
import Player from '../../utils/game/Player'

const GameComponent = (props) => {
    useEffect(() => {
        let game = new Game()
        let currPlayer = new Player(game, true)
        game.addPlayer(currPlayer)
        game.startGame()
    }, [])
  return (
    <div id='game-object'>
      
    </div>
  )
}

export default GameComponent
