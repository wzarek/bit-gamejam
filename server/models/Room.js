export default class Room {
    #name
    #isPublic = false
    #maxPlayers = 2
    #players = []
    #isStarted = false

    constructor(name, isPublic) {
        this.#name = name
        this.#isPublic = isPublic
    }

    addPlayer(socketId) {
        if (this.#players.length === this.#maxPlayers) return
        this.#players.push(socketId)
    }

    removePlayer(socketId) {
        if (!this.#players.some((playerId) => playerId === socketId)) return

        this.#players.splice(this.#players.indexOf(socketId), 1)
    }

    get name() {
        return this.#name
    }

    get playersInRoom() {
        return this.#players.length
    }

    get isPublic() {
        return this.#isPublic
    }

    get isFull() {
        return this.playersInRoom === this.#maxPlayers
    }

    get isStarted() {
        return this.#isStarted
    }
}
