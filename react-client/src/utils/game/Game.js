import InputHandler from '../input-handler/InputHandler'

export default class Game {
    #height = 500
    #width = 500
    #maxPlayers = 2
    #gameObjectId = 'game-object'

    #inputHandler

    #playersList = []
    #playersToReconnect = []
    #gameState = GameState.WaitingForPlayers

    constructor(width = 500, height = 500, maxPlayers = 2) {
        this.#height = height
        this.#width = width
        this.#maxPlayers = maxPlayers
    }

    startGame() {
        // if (this.#gameState !== GameState.WaitingForPlayers) return

        this.#gameState = GameState.Starting
        // logic of game starting
        this.#createCanvas()
        // end of game starting
        this.#gameState = GameState.InProgress
    }

    #createCanvas() {
        const gameElement = document.getElementById(this.#gameObjectId)
        let canvasElement = document.createElement('canvas')
        canvasElement.width = this.#width
        canvasElement.height = this.#height
        canvasElement.classList.add('border-2')
        gameElement.appendChild(canvasElement)
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