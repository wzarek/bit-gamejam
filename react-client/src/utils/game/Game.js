import InputHandler from '../input-handler/InputHandler'
import AudioHandler from '../../audio/AudioHandler'
import { assets } from './Assets'
import Room from './Room'

export default class Game {
    socketObject
    roomName

    #height
    #width
    #maxPlayers = 2
    #gameObjectId = 'game-object'

    #level

    #assets = assets

    #inputHandler

    #playersList = []
    #playersToReconnect = []
    #gameState = GameState.WaitingForPlayers

    #playerCanvasContext
    #roomCanvasContext
    #currentPlayer

    #roomObjects = []

    constructor(socketObj, roomName, level, width = 960, height = 640, maxPlayers = 2) {
        this.socketObject = socketObj
        this.roomName = roomName
        this.#level = level
        this.#height = height
        this.#width = width
        this.#maxPlayers = maxPlayers
        this.#inputHandler = new InputHandler()
    }

    startGame() {
        if (this.#gameState !== GameState.WaitingForPlayers) return

        this.#gameState = GameState.Starting
        // logic of game starting
        this.#createRoomCanvas()
        this.#createPlayerCanvas()
        this.drawPlayers()
        this.#startAudio()
        this.#renderRoom()
        // end of game starting
        this.#gameState = GameState.InProgress
    }

    #renderRoom() {
        let room = new Room('room01')
        room.render(this.#roomCanvasContext)
        //this.#roomObjects = room.
    }

    #startAudio() {
        let audioHandler = new AudioHandler()

        // let button = document.createElement('button')
        // button.innerHTML = 'Start music'
        // document.body.appendChild(button)
        // let audio = new AudioHandler(ambient1)
        // button.addEventListener('click', () => {   
        //     audio.play()
        // })
        // let button2 = document.createElement('button')
        // button2.innerHTML = 'Stop audio'
        // document.body.appendChild(button2)
        // button2.addEventListener('click', () => {
        //     audio.stop()
        // })
    }

    #createRoomCanvas() {
        const gameElement = document.getElementById(this.#gameObjectId)
        let roomCanvasElement = document.createElement('canvas')
        roomCanvasElement.width = this.#width
        roomCanvasElement.height = this.#height
        roomCanvasElement.classList.add('border-2', 'mx-auto', 'absolute', 't-0')
        roomCanvasElement.id = 'room-canvas'
        gameElement.appendChild(roomCanvasElement)
        this.#roomCanvasContext = roomCanvasElement.getContext('2d')
    }

    #createPlayerCanvas() {
        const gameElement = document.getElementById(this.#gameObjectId)
        let canvasElement = document.createElement('canvas')
        canvasElement.width = this.#width
        canvasElement.height = this.#height
        canvasElement.classList.add('border-2', 'mx-auto', 'absolute', 't-0')
        canvasElement.id = 'player-canvas'
        gameElement.appendChild(canvasElement)
        this.#playerCanvasContext = canvasElement.getContext('2d')
    }

    drawPlayers() {
        this.#playersList.forEach((player) => {
            player.render(this.#playerCanvasContext)
        })
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
        //if (this.#playersList.length === this.#maxPlayers) this.startGame()
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

    getPlayer(socketId) {
        if (!this.#playersList.some((el) => el.socketId === socketId)) return null

        return this.#playersList.find((el) => el.socketId === socketId)
    }

    get playerCanvasContext() {
        return this.#playerCanvasContext
    }

    get roomCanvasContext() {
        return this.#roomCanvasContext
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