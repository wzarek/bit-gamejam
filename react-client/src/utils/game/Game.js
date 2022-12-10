import InputHandler from '../input-handler/InputHandler'
import AudioHandler from '../../audio/AudioHandler'
import ambient1 from '../media/audio/ambient1.mp3'
import { assets } from './Assets'

export default class Game {
    #height
    #width
    #maxPlayers = 2
    #gameObjectId = 'game-object'

    #assets = assets

    #inputHandler

    #playersList = []
    #playersToReconnect = []
    #gameState = GameState.WaitingForPlayers

    #canvasContext
    #currentPlayer

    constructor(width = 900, height = 400, maxPlayers = 2) {
        this.#height = height
        this.#width = width
        this.#maxPlayers = maxPlayers
        this.#inputHandler = new InputHandler()
    }

    startGame() {
        // if (this.#gameState !== GameState.WaitingForPlayers) return

        this.#gameState = GameState.Starting
        // logic of game starting
        this.#createCanvas()
        this.#drawPlayers()
        this.#startAudio()
        // end of game starting
        this.#gameState = GameState.InProgress
    }

    #startAudio() {
        let button = document.createElement('button')
        button.innerHTML = 'Start music'
        document.body.appendChild(button)
        let audio = new AudioHandler(ambient1)
        button.addEventListener('click', () => {   
            audio.play()
        })
        let button2 = document.createElement('button')
        button2.innerHTML = 'Stop audio'
        document.body.appendChild(button2)
        button2.addEventListener('click', () => {
            audio.stop()
        })
    }

    #createCanvas() {
        const gameElement = document.getElementById(this.#gameObjectId)
        let canvasElement = document.createElement('canvas')
        canvasElement.width = this.#width
        canvasElement.height = this.#height
        canvasElement.classList.add('border-2', 'mx-auto')
        gameElement.appendChild(canvasElement)
        this.#canvasContext = canvasElement.getContext('2d')
    }

    #drawPlayers() {
        this.#playersList.forEach((player) => {
            player.render(this.#canvasContext)
        })
    }

    drawCurrentPlayer() {
        if (!this.#currentPlayer) return

        this.#currentPlayer.render(this.#canvasContext)
    }

    updateCurrentPlayer() {
        if (!this.#currentPlayer) return

        this.#currentPlayer.update(this.#inputHandler.keysPressed)
    }

    #pauseGame() {
        if (this.#gameState != GameState.InProgress || this.#gameState != GameState.WaitingForReconnection) return

        this.#gameState = GameState.Paused
    }

    #resumeGame() {
        if (this.#gameState != GameState.Paused) return

        this.#gameState = GameState.InProgress
    }

    #finishGame() {

    }

    addPlayer(player) {
        if (this.#gameState !== GameState.WaitingForPlayers) return
        if (this.#playersList.length >= this.#maxPlayers) return
        if (this.#playersList.some((el) => el === player)) return

        if (player.isCurrentPlayer) {
            this.#currentPlayer = player
        }

        this.#playersList.push(player)
        if (this.#playersList.length === this.#maxPlayers) this.startGame()
    }

    reconnectPlayer(player) {
        if (this.#gameState !== GameState.WaitingForReconnection) return
        if (this.#playersList.length >= this.#maxPlayers) return

        this.#playersList.push(player)
        if (this.#playersToReconnect.length === 0) this.#pauseGame()
    }

    disconnectPlayer(player) {
        if (!this.#playersList.some((el) => el === player)) return

        this.#playersList.splice(this.#playersList.indexOf(player), 1)
        this.#playersToReconnect.push(player)
        this.#gameState = GameState.WaitingForReconnection
    }

    removePlayer(player) {
        if (!this.#playersList.some((el) => el === player)) return

        this.#playersList.splice(this.#playersList.indexOf(player), 1)
        this.#pauseGame()
    }

    get canvasContext() {
        return this.#canvasContext
    }

    get width() {
        return this.#width
    }

    get height() {
        return this.#height
    }
}

const GameState = {
    WaitingForPlayers: 'waiting-for-players',
    Starting: 'starting',
    InProgress: 'in-progress',
    Paused: 'paused',
    WaitingForReconnection: 'waiting-for-reconnection',
    Ending: 'ending',
    Finished: 'finished'
}