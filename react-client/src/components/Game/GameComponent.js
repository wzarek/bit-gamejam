import React, { useEffect } from 'react'
import Game from '../../utils/game/Game'

const GameComponent = (props) => {
    useEffect(() => {
        let game = new Game()
        game.startGame()
    }, [])
  return (
    <div id='game-object'>
      
    </div>
  )
}

export default GameComponent
